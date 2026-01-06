// lib/pregnancy-followups/types.ts

export interface PregnancyFollowupListItem {
  id: number;
  pregnancyId: number;
  visitId: number;
  visitDate: Date;
  gestationalAgeWeeks: number | null;
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
  // gestationalAgeWeeks سيتم حسابه تلقائياً من lmpDate و visitDate في الـ backend
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
  medicationsPrescribed?: string;
  nextVisitDate?: Date;
  notes?: string;
}

export interface UpdatePregnancyFollowupData {
  visitDate?: Date;
  // gestationalAgeWeeks سيتم حسابه تلقائياً من lmpDate و visitDate في الـ backend
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
  medicationsPrescribed?: string;
  nextVisitDate?: Date;
  notes?: string;
}

