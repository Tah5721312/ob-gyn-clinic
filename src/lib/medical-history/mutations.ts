// lib/medical-history/mutations.ts

import { PrismaClient } from "@prisma/client";
import { MedicalHistoryData } from "./types";

export async function createOrUpdateMedicalHistory(
  prisma: PrismaClient,
  data: MedicalHistoryData
) {
  return await prisma.medicalHistory.upsert({
    where: { patientId: data.patientId },
    update: {
      ...data,
      lastMenstrualPeriod: data.lastMenstrualPeriod ? new Date(data.lastMenstrualPeriod) : undefined,
      contraceptionStartDate: data.contraceptionStartDate ? new Date(data.contraceptionStartDate) : undefined,
    },
    create: {
      ...data,
      gravida: data.gravida || 0,
      para: data.para || 0,
      abortion: data.abortion || 0,
      livingChildren: data.livingChildren || 0,
      lastMenstrualPeriod: data.lastMenstrualPeriod ? new Date(data.lastMenstrualPeriod) : undefined,
      contraceptionStartDate: data.contraceptionStartDate ? new Date(data.contraceptionStartDate) : undefined,
    },
  });
}

export async function updateMedicalHistory(
  prisma: PrismaClient,
  patientId: number,
  data: Partial<MedicalHistoryData>
) {
  return await prisma.medicalHistory.update({
    where: { patientId },
    data: {
      ...data,
      lastMenstrualPeriod: data.lastMenstrualPeriod ? new Date(data.lastMenstrualPeriod) : undefined,
      contraceptionStartDate: data.contraceptionStartDate ? new Date(data.contraceptionStartDate) : undefined,
    },
  });
}

