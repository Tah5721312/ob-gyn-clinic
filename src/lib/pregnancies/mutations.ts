// lib/pregnancies/mutations.ts

import { PrismaClient } from "@prisma/client";

export interface CreatePregnancyData {
  patientId: number;
  pregnancyNumber: number;
  lmpDate: Date;
  eddDate?: Date;
  eddByUltrasound?: Date;
  deliveryDate?: Date;
  deliveryType?: string;
  gestationalAgeAtDelivery?: number;
  deliveryMethod?: string;
  babyGender?: string;
  medicationsDuringPregnancy?: string;
  notes?: string;
  isActive?: boolean;
}

export interface UpdatePregnancyData {
  lmpDate?: Date;
  eddDate?: Date;
  eddByUltrasound?: Date;
  deliveryDate?: Date;
  deliveryType?: string;
  gestationalAgeAtDelivery?: number;
  deliveryMethod?: string;
  babyGender?: string;
  medicationsDuringPregnancy?: string;
  notes?: string;
  isActive?: boolean;
}

export async function createPregnancy(
  prisma: PrismaClient,
  data: CreatePregnancyData
) {
  return await prisma.pregnancyRecord.create({
    data: {
      patientId: data.patientId,
      pregnancyNumber: data.pregnancyNumber,
      lmpDate: new Date(data.lmpDate),
      eddDate: data.eddDate ? new Date(data.eddDate) : null,
      eddByUltrasound: data.eddByUltrasound ? new Date(data.eddByUltrasound) : null,
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
      deliveryType: data.deliveryType || null,
      gestationalAgeAtDelivery: data.gestationalAgeAtDelivery || null,
      deliveryMethod: data.deliveryMethod || null,
      babyGender: data.babyGender || null,
      medicationsDuringPregnancy: data.medicationsDuringPregnancy || null,
      notes: data.notes || null,
      isActive: data.isActive ?? true,
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

