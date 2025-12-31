// lib/invoices/utils.ts

export function calculateRemainingAmount(
  totalAmount: number,
  paidAmount: number
): number {
  return Math.max(0, totalAmount - paidAmount);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
  }).format(amount);
}

export function isInvoicePaid(
  totalAmount: number,
  paidAmount: number
): boolean {
  return paidAmount >= totalAmount;
}

export function getPaymentStatus(
  totalAmount: number,
  paidAmount: number
): "مدفوع" | "مدفوع جزئياً" | "غير مدفوع" {
  if (paidAmount >= totalAmount) return "مدفوع";
  if (paidAmount > 0) return "مدفوع جزئياً";
  return "غير مدفوع";
}

