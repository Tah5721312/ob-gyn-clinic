// lib/users/queries.ts

/**
 * Database queries for User operations
 */

import { PrismaClient } from "@prisma/client";
import { UserFilters, UserListItem } from "./types";

/**
 * بناء where clause للبحث والفلترة
 */
function buildWhereClause(filters: UserFilters) {
  const where: any = {};

  // البحث في username, firstName, lastName, email, phone
  if (filters.search) {
    where.OR = [
      { username: { contains: filters.search, mode: "insensitive" } },
      { firstName: { contains: filters.search, mode: "insensitive" } },
      { lastName: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  // Filter: role
  if (filters.role) {
    where.role = filters.role;
  }

  // Filter: isActive
  if (filters.isActive !== null && filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  // Filter: doctorId
  if (filters.doctorId !== null && filters.doctorId !== undefined) {
    where.doctorId = filters.doctorId;
  }

  return where;
}

/**
 * جلب قائمة المستخدمين مع البحث والفلترة
 */
export async function getUsersList(
  prisma: PrismaClient,
  filters: UserFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<UserListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      username: true,
      role: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      doctorId: true,
      isActive: true,
      lastLogin: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: offset,
  });

  return users.map((user) => ({
    id: user.id,
    username: user.username,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    doctorId: user.doctorId,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
  }));
}

/**
 * جلب عدد المستخدمين (للـ pagination)
 */
export async function getUsersCount(
  prisma: PrismaClient,
  filters: UserFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.user.count({ where });
}

/**
 * جلب مستخدم واحد بالـ ID
 */
export async function getUserById(
  prisma: PrismaClient,
  userId: number
) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      doctor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          specialization: true,
        },
      },
    },
  });
}

/**
 * جلب مستخدم بالـ username
 */
export async function getUserByUsername(
  prisma: PrismaClient,
  username: string
) {
  return await prisma.user.findUnique({
    where: { username },
    include: {
      doctor: true,
    },
  });
}


