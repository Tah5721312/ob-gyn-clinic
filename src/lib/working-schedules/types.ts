// lib/working-schedules/types.ts

export interface WorkingScheduleListItem {
  id: number;
  doctorId: number;
  doctorName: string;
  dayOfWeek: number;
  dayName: string;
  startTime: Date;
  endTime: Date;
  slotDurationMinutes: number;
  maxPatientsPerSlot: number;
  isActive: boolean;
}

export interface WorkingScheduleFilters {
  doctorId?: number;
  dayOfWeek?: number;
  isActive?: boolean;
}

export interface CreateWorkingScheduleData {
  doctorId: number;
  dayOfWeek: number;
  dayName: string;
  startTime: Date;
  endTime: Date;
  slotDurationMinutes?: number;
  maxPatientsPerSlot?: number;
  isActive?: boolean;
  notes?: string;
}

export interface UpdateWorkingScheduleData {
  dayOfWeek?: number;
  dayName?: string;
  startTime?: Date;
  endTime?: Date;
  slotDurationMinutes?: number;
  maxPatientsPerSlot?: number;
  isActive?: boolean;
  notes?: string;
}

