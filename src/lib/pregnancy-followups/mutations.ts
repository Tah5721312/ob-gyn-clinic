// lib/pregnancy-followups/mutations.ts

import { PrismaClient } from "@prisma/client";
import { CreatePregnancyFollowupData, UpdatePregnancyFollowupData } from "./types";

export async function createPregnancyFollowup(
  prisma: PrismaClient,
  data: CreatePregnancyFollowupData
) {
  return await prisma.pregnancyFollowup.create({
    data: {
      ...data,
      visitDate: new Date(data.visitDate),
      nextVisitDate: data.nextVisitDate ? new Date(data.nextVisitDate) : undefined,
    },
  });
}

export async function updatePregnancyFollowup(
  prisma: PrismaClient,
  followupId: number,
  data: UpdatePregnancyFollowupData
) {
  return await prisma.pregnancyFollowup.update({
    where: { id: followupId },
    data: {
      ...data,
      nextVisitDate: data.nextVisitDate ? new Date(data.nextVisitDate) : undefined,
    },
  });
}

export async function deletePregnancyFollowup(
  prisma: PrismaClient,
  followupId: number
) {
  return await prisma.pregnancyFollowup.delete({
    where: { id: followupId },
  });
}

