// lib/diagnoses/mutations.ts

import { PrismaClient } from "@prisma/client";
import { CreateDiagnosisData, UpdateDiagnosisData } from "./types";

export async function createDiagnosis(
  prisma: PrismaClient,
  data: CreateDiagnosisData
) {
  return await prisma.diagnosis.create({
    data: {
      diagnosisDate: data.diagnosisDate || new Date(),
      isChronic: data.isChronic || false,
      isResolved: false,
      ...data,
    },
  });
}

export async function updateDiagnosis(
  prisma: PrismaClient,
  diagnosisId: number,
  data: UpdateDiagnosisData
) {
  return await prisma.diagnosis.update({
    where: { id: diagnosisId },
    data: {
      ...data,
      resolutionDate: data.isResolved && !data.resolutionDate ? new Date() : data.resolutionDate,
    },
  });
}

export async function deleteDiagnosis(
  prisma: PrismaClient,
  diagnosisId: number
) {
  return await prisma.diagnosis.delete({
    where: { id: diagnosisId },
  });
}

