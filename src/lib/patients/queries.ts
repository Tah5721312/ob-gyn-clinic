// lib/patients/queries.ts

/**
 * Database queries for Patient operations
 */

import { PrismaClient } from "@prisma/client";
import { PatientFilters, PatientListItem } from "./types";
import { calculateAge, buildFullName } from "./utils";

/**
 * بناء where clause للبحث والفلترة
 */
function buildWhereClause(filters: PatientFilters) {
  const where: any = {};

  // البحث في firstName, lastName, phone
  if (filters.search) {
    where.OR = [
      { firstName: { contains: filters.search, mode: "insensitive" } },
      { lastName: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  // Filter: isActive
  if (filters.isActive !== null && filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  return where;
}

/**
 * جلب قائمة المرضى مع البحث والفلترة
 */
export async function getPatientsList(
  prisma: PrismaClient,
  filters: PatientFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<PatientListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  // جلب البيانات مع العلاقات المطلوبة
  const patients = await prisma.patient.findMany({
    where,
      select: {
      id: true,
      firstName: true,
      lastName: true,
      birthDate: true,
      registrationDate: true,
      phone: true,
      isActive: true,
    },
    orderBy: {
      registrationDate: "desc",
    },
    take: limit,
    skip: offset,
  });

  // تحويل البيانات إلى PatientListItem
  return patients.map((patient) => {
    const age = calculateAge(patient.birthDate);

    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      fullName: buildFullName(patient.firstName, patient.lastName),
      phone: patient.phone,
      age,
      registrationDate: patient.registrationDate,
      isActive: patient.isActive,
    };
  });
}

/**
 * جلب عدد المرضى (للـ pagination)
 */
export async function getPatientsCount(
  prisma: PrismaClient,
  filters: PatientFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.patient.count({ where });
}

/**
 * جلب مريض واحد بالـ ID
 */
export async function getPatientById(
  prisma: PrismaClient,
  patientId: number
) {
  return await prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      pregnancyRecords: {
        where: { isActive: true },
        orderBy: { lmpDate: "desc" },
        take: 1,
      },
      medicalHistory: true,
      appointments: {
        orderBy: { appointmentDate: "desc" },
        take: 10,
        include: {
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      visits: {
        orderBy: { visitDate: "desc" },
        take: 10,
        include: {
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          prescriptions: {
            include: {
              items: true,
            },
          },
        },
      },
      diagnoses: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

