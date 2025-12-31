// lib/doctor-leaves/queries.ts

import { PrismaClient } from "@prisma/client";
import { DoctorLeaveFilters, DoctorLeaveListItem } from "./types";

function buildWhereClause(filters: DoctorLeaveFilters) {
  const where: any = {};

  if (filters.doctorId) {
    where.doctorId = filters.doctorId;
  }

  if (filters.leaveType) {
    where.leaveType = filters.leaveType;
  }

  if (filters.isApproved !== undefined) {
    where.isApproved = filters.isApproved;
  }

  if (filters.startDate || filters.endDate) {
    where.OR = [
      {
        leaveStartDate: {
          lte: filters.endDate || new Date(),
        },
        leaveEndDate: {
          gte: filters.startDate || new Date(0),
        },
      },
    ];
  }

  return where;
}

export async function getDoctorLeavesList(
  prisma: PrismaClient,
  filters: DoctorLeaveFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<DoctorLeaveListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const leaves = await prisma.doctorLeave.findMany({
    where,
    include: {
      doctor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      leaveStartDate: "desc",
    },
    take: limit,
    skip: offset,
  });

  return leaves.map((leave) => ({
    id: leave.id,
    doctorId: leave.doctorId,
    doctorName: `${leave.doctor.firstName} ${leave.doctor.lastName}`,
    leaveStartDate: leave.leaveStartDate,
    leaveEndDate: leave.leaveEndDate,
    leaveType: leave.leaveType,
    isApproved: leave.isApproved,
  }));
}

export async function getDoctorLeavesCount(
  prisma: PrismaClient,
  filters: DoctorLeaveFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.doctorLeave.count({ where });
}

export async function getDoctorLeaveById(
  prisma: PrismaClient,
  leaveId: number
) {
  return await prisma.doctorLeave.findUnique({
    where: { id: leaveId },
    include: {
      doctor: true,
    },
  });
}

