// lib/staff/mutations.ts

import { PrismaClient } from "@prisma/client";
import { CreateStaffData, UpdateStaffData } from "./types";

export async function createStaff(
  prisma: PrismaClient,
  data: CreateStaffData
) {
  return await prisma.staff.create({
    data: {
      salaryCurrency: data.salaryCurrency || "EGP",
      isActive: data.isActive ?? true,
      ...data,
      hireDate: new Date(data.hireDate),
      terminationDate: data.terminationDate ? new Date(data.terminationDate) : undefined,
    },
  });
}

export async function updateStaff(
  prisma: PrismaClient,
  staffId: number,
  data: UpdateStaffData
) {
  return await prisma.staff.update({
    where: { id: staffId },
    data: {
      ...data,
      terminationDate: data.terminationDate ? new Date(data.terminationDate) : undefined,
    },
  });
}

export async function deleteStaff(
  prisma: PrismaClient,
  staffId: number
) {
  return await prisma.staff.delete({
    where: { id: staffId },
  });
}

