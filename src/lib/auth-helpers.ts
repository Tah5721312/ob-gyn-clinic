// lib/auth-helpers.ts

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export interface SystemUserAuth {
  id: number;
  username: string;
  userType: string;
  roleId: number | null;
  roleName: string | null;
  roleCode: string | null;
  doctorId: number | null;
  staffId: number | null;
  permissions: string[];
  mustChangePassword: boolean;
}

/**
 * التحقق من بيانات المستخدم وإرجاع معلومات الـ Session
 */
export async function authenticateSystemUser(
  username: string,
  password: string
): Promise<SystemUserAuth | null> {
  // البحث عن المستخدم
  const user = await prisma.systemUser.findUnique({
    where: { username },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
      doctor: true,
      staff: true,
    },
  });

  if (!user) {
    return null;
  }

  // التحقق من حالة الحساب
  if (!user.isActive) {
    throw new Error("الحساب غير نشط");
  }

  if (user.accountLocked) {
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new Error(`الحساب مقفل حتى ${user.lockedUntil.toLocaleString("ar-EG")}`);
    } else if (user.lockedUntil && user.lockedUntil <= new Date()) {
      // إلغاء القفل إذا انتهت المدة
      await prisma.systemUser.update({
        where: { id: user.id },
        data: {
          accountLocked: false,
          lockedUntil: null,
          failedLoginAttempts: 0,
        },
      });
    } else {
      throw new Error("الحساب مقفل. اتصل بالإدارة");
    }
  }

  // التحقق من كلمة المرور
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    // زيادة عدد محاولات الفشل
    const newFailedAttempts = user.failedLoginAttempts + 1;
    const shouldLock = newFailedAttempts >= 5;

    await prisma.systemUser.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: newFailedAttempts,
        accountLocked: shouldLock,
        lockedUntil: shouldLock
          ? new Date(Date.now() + 30 * 60 * 1000) // قفل لمدة 30 دقيقة
          : null,
      },
    });

    if (shouldLock) {
      throw new Error("تم قفل الحساب بسبب محاولات فاشلة متعددة");
    }

    throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة");
  }

  // تحديث آخر تسجيل دخول وإعادة تعيين المحاولات الفاشلة
  await prisma.systemUser.update({
    where: { id: user.id },
    data: {
      lastLogin: new Date(),
      failedLoginAttempts: 0,
    },
  });

  // جمع الصلاحيات
  const permissions =
    user.role?.permissions.map((rp: any) => rp.permission.permissionCode) || [];

  return {
    id: user.id,
    username: user.username,
    userType: user.userType,
    roleId: user.roleId,
    roleName: user.role?.roleName || null,
    roleCode: user.role?.roleCode || null,
    doctorId: user.doctorId,
    staffId: user.staffId,
    permissions,
    mustChangePassword: user.mustChangePassword,
  };
}

/**
 * تحديد الصفحة المناسبة للتوجيه بعد تسجيل الدخول
 * 
 * Redirect Logic:
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
  if (userType === "DOCTOR" || userType === "طبيب") {
    return "/dashboard";
  }

  // 3. STAFF حسب الدور (Role)
  if (userType === "STAFF" || userType === "موظف") {
    const roleCode = roleName?.toUpperCase().replace(/\s+/g, "_");
    
    switch (roleCode) {
      case "RECEPTION":
      case "استقبال":
        return "/appointments";
      
      case "ACCOUNTANT":
      case "محاسب":
        return "/billing";
      
      case "NURSE":
      case "ممرضة":
        return "/patients";
      
      default:
        return "/dashboard";
    }
  }

  // 4. ADMIN يذهب للـ Dashboard
  if (userType === "ADMIN" || userType === "مدير") {
    return "/dashboard";
  }

  // 5. افتراضي
  return "/dashboard";
}

/**
 * التحقق من صلاحية معينة
 */
export function hasPermission(
  permissions: string[],
  requiredPermission: string
): boolean {
  return permissions.includes(requiredPermission);
}