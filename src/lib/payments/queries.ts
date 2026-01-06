// lib/payments/queries.ts

/**
 * Database queries for Payment operations
 */

import { PrismaClient } from "@prisma/client";
import { PaymentFilters, PaymentListItem } from "./types";

/**
 * بناء where clause للبحث والفلترة
 */
function buildWhereClause(filters: PaymentFilters) {
  const where: any = {};

  if (filters.invoiceId) {
    where.invoiceId = filters.invoiceId;
  }

  if (filters.paymentDate) {
    const startOfDay = new Date(filters.paymentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(filters.paymentDate);
    endOfDay.setHours(23, 59, 59, 999);
    where.paymentDate = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }

  if (filters.paymentMethod) {
    where.paymentMethod = filters.paymentMethod;
  }

  if (filters.receivedById) {
    where.receivedById = filters.receivedById;
  }

  if (filters.isRefunded !== undefined) {
    where.isRefunded = filters.isRefunded;
  }

  return where;
}

/**
 * جلب قائمة الدفعات مع البحث والفلترة
 */
export async function getPaymentsList(
  prisma: PrismaClient,
  filters: PaymentFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<PaymentListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const payments = await prisma.payment.findMany({
    where,
    include: {
      receivedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: offset,
  });

  return payments.map((payment) => ({
    id: payment.id,
    invoiceId: payment.invoiceId,
    paymentNumber: payment.paymentNumber || "",
    paymentDate: payment.paymentDate,
    paymentTime: payment.paymentTime,
    amount: Number(payment.amount),
    paymentMethod: payment.paymentMethod,
    referenceNumber: payment.referenceNumber,
    bankName: payment.bankName,
    checkNumber: payment.checkNumber,
    receivedById: payment.receivedById,
    receivedByName: payment.receivedBy
      ? `${payment.receivedBy.firstName} ${payment.receivedBy.lastName}`
      : null,
    isRefunded: payment.isRefunded,
    refundedAt: payment.refundedAt,
    createdAt: payment.createdAt,
  }));
}

/**
 * جلب عدد الدفعات (للـ pagination)
 */
export async function getPaymentsCount(
  prisma: PrismaClient,
  filters: PaymentFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.payment.count({ where });
}

/**
 * جلب دفعة واحدة بالـ ID
 */
export async function getPaymentById(
  prisma: PrismaClient,
  paymentId: number
) {
  return await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      invoice: {
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              nationalId: true,
            },
          },
        },
      },
      receivedBy: true,
    },
  });
}

/**
 * جلب جميع الدفعات الخاصة بفاتورة معينة
 */
export async function getPaymentsByInvoiceId(
  prisma: PrismaClient,
  invoiceId: number
) {
  return await prisma.payment.findMany({
    where: { invoiceId },
    include: {
      receivedBy: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

