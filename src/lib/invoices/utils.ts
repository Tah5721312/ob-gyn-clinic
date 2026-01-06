// lib/invoices/utils.ts
// Utility functions للعرض فقط (UI helpers)

/**
 * تنسيق المبلغ كعملة
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
  }).format(amount);
}

