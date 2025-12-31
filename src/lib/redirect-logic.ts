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
 * 2. جميع الأدوار → /dashboard (Role-Based Dashboard)
 * 
 * ملاحظة: Dashboard واحد لكن المحتوى يتغير حسب الدور (Role-Based Widgets)
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

  // 2. جميع الأدوار تذهب إلى /dashboard
  // المحتوى يتغير حسب userType و role (Role-Based Dashboard)
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

