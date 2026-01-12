// lib/pregnancies/queries.ts

import { PrismaClient } from "@prisma/client";
import { PregnancyFilters, PregnancyListItem } from "./types";
import { calculateGestationalAge } from "./utils";
import { calculateGestationalAgeWeeks } from "../pregnancy-followups/utils";

function buildWhereClause(filters: PregnancyFilters) {
  const where: any = {};

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  if (filters.search) {
    where.OR = [
      { patient: { firstName: { contains: filters.search, mode: "insensitive" } } },
      { patient: { lastName: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  return where;
}

export async function getPregnanciesList(
  prisma: PrismaClient,
  filters: PregnancyFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<PregnancyListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const pregnancies = await prisma.pregnancyRecord.findMany({
    where,
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      followups: {
        select: {
          visitDate: true,
        },
        orderBy: {
          visitDate: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      lmpDate: "desc",
    },
    take: limit,
    skip: offset,
  });

  return pregnancies.map((pregnancy) => ({
    id: pregnancy.id,
    patientId: pregnancy.patientId,
    patientName: `${pregnancy.patient.firstName} ${pregnancy.patient.lastName}`,
    pregnancyNumber: pregnancy.pregnancyNumber,
    lmpDate: pregnancy.lmpDate,
    eddDate: pregnancy.eddDate,
    isActive: pregnancy.isActive,
    gestationalAgeWeeks: pregnancy.followups[0]?.visitDate
      ? calculateGestationalAgeWeeks(
          pregnancy.lmpDate,
          pregnancy.followups[0].visitDate
        )
      : calculateGestationalAge(pregnancy.lmpDate),
    deliveryDate: pregnancy.deliveryDate,
  }));
}

export async function getPregnanciesCount(
  prisma: PrismaClient,
  filters: PregnancyFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.pregnancyRecord.count({ where });
}

export async function getPregnancyById(
  prisma: PrismaClient,
  pregnancyId: number
) {
  return await prisma.pregnancyRecord.findUnique({
    where: { id: pregnancyId },
    include: {
      patient: true,
      followups: {
        include: {
          visit: true,
        },
        orderBy: {
          visitDate: "desc",
        },
      },
    },
  });
}

export async function getActivePregnancies(
  prisma: PrismaClient,
  patientId?: number
) {
  const where: any = {
    isActive: true,
  };

  if (patientId) {
    where.patientId = patientId;
  }

  return await prisma.pregnancyRecord.findMany({
    where,
    include: {
      patient: true,
      followups: {
        orderBy: {
          visitDate: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      lmpDate: "desc",
    },
  });
}

