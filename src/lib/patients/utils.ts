// lib/patients/utils.ts

/**
 * Utility functions for Patient operations
 */

/**
 * حساب العمر من تاريخ الميلاد
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * بناء اسم كامل من الاسم الأول والأخير
 */
export function buildFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

/**
 * التحقق من وجود تأمين نشط
 */
export function hasActiveInsurance(insuranceRecords: Array<{ isActive: boolean }>): boolean {
  return insuranceRecords.some((record) => record.isActive);
}

/**
 * التحقق من وجود حمل نشط
 */
export function hasActivePregnancy(
  pregnancyRecords: Array<{ pregnancyStatus: string }>
): boolean {
  return pregnancyRecords.some((record) => record.pregnancyStatus === "جارية");
}

