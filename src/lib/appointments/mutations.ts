// lib/appointments/mutations.ts

import { PrismaClient } from "@prisma/client";

export interface CreateAppointmentData {
  patientId: number;
  doctorId: number;
  appointmentDate: Date;
  appointmentTime: Date;
  appointmentType?: string; // سيتم تحويله إلى visitReason
  visitReason?: string;
  status?: string;
  durationMinutes?: number;
  notes?: string;
  receptionNotes?: string;
  createdBy?: number;
}

export interface UpdateAppointmentData {
  appointmentDate?: Date;
  appointmentTime?: Date;
  appointmentType?: string; // سيتم تحويله إلى visitReason
  visitReason?: string;
  status?: string;
  durationMinutes?: number;
  cancellationReason?: string;
  cancelledBy?: number;
  cancelledAt?: Date;
  arrivalTime?: Date;
  notes?: string;
  receptionNotes?: string;
}

export async function createAppointment(
  prisma: PrismaClient,
  data: CreateAppointmentData
) {
  // تحويل appointmentType إلى visitReason إذا كان موجوداً
  const { appointmentType, ...restData } = data;
  const visitReason = data.visitReason || appointmentType;
  
  return await prisma.appointment.create({
    data: {
      status: data.status || "BOOKED",
      durationMinutes: data.durationMinutes || 30,
      visitReason: visitReason || null,
      ...restData,
    },
  });
}

export async function updateAppointment(
  prisma: PrismaClient,
  appointmentId: number,
  data: UpdateAppointmentData
) {
  // تحويل appointmentType إلى visitReason إذا كان موجوداً
  const { appointmentType, ...restData } = data;
  const updateData: any = { ...restData };
  
  if (appointmentType !== undefined) {
    updateData.visitReason = appointmentType;
  }
  
  return await prisma.appointment.update({
    where: { id: appointmentId },
    data: updateData,
  });
}

export async function deleteAppointment(
  prisma: PrismaClient,
  appointmentId: number
) {
  return await prisma.appointment.delete({
    where: { id: appointmentId },
  });
}

export async function cancelAppointment(
  prisma: PrismaClient,
  appointmentId: number,
  reason: string,
  cancelledBy?: number
) {
  return await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status: "CANCELLED",
      notes: reason, // استخدام notes بدلاً من cancellationReason
      updatedAt: new Date(),
    },
  });
}

