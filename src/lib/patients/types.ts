// lib/patients/types.ts

/**
 * Types for Patient-related operations
 */

export interface PatientListItem {
  id: number;
  nationalId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  age: number;
  city: string | null;
  hasInsurance: boolean;
  isPregnant: boolean;
  isActive: boolean;
}

export interface PatientFilters {
  search?: string;
  isActive?: boolean | null;
  hasInsurance?: boolean | null;
  isPregnant?: boolean | null;
  city?: string;
}

export interface PatientListResponse {
  success: boolean;
  data: PatientListItem[];
  count: number;
  error?: string;
}

