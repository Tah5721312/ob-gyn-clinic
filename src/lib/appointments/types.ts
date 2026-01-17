// lib/appointments/types.ts

export interface AppointmentListItem {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  appointmentDate: Date;
  appointmentTime: Date;
  status: string;
  priority: string; // محفوظ للتوافق مع الكود القديم، لكن دائماً فارغ
  durationMinutes: number;
  arrivalTime: Date | null; // محفوظ للتوافق مع الكود القديم، لكن دائماً null
  hasVisit: boolean;
}

export interface AppointmentFilters {
  patientId?: number;
  doctorId?: number;
  appointmentDate?: Date;
  status?: string;
  search?: string;
}

export interface AppointmentListResponse {
  success: boolean;
  data: AppointmentListItem[];
  count: number;
  error?: string;
}

