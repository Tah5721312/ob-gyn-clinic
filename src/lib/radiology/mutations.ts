// lib/radiology/mutations.ts

import { PrismaClient } from "@prisma/client";
import { CreateRadiologyOrderData, UpdateRadiologyOrderData } from "./types";

export async function createRadiologyOrder(
  prisma: PrismaClient,
  data: CreateRadiologyOrderData
) {
  return await prisma.radiologyOrder.create({
    data: {
      orderDate: data.orderDate || new Date(),
      status: data.status || "معلق",
      ...data,
      examDate: data.examDate ? new Date(data.examDate) : undefined,
      examTime: data.examTime ? new Date(data.examTime) : undefined,
    },
  });
}

export async function updateRadiologyOrder(
  prisma: PrismaClient,
  orderId: number,
  data: UpdateRadiologyOrderData
) {
  return await prisma.radiologyOrder.update({
    where: { id: orderId },
    data: {
      ...data,
      examDate: data.examDate ? new Date(data.examDate) : undefined,
      examTime: data.examTime ? new Date(data.examTime) : undefined,
    },
  });
}

export async function deleteRadiologyOrder(
  prisma: PrismaClient,
  orderId: number
) {
  return await prisma.radiologyOrder.delete({
    where: { id: orderId },
  });
}

