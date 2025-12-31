// lib/lab-tests/queries.ts

import { PrismaClient } from "@prisma/client";
import { LabTestFilters, LabTestListItem } from "./types";

function buildWhereClause(filters: LabTestFilters) {
  const where: any = {};

  if (filters.search) {
    where.OR = [
      { testCode: { contains: filters.search, mode: "insensitive" } },
      { testName: { contains: filters.search, mode: "insensitive" } },
      { testNameEn: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.testCategory) {
    where.testCategory = { contains: filters.testCategory, mode: "insensitive" };
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  return where;
}

export async function getLabTestsList(
  prisma: PrismaClient,
  filters: LabTestFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<LabTestListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const tests = await prisma.labTest.findMany({
    where,
    select: {
      id: true,
      testCode: true,
      testName: true,
      testNameEn: true,
      testCategory: true,
      normalRangeMin: true,
      normalRangeMax: true,
      normalRangeText: true,
      unit: true,
      sampleType: true,
      fastingRequired: true,
      price: true,
      isActive: true,
    },
    orderBy: {
      testCategory: "asc",
    },
    take: limit,
    skip: offset,
  });

  return tests.map((test) => ({
    ...test,
    normalRangeMin: test.normalRangeMin ? Number(test.normalRangeMin) : null,
    normalRangeMax: test.normalRangeMax ? Number(test.normalRangeMax) : null,
    price: test.price ? Number(test.price) : null,
  }));
}

export async function getLabTestsCount(
  prisma: PrismaClient,
  filters: LabTestFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.labTest.count({ where });
}

export async function getLabTestById(
  prisma: PrismaClient,
  testId: number
) {
  return await prisma.labTest.findUnique({
    where: { id: testId },
  });
}

