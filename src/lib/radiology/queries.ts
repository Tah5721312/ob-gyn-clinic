// lib/radiology/queries.ts

import { PrismaClient } from "@prisma/client";
import { RadiologyFilters, RadiologyOrderListItem } from "./types";

function buildWhereClause(filters: RadiologyFilters) {
  const where: any = {};

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters.doctorId) {
    where.doctorId = filters.doctorId;
  }

  if (filters.pregnancyId) {
    where.pregnancyId = filters.pregnancyId;
  }

  if (filters.examType) {
    where.examType = filters.examType;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.orderDate) {
    where.orderDate = filters.orderDate;
  }

  if (filters.search) {
    where.OR = [
      { patient: { firstName: { contains: filters.search, mode: "insensitive" } } },
      { patient: { lastName: { contains: filters.search, mode: "insensitive" } } },
      { examReason: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function getRadiologyOrdersList(
  prisma: PrismaClient,
  filters: RadiologyFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<RadiologyOrderListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const orders = await prisma.radiologyOrder.findMany({
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
    pregnancyId: order.pregnancyId,
    examType: order.examType,
    examArea: order.examArea,
    orderDate: order.orderDate,
    examDate: order.examDate,
    status: order.status,
    gestationalAgeAtScan: order.gestationalAgeAtScan ? Number(order.gestationalAgeAtScan) : null,
  }));
}

export async function getRadiologyOrdersCount(
  prisma: PrismaClient,
  filters: RadiologyFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.radiologyOrder.count({ where });
}

export async function getRadiologyOrderById(
  prisma: PrismaClient,
  orderId: number
) {
  return await prisma.radiologyOrder.findUnique({
    where: { id: orderId },
    include: {
      patient: true,
      doctor: true,
      visit: true,
      pregnancy: true,
    },
  });
}

