// lib/prescriptions/mutations.ts

import { PrismaClient } from "@prisma/client";
import { CreatePrescriptionData, UpdatePrescriptionData, PrescriptionItemData } from "./types";

export async function createPrescription(
  prisma: PrismaClient,
  data: CreatePrescriptionData
) {
  return await prisma.prescription.create({
    data: {
      visitId: data.visitId || null,
      followupId: data.followupId || null,
      notes: data.notes || null,
      items: {
        create: data.items.map((item) => ({
          medicationName: item.medicationName,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          instructions: item.instructions || null,
        })),
      },
    },
    include: {
      items: true,
    },
  });
}

export async function updatePrescription(
  prisma: PrismaClient,
  prescriptionId: number,
  data: UpdatePrescriptionData
) {
  // إذا تم تحديث items، نحذف القديمة ونضيف الجديدة
  if (data.items) {
    await prisma.prescriptionItem.deleteMany({
      where: { prescriptionId },
    });
  }

  return await prisma.prescription.update({
    where: { id: prescriptionId },
    data: {
      notes: data.notes,
      ...(data.items && {
        items: {
          create: data.items.map((item) => ({
            medicationName: item.medicationName,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            instructions: item.instructions,
          })),
        },
      }),
    },
    include: {
      items: true,
    },
  });
}

export async function deletePrescription(
  prisma: PrismaClient,
  prescriptionId: number
) {
  return await prisma.prescription.delete({
    where: { id: prescriptionId },
  });
}

export async function addPrescriptionItem(
  prisma: PrismaClient,
  prescriptionId: number,
  item: PrescriptionItemData
) {
  return await prisma.prescriptionItem.create({
    data: {
      prescriptionId,
      medicationName: item.medicationName,
      dosage: item.dosage,
      frequency: item.frequency,
      duration: item.duration,
      instructions: item.instructions,
    },
  });
}

export async function updatePrescriptionItem(
  prisma: PrismaClient,
  itemId: number,
  item: PrescriptionItemData
) {
  return await prisma.prescriptionItem.update({
    where: { id: itemId },
    data: {
      medicationName: item.medicationName,
      dosage: item.dosage,
      frequency: item.frequency,
      duration: item.duration,
      instructions: item.instructions,
    },
  });
}

export async function deletePrescriptionItem(
  prisma: PrismaClient,
  itemId: number
) {
  return await prisma.prescriptionItem.delete({
    where: { id: itemId },
  });
}

