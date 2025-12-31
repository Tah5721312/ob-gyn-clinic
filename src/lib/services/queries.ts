// lib/services/queries.ts

import { PrismaClient } from "@prisma/client";
import { ServiceFilters, ServiceListItem } from "./types";

function buildWhereClause(filters: ServiceFilters) {
  const where: any = {};

  if (filters.search) {
    where.OR = [
      { serviceCode: { contains: filters.search, mode: "insensitive" } },
      { serviceName: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.serviceCategory) {
    where.serviceCategory = { contains: filters.serviceCategory, mode: "insensitive" };
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  return where;
}

export async function getServicesList(
  prisma: PrismaClient,
  filters: ServiceFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<ServiceListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const services = await prisma.service.findMany({
    where,
    select: {
      id: true,
      serviceCode: true,
      serviceName: true,
      serviceCategory: true,
      description: true,
      basePrice: true,
      insurancePrice: true,
      durationMinutes: true,
      isTaxable: true,
      taxPercentage: true,
      isActive: true,
    },
    orderBy: {
      serviceCategory: "asc",
    },
    take: limit,
    skip: offset,
  });

  return services.map((service) => ({
    ...service,
    basePrice: Number(service.basePrice),
    insurancePrice: service.insurancePrice ? Number(service.insurancePrice) : null,
    taxPercentage: Number(service.taxPercentage),
  }));
}

export async function getServicesCount(
  prisma: PrismaClient,
  filters: ServiceFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.service.count({ where });
}

export async function getServiceById(
  prisma: PrismaClient,
  serviceId: number
) {
  return await prisma.service.findUnique({
    where: { id: serviceId },
  });
}

export async function getServicesByCategory(
  prisma: PrismaClient,
  category: string
) {
  return await prisma.service.findMany({
    where: {
      serviceCategory: category,
      isActive: true,
    },
    orderBy: {
      serviceName: "asc",
    },
  });
}

