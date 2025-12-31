// lib/radiology/types.ts

export interface RadiologyOrderListItem {
  id: number;
  visitId: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  pregnancyId: number | null;
  examType: string;
  examArea: string | null;
  orderDate: Date;
  examDate: Date | null;
  status: string;
  gestationalAgeAtScan: number | null;
}

export interface RadiologyFilters {
  patientId?: number;
  doctorId?: number;
  pregnancyId?: number;
  examType?: string;
  status?: string;
  orderDate?: Date;
  search?: string;
}

export interface CreateRadiologyOrderData {
  visitId: number;
  patientId: number;
  doctorId: number;
  pregnancyId?: number;
  examType: string;
  examArea?: string;
  examReason?: string;
  orderDate?: Date;
  examDate?: Date;
  examTime?: Date;
  gestationalAgeAtScan?: number;
  findings?: string;
  impression?: string;
  measurements?: string;
  status?: string;
  imagePath?: string;
  reportPath?: string;
  dicomStudyId?: string;
  performedBy?: string;
  reportedBy?: string;
  notes?: string;
}

export interface UpdateRadiologyOrderData {
  examType?: string;
  examArea?: string;
  examReason?: string;
  examDate?: Date;
  examTime?: Date;
  gestationalAgeAtScan?: number;
  findings?: string;
  impression?: string;
  measurements?: string;
  status?: string;
  imagePath?: string;
  reportPath?: string;
  dicomStudyId?: string;
  performedBy?: string;
  reportedBy?: string;
  notes?: string;
}

