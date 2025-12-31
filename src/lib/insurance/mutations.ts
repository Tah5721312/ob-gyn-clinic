// lib/insurance/mutations.ts

import { PrismaClient } from "@prisma/client";
import {
  CreateInsuranceCompanyData,
  UpdateInsuranceCompanyData,
  CreatePatientInsuranceData,
  UpdatePatientInsuranceData,
} from "./types";

export async function createInsuranceCompany(
  prisma: PrismaClient,
  data: CreateInsuranceCompanyData
) {
  return await prisma.insuranceCompany.create({
    data: {
      isActive: data.isActive ?? true,
      approvalRequired: data.approvalRequired ?? true,
      ...data,
      contractStartDate: data.contractStartDate ? new Date(data.contractStartDate) : undefined,
      contractEndDate: data.contractEndDate ? new Date(data.contractEndDate) : undefined,
    },
  });
}

export async function updateInsuranceCompany(
  prisma: PrismaClient,
  insuranceId: number,
  data: UpdateInsuranceCompanyData
) {
  return await prisma.insuranceCompany.update({
    where: { id: insuranceId },
    data: {
      ...data,
      contractStartDate: data.contractStartDate ? new Date(data.contractStartDate) : undefined,
      contractEndDate: data.contractEndDate ? new Date(data.contractEndDate) : undefined,
    },
  });
}

export async function deleteInsuranceCompany(
  prisma: PrismaClient,
  insuranceId: number
) {
  return await prisma.insuranceCompany.delete({
    where: { id: insuranceId },
  });
}

export async function createPatientInsurance(
  prisma: PrismaClient,
  data: CreatePatientInsuranceData
) {
  return await prisma.patientInsurance.create({
    data: {
      preauthorizationRequired: data.preauthorizationRequired ?? true,
      isPrimary: data.isPrimary ?? false,
      isActive: data.isActive ?? true,
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });
}

export async function updatePatientInsurance(
  prisma: PrismaClient,
  patientInsuranceId: number,
  data: UpdatePatientInsuranceData
) {
  return await prisma.patientInsurance.update({
    where: { id: patientInsuranceId },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      verificationDate: data.verificationDate ? new Date(data.verificationDate) : undefined,
    },
  });
}

export async function deletePatientInsurance(
  prisma: PrismaClient,
  patientInsuranceId: number
) {
  return await prisma.patientInsurance.delete({
    where: { id: patientInsuranceId },
  });
}

