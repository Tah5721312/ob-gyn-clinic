// lib/doctors/queries.ts

import { PrismaClient } from "@prisma/client";
import { DoctorFilters, DoctorListItem } from "./types";
import { buildDoctorFullName } from "./utils";

function buildWhereClause(filters: DoctorFilters) {
  const where: any = {};

  if (filters.search) {
    where.OR = [
      { firstName: { contains: filters.search, mode: "insensitive" } },
      { lastName: { contains: filters.search, mode: "insensitive" } },
      { specialization: { contains: filters.search, mode: "insensitive" } },
      { licenseNumber: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.specialization) {
    where.specialization = { contains: filters.specialization, mode: "insensitive" };
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  return where;
}

export async function getDoctorsList(
  prisma: PrismaClient,
  filters: DoctorFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<DoctorListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const doctors = await prisma.doctor.findMany({
    where,
    select: {
      id: true,
      nationalId: true,
      firstName: true,
      lastName: true,
      specialization: true,
      licenseNumber: true,
      phone: true,
      isActive: true,
    },
    orderBy: {
      firstName: "asc",
    },
    take: limit,
    skip: offset,
  });

  return doctors.map((doctor) => ({
    ...doctor,
    fullName: buildDoctorFullName(doctor.firstName, doctor.lastName),
  }));
}

export async function getDoctorsCount(
  prisma: PrismaClient,
  filters: DoctorFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.doctor.count({ where });
}

export async function getDoctorById(
  prisma: PrismaClient,
  doctorId: number
) {
  return await prisma.doctor.findUnique({
    where: { id: doctorId },
    include: {
      workingSchedule: {
        where: { isActive: true },
      },
      appointments: {
        orderBy: { appointmentDate: "desc" },
        take: 10,
      },
    },
  });
}

