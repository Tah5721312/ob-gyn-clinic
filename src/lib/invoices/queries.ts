// lib/invoices/queries.ts

import { PrismaClient } from "@prisma/client";
import { InvoiceFilters, InvoiceListItem, PaymentListItem } from "./types";

function buildWhereClause(filters: InvoiceFilters) {
  const where: any = {};

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters.invoiceDate) {
    where.invoiceDate = filters.invoiceDate;
  }

  if (filters.paymentStatus) {
    where.paymentStatus = filters.paymentStatus;
  }

  if (filters.search) {
    where.OR = [
      { invoiceNumber: { contains: filters.search, mode: "insensitive" } },
      { patient: { firstName: { contains: filters.search, mode: "insensitive" } } },
      { patient: { lastName: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  return where;
}

export async function getInvoicesList(
  prisma: PrismaClient,
  filters: InvoiceFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<InvoiceListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const invoices = await prisma.invoice.findMany({
    where,
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          insuranceId: true,
          insurance: {
            select: {
              id: true,
              insuranceCompany: true,
            },
          },
        },
      },
    },
    orderBy: {
      invoiceDate: "desc",
    },
    take: limit,
    skip: offset,
  });

  // جلب عدد البنود لكل فاتورة
  const invoiceIds = invoices.map((inv) => inv.id);
  const itemsCounts = await prisma.invoiceItem.groupBy({
    by: ["invoiceId"],
    where: { invoiceId: { in: invoiceIds } },
    _count: { id: true },
  });

  const itemsCountMap = new Map(
    itemsCounts.map((item) => [item.invoiceId, item._count.id])
  );

  return invoices.map((invoice) => ({
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    patientId: invoice.patientId,
    patientName: `${invoice.patient.firstName} ${invoice.patient.lastName}`,
    visitId: invoice.visitId,
    invoiceDate: invoice.invoiceDate,
    // المبالغ الإجمالية - مطابقة schema
    subtotalAmount: Number(invoice.subtotal),
    discountAmount: Number(invoice.discount),
    taxAmount: 0, // لا يوجد في schema
    totalAmount: Number(invoice.totalAmount),
    insuranceCoverage: Number(invoice.insuranceAmount || 0),
    patientResponsibility: Number(invoice.totalAmount) - Number(invoice.insuranceAmount || 0),
    netAmount: Number(invoice.totalAmount),
    paidAmount: Number(invoice.paidAmount),
    remainingAmount: Number(invoice.remainingAmount),
    paymentStatus: invoice.paymentStatus,
    insuranceId: invoice.patient.insuranceId,
    insuranceName: invoice.patient.insurance?.insuranceCompany || null,
    itemsCount: itemsCountMap.get(invoice.id) || 0,
  }));
}

export async function getInvoicesCount(
  prisma: PrismaClient,
  filters: InvoiceFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.invoice.count({ where });
}

export async function getInvoiceById(
  prisma: PrismaClient,
  invoiceId: number
) {
  return await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      patient: {
        include: {
          insurance: true,
        },
      },
      doctor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      visit: true,
      items: {
        orderBy: {
          id: "asc",
        },
      },
      payments: {
        include: {
          receivedBy: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          paymentDate: "desc",
        },
      },
    },
  });
}

export async function getPaymentsList(
  prisma: PrismaClient,
  filters: { invoiceId?: number; paymentDate?: Date } = {},
  options: { limit?: number; offset?: number } = {}
): Promise<PaymentListItem[]> {
  const where: any = {};

  if (filters.invoiceId) {
    where.invoiceId = filters.invoiceId;
  }

  if (filters.paymentDate) {
    where.paymentDate = filters.paymentDate;
  }

  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const payments = await prisma.payment.findMany({
    where,
    include: {
      invoice: {
        select: {
          invoiceNumber: true,
        },
      },
    },
    orderBy: {
      paymentDate: "desc",
    },
    take: limit,
    skip: offset,
  });

  return payments.map((payment) => ({
    id: payment.id,
    paymentNumber: payment.paymentNumber,
    invoiceId: payment.invoiceId,
    invoiceNumber: payment.invoice.invoiceNumber,
    paymentDate: payment.paymentDate,
    paymentAmount: Number(payment.amount),
    paymentMethod: payment.paymentMethod,
    referenceNumber: payment.referenceNumber,
    isRefund: payment.isRefunded,
  }));
}

