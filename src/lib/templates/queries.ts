// lib/templates/queries.ts

import { PrismaClient } from "@prisma/client";
import { TemplateFilters, TemplateListItem } from "./types";

function buildWhereClause(filters: TemplateFilters) {
  const where: any = {};

  if (filters.doctorId) {
    where.doctorId = filters.doctorId;
  }

  if (filters.templateType) {
    where.templateType = filters.templateType;
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  if (filters.isFavorite !== undefined) {
    where.isFavorite = filters.isFavorite;
  }

  if (filters.search) {
    where.OR = [
      { templateName: { contains: filters.search, mode: "insensitive" } },
      { content: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function getTemplatesList(
  prisma: PrismaClient,
  filters: TemplateFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<TemplateListItem[]> {
  const where = buildWhereClause(filters);
  // إزالة الحد الأقصى أو جعله كبير جداً لجلب كل القوالب
  const limit = options.limit || 1000; // زيادة الحد الأقصى
  const offset = options.offset || 0;

  const templates = await prisma.template.findMany({
    where,
    orderBy: [
      { isFavorite: "desc" },
      { usageCount: "desc" },
      { templateName: "asc" },
    ],
    take: limit,
    skip: offset,
  });

  return templates.map((template) => ({
    id: template.id,
    doctorId: template.doctorId,
    templateType: template.templateType,
    templateName: template.templateName,
    category: template.category,
    content: template.content,
    isActive: template.isActive,
    usageCount: template.usageCount,
    isFavorite: template.isFavorite,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
  }));
}

export async function getTemplatesCount(
  prisma: PrismaClient,
  filters: TemplateFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.template.count({ where });
}

export async function getTemplateById(
  prisma: PrismaClient,
  templateId: number
) {
  return await prisma.template.findUnique({
    where: { id: templateId },
    include: {
      doctor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getTemplatesByDoctor(
  prisma: PrismaClient,
  doctorId: number,
  templateType?: string
) {
  const where: any = { doctorId };
  if (templateType) {
    where.templateType = templateType;
  }

  return await prisma.template.findMany({
    where,
    orderBy: {
      templateName: "asc",
    },
  });
}

