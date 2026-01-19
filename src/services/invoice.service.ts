// services/invoice.service.ts
// Service Layer - العقل المحاسبي للنظام
// كل الحسابات هنا في مكان واحد ✅

import { PrismaClient } from "@prisma/client";

// ====================================
// 1️⃣ حساب بند واحد
// ====================================
export function calculateInvoiceItem(item: {
  quantity: number;
  unitPrice: number;
  discountAmount?: number;
  taxAmount?: number;
}) {
  const base = item.quantity * item.unitPrice;
  const discount = item.discountAmount || 0;
  const tax = item.taxAmount || 0;
  const totalPrice = base - discount + tax;

  return {
    ...item,
    discountAmount: discount,
    taxAmount: tax,
    totalPrice,
  };
}

// ====================================
// 2️⃣ حساب إجماليات الفاتورة
// ====================================
export function calculateInvoiceTotals(input: {
  items: Array<{ totalPrice: number; taxAmount?: number }>;
  discountPercentage?: number;
  discountAmount?: number;
  taxAmount?: number;
}) {
  // جمع البنود
  const subtotalAmount = input.items.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  // حساب الخصم
  const discountAmount =
    input.discountPercentage && input.discountPercentage > 0
      ? (subtotalAmount * input.discountPercentage) / 100
      : input.discountAmount || 0;

  // حساب الضريبة
  const taxAmount =
    input.taxAmount ||
    input.items.reduce((sum, item) => sum + (item.taxAmount || 0), 0);

  // الإجمالي
  const totalAmount = subtotalAmount - discountAmount + taxAmount;
  const netAmount = totalAmount;

  return {
    subtotalAmount,
    discountAmount,
    taxAmount,
    totalAmount,
    netAmount,
  };
}

// ====================================
// 3️⃣ تحديد حالة الدفع
// ====================================
export function resolvePaymentStatus(
  netAmount: number,
  paidAmount: number
): "UNPAID" | "PARTIAL" | "PAID" {
  if (paidAmount === 0) return "UNPAID";
  if (paidAmount < netAmount) return "PARTIAL";
  return "PAID";
}

// ====================================
// 4️⃣ حساب المبلغ المدفوع من الدفعات
// ====================================
export async function calculatePaidAmount(
  prisma: PrismaClient,
  invoiceId: number
): Promise<number> {
  const payments = await prisma.payment.findMany({
    where: { invoiceId, isRefunded: false },
  });

  return payments.reduce(
    (sum: number, payment: { amount: unknown }) => sum + Number(payment.amount),
    0
  );
}

// ====================================
// 5️⃣ تحديث حالة الدفع للفاتورة
// ====================================
export async function updateInvoicePaymentStatus(
  prisma: PrismaClient,
  invoiceId: number
): Promise<void> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice) throw new Error("Invoice not found");

  const paidAmount = await calculatePaidAmount(prisma, invoiceId);

  // Calculate totals from base fields to ensure consistency
  const subtotal = Number(invoice.subtotal);
  const discount = Number(invoice.discount || 0);
  const totalAmount = subtotal - discount;
  const netAmount = totalAmount;
  const remainingAmount = Math.max(0, netAmount - paidAmount);
  const paymentStatus = resolvePaymentStatus(netAmount, paidAmount);

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      paidAmount,
      remainingAmount,
      paymentStatus,
    },
  });
}

// ====================================
// 6️⃣ إعادة حساب الفاتورة من البنود
// ====================================
export async function recalculateInvoiceTotals(
  prisma: PrismaClient,
  invoiceId: number
): Promise<void> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice) throw new Error("Invoice not found");

  // جلب البنود
  const items = await (prisma as any).invoiceItem.findMany({
    where: { invoiceId },
  });

  // حساب كل بند
  const calculatedItems = items.map((item: any) =>
    calculateInvoiceItem({
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      discountAmount: Number(item.discountAmount),
      taxAmount: Number(item.taxAmount),
    })
  );

  // حساب الإجماليات
  const totals = calculateInvoiceTotals({
    items: calculatedItems,
    discountAmount: Number(invoice.discount || 0),
  });

  // حساب المدفوع
  const paidAmount = await calculatePaidAmount(prisma, invoiceId);
  const remainingAmount = Math.max(0, totals.netAmount - paidAmount);
  const paymentStatus = resolvePaymentStatus(totals.netAmount, paidAmount);

  // تحديث الفاتورة
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      ...totals,
      paidAmount,
      remainingAmount,
      paymentStatus,
    },
  });
}

// ====================================
// 7️⃣ التحقق من المبلغ (منع Overpayment)
// ====================================
export async function validatePaymentAmount(
  prisma: PrismaClient,
  invoiceId: number,
  paymentAmount: number
): Promise<void> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice) throw new Error("Invoice not found");

  const currentPaid = await calculatePaidAmount(prisma, invoiceId);
  const totalAmount = Number(invoice.totalAmount);
  const netAmount = totalAmount;
  const newPaid = currentPaid + paymentAmount;

  if (newPaid > netAmount) {
    throw new Error(
      `المبلغ المدفوع (${newPaid}) يتجاوز المبلغ المستحق (${netAmount})`
    );
  }
}
