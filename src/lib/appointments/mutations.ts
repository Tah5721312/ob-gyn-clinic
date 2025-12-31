// lib/appointments/mutations.ts

import { PrismaClient } from "@prisma/client";

export interface CreateAppointmentData {
  patientId: number;
  doctorId: number;
  appointmentDate: Date;
  appointmentTime: Date;
  appointmentType: string;
  status?: string;
  priority?: string;
  durationMinutes?: number;
  notes?: string;
  createdBy?: number;
}

export interface UpdateAppointmentData {
  appointmentDate?: Date;
  appointmentTime?: Date;
  appointmentType?: string;
  status?: string;
  priority?: string;
  durationMinutes?: number;
  cancellationReason?: string;
  cancelledBy?: number;
  cancelledAt?: Date;
  arrivalTime?: Date;
  notes?: string;
}

export async function createAppointment(
  prisma: PrismaClient,
  data: CreateAppointmentData
) {
  return await prisma.appointment.create({
    data: {
      status: data.status || "محجوز",
      priority: data.priority || "عادي",
      durationMinutes: data.durationMinutes || 30,
      ...data,
    },
  });
}

export async function updateAppointment(
  prisma: PrismaClient,
  appointmentId: number,
  data: UpdateAppointmentData
) {
  return await prisma.appointment.update({
    where: { id: appointmentId },
    data,
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
      status: "ملغي",
      cancellationReason: reason,
      cancelledBy,
      cancelledAt: new Date(),
    },
  });
}

