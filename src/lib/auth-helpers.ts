// lib/auth-helpers.ts

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export interface SystemUserAuth {
  id: number;
  username: string;
  role: string; // DOCTOR, RECEPTIONIST, ADMIN
  doctorId: number | null;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
}

/**
 * التحقق من بيانات المستخدم وإرجاع معلومات الـ Session
 */
export async function authenticateSystemUser(
  username: string,
  password: string
): Promise<SystemUserAuth | null> {
  // البحث عن المستخدم
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      doctor: true,
    },
  });

  if (!user) {
    return null;
  }

  // التحقق من حالة الحساب
  if (!user.isActive) {
    throw new Error("الحساب غير نشط");
  }

  // التحقق من كلمة المرور
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة");
  }

  // تحديث آخر تسجيل دخول
  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLogin: new Date(),
    },
  });

  return {
    id: user.id,
    username: user.username,
    role: user.role,
    doctorId: user.doctorId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  };
}

/**
 * تحديد الصفحة المناسبة للتوجيه بعد تسجيل الدخول
 * 
 * Redirect Logic:
 * 1. DOCTOR → /
 * 2. RECEPTIONIST → /appointments
 * 3. ADMIN → /
 * 4. افتراضي → /
 */
export function getRedirectUrl(role: string): string {
  // استخدام role مباشرة من الـ schema
  switch (role.toUpperCase()) {
    case "DOCTOR":
      return "/";
    
    case "RECEPTIONIST":
      return "/appointments";
    
    case "ADMIN":
      return "/";
    
    default:
      return "/";
  }
}

/**
 * التحقق من دور المستخدم
 */
export function hasRole(userRole: string, requiredRole: string): boolean {
  return userRole.toUpperCase() === requiredRole.toUpperCase();
}

/**
 * التحقق من أن المستخدم لديه أحد الأدوار المطلوبة
 */
export function hasAnyRole(userRole: string, requiredRoles: string[]): boolean {
  const upperUserRole = userRole.toUpperCase();
  return requiredRoles.some(role => role.toUpperCase() === upperUserRole);
}