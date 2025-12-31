// lib/doctor-leaves/types.ts

export interface DoctorLeaveListItem {
  id: number;
  doctorId: number;
  doctorName: string;
  leaveStartDate: Date;
  leaveEndDate: Date;
  leaveType: string;
  isApproved: boolean;
}

export interface DoctorLeaveFilters {
  doctorId?: number;
  leaveType?: string;
  isApproved?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface CreateDoctorLeaveData {
  doctorId: number;
  leaveStartDate: Date;
  leaveEndDate: Date;
  leaveType: string;
  reason?: string;
  isApproved?: boolean;
  approvedBy?: number;
}

export interface UpdateDoctorLeaveData {
  leaveStartDate?: Date;
  leaveEndDate?: Date;
  leaveType?: string;
  reason?: string;
  isApproved?: boolean;
  approvedBy?: number;
}

