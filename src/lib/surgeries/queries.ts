// lib/surgeries/queries.ts

import { PrismaClient } from "@prisma/client";
import { SurgeryFilters, SurgeryListItem } from "./types";

function buildWhereClause(filters: SurgeryFilters) {
  const where: any = {};

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters.doctorId) {
    where.doctorId = filters.doctorId;
  }

  if (filters.surgeryType) {
    where.surgeryType = filters.surgeryType;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.scheduledDate) {
    where.scheduledDate = filters.scheduledDate;
  }

  if (filters.search) {
    where.OR = [
      { surgeryName: { contains: filters.search, mode: "insensitive" } },
      { patient: { firstName: { contains: filters.search, mode: "insensitive" } } },
      { patient: { lastName: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  return where;
}

export async function getSurgeriesList(
  prisma: PrismaClient,
  filters: SurgeryFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<SurgeryListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const surgeries = await prisma.surgery.findMany({
    where,
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      doctor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      scheduledDate: "desc",
    },
    take: limit,
    skip: offset,
  });

  return surgeries.map((surgery) => ({
    id: surgery.id,
    patientId: surgery.patientId,
    patientName: `${surgery.patient.firstName} ${surgery.patient.lastName}`,
    doctorId: surgery.doctorId,
    doctorName: `${surgery.doctor.firstName} ${surgery.doctor.lastName}`,
    anesthesiologistId: surgery.anesthesiologistId,
    surgeryName: surgery.surgeryName,
    surgeryType: surgery.surgeryType,
    scheduledDate: surgery.scheduledDate,
    scheduledTime: surgery.scheduledTime,
    status: surgery.status,
    actualSurgeryDate: surgery.actualSurgeryDate,
  }));
}

export async function getSurgeriesCount(
  prisma: PrismaClient,
  filters: SurgeryFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.surgery.count({ where });
}

export async function getSurgeryById(
  prisma: PrismaClient,
  surgeryId: number
) {
  return await prisma.surgery.findUnique({
    where: { id: surgeryId },
    include: {
      patient: true,
      doctor: true,
      anesthesiologist: true,
      followups: {
        include: {
          visit: true,
        },
        orderBy: {
          followupDate: "desc",
        },
      },
    },
  });
}

