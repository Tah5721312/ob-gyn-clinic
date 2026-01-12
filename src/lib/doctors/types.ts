// lib/doctors/types.ts

export interface DoctorListItem {
  id: number;
  nationalId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  specialization: string;
  licenseNumber: string;
  phone: string;
  isActive: boolean;
}

export interface DoctorFilters {
  search?: string;
  specialization?: string;
  isActive?: boolean;
}

export interface DoctorListResponse {
  success: boolean;
  data: DoctorListItem[];
  count: number;
  error?: string;
}

