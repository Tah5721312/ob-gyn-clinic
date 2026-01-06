// lib/pregnancy-followups/utils.ts

/**
 * حساب عمر الحمل بالأسبوع من تاريخ آخر دورة (LMP) وتاريخ الزيارة
 */
export function calculateGestationalAgeWeeks(
  lmpDate: Date,
  visitDate: Date
): number {
  const lmp = new Date(lmpDate);
  const visit = new Date(visitDate);
  const diffTime = visit.getTime() - lmp.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weeks = diffDays / 7;
  return Math.round(weeks * 10) / 10; // تقريب لأقرب رقم عشري واحد
}

