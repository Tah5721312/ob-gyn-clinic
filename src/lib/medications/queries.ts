// lib/medications/queries.ts

import { PrismaClient } from "@prisma/client";
import { MedicationFilters, MedicationListItem } from "./types";

function buildWhereClause(filters: MedicationFilters) {
  const where: any = {};

  if (filters.search) {
    where.OR = [
      { medicationName: { contains: filters.search, mode: "insensitive" } },
      { scientificName: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function getMedicationsList(
  prisma: PrismaClient,
  filters: MedicationFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<MedicationListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const medications = await prisma.medication.findMany({
    where,
    select: {
      id: true,
      medicationName: true,
      form: true,
      strength: true,
      unit: true,
      price: true,
    },
    orderBy: {
      medicationName: "asc",
    },
    take: limit,
    skip: offset,
  });

  return medications.map((med) => ({
    ...med,
    price: med.price ? Number(med.price) : null,
  }));
}

export async function getMedicationsCount(
  prisma: PrismaClient,
  filters: MedicationFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.medication.count({ where });
}

export async function getMedicationById(
  prisma: PrismaClient,
  medicationId: number
) {
  return await prisma.medication.findUnique({
    where: { id: medicationId },
  });
}

