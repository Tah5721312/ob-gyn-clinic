// lib/surgeries/mutations.ts

import { PrismaClient } from "@prisma/client";
import { CreateSurgeryData, UpdateSurgeryData } from "./types";

export async function createSurgery(
  prisma: PrismaClient,
  data: CreateSurgeryData
) {
  return await prisma.surgery.create({
    data: {
      status: data.status || "مجدولة",
      ...data,
      plannedDate: data.plannedDate ? new Date(data.plannedDate) : undefined,
      scheduledDate: new Date(data.scheduledDate),
      scheduledTime: data.scheduledTime ? new Date(data.scheduledTime) : undefined,
    },
  });
}

export async function updateSurgery(
  prisma: PrismaClient,
  surgeryId: number,
  data: UpdateSurgeryData
) {
  return await prisma.surgery.update({
    where: { id: surgeryId },
    data: {
      ...data,
      plannedDate: data.plannedDate ? new Date(data.plannedDate) : undefined,
      scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : undefined,
      scheduledTime: data.scheduledTime ? new Date(data.scheduledTime) : undefined,
      actualSurgeryDate: data.actualSurgeryDate ? new Date(data.actualSurgeryDate) : undefined,
      actualStartTime: data.actualStartTime ? new Date(data.actualStartTime) : undefined,
      actualEndTime: data.actualEndTime ? new Date(data.actualEndTime) : undefined,
    },
  });
}

export async function deleteSurgery(
  prisma: PrismaClient,
  surgeryId: number
) {
  return await prisma.surgery.delete({
    where: { id: surgeryId },
  });
}

