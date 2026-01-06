// lib/invoice-items/mutations.ts

import { PrismaClient } from "@prisma/client";
import { CreateInvoiceItemData, UpdateInvoiceItemData } from "./types";
import { calculateInvoiceItem, recalculateInvoiceTotals } from "@/services/invoice.service";

export async function createInvoiceItem(
  prisma: PrismaClient,
  data: CreateInvoiceItemData
) {
  const quantity = data.quantity || 1;
  const discountAmount = data.discountAmount || 0;
  const taxAmount = data.taxAmount || 0;

  // استخدام Service Layer لحساب البند
  const calculatedItem = calculateInvoiceItem({
    quantity,
    unitPrice: data.unitPrice,
    discountAmount,
    taxAmount,
  });

  const item = await (prisma as any).invoiceItem.create({
    data: {
      ...data,
      quantity: calculatedItem.quantity,
      unitPrice: calculatedItem.unitPrice,
      discountAmount: calculatedItem.discountAmount,
      taxAmount: calculatedItem.taxAmount,
      totalPrice: calculatedItem.totalPrice,
    },
  });

  // تحديث الفاتورة بعد إضافة البند (Service Layer)
  await recalculateInvoiceTotals(prisma, data.invoiceId);

  return item;
}

export async function updateInvoiceItem(
  prisma: PrismaClient,
  itemId: number,
  data: UpdateInvoiceItemData
) {
  // جلب البند الحالي
  const currentItem = await (prisma as any).invoiceItem.findUnique({
    where: { id: itemId },
  });

  if (!currentItem) {
    throw new Error("Invoice item not found");
  }

  const quantity = data.quantity ?? currentItem.quantity;
  const unitPrice = data.unitPrice
    ? Number(data.unitPrice)
    : Number(currentItem.unitPrice);
  const discountAmount = data.discountAmount
    ? Number(data.discountAmount)
    : Number(currentItem.discountAmount);
  const taxAmount = data.taxAmount
    ? Number(data.taxAmount)
    : Number(currentItem.taxAmount);

  // استخدام Service Layer لحساب البند
  const calculatedItem = calculateInvoiceItem({
    quantity,
    unitPrice,
    discountAmount,
    taxAmount,
  });

  const item = await (prisma as any).invoiceItem.update({
    where: { id: itemId },
    data: {
      ...data,
      quantity: calculatedItem.quantity,
      unitPrice: calculatedItem.unitPrice,
      discountAmount: calculatedItem.discountAmount,
      taxAmount: calculatedItem.taxAmount,
      totalPrice: calculatedItem.totalPrice,
    },
  });

  // تحديث الفاتورة بعد تحديث البند (Service Layer)
  await recalculateInvoiceTotals(prisma, currentItem.invoiceId);

  return item;
}

export async function deleteInvoiceItem(
  prisma: PrismaClient,
  itemId: number
) {
  const item = await (prisma as any).invoiceItem.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    throw new Error("Invoice item not found");
  }

  const invoiceId = item.invoiceId;

  await (prisma as any).invoiceItem.delete({
    where: { id: itemId },
  });

  // تحديث الفاتورة بعد حذف البند (Service Layer)
  await recalculateInvoiceTotals(prisma, invoiceId);
}

