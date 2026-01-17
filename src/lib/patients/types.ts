// lib/patients/types.ts

/**
 * Types for Patient-related operations
 */

export interface PatientListItem {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  age: number;
  registrationDate?: Date | string;
  isActive: boolean;
}

export interface PatientFilters {
  search?: string;
  isActive?: boolean | null;
}

export interface PatientListResponse {
  success: boolean;
  data: PatientListItem[];
  count: number;
  error?: string;
}

