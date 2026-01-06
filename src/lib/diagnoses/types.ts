// lib/diagnoses/types.ts

export interface DiagnosisListItem {
  id: number;
  visitId: number;
  patientId: number;
  patientName: string;
  diagnosisName: string;
  diagnosisType: string;
  riskLevel: string | null;
  diagnosisDate: Date;
  isChronic: boolean;
  isResolved: boolean;
}

export interface DiagnosisFilters {
  patientId?: number;
  visitId?: number;
  diagnosisType?: string;
  isChronic?: boolean;
  isResolved?: boolean;
  search?: string;
}

export interface CreateDiagnosisData {
  visitId: number;
  patientId: number;
  diagnosisName: string;
  diagnosisNameEn?: string;
  diagnosisType: string;
  riskLevel?: string;
  diagnosisDate?: Date;
  isChronic?: boolean;
  notes?: string;
  createdBy?: number;
}

export interface UpdateDiagnosisData {
  diagnosisName?: string;
  diagnosisNameEn?: string;
  diagnosisType?: string;
  riskLevel?: string;
  isChronic?: boolean;
  isResolved?: boolean;
  notes?: string;
}

