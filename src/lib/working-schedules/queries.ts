// lib/working-schedules/queries.ts

import { PrismaClient } from "@prisma/client";
import { WorkingScheduleFilters, WorkingScheduleListItem } from "./types";

function buildWhereClause(filters: WorkingScheduleFilters) {
  const where: any = {};

  if (filters.doctorId) {
    where.doctorId = filters.doctorId;
  }

  if (filters.dayOfWeek !== undefined) {
    where.dayOfWeek = filters.dayOfWeek;
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  return where;
}

export async function getWorkingSchedulesList(
  prisma: PrismaClient,
  filters: WorkingScheduleFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<WorkingScheduleListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const schedules = await prisma.workingSchedule.findMany({
    where,
    include: {
      doctor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: [
      { doctorId: "asc" },
      { dayOfWeek: "asc" },
    ],
    take: limit,
    skip: offset,
  });

  return schedules.map((schedule) => ({
    id: schedule.id,
    doctorId: schedule.doctorId,
    doctorName: `${schedule.doctor.firstName} ${schedule.doctor.lastName}`,
    dayOfWeek: schedule.dayOfWeek,
    dayName: schedule.dayName,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    slotDurationMinutes: schedule.slotDurationMinutes,
    maxPatientsPerSlot: schedule.maxPatientsPerSlot,
    isActive: schedule.isActive,
  }));
}

export async function getWorkingSchedulesCount(
  prisma: PrismaClient,
  filters: WorkingScheduleFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.workingSchedule.count({ where });
}

export async function getWorkingScheduleById(
  prisma: PrismaClient,
  scheduleId: number
) {
  return await prisma.workingSchedule.findUnique({
    where: { id: scheduleId },
    include: {
      doctor: true,
    },
  });
}

