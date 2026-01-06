// lib/templates/mutations.ts

import { PrismaClient } from "@prisma/client";
import { CreateTemplateData, UpdateTemplateData } from "./types";

export async function createTemplate(
  prisma: PrismaClient,
  data: CreateTemplateData
) {
  return await prisma.template.create({
    data: {
      doctorId: data.doctorId,
      templateType: data.templateType,
      templateName: data.templateName,
      category: data.category || null,
      content: data.content, // content يجب أن يكون string (JSON string)
      isActive: data.isActive ?? true,
      isFavorite: data.isFavorite ?? false,
    },
  });
}

export async function updateTemplate(
  prisma: PrismaClient,
  templateId: number,
  data: UpdateTemplateData
) {
  return await prisma.template.update({
    where: { id: templateId },
    data,
  });
}

export async function deleteTemplate(
  prisma: PrismaClient,
  templateId: number
) {
  return await prisma.template.delete({
    where: { id: templateId },
  });
}

// زيادة عدد مرات الاستخدام
export async function incrementTemplateUsage(
  prisma: PrismaClient,
  templateId: number
) {
  return await prisma.template.update({
    where: { id: templateId },
    data: {
      usageCount: { increment: 1 },
    },
  });
}

// تبديل حالة التثبيت
export async function toggleTemplateFavorite(
  prisma: PrismaClient,
  templateId: number
) {
  const template = await prisma.template.findUnique({
    where: { id: templateId },
    select: { isFavorite: true },
  });

  if (!template) {
    throw new Error("Template not found");
  }

  return await prisma.template.update({
    where: { id: templateId },
    data: {
      isFavorite: !template.isFavorite,
    },
  });
}
