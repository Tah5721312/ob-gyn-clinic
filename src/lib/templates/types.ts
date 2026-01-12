// lib/templates/types.ts

export interface TemplateListItem {
  id: number;
  doctorId: number;
  templateType: string;
  templateName: string;
  category: string | null;
  content: string;
  isActive: boolean;
  usageCount: number;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateFilters {
  doctorId?: number;
  templateType?: string;
  category?: string;
  isActive?: boolean;
  isFavorite?: boolean;
  search?: string;
}

export interface CreateTemplateData {
  doctorId: number;
  templateType: string; // VisitTemplate, DiagnosisTemplate, PrescriptionTemplate, etc.
  templateName: string;
  category?: string; // حمل، التهابات، فيتامينات، إلخ
  content: string; // free text
  isActive?: boolean;
  isFavorite?: boolean;
}

export interface UpdateTemplateData {
  templateName?: string;
  templateType?: string;
  category?: string;
  content?: string;
  isActive?: boolean;
  isFavorite?: boolean;
}

// إعادة تصدير من enumdb.ts
export { TEMPLATE_TYPE_SUGGESTIONS, TEMPLATE_CATEGORY_SUGGESTIONS } from "@/lib/enumdb";

// محتوى قالب الزيارة
export interface VisitTemplateContent {
  chiefComplaint?: string;
  examinationFindings?: string;
  treatmentPlan?: string;
  recommendations?: string;
  prescriptionItems?: Array<{
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
}

// محتوى قالب الزيارة
export interface VisitTemplateContent {
  chiefComplaint?: string;
  symptoms?: string[];
  examinationFindings?: string;
  diagnosisId?: number;
  diagnosisName?: string;
  treatmentPlan?: string;
  recommendations?: string;
  prescriptionItems?: PrescriptionItemTemplate[];
  nextVisitDays?: number;
}

// محتوى قالب الشكوى
export interface ChiefComplaintTemplateContent {
  complaint: string;
  duration?: string;
  associatedSymptoms?: string[];
}

// محتوى قالب الروشتة
export interface PrescriptionTemplateContent {
  medications: PrescriptionItemTemplate[];
  generalInstructions?: string;
}

export interface PrescriptionItemTemplate {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

// محتوى قالب التشخيص
export interface DiagnosisTemplateContent {
  diagnosisName: string;
  diagnosisNameEn?: string;
  diagnosisType: string;
  riskLevel?: string;
  notes?: string;
}

// محتوى قالب التشخيص + خطة
export interface DiagnosisWithPlanTemplateContent {
  diagnosisName: string;
  diagnosisType: string;
  riskLevel?: string;
  treatmentPlan: string;
  medications?: PrescriptionItemTemplate[];
  recommendations?: string;
  followupDays?: number;
}

// محتوى قالب متابعة الحمل
export interface PregnancyRoutineTemplateContent {
  vitalChecks: string[];
  commonTests: string[];
  recommendations: string[];
  nextVisitWeeks: number;
}

// محتوى قالب السونار
export interface UltrasoundTemplateContent {
  gestationalAge?: string;
  fetalWeight?: string;
  placentalLocation?: string;
  amnioticFluid?: string;
  remarks?: string;
}

// محتوى قالب التوصيات
export interface RecommendationsTemplateContent {
  recommendations: string[];
  warnings?: string[];
  lifestyle?: string[];
}

