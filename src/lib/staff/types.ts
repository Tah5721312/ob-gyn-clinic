// lib/staff/types.ts

export interface StaffListItem {
  id: number;
  employeeNumber: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  position: string;
  department: string | null;
  phone: string;
  email: string | null;
  hireDate: Date;
  isActive: boolean;
}

export interface StaffFilters {
  search?: string;
  position?: string;
  department?: string;
  isActive?: boolean;
}

export interface CreateStaffData {
  employeeNumber: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  position: string;
  department?: string;
  phone: string;
  email?: string;
  address?: string;
  hireDate: Date;
  terminationDate?: Date;
  employmentType: string;
  salary?: number;
  salaryCurrency?: string;
  workingHoursPerWeek?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  isActive?: boolean;
  notes?: string;
}

export interface UpdateStaffData {
  firstName?: string;
  lastName?: string;
  position?: string;
  department?: string;
  phone?: string;
  email?: string;
  address?: string;
  terminationDate?: Date;
  employmentType?: string;
  salary?: number;
  salaryCurrency?: string;
  workingHoursPerWeek?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  isActive?: boolean;
  notes?: string;
}

