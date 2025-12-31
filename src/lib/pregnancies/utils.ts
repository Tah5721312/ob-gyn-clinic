// lib/pregnancies/utils.ts

/**
 * حساب عمر الحمل بالأسبوع من تاريخ آخر دورة (LMP)
 */
export function calculateGestationalAge(lmpDate: Date): number {
  const today = new Date();
  const lmp = new Date(lmpDate);
  const diffTime = today.getTime() - lmp.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
}

/**
 * حساب تاريخ الولادة المتوقع (EDD) من LMP
 */
export function calculateEDD(lmpDate: Date): Date {
  const edd = new Date(lmpDate);
  edd.setDate(edd.getDate() + 280); // 40 weeks = 280 days
  return edd;
}

/**
 * التحقق من وجود حمل نشط
 */
export function isActivePregnancy(pregnancyStatus: string): boolean {
  return pregnancyStatus === "جارية";
}

/**
 * حساب عمر الحمل بالأيام
 */
export function calculateGestationalAgeDays(lmpDate: Date): number {
  const today = new Date();
  const lmp = new Date(lmpDate);
  const diffTime = today.getTime() - lmp.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

