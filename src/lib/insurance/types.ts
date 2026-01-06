// lib/insurance/types.ts

export interface InsuranceListItem {
  id: number;
  patientId: number;
  patientName: string;
  insuranceCompany: string;
  policyNumber: string;
  expiryDate: Date;
  coverageDetails: string | null;
  isActive: boolean;
  createdAt: Date;
}

export interface InsuranceFilters {
  patientId?: number;
  isActive?: boolean;
  expiryDate?: Date;
}

export interface CreateInsuranceData {
  patientId: number;
  insuranceCompany: string;
  policyNumber: string;
  expiryDate: Date;
  coverageDetails?: string | null;
  isActive?: boolean;
}

export interface UpdateInsuranceData {
  insuranceCompany?: string;
  policyNumber?: string;
  expiryDate?: Date;
  coverageDetails?: string | null;
  isActive?: boolean;
}
