// lib/medications/mutations.ts

import { PrismaClient } from "@prisma/client";
import { CreateMedicationData, UpdateMedicationData } from "./types";

export async function createMedication(
  prisma: PrismaClient,
  data: CreateMedicationData
) {
  return await prisma.medication.create({
    data,
  });
}

export async function updateMedication(
  prisma: PrismaClient,
  medicationId: number,
  data: UpdateMedicationData
) {
  return await prisma.medication.update({
    where: { id: medicationId },
    data,
  });
}

export async function deleteMedication(
  prisma: PrismaClient,
  medicationId: number
) {
  return await prisma.medication.delete({
    where: { id: medicationId },
  });
}

