// lib/users/types.ts

/**
 * Types for User-related operations
 */

export interface UserListItem {
  id: number;
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string | null;
  phone: string;
  doctorId: number | null;
  isActive: boolean;
  lastLogin: Date | null;
}

export interface UserFilters {
  search?: string;
  role?: string;
  isActive?: boolean | null;
  doctorId?: number | null;
}

export interface UserListResponse {
  success: boolean;
  data: UserListItem[];
  count: number;
  error?: string;
}

export interface CreateUserData {
  username: string;
  passwordHash: string;
  role: string;
  doctorId?: number | null;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone: string;
  isActive?: boolean;
}

export interface UpdateUserData {
  username?: string;
  passwordHash?: string;
  role?: string;
  doctorId?: number | null;
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string;
  isActive?: boolean;
}


