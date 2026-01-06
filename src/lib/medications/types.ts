// lib/medications/types.ts

import { MedicationStrength, MedicationUnit } from "@/lib/enumdb";

export interface MedicationListItem {
  id: number;
  medicationName: string;
  form: string | null;
  strength: MedicationStrength | null;
  unit: MedicationUnit | null;
  price: number | null;
}

export interface MedicationFilters {
  search?: string;
}

export interface CreateMedicationData {
  medicationName: string;
  scientificName?: string;
  form?: string;
  strength?: MedicationStrength;
  unit?: MedicationUnit;
  pregnancyCategory?: string;
  breastfeedingSafe?: boolean;
  sideEffects?: string;
  contraindications?: string;
  drugInteractions?: string;
  price?: number;
}

export interface UpdateMedicationData {
  medicationName?: string;
  scientificName?: string;
  form?: string;
  strength?: MedicationStrength;
  unit?: MedicationUnit;
  pregnancyCategory?: string;
  breastfeedingSafe?: boolean;
  sideEffects?: string;
  contraindications?: string;
  drugInteractions?: string;
  price?: number;
}

