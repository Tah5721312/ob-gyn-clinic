// lib/staff/queries.ts

import { PrismaClient } from "@prisma/client";
import { StaffFilters, StaffListItem } from "./types";

function buildWhereClause(filters: StaffFilters) {
  const where: any = {};

  if (filters.search) {
    where.OR = [
      { firstName: { contains: filters.search, mode: "insensitive" } },
      { lastName: { contains: filters.search, mode: "insensitive" } },
      { employeeNumber: { contains: filters.search, mode: "insensitive" } },
      { nationalId: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.position) {
    where.position = { contains: filters.position, mode: "insensitive" };
  }

  if (filters.department) {
    where.department = { contains: filters.department, mode: "insensitive" };
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  return where;
}

export async function getStaffList(
  prisma: PrismaClient,
  filters: StaffFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<StaffListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const staff = await prisma.staff.findMany({
    where,
    select: {
      id: true,
      employeeNumber: true,
      nationalId: true,
      firstName: true,
      lastName: true,
      position: true,
      department: true,
      phone: true,
      email: true,
      hireDate: true,
      isActive: true,
    },
    orderBy: {
      firstName: "asc",
    },
    take: limit,
    skip: offset,
  });

  return staff.map((member) => ({
    ...member,
    fullName: `${member.firstName} ${member.lastName}`,
  }));
}

export async function getStaffCount(
  prisma: PrismaClient,
  filters: StaffFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.staff.count({ where });
}

export async function getStaffById(
  prisma: PrismaClient,
  staffId: number
) {
  return await prisma.staff.findUnique({
    where: { id: staffId },
    include: {
      systemUser: true,
    },
  });
}

