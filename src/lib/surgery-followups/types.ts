// lib/surgery-followups/types.ts

export interface SurgeryFollowupListItem {
  id: number;
  surgeryId: number;
  visitId: number | null;
  followupDate: Date;
  daysPostSurgery: number | null;
  woundCondition: string | null;
  painLevel: number | null;
  healingStatus: string | null;
}

export interface SurgeryFollowupFilters {
  surgeryId?: number;
  visitId?: number;
  followupDate?: Date;
}

export interface CreateSurgeryFollowupData {
  surgeryId: number;
  visitId?: number;
  followupDate: Date;
  daysPostSurgery?: number;
  woundCondition?: string;
  painLevel?: number;
  complications?: string;
  healingStatus?: string;
  suturesRemoved?: boolean;
  suturesRemovalDate?: Date;
  medicationsContinued?: string;
  recommendations?: string;
  nextFollowupDate?: Date;
  notes?: string;
}

export interface UpdateSurgeryFollowupData {
  visitId?: number;
  followupDate?: Date;
  daysPostSurgery?: number;
  woundCondition?: string;
  painLevel?: number;
  complications?: string;
  healingStatus?: string;
  suturesRemoved?: boolean;
  suturesRemovalDate?: Date;
  medicationsContinued?: string;
  recommendations?: string;
  nextFollowupDate?: Date;
  notes?: string;
}

