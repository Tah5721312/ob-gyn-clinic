// lib/insurance/queries.ts

import { PrismaClient } from "@prisma/client";
import {
  InsuranceFilters,
  InsuranceCompanyListItem,
  PatientInsuranceListItem,
} from "./types";

function buildInsuranceWhereClause(filters: InsuranceFilters) {
  const where: any = {};

  if (filters.search) {
    where.OR = [
      { companyCode: { contains: filters.search, mode: "insensitive" } },
      { companyName: { contains: filters.search, mode: "insensitive" } },
      { companyNameEn: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  return where;
}

export async function getInsuranceCompaniesList(
  prisma: PrismaClient,
  filters: InsuranceFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<InsuranceCompanyListItem[]> {
  const where = buildInsuranceWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const companies = await prisma.insuranceCompany.findMany({
    where,
    select: {
      id: true,
      companyCode: true,
      companyName: true,
      companyNameEn: true,
      phone: true,
      email: true,
      coveragePercentage: true,
      isActive: true,
    },
    orderBy: {
      companyName: "asc",
    },
    take: limit,
    skip: offset,
  });

  return companies.map((company) => ({
    ...company,
    coveragePercentage: company.coveragePercentage ? Number(company.coveragePercentage) : null,
  }));
}

export async function getInsuranceCompaniesCount(
  prisma: PrismaClient,
  filters: InsuranceFilters = {}
): Promise<number> {
  const where = buildInsuranceWhereClause(filters);
  return await prisma.insuranceCompany.count({ where });
}

export async function getInsuranceCompanyById(
  prisma: PrismaClient,
  insuranceId: number
) {
  return await prisma.insuranceCompany.findUnique({
    where: { id: insuranceId },
  });
}

export async function getPatientInsurancesList(
  prisma: PrismaClient,
  patientId: number
): Promise<PatientInsuranceListItem[]> {
  const insurances = await prisma.patientInsurance.findMany({
    where: { patientId },
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      insurance: {
        select: {
          id: true,
          companyName: true,
        },
      },
    },
    orderBy: {
      isPrimary: "desc",
    },
  });

  return insurances.map((insurance) => ({
    id: insurance.id,
    patientId: insurance.patientId,
    patientName: `${insurance.patient.firstName} ${insurance.patient.lastName}`,
    insuranceId: insurance.insuranceId,
    insuranceName: insurance.insurance.companyName,
    policyNumber: insurance.policyNumber,
    memberId: insurance.memberId,
    startDate: insurance.startDate,
    endDate: insurance.endDate,
    isPrimary: insurance.isPrimary,
    isActive: insurance.isActive,
  }));
}

export async function getPatientInsuranceById(
  prisma: PrismaClient,
  patientInsuranceId: number
) {
  return await prisma.patientInsurance.findUnique({
    where: { id: patientInsuranceId },
    include: {
      patient: true,
      insurance: true,
    },
  });
}

