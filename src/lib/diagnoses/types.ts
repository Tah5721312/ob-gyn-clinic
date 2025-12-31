// lib/diagnoses/types.ts

export interface DiagnosisListItem {
  id: number;
  visitId: number;
  patientId: number;
  patientName: string;
  icdCode: string | null;
  diagnosisName: string;
  diagnosisType: string;
  severity: string | null;
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
  icdCode?: string;
  diagnosisName: string;
  diagnosisNameEn?: string;
  diagnosisType: string;
  severity?: string;
  diagnosisDate?: Date;
  isChronic?: boolean;
  notes?: string;
  createdBy?: number;
}

export interface UpdateDiagnosisData {
  icdCode?: string;
  diagnosisName?: string;
  diagnosisNameEn?: string;
  diagnosisType?: string;
  severity?: string;
  isChronic?: boolean;
  isResolved?: boolean;
  resolutionDate?: Date;
  notes?: string;
}

