// lib/patients/mutations.ts

import { PrismaClient } from "@prisma/client";

export interface CreatePatientData {
  nationalId: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  bloodType?: string;
  phone: string;
  phone2?: string;
  address?: string;
  maritalStatus?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  notes?: string;
  isActive?: boolean;
  insuranceId?: number | null;
}

export interface UpdatePatientData {
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  bloodType?: string;
  phone?: string;
  phone2?: string;
  address?: string;
  maritalStatus?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  notes?: string;
  isActive?: boolean;
  insuranceId?: number | null;
}

export async function createPatient(
  prisma: PrismaClient,
  data: CreatePatientData
) {
  return await prisma.patient.create({
    data: {
      ...data,
    },
  });
}

export async function updatePatient(
  prisma: PrismaClient,
  patientId: number,
  data: UpdatePatientData
) {
  return await prisma.patient.update({
    where: { id: patientId },
    data,
  });
}

export async function deletePatient(
  prisma: PrismaClient,
  patientId: number
) {
  return await prisma.patient.delete({
    where: { id: patientId },
  });
}

