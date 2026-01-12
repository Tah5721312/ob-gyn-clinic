// lib/prescriptions/queries.ts

import { PrismaClient } from "@prisma/client";
import { PrescriptionFilters, PrescriptionListItem } from "./types";

function buildWhereClause(filters: PrescriptionFilters) {
  const where: any = {};

  if (filters.visitId) {
    where.visitId = filters.visitId;
  }

  if (filters.followupId) {
    where.followupId = filters.followupId;
  }

  if (filters.patientId) {
    // جلب الروشتات من خلال الزيارات أو متابعات الحمل
    where.OR = [
      { visit: { patientId: filters.patientId } },
      { followup: { pregnancy: { patientId: filters.patientId } } },
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
      _count: {
        select: { items: true },
      },
      visit: {
        select: {
          patientId: true,
          visitDate: true,
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      followup: {
        select: {
          pregnancy: {
            select: {
              patientId: true,
              patient: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: offset,
  });

  return prescriptions.map((prescription) => ({
    id: prescription.id,
    visitId: prescription.visitId,
    followupId: prescription.followupId,
    notes: prescription.notes,
    itemsCount: prescription._count.items,
    createdAt: prescription.createdAt,
    visit: prescription.visit,
    followup: prescription.followup,
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
      items: true,
      visit: {
        include: {
          patient: true,
        },
      },
      followup: {
        include: {
          pregnancy: {
            include: {
              patient: true,
            },
          },
        },
      },
    },
  });
}

export async function getPrescriptionItems(
  prisma: PrismaClient,
  prescriptionId: number
) {
  return await prisma.prescriptionItem.findMany({
    where: { prescriptionId },
    orderBy: {
      id: "asc",
    },
  });
}

