// lib/templates/utils.ts
// دوال مساعدة لتبسيط استخدام القوالب للدكتور

import { PrismaClient } from "@prisma/client";
import {
  PrescriptionTemplateContent,
  DiagnosisWithPlanTemplateContent,
  VisitTemplateContent,
  PregnancyRoutineTemplateContent,
} from "./types";

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

/**
 * استخدام قالب وإنشاء روشتة تلقائياً
 */
export async function useTemplateForPrescription(
  prisma: PrismaClient,
  templateId: number,
  visitId?: number,
  followupId?: number
) {
  // جلب القالب
  const template = await (prisma as any).template.findUnique({
    where: { id: templateId },
  });

  if (!template || !template.templateType?.includes("روشتة")) {
    throw new Error("Template not found or not a prescription template");
  }

  // زيادة عدد الاستخدام
  await (prisma as any).template.update({
    where: { id: templateId },
    data: { usageCount: { increment: 1 } },
  });

  // تحويل المحتوى
  const content = JSON.parse(template.content) as PrescriptionTemplateContent;

  // إنشاء الروشتة
  const prescription = await (prisma as any).prescription.create({
    data: {
      visitId: visitId || null,
      followupId: followupId || null,
      notes: content.generalInstructions,
      items: {
        create: content.medications.map((med) => ({
          medicationName: med.medicationName,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instructions: med.instructions,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  return prescription;
}

/**
 * استخدام قالب وإنشاء تشخيص تلقائياً
 */
export async function useTemplateForDiagnosis(
  prisma: PrismaClient,
  templateId: number,
  visitId: number,
  patientId: number,
  createdBy?: number
) {
  // جلب القالب
  const template = await (prisma as any).template.findUnique({
    where: { id: templateId },
  });

  if (!template || !template.templateType.includes("diagnosis")) {
    throw new Error("Template not found or not a diagnosis template");
  }

  // زيادة عدد الاستخدام
  await (prisma as any).template.update({
    where: { id: templateId },
    data: { usageCount: { increment: 1 } },
  });

  // تحويل المحتوى
  const content = JSON.parse(template.content) as DiagnosisWithPlanTemplateContent;

  // إنشاء التشخيص
  const diagnosis = await prisma.diagnosis.create({
    data: {
      visitId,
      patientId,
      diagnosisName: content.diagnosisName,
      diagnosisType: content.diagnosisType,
      // riskLevel سيتم إضافته لاحقاً
      notes: content.recommendations || null,
      createdBy,
    },
  });

  return diagnosis;
}

/**
 * استخدام قالب زيارة كامل
 */
export async function useTemplateForVisit(
  prisma: PrismaClient,
  templateId: number,
  visitId: number
) {
  // جلب القالب
  const template = await (prisma as any).template.findUnique({
    where: { id: templateId },
  });

  if (!template || !template.templateType?.includes("زيارة")) {
    throw new Error("Template not found or not a visit template");
  }

  // زيادة عدد الاستخدام
  await (prisma as any).template.update({
    where: { id: templateId },
    data: { usageCount: { increment: 1 } },
  });

  // تحويل المحتوى
  const content = JSON.parse(template.content) as VisitTemplateContent;

  // تحديث الزيارة
  const visit = await prisma.medicalVisit.update({
    where: { id: visitId },
    data: {
      chiefComplaint: content.chiefComplaint,
      examinationFindings: content.examinationFindings,
      treatmentPlan: content.treatmentPlan,
      recommendations: content.recommendations,
      nextVisitDate: content.nextVisitDays
        ? new Date(Date.now() + content.nextVisitDays * 24 * 60 * 60 * 1000)
        : null,
    },
  });

  // إذا كان هناك تشخيص في القالب
  if (content.diagnosisName) {
    const visitData = await prisma.medicalVisit.findUnique({
      where: { id: visitId },
      select: { patientId: true },
    });

    if (visitData) {
      await prisma.diagnosis.create({
        data: {
          visitId,
          patientId: visitData.patientId,
          diagnosisName: content.diagnosisName,
          diagnosisType: "أولي", // سيتم إضافة diagnosisType لاحقاً
        },
      });
    }
  }

  // إذا كان هناك روشتة في القالب
  if (content.prescriptionItems && content.prescriptionItems.length > 0) {
    await (prisma as any).prescription.create({
      data: {
        visitId,
        items: {
          create: content.prescriptionItems.map((item) => ({
            medicationName: item.medicationName,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            instructions: item.instructions,
          })),
        },
      },
    });
  }

  return visit;
}

/**
 * إنشاء Quick Action (إجراء سريع)
 * يحفظ قالب كـ favorite تلقائياً
 */
export async function createQuickAction(
  prisma: PrismaClient,
  data: {
    doctorId: number;
    templateType: string;
    templateName: string;
    category?: string;
    content: any;
  }
) {
  return await (prisma as any).template.create({
    data: {
      ...data,
      content: JSON.stringify(data.content),
      isFavorite: true, // تلقائياً مفضل
      isActive: true,
    },
  });
}

