// lib/working-schedules/mutations.ts

import { PrismaClient } from "@prisma/client";
import { CreateWorkingScheduleData, UpdateWorkingScheduleData } from "./types";

export async function createWorkingSchedule(
  prisma: PrismaClient,
  data: CreateWorkingScheduleData
) {
  return await prisma.workingSchedule.create({
    data: {
      slotDurationMinutes: data.slotDurationMinutes || 30,
      maxPatientsPerSlot: data.maxPatientsPerSlot || 1,
      isActive: data.isActive ?? true,
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    },
  });
}

export async function updateWorkingSchedule(
  prisma: PrismaClient,
  scheduleId: number,
  data: UpdateWorkingScheduleData
) {
  return await prisma.workingSchedule.update({
    where: { id: scheduleId },
    data: {
      ...data,
      startTime: data.startTime ? new Date(data.startTime) : undefined,
      endTime: data.endTime ? new Date(data.endTime) : undefined,
    },
  });
}

export async function deleteWorkingSchedule(
  prisma: PrismaClient,
  scheduleId: number
) {
  return await prisma.workingSchedule.delete({
    where: { id: scheduleId },
  });
}

