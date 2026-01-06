// lib/users/mutations.ts

import { PrismaClient } from "@prisma/client";
import { CreateUserData, UpdateUserData } from "./types";

export async function createUser(
  prisma: PrismaClient,
  data: CreateUserData
) {
  return await prisma.user.create({
    data: {
      username: data.username,
      passwordHash: data.passwordHash,
      role: data.role,
      doctorId: data.doctorId || null,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || null,
      phone: data.phone,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateUser(
  prisma: PrismaClient,
  userId: number,
  data: UpdateUserData
) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.username && { username: data.username }),
      ...(data.passwordHash && { passwordHash: data.passwordHash }),
      ...(data.role && { role: data.role }),
      ...(data.doctorId !== undefined && { doctorId: data.doctorId }),
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.phone && { phone: data.phone }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
}

export async function deleteUser(
  prisma: PrismaClient,
  userId: number
) {
  return await prisma.user.delete({
    where: { id: userId },
  });
}

export async function updateLastLogin(
  prisma: PrismaClient,
  userId: number
) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      lastLogin: new Date(),
    },
  });
}


