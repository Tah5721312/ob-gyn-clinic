// lib/payments/mutations.ts

import { PrismaClient } from "@prisma/client";
import { CreatePaymentData, UpdatePaymentData, RefundPaymentData } from "./types";

export async function createPayment(
  prisma: PrismaClient,
  data: CreatePaymentData
) {
  // إنشاء الدفعة
  const payment = await prisma.payment.create({
    data: {
      invoiceId: data.invoiceId,
      paymentNumber: data.paymentNumber,
      paymentDate: data.paymentDate || new Date(),
      paymentTime: data.paymentTime || new Date(),
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber || null,
      bankName: data.bankName || null,
      checkNumber: data.checkNumber || null,
      receivedById: data.receivedById || null,
      notes: data.notes || null,
    },
  });

  // تحديث الفاتورة - إضافة المبلغ المدفوع
  const invoice = await prisma.invoice.findUnique({
    where: { id: data.invoiceId },
  });

  if (invoice) {
    const newPaidAmount = Number(invoice.paidAmount) + Number(data.amount);
    const newRemainingAmount = Number(invoice.totalAmount) - newPaidAmount;

    let paymentStatus = "UNPAID";
    if (newRemainingAmount <= 0) {
      paymentStatus = "PAID";
    } else if (newPaidAmount > 0) {
      paymentStatus = "PARTIAL";
    }

    await prisma.invoice.update({
      where: { id: data.invoiceId },
      data: {
        paidAmount: newPaidAmount,
        remainingAmount: newRemainingAmount,
        paymentStatus,
      },
    });
  }

  return payment;
}

export async function updatePayment(
  prisma: PrismaClient,
  paymentId: number,
  data: UpdatePaymentData
) {
  // جلب الدفعة القديمة
  const oldPayment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!oldPayment) {
    throw new Error("Payment not found");
  }

  // تحديث الدفعة
  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      ...(data.paymentDate && { paymentDate: data.paymentDate }),
      ...(data.paymentTime && { paymentTime: data.paymentTime }),
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.paymentMethod && { paymentMethod: data.paymentMethod }),
      ...(data.referenceNumber !== undefined && { referenceNumber: data.referenceNumber }),
      ...(data.bankName !== undefined && { bankName: data.bankName }),
      ...(data.checkNumber !== undefined && { checkNumber: data.checkNumber }),
      ...(data.receivedById !== undefined && { receivedById: data.receivedById }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  });

  // إذا تم تغيير المبلغ، نحدث الفاتورة
  if (data.amount !== undefined && data.amount !== Number(oldPayment.amount)) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: oldPayment.invoiceId },
    });

    if (invoice) {
      // نحسب المبلغ المدفوع من جميع الدفعات
      const allPayments = await prisma.payment.findMany({
        where: {
          invoiceId: oldPayment.invoiceId,
          isRefunded: false,
        },
      });

      const totalPaid = allPayments.reduce(
        (sum, p) => sum + Number(p.amount),
        0
      );
      const newRemainingAmount = Number(invoice.totalAmount) - totalPaid;

      let paymentStatus = "UNPAID";
      if (newRemainingAmount <= 0) {
        paymentStatus = "PAID";
      } else if (totalPaid > 0) {
        paymentStatus = "PARTIAL";
      }

      await prisma.invoice.update({
        where: { id: oldPayment.invoiceId },
        data: {
          paidAmount: totalPaid,
          remainingAmount: newRemainingAmount,
          paymentStatus,
        },
      });
    }
  }

  return updatedPayment;
}

export async function deletePayment(
  prisma: PrismaClient,
  paymentId: number
) {
  // جلب الدفعة
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  // حذف الدفعة
  await prisma.payment.delete({
    where: { id: paymentId },
  });

  // تحديث الفاتورة - خصم المبلغ المحذوف
  const invoice = await prisma.invoice.findUnique({
    where: { id: payment.invoiceId },
  });

  if (invoice && !payment.isRefunded) {
    const newPaidAmount = Number(invoice.paidAmount) - Number(payment.amount);
    const newRemainingAmount = Number(invoice.totalAmount) - newPaidAmount;

    let paymentStatus = "UNPAID";
    if (newRemainingAmount <= 0) {
      paymentStatus = "PAID";
    } else if (newPaidAmount > 0) {
      paymentStatus = "PARTIAL";
    }

    await prisma.invoice.update({
      where: { id: payment.invoiceId },
      data: {
        paidAmount: newPaidAmount,
        remainingAmount: newRemainingAmount,
        paymentStatus,
      },
    });
  }

  return payment;
}

export async function refundPayment(
  prisma: PrismaClient,
  paymentId: number,
  data: RefundPaymentData
) {
  // جلب الدفعة
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.isRefunded) {
    throw new Error("Payment is already refunded");
  }

  // تحديث الدفعة كـ refunded
  const refundedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      isRefunded: true,
      refundedAt: new Date(),
      refundReason: data.refundReason || null,
    },
  });

  // تحديث الفاتورة - خصم المبلغ المسترجع
  const invoice = await prisma.invoice.findUnique({
    where: { id: payment.invoiceId },
  });

  if (invoice) {
    const newPaidAmount = Number(invoice.paidAmount) - Number(payment.amount);
    const newRemainingAmount = Number(invoice.totalAmount) - newPaidAmount;

    let paymentStatus = "UNPAID";
    if (newRemainingAmount <= 0) {
      paymentStatus = "PAID";
    } else if (newPaidAmount > 0) {
      paymentStatus = "PARTIAL";
    }

    await prisma.invoice.update({
      where: { id: payment.invoiceId },
      data: {
        paidAmount: newPaidAmount,
        remainingAmount: newRemainingAmount,
        paymentStatus,
      },
    });
  }

  return refundedPayment;
}


