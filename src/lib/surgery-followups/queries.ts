// lib/surgery-followups/queries.ts

import { PrismaClient } from "@prisma/client";
import { SurgeryFollowupFilters, SurgeryFollowupListItem } from "./types";

function buildWhereClause(filters: SurgeryFollowupFilters) {
  const where: any = {};

  if (filters.surgeryId) {
    where.surgeryId = filters.surgeryId;
  }

  if (filters.visitId) {
    where.visitId = filters.visitId;
  }

  if (filters.followupDate) {
    where.followupDate = filters.followupDate;
  }

  return where;
}

export async function getSurgeryFollowupsList(
  prisma: PrismaClient,
  filters: SurgeryFollowupFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<SurgeryFollowupListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const followups = await prisma.surgeryFollowup.findMany({
    where,
    orderBy: {
      followupDate: "desc",
    },
    take: limit,
    skip: offset,
  });

  return followups.map((followup) => ({
    id: followup.id,
    surgeryId: followup.surgeryId,
    visitId: followup.visitId,
    followupDate: followup.followupDate,
    daysPostSurgery: followup.daysPostSurgery,
    woundCondition: followup.woundCondition,
    painLevel: followup.painLevel,
    healingStatus: followup.healingStatus,
  }));
}

export async function getSurgeryFollowupsCount(
  prisma: PrismaClient,
  filters: SurgeryFollowupFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.surgeryFollowup.count({ where });
}

export async function getSurgeryFollowupById(
  prisma: PrismaClient,
  followupId: number
) {
  return await prisma.surgeryFollowup.findUnique({
    where: { id: followupId },
    include: {
      surgery: true,
      visit: true,
    },
  });
}

