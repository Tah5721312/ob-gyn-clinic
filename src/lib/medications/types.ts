// lib/medications/types.ts

export interface MedicationListItem {
  id: number;
  medicationName: string;
  genericName: string | null;
  category: string | null;
  form: string | null;
  strength: string | null;
  unit: string | null;
  price: number | null;
  isActive: boolean;
}

export interface MedicationFilters {
  search?: string;
  category?: string;
  isActive?: boolean;
}

export interface CreateMedicationData {
  medicationName: string;
  genericName?: string;
  scientificName?: string;
  category?: string;
  subcategory?: string;
  form?: string;
  strength?: string;
  unit?: string;
  manufacturer?: string;
  pregnancyCategory?: string;
  breastfeedingSafe?: boolean;
  sideEffects?: string;
  contraindications?: string;
  drugInteractions?: string;
  storageConditions?: string;
  price?: number;
  isActive?: boolean;
}

export interface UpdateMedicationData {
  medicationName?: string;
  genericName?: string;
  scientificName?: string;
  category?: string;
  subcategory?: string;
  form?: string;
  strength?: string;
  unit?: string;
  manufacturer?: string;
  pregnancyCategory?: string;
  breastfeedingSafe?: boolean;
  sideEffects?: string;
  contraindications?: string;
  drugInteractions?: string;
  storageConditions?: string;
  price?: number;
  isActive?: boolean;
}

