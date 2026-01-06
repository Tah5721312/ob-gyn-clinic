// lib/pregnancy-followups/mutations.ts

import { PrismaClient } from "@prisma/client";
import { CreatePregnancyFollowupData, UpdatePregnancyFollowupData } from "./types";
import { calculateGestationalAgeWeeks } from "./utils";

export async function createPregnancyFollowup(
  prisma: PrismaClient,
  data: CreatePregnancyFollowupData
) {
  // جلب بيانات الحمل لحساب gestationalAgeWeeks من lmpDate
  const pregnancy = await prisma.pregnancyRecord.findUnique({
    where: { id: data.pregnancyId },
    select: { lmpDate: true },
  });

  if (!pregnancy) {
    throw new Error("Pregnancy not found");
  }

  const visitDate = new Date(data.visitDate);
  const gestationalAgeWeeks = calculateGestationalAgeWeeks(
    pregnancy.lmpDate,
    visitDate
  );

  return await prisma.pregnancyFollowup.create({
    data: {
      ...data,
      visitDate,
      gestationalAgeWeeks,
      nextVisitDate: data.nextVisitDate ? new Date(data.nextVisitDate) : undefined,
    },
  });
}

export async function updatePregnancyFollowup(
  prisma: PrismaClient,
  followupId: number,
  data: UpdatePregnancyFollowupData
) {
  // إذا تم تحديث visitDate، نحسب gestationalAgeWeeks من جديد
  let gestationalAgeWeeks: number | undefined;

  if (data.visitDate) {
    const followup = await prisma.pregnancyFollowup.findUnique({
      where: { id: followupId },
      select: { pregnancyId: true },
    });

    if (followup) {
      const pregnancy = await prisma.pregnancyRecord.findUnique({
        where: { id: followup.pregnancyId },
        select: { lmpDate: true },
      });

      if (pregnancy) {
        const visitDate = new Date(data.visitDate);
        gestationalAgeWeeks = calculateGestationalAgeWeeks(
          pregnancy.lmpDate,
          visitDate
        );
      }
    }
  }

  return await prisma.pregnancyFollowup.update({
    where: { id: followupId },
    data: {
      ...data,
      visitDate: data.visitDate ? new Date(data.visitDate) : undefined,
      gestationalAgeWeeks,
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

