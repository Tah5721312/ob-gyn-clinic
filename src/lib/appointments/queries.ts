// lib/appointments/queries.ts

import { PrismaClient } from "@prisma/client";
import { AppointmentFilters, AppointmentListItem } from "./types";

function buildWhereClause(filters: AppointmentFilters) {
  const where: any = {};

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters.doctorId) {
    where.doctorId = filters.doctorId;
  }

  if (filters.appointmentDate) {
    where.appointmentDate = filters.appointmentDate;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.appointmentType) {
    where.appointmentType = filters.appointmentType;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.search) {
    where.OR = [
      { patient: { firstName: { contains: filters.search, mode: "insensitive" } } },
      { patient: { lastName: { contains: filters.search, mode: "insensitive" } } },
      { patient: { phone: { contains: filters.search, mode: "insensitive" } } },
      { doctor: { firstName: { contains: filters.search, mode: "insensitive" } } },
      { doctor: { lastName: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  return where;
}

export async function getAppointmentsList(
  prisma: PrismaClient,
  filters: AppointmentFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<AppointmentListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      doctor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      visit: {
        select: {
          id: true,
        },
      },
    },
    orderBy: [
      { appointmentDate: "desc" },
      { appointmentTime: "desc" },
    ],
    take: limit,
    skip: offset,
  });

  return appointments.map((apt) => ({
    id: apt.id,
    patientId: apt.patientId,
    patientName: `${apt.patient.firstName} ${apt.patient.lastName}`,
    doctorId: apt.doctorId,
    doctorName: `${apt.doctor.firstName} ${apt.doctor.lastName}`,
    appointmentDate: apt.appointmentDate,
    appointmentTime: apt.appointmentTime,
    appointmentType: apt.appointmentType,
    status: apt.status,
    priority: apt.priority,
    durationMinutes: apt.durationMinutes,
    arrivalTime: apt.arrivalTime,
    hasVisit: apt.visit !== null,
  }));
}

export async function getAppointmentsCount(
  prisma: PrismaClient,
  filters: AppointmentFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.appointment.count({ where });
}

export async function getAppointmentById(
  prisma: PrismaClient,
  appointmentId: number
) {
  return await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      patient: true,
      doctor: true,
      visit: true,
    },
  });
}

export async function getTodayAppointments(
  prisma: PrismaClient,
  doctorId?: number
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const where: any = {
    appointmentDate: today,
  };

  if (doctorId) {
    where.doctorId = doctorId;
  }

  return await prisma.appointment.findMany({
    where,
    include: {
      patient: true,
      doctor: true,
      visit: true,
    },
    orderBy: {
      appointmentTime: "asc",
    },
  });
}

