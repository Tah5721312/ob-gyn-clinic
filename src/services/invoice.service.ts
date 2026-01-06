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
  insuranceCoverage?: number;
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

  // التأمين
  const insuranceCoverage = input.insuranceCoverage || 0;
  const patientResponsibility = totalAmount - insuranceCoverage;
  const netAmount = patientResponsibility;

  return {
    subtotalAmount,
    discountAmount,
    taxAmount,
    totalAmount,
    insuranceCoverage,
    patientResponsibility,
    netAmount,
  };
}

// ====================================
// 3️⃣ تحديد حالة الدفع
// ====================================
export function resolvePaymentStatus(
  netAmount: number,
  paidAmount: number
): "غير مدفوع" | "مدفوع جزئياً" | "مدفوع" {
  if (paidAmount === 0) return "غير مدفوع";
  if (paidAmount < netAmount) return "مدفوع جزئياً";
  return "مدفوع";
}

// ====================================
// 4️⃣ حساب المبلغ المدفوع من الدفعات
// ====================================
export async function calculatePaidAmount(
  prisma: PrismaClient,
  invoiceId: number
): Promise<number> {
  const payments = await prisma.payment.findMany({
    where: { invoiceId, isRefund: false },
  });

  return payments.reduce(
    (sum, payment) => sum + Number(payment.paymentAmount),
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
  const netAmount = Number(invoice.netAmount);
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
    discountPercentage: Number(invoice.discountPercentage),
    discountAmount: Number(invoice.discountAmount),
    taxAmount: Number(invoice.taxAmount),
    insuranceCoverage: Number(invoice.insuranceCoverage),
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
  const netAmount = Number(invoice.netAmount);
  const newPaid = currentPaid + paymentAmount;

  if (newPaid > netAmount) {
    throw new Error(
      `المبلغ المدفوع (${newPaid}) يتجاوز المبلغ المستحق (${netAmount})`
    );
  }
}
