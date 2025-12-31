// lib/lab-tests/types.ts

export interface LabTestListItem {
  id: number;
  testCode: string;
  testName: string;
  testNameEn: string | null;
  testCategory: string;
  normalRangeMin: number | null;
  normalRangeMax: number | null;
  normalRangeText: string | null;
  unit: string | null;
  sampleType: string | null;
  fastingRequired: boolean;
  price: number | null;
  isActive: boolean;
}

export interface LabTestFilters {
  search?: string;
  testCategory?: string;
  isActive?: boolean;
}

export interface CreateLabTestData {
  testCode: string;
  testName: string;
  testNameEn?: string;
  testCategory: string;
  normalRangeMin?: number;
  normalRangeMax?: number;
  normalRangeText?: string;
  unit?: string;
  sampleType?: string;
  fastingRequired?: boolean;
  preparationInstructions?: string;
  turnaroundTimeHours?: number;
  price?: number;
  isActive?: boolean;
}

export interface UpdateLabTestData {
  testName?: string;
  testNameEn?: string;
  testCategory?: string;
  normalRangeMin?: number;
  normalRangeMax?: number;
  normalRangeText?: string;
  unit?: string;
  sampleType?: string;
  fastingRequired?: boolean;
  preparationInstructions?: string;
  turnaroundTimeHours?: number;
  price?: number;
  isActive?: boolean;
}

