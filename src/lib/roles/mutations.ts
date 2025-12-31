// lib/roles/mutations.ts

import { PrismaClient } from "@prisma/client";
import {
  CreateRoleData,
  UpdateRoleData,
  CreatePermissionData,
  UpdatePermissionData,
  AssignPermissionData,
} from "./types";

export async function createRole(
  prisma: PrismaClient,
  data: CreateRoleData
) {
  return await prisma.role.create({
    data: {
      isActive: data.isActive ?? true,
      ...data,
    },
  });
}

export async function updateRole(
  prisma: PrismaClient,
  roleId: number,
  data: UpdateRoleData
) {
  return await prisma.role.update({
    where: { id: roleId },
    data,
  });
}

export async function deleteRole(
  prisma: PrismaClient,
  roleId: number
) {
  return await prisma.role.delete({
    where: { id: roleId },
  });
}

export async function createPermission(
  prisma: PrismaClient,
  data: CreatePermissionData
) {
  return await prisma.permission.create({
    data: {
      isActive: data.isActive ?? true,
      ...data,
    },
  });
}

export async function updatePermission(
  prisma: PrismaClient,
  permissionId: number,
  data: UpdatePermissionData
) {
  return await prisma.permission.update({
    where: { id: permissionId },
    data,
  });
}

export async function deletePermission(
  prisma: PrismaClient,
  permissionId: number
) {
  return await prisma.permission.delete({
    where: { id: permissionId },
  });
}

export async function assignPermissionToRole(
  prisma: PrismaClient,
  data: AssignPermissionData
) {
  return await prisma.rolePermission.create({
    data: {
      ...data,
    },
  });
}

export async function removePermissionFromRole(
  prisma: PrismaClient,
  roleId: number,
  permissionId: number
) {
  return await prisma.rolePermission.delete({
    where: {
      roleId_permissionId: {
        roleId,
        permissionId,
      },
    },
  });
}

