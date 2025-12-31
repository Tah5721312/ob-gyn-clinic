// lib/roles/queries.ts

import { PrismaClient } from "@prisma/client";
import { RoleFilters, PermissionFilters, RoleListItem, PermissionListItem } from "./types";

function buildRoleWhereClause(filters: RoleFilters) {
  const where: any = {};

  if (filters.search) {
    where.OR = [
      { roleName: { contains: filters.search, mode: "insensitive" } },
      { roleCode: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  return where;
}

function buildPermissionWhereClause(filters: PermissionFilters) {
  const where: any = {};

  if (filters.search) {
    where.OR = [
      { permissionName: { contains: filters.search, mode: "insensitive" } },
      { permissionCode: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.module) {
    where.module = { contains: filters.module, mode: "insensitive" };
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  return where;
}

export async function getRolesList(
  prisma: PrismaClient,
  filters: RoleFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<RoleListItem[]> {
  const where = buildRoleWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const roles = await prisma.role.findMany({
    where,
    include: {
      permissions: {
        select: { id: true },
      },
      users: {
        select: { id: true },
      },
    },
    orderBy: {
      roleName: "asc",
    },
    take: limit,
    skip: offset,
  });

  return roles.map((role) => ({
    id: role.id,
    roleName: role.roleName,
    roleCode: role.roleCode,
    description: role.description,
    isActive: role.isActive,
    permissionsCount: role.permissions.length,
    usersCount: role.users.length,
  }));
}

export async function getRolesCount(
  prisma: PrismaClient,
  filters: RoleFilters = {}
): Promise<number> {
  const where = buildRoleWhereClause(filters);
  return await prisma.role.count({ where });
}

export async function getRoleById(
  prisma: PrismaClient,
  roleId: number
) {
  return await prisma.role.findUnique({
    where: { id: roleId },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
      users: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
}

export async function getPermissionsList(
  prisma: PrismaClient,
  filters: PermissionFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<PermissionListItem[]> {
  const where = buildPermissionWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const permissions = await prisma.permission.findMany({
    where,
    select: {
      id: true,
      permissionName: true,
      permissionCode: true,
      description: true,
      module: true,
      isActive: true,
    },
    orderBy: {
      module: "asc",
    },
    take: limit,
    skip: offset,
  });

  return permissions;
}

export async function getPermissionsCount(
  prisma: PrismaClient,
  filters: PermissionFilters = {}
): Promise<number> {
  const where = buildPermissionWhereClause(filters);
  return await prisma.permission.count({ where });
}

export async function getPermissionById(
  prisma: PrismaClient,
  permissionId: number
) {
  return await prisma.permission.findUnique({
    where: { id: permissionId },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });
}

