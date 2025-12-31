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
  visitType: string | null;
  visitStatus: string;
  chiefComplaint: string | null;
  hasDiagnoses: boolean;
  hasPrescriptions: boolean;
  hasLabOrders: boolean;
}

export interface VisitFilters {
  patientId?: number;
  doctorId?: number;
  visitDate?: Date;
  visitStatus?: string;
  visitType?: string;
  search?: string;
}

export interface VisitListResponse {
  success: boolean;
  data: VisitListItem[];
  count: number;
  error?: string;
}

