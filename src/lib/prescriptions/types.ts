// lib/prescriptions/types.ts

export interface PrescriptionListItem {
  id: number;
  visitId: number | null;
  followupId: number | null;
  notes: string | null;
  itemsCount: number;
  createdAt: Date;
}

export interface PrescriptionItemData {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface PrescriptionFilters {
  visitId?: number;
  followupId?: number;
  patientId?: number;
}

export interface CreatePrescriptionData {
  visitId?: number;
  followupId?: number;
  notes?: string;
  items: PrescriptionItemData[];
}

export interface UpdatePrescriptionData {
  notes?: string;
  items?: PrescriptionItemData[];
}

export interface PrescriptionItemListItem {
  id: number;
  prescriptionId: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string | null;
}

