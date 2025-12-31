// lib/pregnancies/types.ts

export interface PregnancyListItem {
  id: number;
  patientId: number;
  patientName: string;
  pregnancyNumber: number;
  lmpDate: Date;
  eddDate: Date | null;
  pregnancyStatus: string;
  riskLevel: string | null;
  gestationalAgeWeeks: number | null;
  deliveryDate: Date | null;
}

export interface PregnancyFilters {
  patientId?: number;
  pregnancyStatus?: string;
  riskLevel?: string;
  search?: string;
}

export interface PregnancyListResponse {
  success: boolean;
  data: PregnancyListItem[];
  count: number;
  error?: string;
}

