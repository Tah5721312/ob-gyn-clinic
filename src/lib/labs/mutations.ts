// lib/labs/mutations.ts

import { PrismaClient } from "@prisma/client";

export interface CreateLabOrderData {
  visitId: number;
  patientId: number;
  doctorId: number;
  orderDate?: Date;
  orderReason?: string;
  priority?: string;
  status?: string;
  expectedResultDate?: Date;
  labName?: string;
  externalLabOrderId?: string;
  notes?: string;
}

export interface UpdateLabOrderData {
  orderReason?: string;
  priority?: string;
  status?: string;
  sampleCollectedAt?: Date;
  sampleReceivedAt?: Date;
  expectedResultDate?: Date;
  labName?: string;
  externalLabOrderId?: string;
  notes?: string;
}

export interface CreateLabResultData {
  orderId: number;
  testId: number;
  resultValue?: string;
  resultNumeric?: number;
  resultStatus?: string;
  resultDate?: Date;
  resultTime?: Date;
  performedBy?: string;
  verifiedBy?: string;
  isCritical?: boolean;
  criticalNotified?: boolean;
  notes?: string;
}

export async function createLabOrder(
  prisma: PrismaClient,
  data: CreateLabOrderData
) {
  return await prisma.labOrder.create({
    data: {
      orderDate: data.orderDate || new Date(),
      priority: data.priority || "عادي",
      status: data.status || "معلق",
      ...data,
    },
  });
}

export async function updateLabOrder(
  prisma: PrismaClient,
  orderId: number,
  data: UpdateLabOrderData
) {
  return await prisma.labOrder.update({
    where: { id: orderId },
    data,
  });
}

export async function deleteLabOrder(
  prisma: PrismaClient,
  orderId: number
) {
  return await prisma.labOrder.delete({
    where: { id: orderId },
  });
}

export async function addLabResult(
  prisma: PrismaClient,
  data: CreateLabResultData
) {
  return await prisma.labResult.create({
    data: {
      resultDate: data.resultDate || new Date(),
      resultTime: data.resultTime || new Date(),
      isCritical: data.isCritical || false,
      criticalNotified: data.criticalNotified || false,
      ...data,
    },
  });
}

export async function updateLabResult(
  prisma: PrismaClient,
  resultId: number,
  data: Partial<CreateLabResultData>
) {
  return await prisma.labResult.update({
    where: { id: resultId },
    data,
  });
}

