// lib/templates/utils.ts
// دوال مساعدة لتبسيط استخدام القوالب للدكتور

import { PrismaClient } from "@prisma/client";
// تم إزالة imports للـ JSON types - المحتوى الآن نص عادي

/**
 * جلب القوالب المفضلة للدكتور (Quick Actions)
 */
export async function getFavoriteTemplates(
  prisma: PrismaClient,
  doctorId: number
) {
  return await (prisma as any).template.findMany({
    where: {
      doctorId,
      isFavorite: true,
      isActive: true,
    },
    orderBy: [
      { usageCount: "desc" },
      { updatedAt: "desc" },
    ],
    take: 10, // أول 10 قوالب مفضلة
  });
}

/**
 * جلب الروشتات المفضلة (الأكثر استخداماً)
 */
export async function getFavoritePrescriptions(
  prisma: PrismaClient,
  doctorId: number,
  limit: number = 5
) {
  return await (prisma as any).template.findMany({
    where: {
      doctorId,
      templateType: "روشتة",
      isActive: true,
    },
    orderBy: {
      usageCount: "desc",
    },
    take: limit,
  });
}

/**
 * جلب التشخيصات المكررة (الأكثر استخداماً)
 */
export async function getCommonDiagnoses(
  prisma: PrismaClient,
  doctorId: number,
  limit: number = 5
) {
  return await (prisma as any).template.findMany({
    where: {
      doctorId,
      templateType: {
        in: ["تشخيص", "تشخيص + خطة"],
      },
      isActive: true,
    },
    orderBy: {
      usageCount: "desc",
    },
    take: limit,
  });
}

/**
 * جلب قوالب الزيارات الجاهزة
 */
export async function getVisitTemplates(
  prisma: PrismaClient,
  doctorId: number
) {
  return await (prisma as any).template.findMany({
    where: {
      doctorId,
      templateType: "زيارة",
      isActive: true,
    },
    orderBy: [
      { isFavorite: "desc" },
      { usageCount: "desc" },
    ],
  });
}

/**
 * اقتراح قوالب ذكية حسب السياق
 */
export async function suggestTemplates(
  prisma: PrismaClient,
  doctorId: number,
  context: {
    isPregnant?: boolean;
    chiefComplaint?: string;
    diagnosisName?: string;
  }
) {
  const suggestions: any[] = [];

  // إذا كانت حامل
  if (context.isPregnant) {
    const pregnancyTemplates = await (prisma as any).template.findMany({
      where: {
        doctorId,
        category: "حمل",
        isActive: true,
      },
      orderBy: { usageCount: "desc" },
      take: 3,
    });
    suggestions.push(...pregnancyTemplates);
  }

  // إذا كانت الشكوى تحتوي على كلمات معينة
  if (context.chiefComplaint) {
    const complaint = context.chiefComplaint.toLowerCase();
    
    if (complaint.includes("حرقان") || complaint.includes("بول")) {
      const utiTemplates = await (prisma as any).template.findMany({
        where: {
          doctorId,
          templateName: { contains: "مسالك", mode: "insensitive" },
          isActive: true,
        },
        take: 2,
      });
      suggestions.push(...utiTemplates);
    }
  }

  // إذا كان التشخيص يحتوي على كلمات معينة
  if (context.diagnosisName) {
    const diagnosis = context.diagnosisName.toLowerCase();
    
    if (diagnosis.includes("سكر")) {
      const diabetesTemplates = await (prisma as any).template.findMany({
        where: {
          doctorId,
          templateName: { contains: "سكر", mode: "insensitive" },
          isActive: true,
        },
        take: 2,
      });
      suggestions.push(...diabetesTemplates);
    }
  }

  return suggestions;
}


