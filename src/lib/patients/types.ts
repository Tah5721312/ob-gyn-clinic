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
  hasInsurance: boolean;
  isPregnant: boolean;
  isActive: boolean;
}

export interface PatientFilters {
  search?: string;
  isActive?: boolean | null;
  hasInsurance?: boolean | null;
  isPregnant?: boolean | null;
}

export interface PatientListResponse {
  success: boolean;
  data: PatientListItem[];
  count: number;
  error?: string;
}

