// lib/pregnancies/types.ts

export interface PregnancyListItem {
  id: number;
  patientId: number;
  patientName: string;
  pregnancyNumber: number;
  lmpDate: Date;
  eddDate: Date | null;
  isActive: boolean;
  gestationalAgeWeeks: number | null;
  deliveryDate: Date | null;
}

export interface PregnancyFilters {
  patientId?: number;
  isActive?: boolean;
  search?: string;
}

export interface PregnancyListResponse {
  success: boolean;
  data: PregnancyListItem[];
  count: number;
  error?: string;
}

