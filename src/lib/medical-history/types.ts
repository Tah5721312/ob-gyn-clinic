// lib/medical-history/types.ts

export interface MedicalHistoryData {
  patientId: number;
  chronicDiseases?: string;
  previousSurgeries?: string;
  allergies?: string;
  currentMedications?: string;
  familyHistory?: string;
  gynecologicalHistory?: string;
  ageOfMenarche?: number;
  lastMenstrualPeriod?: Date;
  menstrualCycleLength?: number;
  menstrualCycleRegularity?: string;
  menstrualFlow?: string;
  dysmenorrhea?: string;
  contraceptionMethod?: string;
  contraceptionStartDate?: Date;
  gravida?: number;
  para?: number;
  abortion?: number;
  livingChildren?: number;
  sexualHistory?: string;
  smokingStatus?: string;
  alcoholConsumption?: string;
  exerciseFrequency?: string;
  updatedBy?: number;
}

