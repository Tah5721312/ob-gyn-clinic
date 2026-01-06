// lib/pregnancy-followups/queries.ts

import { PrismaClient } from "@prisma/client";
import { PregnancyFollowupFilters, PregnancyFollowupListItem } from "./types";
import { calculateGestationalAgeWeeks } from "./utils";

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
    include: {
      pregnancy: {
        select: {
          lmpDate: true,
        },
      },
    },
    orderBy: {
      visitDate: "desc",
    },
    take: limit,
    skip: offset,
  });

  return followups.map((followup) => {
    // حساب gestationalAgeWeeks من lmpDate و visitDate (دائماً في الـ backend)
    const gestationalAgeWeeks = followup.pregnancy
      ? calculateGestationalAgeWeeks(
          followup.pregnancy.lmpDate,
          followup.visitDate
        )
      : null;

    return {
      id: followup.id,
      pregnancyId: followup.pregnancyId,
      visitId: followup.visitId,
      visitDate: followup.visitDate,
      gestationalAgeWeeks,
    };
  });
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
  const followup = await prisma.pregnancyFollowup.findUnique({
    where: { id: followupId },
    include: {
      pregnancy: true,
      visit: true,
    },
  });

  if (!followup) {
    return null;
  }

  // حساب gestationalAgeWeeks من lmpDate و visitDate (دائماً في الـ backend)
  const gestationalAgeWeeks = followup.pregnancy
    ? calculateGestationalAgeWeeks(
        followup.pregnancy.lmpDate,
        followup.visitDate
      )
    : null;

  return {
    ...followup,
    gestationalAgeWeeks,
  };
}

