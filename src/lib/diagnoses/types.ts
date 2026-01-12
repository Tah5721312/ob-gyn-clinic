// lib/diagnoses/types.ts

export interface DiagnosisListItem {
  id: number;
  visitId: number;
  patientId: number;
  patientName: string;
  diagnosisName: string;
  diagnosisDate: Date;
  isChronic: boolean;
  isHighRisk: boolean;
}

export interface DiagnosisFilters {
  patientId?: number;
  visitId?: number;
  isChronic?: boolean;
  isHighRisk?: boolean;
  search?: string;
}

export interface CreateDiagnosisData {
  visitId: number;
  patientId: number;
  diagnosisName: string;
  diagnosisDate?: Date;
  isChronic?: boolean;
  isHighRisk?: boolean;
  notes?: string;
}

export interface UpdateDiagnosisData {
  diagnosisName?: string;
  diagnosisDate?: Date;
  isChronic?: boolean;
  isHighRisk?: boolean;
  notes?: string;
}

