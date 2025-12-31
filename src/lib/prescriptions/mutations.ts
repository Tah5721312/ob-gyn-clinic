// lib/prescriptions/mutations.ts

import { PrismaClient } from "@prisma/client";

export interface CreatePrescriptionData {
  visitId: number;
  patientId: number;
  doctorId: number;
  prescriptionDate?: Date;
  isEmergency?: boolean;
  isChronicMedication?: boolean;
  validUntil?: Date;
  refillsAllowed?: number;
  pharmacyNotes?: string;
  notes?: string;
}

export interface UpdatePrescriptionData {
  validUntil?: Date;
  refillsAllowed?: number;
  refillsUsed?: number;
  pharmacyNotes?: string;
  notes?: string;
}

export interface CreatePrescriptionDetailData {
  prescriptionId: number;
  medicationId: number;
  dosage: string;
  frequency: string;
  frequencyPerDay?: number;
  route?: string;
  timing?: string;
  durationDays?: number;
  startDate?: Date;
  endDate?: Date;
  totalQuantity?: number;
  instructions?: string;
  isAsNeeded?: boolean;
}

export async function createPrescription(
  prisma: PrismaClient,
  data: CreatePrescriptionData
) {
  return await prisma.prescription.create({
    data: {
      prescriptionDate: data.prescriptionDate || new Date(),
      isEmergency: data.isEmergency || false,
      isChronicMedication: data.isChronicMedication || false,
      refillsAllowed: data.refillsAllowed || 0,
      refillsUsed: 0,
      ...data,
    },
  });
}

export async function updatePrescription(
  prisma: PrismaClient,
  prescriptionId: number,
  data: UpdatePrescriptionData
) {
  return await prisma.prescription.update({
    where: { id: prescriptionId },
    data,
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

export async function addPrescriptionDetail(
  prisma: PrismaClient,
  data: CreatePrescriptionDetailData
) {
  return await prisma.prescriptionDetail.create({
    data,
  });
}

export async function removePrescriptionDetail(
  prisma: PrismaClient,
  detailId: number
) {
  return await prisma.prescriptionDetail.delete({
    where: { id: detailId },
  });
}

