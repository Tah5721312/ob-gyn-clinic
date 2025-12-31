// lib/diagnoses/queries.ts

import { PrismaClient } from "@prisma/client";
import { DiagnosisFilters, DiagnosisListItem } from "./types";

function buildWhereClause(filters: DiagnosisFilters) {
  const where: any = {};

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters.visitId) {
    where.visitId = filters.visitId;
  }

  if (filters.diagnosisType) {
    where.diagnosisType = filters.diagnosisType;
  }

  if (filters.isChronic !== undefined) {
    where.isChronic = filters.isChronic;
  }

  if (filters.isResolved !== undefined) {
    where.isResolved = filters.isResolved;
  }

  if (filters.search) {
    where.OR = [
      { diagnosisName: { contains: filters.search, mode: "insensitive" } },
      { icdCode: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function getDiagnosesList(
  prisma: PrismaClient,
  filters: DiagnosisFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<DiagnosisListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const diagnoses = await prisma.diagnosis.findMany({
    where,
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      diagnosisDate: "desc",
    },
    take: limit,
    skip: offset,
  });

  return diagnoses.map((diagnosis) => ({
    id: diagnosis.id,
    visitId: diagnosis.visitId,
    patientId: diagnosis.patientId,
    patientName: `${diagnosis.patient.firstName} ${diagnosis.patient.lastName}`,
    icdCode: diagnosis.icdCode,
    diagnosisName: diagnosis.diagnosisName,
    diagnosisType: diagnosis.diagnosisType,
    severity: diagnosis.severity,
    diagnosisDate: diagnosis.diagnosisDate,
    isChronic: diagnosis.isChronic,
    isResolved: diagnosis.isResolved,
  }));
}

export async function getDiagnosesCount(
  prisma: PrismaClient,
  filters: DiagnosisFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.diagnosis.count({ where });
}

export async function getDiagnosisById(
  prisma: PrismaClient,
  diagnosisId: number
) {
  return await prisma.diagnosis.findUnique({
    where: { id: diagnosisId },
    include: {
      patient: true,
      visit: true,
    },
  });
}

