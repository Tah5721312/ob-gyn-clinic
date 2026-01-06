// lib/invoice-items/queries.ts

import { PrismaClient } from "@prisma/client";
import { InvoiceItemFilters, InvoiceItemListItem } from "./types";

function buildWhereClause(filters: InvoiceItemFilters) {
  const where: any = {};

  if (filters.invoiceId) {
    where.invoiceId = filters.invoiceId;
  }

  if (filters.itemType) {
    where.itemType = filters.itemType;
  }

  return where;
}

export async function getInvoiceItemsList(
  prisma: PrismaClient,
  filters: InvoiceItemFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<InvoiceItemListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const items = await (prisma as any).invoiceItem.findMany({
    where,
    orderBy: {
      id: "asc",
    },
    take: limit,
    skip: offset,
  });

  return items.map((item: any) => ({
    id: item.id,
    invoiceId: item.invoiceId,
    itemType: item.itemType,
    description: item.description,
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
    discountAmount: Number(item.discountAmount),
    taxAmount: Number(item.taxAmount),
    totalPrice: Number(item.totalPrice),
    notes: item.notes,
  }));
}

export async function getInvoiceItemsCount(
  prisma: PrismaClient,
  filters: InvoiceItemFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await (prisma as any).invoiceItem.count({ where });
}

export async function getInvoiceItemById(
  prisma: PrismaClient,
  itemId: number
) {
  return await (prisma as any).invoiceItem.findUnique({
    where: { id: itemId },
    include: {
      invoice: true,
    },
  });
}

export async function getInvoiceItemsByInvoiceId(
  prisma: PrismaClient,
  invoiceId: number
) {
  return await (prisma as any).invoiceItem.findMany({
    where: { invoiceId },
    orderBy: {
      id: "asc",
    },
  });
}

