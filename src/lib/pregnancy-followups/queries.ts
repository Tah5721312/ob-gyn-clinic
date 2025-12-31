// lib/pregnancy-followups/queries.ts

import { PrismaClient } from "@prisma/client";
import { PregnancyFollowupFilters, PregnancyFollowupListItem } from "./types";

function buildWhereClause(filters: PregnancyFollowupFilters) {
  const where: any = {};

  if (filters.pregnancyId) {
    where.pregnancyId = filters.pregnancyId;
  }

  if (filters.visitId) {
    where.visitId = filters.visitId;
  }

  if (filters.visitDate) {
    where.visitDate = filters.visitDate;
  }

  return where;
}

export async function getPregnancyFollowupsList(
  prisma: PrismaClient,
  filters: PregnancyFollowupFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<PregnancyFollowupListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const followups = await prisma.pregnancyFollowup.findMany({
    where,
    orderBy: {
      visitDate: "desc",
    },
    take: limit,
    skip: offset,
  });

  return followups.map((followup) => ({
    id: followup.id,
    pregnancyId: followup.pregnancyId,
    visitId: followup.visitId,
    visitDate: followup.visitDate,
    visitNumber: followup.visitNumber,
    gestationalAgeWeeks: followup.gestationalAgeWeeks ? Number(followup.gestationalAgeWeeks) : null,
    fundalHeight: followup.fundalHeight ? Number(followup.fundalHeight) : null,
    fetalHeartRate: followup.fetalHeartRate,
  }));
}

export async function getPregnancyFollowupsCount(
  prisma: PrismaClient,
  filters: PregnancyFollowupFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.pregnancyFollowup.count({ where });
}

export async function getPregnancyFollowupById(
  prisma: PrismaClient,
  followupId: number
) {
  return await prisma.pregnancyFollowup.findUnique({
    where: { id: followupId },
    include: {
      pregnancy: true,
      visit: true,
    },
  });
}

