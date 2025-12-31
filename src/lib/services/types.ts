// lib/services/types.ts

export interface ServiceListItem {
  id: number;
  serviceCode: string;
  serviceName: string;
  serviceCategory: string;
  description: string | null;
  basePrice: number;
  insurancePrice: number | null;
  durationMinutes: number | null;
  isTaxable: boolean;
  taxPercentage: number;
  isActive: boolean;
}

export interface ServiceFilters {
  search?: string;
  serviceCategory?: string;
  isActive?: boolean;
}

export interface ServiceListResponse {
  success: boolean;
  data: ServiceListItem[];
  count: number;
  error?: string;
}

