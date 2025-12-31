// lib/pregnancies/mutations.ts

import { PrismaClient } from "@prisma/client";

export interface CreatePregnancyData {
  patientId: number;
  pregnancyNumber: number;
  lmpDate: Date;
  eddDate?: Date;
  eddByUltrasound?: Date;
  conceptionMethod?: string;
  pregnancyType?: string;
  pregnancyStatus?: string;
  riskLevel?: string;
}

export interface UpdatePregnancyData {
  lmpDate?: Date;
  eddDate?: Date;
  eddByUltrasound?: Date;
  conceptionMethod?: string;
  pregnancyType?: string;
  pregnancyStatus?: string;
  riskLevel?: string;
  deliveryDate?: Date;
  deliveryType?: string;
  deliveryLocation?: string;
  gestationalAgeAtDelivery?: number;
  deliveryMethod?: string;
  anesthesiaType?: string;
  babyGender?: string;
  babyWeight?: number;
  babyLength?: number;
  babyHeadCircumference?: number;
  apgarScore1min?: number;
  apgarScore5min?: number;
  babyStatus?: string;
  complications?: string;
  medicationsDuringPregnancy?: string;
  notes?: string;
}

export async function createPregnancy(
  prisma: PrismaClient,
  data: CreatePregnancyData
) {
  return await prisma.pregnancyRecord.create({
    data: {
      pregnancyStatus: data.pregnancyStatus || "جارية",
      ...data,
    },
  });
}

export async function updatePregnancy(
  prisma: PrismaClient,
  pregnancyId: number,
  data: UpdatePregnancyData
) {
  return await prisma.pregnancyRecord.update({
    where: { id: pregnancyId },
    data,
  });
}

export async function deletePregnancy(
  prisma: PrismaClient,
  pregnancyId: number
) {
  return await prisma.pregnancyRecord.delete({
    where: { id: pregnancyId },
  });
}

