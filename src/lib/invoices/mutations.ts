// lib/invoices/mutations.ts

import { PrismaClient } from "@prisma/client";

export interface CreateInvoiceData {
  invoiceNumber: string;
  patientId: number;
  visitId?: number;
  invoiceDate?: Date;
  dueDate?: Date;
  subtotalAmount: number;
  discountPercentage?: number;
  discountAmount?: number;
  discountReason?: string;
  taxAmount?: number;
  totalAmount: number;
  insuranceCoverage?: number;
  patientResponsibility?: number;
  netAmount: number;
  insuranceId?: number;
  insuranceClaimNumber?: string;
  billingNotes?: string;
  notes?: string;
  createdBy?: number;
}

export interface UpdateInvoiceData {
  dueDate?: Date;
  discountPercentage?: number;
  discountAmount?: number;
  discountReason?: string;
  taxAmount?: number;
  totalAmount?: number;
  insuranceCoverage?: number;
  patientResponsibility?: number;
  netAmount?: number;
  paymentStatus?: string;
  paidAmount?: number;
  remainingAmount?: number;
  insuranceId?: number;
  insuranceClaimNumber?: string;
  billingNotes?: string;
  notes?: string;
}

export interface CreatePaymentData {
  invoiceId: number;
  paymentDate?: Date;
  paymentAmount: number;
  paymentMethod: string;
  referenceNumber?: string;
  cardLast4Digits?: string;
  bankName?: string;
  checkNumber?: string;
  checkDate?: Date;
  processedBy?: number;
  receiptNumber?: string;
  notes?: string;
}

export async function createInvoice(
  prisma: PrismaClient,
  data: CreateInvoiceData
) {
  return await prisma.invoice.create({
    data: {
      invoiceDate: data.invoiceDate || new Date(),
      paymentStatus: "غير مدفوع",
      paidAmount: 0,
      ...data,
    },
  });
}

export async function updateInvoice(
  prisma: PrismaClient,
  invoiceId: number,
  data: UpdateInvoiceData
) {
  return await prisma.invoice.update({
    where: { id: invoiceId },
    data,
  });
}

export async function deleteInvoice(
  prisma: PrismaClient,
  invoiceId: number
) {
  return await prisma.invoice.delete({
    where: { id: invoiceId },
  });
}

export async function createPayment(
  prisma: PrismaClient,
  data: CreatePaymentData
) {
  const payment = await prisma.payment.create({
    data: {
      paymentDate: data.paymentDate || new Date(),
      paymentTime: new Date(),
      ...data,
    },
  });

  // تحديث الفاتورة
  const invoice = await prisma.invoice.findUnique({
    where: { id: data.invoiceId },
  });

  if (invoice) {
    const newPaidAmount = Number(invoice.paidAmount) + Number(data.paymentAmount);
    const remainingAmount = Number(invoice.totalAmount) - newPaidAmount;

    await prisma.invoice.update({
      where: { id: data.invoiceId },
      data: {
        paidAmount: newPaidAmount,
        remainingAmount: remainingAmount,
        paymentStatus:
          remainingAmount <= 0
            ? "مدفوع"
            : newPaidAmount > 0
            ? "مدفوع جزئياً"
            : "غير مدفوع",
      },
    });
  }

  return payment;
}

