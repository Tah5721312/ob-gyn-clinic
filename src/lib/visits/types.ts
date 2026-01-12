// lib/visits/types.ts

export interface VisitListItem {
  id: number;
  appointmentId: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  visitDate: Date;
  visitStartTime: Date | null;
  visitEndTime: Date | null;
  isDraft: boolean;
  completedAt: Date | null;
  chiefComplaint: string | null;
  notes: string | null;
  treatmentPlan: string | null;
  examinationFindings: string | null;
  weight: number | null;
  bloodPressureSystolic: number | null;
  bloodPressureDiastolic: number | null;
  pulse: number | null;
  hasDiagnoses: boolean;
}

export interface VisitFilters {
  patientId?: number;
  doctorId?: number;
  visitDate?: Date;
  isDraft?: boolean;
  search?: string;
}

export interface VisitListResponse {
  success: boolean;
  data: VisitListItem[];
  count: number;
  error?: string;
}

