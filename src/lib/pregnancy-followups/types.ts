// lib/pregnancy-followups/types.ts

export interface PregnancyFollowupListItem {
  id: number;
  pregnancyId: number;
  visitId: number;
  visitDate: Date;
  visitNumber: number | null;
  gestationalAgeWeeks: number | null;
  fundalHeight: number | null;
  fetalHeartRate: number | null;
}

export interface PregnancyFollowupFilters {
  pregnancyId?: number;
  visitId?: number;
  visitDate?: Date;
}

export interface CreatePregnancyFollowupData {
  pregnancyId: number;
  visitId: number;
  visitDate: Date;
  visitNumber?: number;
  gestationalAgeWeeks?: number;
  gestationalAgeDays?: number;
  fundalHeight?: number;
  fetalHeartRate?: number;
  fetalMovement?: string;
  fetalPosition?: string;
  cervicalDilation?: number;
  cervicalEffacement?: number;
  maternalWeight?: number;
  weightGain?: number;
  bloodPressure?: string;
  edema?: string;
  urineProtein?: string;
  urineGlucose?: string;
  urineAnalysis?: string;
  bloodSugarLevel?: number;
  hemoglobinLevel?: number;
  ultrasoundFindings?: string;
  estimatedFetalWeight?: number;
  amnioticFluidIndex?: number;
  placentalLocation?: string;
  placentalGrade?: string;
  complications?: string;
  riskFactors?: string;
  recommendations?: string;
  medicationsPrescribed?: string;
  nextVisitDate?: Date;
  nextVisitType?: string;
  notes?: string;
}

export interface UpdatePregnancyFollowupData {
  visitNumber?: number;
  gestationalAgeWeeks?: number;
  gestationalAgeDays?: number;
  fundalHeight?: number;
  fetalHeartRate?: number;
  fetalMovement?: string;
  fetalPosition?: string;
  cervicalDilation?: number;
  cervicalEffacement?: number;
  maternalWeight?: number;
  weightGain?: number;
  bloodPressure?: string;
  edema?: string;
  urineProtein?: string;
  urineGlucose?: string;
  urineAnalysis?: string;
  bloodSugarLevel?: number;
  hemoglobinLevel?: number;
  ultrasoundFindings?: string;
  estimatedFetalWeight?: number;
  amnioticFluidIndex?: number;
  placentalLocation?: string;
  placentalGrade?: string;
  complications?: string;
  riskFactors?: string;
  recommendations?: string;
  medicationsPrescribed?: string;
  nextVisitDate?: Date;
  nextVisitType?: string;
  notes?: string;
}

