// lib/visits/queries.ts

import { PrismaClient } from "@prisma/client";
import { VisitFilters, VisitListItem } from "./types";

function buildWhereClause(filters: VisitFilters) {
  const where: any = {};

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters.doctorId) {
    where.doctorId = filters.doctorId;
  }

  if (filters.visitDate) {
    where.visitDate = filters.visitDate;
  }

  if (filters.visitStatus) {
    where.visitStatus = filters.visitStatus;
  }

  if (filters.visitType) {
    where.visitType = filters.visitType;
  }

  if (filters.search) {
    where.OR = [
      { patient: { firstName: { contains: filters.search, mode: "insensitive" } } },
      { patient: { lastName: { contains: filters.search, mode: "insensitive" } } },
      { chiefComplaint: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function getVisitsList(
  prisma: PrismaClient,
  filters: VisitFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<VisitListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const visits = await prisma.medicalVisit.findMany({
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
      diagnoses: {
        select: { id: true },
        take: 1,
      },
    },
    orderBy: {
      visitDate: "desc",
    },
    take: limit,
    skip: offset,
  });

  return visits.map((visit) => ({
    id: visit.id,
    appointmentId: visit.appointmentId,
    patientId: visit.patientId,
    patientName: `${visit.patient.firstName} ${visit.patient.lastName}`,
    doctorId: visit.doctorId,
    doctorName: `${visit.doctor.firstName} ${visit.doctor.lastName}`,
    visitDate: visit.visitDate,
    visitStartTime: visit.visitStartTime,
    visitEndTime: visit.visitEndTime,
    visitType: visit.visitType,
    visitStatus: visit.visitStatus,
    chiefComplaint: visit.chiefComplaint,
    hasDiagnoses: visit.diagnoses.length > 0,
  }));
}

export async function getVisitsCount(
  prisma: PrismaClient,
  filters: VisitFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.medicalVisit.count({ where });
}

export async function getVisitById(
  prisma: PrismaClient,
  visitId: number
) {
  return await prisma.medicalVisit.findUnique({
    where: { id: visitId },
    include: {
      patient: true,
      doctor: true,
      appointment: true,
      diagnoses: true,
    },
  });
}

