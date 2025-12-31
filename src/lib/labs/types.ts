// lib/labs/types.ts

export interface LabOrderListItem {
  id: number;
  visitId: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  orderDate: Date;
  priority: string;
  status: string;
  hasResults: boolean;
  criticalResults: number;
}

export interface LabResultListItem {
  id: number;
  orderId: number;
  testId: number;
  testName: string;
  resultValue: string | null;
  resultNumeric: number | null;
  resultStatus: string | null;
  resultDate: Date | null;
  isCritical: boolean;
}

export interface LabFilters {
  patientId?: number;
  doctorId?: number;
  orderDate?: Date;
  status?: string;
  priority?: string;
  search?: string;
}

export interface LabListResponse {
  success: boolean;
  data: LabOrderListItem[];
  count: number;
  error?: string;
}

