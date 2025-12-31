// lib/labs/queries.ts

import { PrismaClient } from "@prisma/client";
import { LabFilters, LabOrderListItem, LabResultListItem } from "./types";
import { isResultCritical } from "./utils";

function buildWhereClause(filters: LabFilters) {
  const where: any = {};

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters.doctorId) {
    where.doctorId = filters.doctorId;
  }

  if (filters.orderDate) {
    where.orderDate = filters.orderDate;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.search) {
    where.OR = [
      { patient: { firstName: { contains: filters.search, mode: "insensitive" } } },
      { patient: { lastName: { contains: filters.search, mode: "insensitive" } } },
      { orderReason: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function getLabOrdersList(
  prisma: PrismaClient,
  filters: LabFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<LabOrderListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const orders = await prisma.labOrder.findMany({
    where,
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      doctor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      results: {
        select: {
          id: true,
          isCritical: true,
        },
      },
    },
    orderBy: {
      orderDate: "desc",
    },
    take: limit,
    skip: offset,
  });

  return orders.map((order) => ({
    id: order.id,
    visitId: order.visitId,
    patientId: order.patientId,
    patientName: `${order.patient.firstName} ${order.patient.lastName}`,
    doctorId: order.doctorId,
    doctorName: `${order.doctor.firstName} ${order.doctor.lastName}`,
    orderDate: order.orderDate,
    priority: order.priority,
    status: order.status,
    hasResults: order.results.length > 0,
    criticalResults: order.results.filter((r) => r.isCritical).length,
  }));
}

export async function getLabOrdersCount(
  prisma: PrismaClient,
  filters: LabFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.labOrder.count({ where });
}

export async function getLabOrderById(
  prisma: PrismaClient,
  orderId: number
) {
  return await prisma.labOrder.findUnique({
    where: { id: orderId },
    include: {
      patient: true,
      doctor: true,
      visit: true,
      results: {
        include: {
          test: true,
        },
      },
    },
  });
}

export async function getLabResultsList(
  prisma: PrismaClient,
  orderId: number
): Promise<LabResultListItem[]> {
  const results = await prisma.labResult.findMany({
    where: { orderId },
    include: {
      test: {
        select: {
          id: true,
          testName: true,
          unit: true,
        },
      },
    },
    orderBy: {
      resultDate: "desc",
    },
  });

  return results.map((result) => ({
    id: result.id,
    orderId: result.orderId,
    testId: result.testId,
    testName: result.test.testName,
    resultValue: result.resultValue,
    resultNumeric: result.resultNumeric ? Number(result.resultNumeric) : null,
    resultStatus: result.resultStatus,
    resultDate: result.resultDate,
    isCritical: result.isCritical,
  }));
}

