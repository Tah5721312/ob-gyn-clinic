// lib/prescriptions/queries.ts

import { PrismaClient } from "@prisma/client";
import { PrescriptionFilters, PrescriptionListItem } from "./types";

function buildWhereClause(filters: PrescriptionFilters) {
  const where: any = {};

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters.doctorId) {
    where.doctorId = filters.doctorId;
  }

  if (filters.prescriptionDate) {
    where.prescriptionDate = filters.prescriptionDate;
  }

  if (filters.isChronicMedication !== undefined) {
    where.isChronicMedication = filters.isChronicMedication;
  }

  if (filters.search) {
    where.OR = [
      { patient: { firstName: { contains: filters.search, mode: "insensitive" } } },
      { patient: { lastName: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  return where;
}

export async function getPrescriptionsList(
  prisma: PrismaClient,
  filters: PrescriptionFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<PrescriptionListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const prescriptions = await prisma.prescription.findMany({
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
      details: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      prescriptionDate: "desc",
    },
    take: limit,
    skip: offset,
  });

  return prescriptions.map((prescription) => ({
    id: prescription.id,
    visitId: prescription.visitId,
    patientId: prescription.patientId,
    patientName: `${prescription.patient.firstName} ${prescription.patient.lastName}`,
    doctorId: prescription.doctorId,
    doctorName: `${prescription.doctor.firstName} ${prescription.doctor.lastName}`,
    prescriptionDate: prescription.prescriptionDate,
    isEmergency: prescription.isEmergency,
    isChronicMedication: prescription.isChronicMedication,
    validUntil: prescription.validUntil,
    refillsAllowed: prescription.refillsAllowed,
    refillsUsed: prescription.refillsUsed,
    medicationsCount: prescription.details.length,
  }));
}

export async function getPrescriptionsCount(
  prisma: PrismaClient,
  filters: PrescriptionFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.prescription.count({ where });
}

export async function getPrescriptionById(
  prisma: PrismaClient,
  prescriptionId: number
) {
  return await prisma.prescription.findUnique({
    where: { id: prescriptionId },
    include: {
      patient: true,
      doctor: true,
      visit: true,
      details: {
        include: {
          medication: true,
        },
      },
    },
  });
}

