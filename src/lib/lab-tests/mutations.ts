// lib/lab-tests/mutations.ts

import { PrismaClient } from "@prisma/client";
import { CreateLabTestData, UpdateLabTestData } from "./types";

export async function createLabTest(
  prisma: PrismaClient,
  data: CreateLabTestData
) {
  return await prisma.labTest.create({
    data: {
      isActive: data.isActive ?? true,
      ...data,
    },
  });
}

export async function updateLabTest(
  prisma: PrismaClient,
  testId: number,
  data: UpdateLabTestData
) {
  return await prisma.labTest.update({
    where: { id: testId },
    data,
  });
}

export async function deleteLabTest(
  prisma: PrismaClient,
  testId: number
) {
  return await prisma.labTest.delete({
    where: { id: testId },
  });
}

