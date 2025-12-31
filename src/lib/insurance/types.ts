// lib/insurance/types.ts

export interface InsuranceCompanyListItem {
  id: number;
  companyCode: string;
  companyName: string;
  companyNameEn: string | null;
  phone: string | null;
  email: string | null;
  coveragePercentage: number | null;
  isActive: boolean;
}

export interface InsuranceFilters {
  search?: string;
  isActive?: boolean;
}

export interface CreateInsuranceCompanyData {
  companyCode: string;
  companyName: string;
  companyNameEn?: string;
  contactPerson?: string;
  phone?: string;
  phone2?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  coveragePercentage?: number;
  copayAmount?: number;
  deductibleAmount?: number;
  maxCoveragePerVisit?: number;
  maxCoverageAnnual?: number;
  approvalRequired?: boolean;
  paymentTerms?: string;
  paymentCycleDays?: number;
  contractStartDate?: Date;
  contractEndDate?: Date;
  isActive?: boolean;
  notes?: string;
}

export interface UpdateInsuranceCompanyData {
  companyName?: string;
  companyNameEn?: string;
  contactPerson?: string;
  phone?: string;
  phone2?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  coveragePercentage?: number;
  copayAmount?: number;
  deductibleAmount?: number;
  maxCoveragePerVisit?: number;
  maxCoverageAnnual?: number;
  approvalRequired?: boolean;
  paymentTerms?: string;
  paymentCycleDays?: number;
  contractStartDate?: Date;
  contractEndDate?: Date;
  isActive?: boolean;
  notes?: string;
}

export interface PatientInsuranceListItem {
  id: number;
  patientId: number;
  patientName: string;
  insuranceId: number;
  insuranceName: string;
  policyNumber: string;
  memberId: string | null;
  startDate: Date;
  endDate: Date | null;
  isPrimary: boolean;
  isActive: boolean;
}

export interface CreatePatientInsuranceData {
  patientId: number;
  insuranceId: number;
  policyNumber: string;
  memberId?: string;
  groupNumber?: string;
  policyHolderName?: string;
  relationshipToHolder?: string;
  startDate: Date;
  endDate?: Date;
  coverageType?: string;
  coverageDetails?: string;
  preauthorizationRequired?: boolean;
  isPrimary?: boolean;
  isActive?: boolean;
  notes?: string;
}

export interface UpdatePatientInsuranceData {
  policyNumber?: string;
  memberId?: string;
  groupNumber?: string;
  policyHolderName?: string;
  relationshipToHolder?: string;
  startDate?: Date;
  endDate?: Date;
  coverageType?: string;
  coverageDetails?: string;
  preauthorizationRequired?: boolean;
  isPrimary?: boolean;
  isActive?: boolean;
  verificationDate?: Date;
  verifiedBy?: number;
  notes?: string;
}

