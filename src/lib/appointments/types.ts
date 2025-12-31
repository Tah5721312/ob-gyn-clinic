// lib/appointments/types.ts

export interface AppointmentListItem {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  appointmentDate: Date;
  appointmentTime: Date;
  appointmentType: string;
  status: string;
  priority: string;
  durationMinutes: number;
  arrivalTime: Date | null;
  hasVisit: boolean;
}

export interface AppointmentFilters {
  patientId?: number;
  doctorId?: number;
  appointmentDate?: Date;
  status?: string;
  appointmentType?: string;
  priority?: string;
  search?: string;
}

export interface AppointmentListResponse {
  success: boolean;
  data: AppointmentListItem[];
  count: number;
  error?: string;
}

