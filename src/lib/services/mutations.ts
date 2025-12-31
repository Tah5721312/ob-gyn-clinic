// lib/services/mutations.ts

import { PrismaClient } from "@prisma/client";

export interface CreateServiceData {
  serviceCode: string;
  serviceName: string;
  serviceCategory: string;
  description?: string;
  basePrice: number;
  insurancePrice?: number;
  durationMinutes?: number;
  isTaxable?: boolean;
  taxPercentage?: number;
  isActive?: boolean;
}

export interface UpdateServiceData {
  serviceName?: string;
  serviceCategory?: string;
  description?: string;
  basePrice?: number;
  insurancePrice?: number;
  durationMinutes?: number;
  isTaxable?: boolean;
  taxPercentage?: number;
  isActive?: boolean;
}

export async function createService(
  prisma: PrismaClient,
  data: CreateServiceData
) {
  return await prisma.service.create({
    data: {
      isTaxable: data.isTaxable ?? true,
      taxPercentage: data.taxPercentage || 14,
      isActive: data.isActive ?? true,
      ...data,
    },
  });
}

export async function updateService(
  prisma: PrismaClient,
  serviceId: number,
  data: UpdateServiceData
) {
  return await prisma.service.update({
    where: { id: serviceId },
    data,
  });
}

export async function deleteService(
  prisma: PrismaClient,
  serviceId: number
) {
  return await prisma.service.delete({
    where: { id: serviceId },
  });
}

