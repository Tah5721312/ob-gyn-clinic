// lib/prescriptions/types.ts

export interface PrescriptionListItem {
  id: number;
  visitId: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  prescriptionDate: Date;
  isEmergency: boolean;
  isChronicMedication: boolean;
  validUntil: Date | null;
  refillsAllowed: number;
  refillsUsed: number;
  medicationsCount: number;
}

export interface PrescriptionFilters {
  patientId?: number;
  doctorId?: number;
  prescriptionDate?: Date;
  isChronicMedication?: boolean;
  search?: string;
}

export interface PrescriptionListResponse {
  success: boolean;
  data: PrescriptionListItem[];
  count: number;
  error?: string;
}

