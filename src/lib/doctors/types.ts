// lib/doctors/types.ts

export interface DoctorListItem {
  id: number;
  nationalId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  specialization: string;
  subSpecialization: string | null;
  licenseNumber: string;
  phone: string;
  email: string | null;
  consultationFee: number;
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

