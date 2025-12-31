// lib/redirect-logic.ts

/**
 * Redirect Logic Helper Functions
 * 
 * 🔹 userType: يحدد نوع الحساب (ADMIN, DOCTOR, STAFF)
 * 🔹 role: يحدد الصلاحيات الفعلية (Reception, Accountant, Nurse, SuperAdmin)
 */

import { UserType, RoleCode } from "@/types/auth";

/**
 * تحديد URL التوجيه بعد تسجيل الدخول
 * 
 * Redirect Logic (بالترتيب):
 * 1. إذا mustChangePassword = true → /change-password
 * 2. Doctor → /dashboard
 * 3. Reception → /appointments
 * 4. Nurse → /patients
 * 5. Accountant → /billing
 * 6. Admin → /dashboard
 * 7. افتراضي → /dashboard
 */
export function getRedirectUrl(
  userType: string,
  roleName: string | null,
  mustChangePassword: boolean = false
): string {
  // 1. التحقق من تغيير كلمة المرور أولاً
  if (mustChangePassword) {
    return "/change-password";
  }

  // 2. DOCTOR يذهب للـ Dashboard
  if (userType === UserType.DOCTOR || userType === "DOCTOR" || userType === "طبيب") {
    return "/dashboard";
  }

  // 3. STAFF حسب الدور (Role) - فقط RECEPTION و ACCOUNTANT
  if (userType === UserType.STAFF || userType === "STAFF" || userType === "موظف") {
    if (!roleName) {
      return "/dashboard";
    }

    // Normalize role name - يمكن أن يكون roleName أو roleCode
    const normalizedRole = roleName.toUpperCase().replace(/\s+/g, "_");

    // RECEPTION → /appointments
    if (
      normalizedRole === RoleCode.RECEPTION ||
      normalizedRole === "RECEPTION" ||
      normalizedRole === "استقبال" ||
      roleName === "استقبال" ||
      roleName === "Reception"
    ) {
      return "/appointments";
    }

    // Nurse → /patients
    if (
      normalizedRole === RoleCode.NURSE ||
      normalizedRole === "NURSE" ||
      normalizedRole === "ممرضة" ||
      roleName === "ممرضة" ||
      roleName === "Nurse"
    ) {
      return "/patients";
    }

    // Accountant → /billing
    if (
      normalizedRole === RoleCode.ACCOUNTANT ||
      normalizedRole === "ACCOUNTANT" ||
      normalizedRole === "محاسب" ||
      roleName === "محاسب" ||
      roleName === "Accountant"
    ) {
      return "/billing";
    }

    // باقي الأدوار → /dashboard
    return "/dashboard";
  }

  // 4. ADMIN → /dashboard
  if (userType === UserType.ADMIN || userType === "ADMIN" || userType === "مدير") {
    return "/dashboard";
  }

  // 5. افتراضي
  return "/dashboard";
}

/**
 * مثال على الاستخدام في Frontend مع NextAuth:
 * 
 * ```typescript
 * import { signIn } from 'next-auth/react';
 * 
 * const result = await signIn('credentials', {
 *   username,
 *   password,
 *   redirect: false,
 * });
 * 
 * if (result?.ok) {
 *   // NextAuth سيتولى التوجيه تلقائياً
 *   // أو يمكنك استخدام getRedirectUrl() لتحديد الوجهة
 *   const redirectUrl = getRedirectUrl(session.user.userType, session.user.roleCode);
 *   router.push(redirectUrl);
 * }
 * ```
 */

