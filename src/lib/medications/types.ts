// lib/medications/types.ts

export interface MedicationListItem {
  id: number;
  medicationName: string;
  form: string | null;
  pregnancyCategory: string | null;
  breastfeedingSafe: string | null;
  price: number | null;
}

export interface MedicationFilters {
  search?: string;
}

export interface CreateMedicationData {
  medicationName: string;
  scientificName?: string;
  form?: string;
  pregnancyCategory?: string;
  breastfeedingSafe?: string;
  sideEffects?: string;
  notes?: string;
  price?: number;
}

export interface UpdateMedicationData {
  medicationName?: string;
  scientificName?: string;
  form?: string;
  pregnancyCategory?: string;
  breastfeedingSafe?: string;
  sideEffects?: string;
  notes?: string;
  price?: number;
}

