// lib/insurance/mutations.ts

import { PrismaClient } from "@prisma/client";
import { CreateInsuranceData, UpdateInsuranceData } from "./types";

export async function createInsurance(
  prisma: PrismaClient,
  data: CreateInsuranceData
) {
  return await prisma.insurance.create({
    data: {
      patientId: data.patientId,
      insuranceCompany: data.insuranceCompany,
      policyNumber: data.policyNumber,
      expiryDate: new Date(data.expiryDate),
      coverageDetails: data.coverageDetails || null,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateInsurance(
  prisma: PrismaClient,
  insuranceId: number,
  data: UpdateInsuranceData
) {
  return await prisma.insurance.update({
    where: { id: insuranceId },
    data: {
      ...(data.insuranceCompany && { insuranceCompany: data.insuranceCompany }),
      ...(data.policyNumber && { policyNumber: data.policyNumber }),
      ...(data.expiryDate && { expiryDate: new Date(data.expiryDate) }),
      ...(data.coverageDetails !== undefined && { coverageDetails: data.coverageDetails }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
}

export async function deleteInsurance(
  prisma: PrismaClient,
  insuranceId: number
) {
  return await prisma.insurance.delete({
    where: { id: insuranceId },
  });
}
