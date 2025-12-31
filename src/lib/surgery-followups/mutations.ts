// lib/surgery-followups/mutations.ts

import { PrismaClient } from "@prisma/client";
import { CreateSurgeryFollowupData, UpdateSurgeryFollowupData } from "./types";

export async function createSurgeryFollowup(
  prisma: PrismaClient,
  data: CreateSurgeryFollowupData
) {
  return await prisma.surgeryFollowup.create({
    data: {
      suturesRemoved: data.suturesRemoved ?? false,
      ...data,
      followupDate: new Date(data.followupDate),
      suturesRemovalDate: data.suturesRemovalDate ? new Date(data.suturesRemovalDate) : undefined,
      nextFollowupDate: data.nextFollowupDate ? new Date(data.nextFollowupDate) : undefined,
    },
  });
}

export async function updateSurgeryFollowup(
  prisma: PrismaClient,
  followupId: number,
  data: UpdateSurgeryFollowupData
) {
  return await prisma.surgeryFollowup.update({
    where: { id: followupId },
    data: {
      ...data,
      followupDate: data.followupDate ? new Date(data.followupDate) : undefined,
      suturesRemovalDate: data.suturesRemovalDate ? new Date(data.suturesRemovalDate) : undefined,
      nextFollowupDate: data.nextFollowupDate ? new Date(data.nextFollowupDate) : undefined,
    },
  });
}

export async function deleteSurgeryFollowup(
  prisma: PrismaClient,
  followupId: number
) {
  return await prisma.surgeryFollowup.delete({
    where: { id: followupId },
  });
}

