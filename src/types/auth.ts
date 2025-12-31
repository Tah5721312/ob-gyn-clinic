// types/auth.ts

/**
 * Login Request
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Login Response
 */
export interface LoginResponse {
  success: boolean;
  userId?: number;
  username?: string;
  userType?: string;
  role?: string;
  roleCode?: string;
  doctorId?: number | null;
  staffId?: number | null;
  mustChangePassword?: boolean;
  permissions?: string[];
  redirectUrl?: string;
  error?: string;
}

/**
 * User Type Enum
 * يحدد نوع الحساب (Account Type)
 */
export enum UserType {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  STAFF = "STAFF",
  PHARMACIST = "PHARMACIST",
  ACCOUNTANT = "ACCOUNTANT",
}

/**
 * Role Code Enum
 * يحدد الصلاحيات الفعلية (Actual Permissions)
 */
export enum RoleCode {
  SUPER_ADMIN = "SUPER_ADMIN",
  DOCTOR = "DOCTOR",
  RECEPTION = "RECEPTION",
  ACCOUNTANT = "ACCOUNTANT",
  NURSE = "NURSE",
}

/**
 * User Session Data
 */
export interface UserSession {
  userId: number;
  username: string;
  userType: string;
  role: string | null;
  roleCode: string | null;
  doctorId: number | null;
  staffId: number | null;
  mustChangePassword: boolean;
  permissions: string[];
}

