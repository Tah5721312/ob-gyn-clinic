// lib/invoices/mutations.ts

import { PrismaClient } from "@prisma/client";
import {
  updateInvoicePaymentStatus,
  validatePaymentAmount,
} from "@/services/invoice.service";

export interface CreateInvoiceData {
  invoiceNumber: string;
  patientId: number;
  doctorId?: number;
  visitId?: number;
  appointmentId?: number;
  invoiceDate?: Date | string;
  dueDate?: Date | string;
  // المبالغ الإجمالية
  subtotalAmount?: number;
  discountAmount?: number;
  totalAmount?: number;
  notes?: string;
}

export interface UpdateInvoiceData {
  invoiceDate?: Date | string;
  dueDate?: Date | string;
  // المبالغ الإجمالية
  subtotal?: number;
  discount?: number;
  discountPercentage?: number;
  discountAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  netAmount?: number;
  // paymentStatus, paidAmount, remainingAmount يتم حسابها تلقائياً
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
  // حساب المبالغ
  const subtotal = data.subtotalAmount || (data as any).subtotal || 0;
  const discount = data.discountAmount || (data as any).discount || 0;
  const totalAmount = data.totalAmount || (subtotal - discount);
  const remainingAmount = totalAmount;

  return await prisma.invoice.create({
    data: {
      invoiceNumber: data.invoiceNumber,
      patientId: data.patientId,
      doctorId: data.doctorId || 1, // TODO: get from session
      visitId: data.visitId || null,
      appointmentId: data.appointmentId || null,
      invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : new Date(),
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      subtotal: subtotal,
      discount: discount,
      totalAmount: totalAmount,
      paidAmount: 0,
      remainingAmount: remainingAmount,
      paymentStatus: "UNPAID",
      notes: data.notes || null,
    },
  });
}

export async function updateInvoice(
  prisma: PrismaClient,
  invoiceId: number,
  data: UpdateInvoiceData
) {
  // Convert date strings to Date objects if present
  const updateData: any = { ...data };

  if (data.invoiceDate) {
    updateData.invoiceDate = new Date(data.invoiceDate);
  }

  if (data.dueDate) {
    updateData.dueDate = new Date(data.dueDate);
  }

  const updatedInvoice = await prisma.invoice.update({
    where: { id: invoiceId },
    data: updateData,
  });

  // إعادة حساب حالة الدفع والمبلغ المتبقي
  await updateInvoicePaymentStatus(prisma, invoiceId);

  return updatedInvoice;
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
  // التحقق من المبلغ (Service Layer)
  await validatePaymentAmount(prisma, data.invoiceId, data.paymentAmount);

  // توليد رقم دفعة بسيط
  const paymentNumber = `PAY-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

  const payment = await prisma.payment.create({
    data: {
      invoiceId: data.invoiceId,
      paymentNumber: paymentNumber,
      paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
      paymentTime: new Date(),
      amount: data.paymentAmount,
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber || null,
      bankName: data.bankName || null,
      checkNumber: data.checkNumber || null,
      receivedById: data.processedBy || null,
      notes: data.notes || null,
    },
  });

  // تحديث الفاتورة - حساب paidAmount من جميع المدفوعات (Service Layer)
  await updateInvoicePaymentStatus(prisma, data.invoiceId);

  return payment;
}

