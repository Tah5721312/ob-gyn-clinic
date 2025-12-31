// lib/surgeries/types.ts

export interface SurgeryListItem {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  anesthesiologistId: number | null;
  surgeryName: string;
  surgeryType: string;
  scheduledDate: Date;
  scheduledTime: Date | null;
  status: string;
  actualSurgeryDate: Date | null;
}

export interface SurgeryFilters {
  patientId?: number;
  doctorId?: number;
  surgeryType?: string;
  status?: string;
  scheduledDate?: Date;
  search?: string;
}

export interface CreateSurgeryData {
  patientId: number;
  doctorId: number;
  anesthesiologistId?: number;
  surgeryName: string;
  surgeryType: string;
  surgeryCategory?: string;
  plannedDate?: Date;
  scheduledDate: Date;
  scheduledTime?: Date;
  expectedDurationMinutes?: number;
  preOpDiagnosis?: string;
  anesthesiaType?: string;
  status?: string;
  notes?: string;
}

export interface UpdateSurgeryData {
  surgeryName?: string;
  surgeryType?: string;
  surgeryCategory?: string;
  plannedDate?: Date;
  scheduledDate?: Date;
  scheduledTime?: Date;
  expectedDurationMinutes?: number;
  actualSurgeryDate?: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  actualDurationMinutes?: number;
  preOpDiagnosis?: string;
  postOpDiagnosis?: string;
  procedureDetails?: string;
  anesthesiaType?: string;
  incisionType?: string;
  surgicalApproach?: string;
  surgicalFindings?: string;
  specimensSent?: string;
  bloodLossMl?: number;
  transfusionRequired?: boolean;
  complications?: string;
  postOpInstructions?: string;
  medicationsPrescribed?: string;
  followupSchedule?: string;
  expectedRecoveryDays?: number;
  status?: string;
  cancellationReason?: string;
  assistingDoctors?: string;
  nursingStaff?: string;
  operatingRoom?: string;
  notes?: string;
}

