// lib/insurance/queries.ts

import { PrismaClient } from "@prisma/client";
import { InsuranceFilters, InsuranceListItem } from "./types";

function buildWhereClause(filters: InsuranceFilters) {
  const where: any = {};

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  if (filters.expiryDate) {
    where.expiryDate = {
      lte: filters.expiryDate,
    };
  }

  return where;
}

export async function getInsurancesList(
  prisma: PrismaClient,
  filters: InsuranceFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<InsuranceListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const insurances = await prisma.insurance.findMany({
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
      createdAt: "desc",
    },
    take: limit,
    skip: offset,
  });

  return insurances.map((insurance) => ({
    id: insurance.id,
    patientId: insurance.patientId,
    patientName: `${insurance.patient.firstName} ${insurance.patient.lastName}`,
    insuranceCompany: insurance.insuranceCompany,
    policyNumber: insurance.policyNumber,
    expiryDate: insurance.expiryDate,
    coverageDetails: insurance.coverageDetails,
    isActive: insurance.isActive,
    createdAt: insurance.createdAt,
  }));
}

export async function getInsurancesCount(
  prisma: PrismaClient,
  filters: InsuranceFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.insurance.count({ where });
}

export async function getInsuranceById(
  prisma: PrismaClient,
  insuranceId: number
) {
  return await prisma.insurance.findUnique({
    where: { id: insuranceId },
    include: {
      patient: true,
    },
  });
}

export async function getInsurancesByPatientId(
  prisma: PrismaClient,
  patientId: number
) {
  return await prisma.insurance.findMany({
    where: { patientId },
    orderBy: {
      expiryDate: "desc",
    },
  });
}
