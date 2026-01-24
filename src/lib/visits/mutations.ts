// lib/visits/mutations.ts

import { PrismaClient } from "@prisma/client";
import { AppointmentStatus } from "@/lib/enumdb";
import { createPrescription } from "@/lib/prescriptions/mutations";

export interface CreateVisitData {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  visitDate: Date;
  visitStartTime?: Date;
  visitEndTime?: Date;
  chiefComplaint?: string;
  symptoms?: string;
  symptomsDuration?: string;
  weight?: number;
  height?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  temperature?: number;
  pulse?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  examinationFindings?: string;
  treatmentPlan?: string;
  recommendations?: string;
  nextVisitDate?: Date;
  notes?: string;
}

export interface UpdateVisitData {
  visitStartTime?: Date;
  visitEndTime?: Date;
  chiefComplaint?: string;
  symptoms?: string;
  symptomsDuration?: string;
  weight?: number;
  height?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  temperature?: number;
  pulse?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  examinationFindings?: string;
  treatmentPlan?: string;
  recommendations?: string;
  nextVisitDate?: Date;
  notes?: string;
}

export async function createVisit(
  prisma: PrismaClient,
  data: CreateVisitData
) {
  // التحقق من وجود زيارة للموعد
  const existingVisit = await prisma.medicalVisit.findUnique({
    where: { appointmentId: data.appointmentId },
  });

  // إذا كانت موجودة، تحديثها بدلاً من إنشاء واحدة جديدة
  if (existingVisit) {
    const updatedVisit = await prisma.medicalVisit.update({
      where: { id: existingVisit.id },
      data: {
        visitDate: data.visitDate,
        visitStartTime: data.visitStartTime || existingVisit.visitStartTime,
        visitEndTime: data.visitEndTime || existingVisit.visitEndTime,
        chiefComplaint: data.chiefComplaint || existingVisit.chiefComplaint,
        symptoms: data.symptoms || existingVisit.symptoms,
        weight: data.weight !== undefined ? data.weight : existingVisit.weight,
        bloodPressureSystolic: data.bloodPressureSystolic !== undefined ? data.bloodPressureSystolic : existingVisit.bloodPressureSystolic,
        bloodPressureDiastolic: data.bloodPressureDiastolic !== undefined ? data.bloodPressureDiastolic : existingVisit.bloodPressureDiastolic,
        temperature: data.temperature !== undefined ? data.temperature : existingVisit.temperature,
        pulse: data.pulse !== undefined ? data.pulse : existingVisit.pulse,
        examinationFindings: data.examinationFindings || existingVisit.examinationFindings,
        treatmentPlan: data.treatmentPlan || existingVisit.treatmentPlan,
        recommendations: data.recommendations || existingVisit.recommendations,
        nextVisitDate: data.nextVisitDate || existingVisit.nextVisitDate,
        notes: data.notes || existingVisit.notes,
        isDraft: false, // تحديث الزيارة = غير مسودة
      },
    });

    // تحديث حالة الموعد إلى مكتمل
    await prisma.appointment.update({
      where: { id: data.appointmentId },
      data: {
        status: AppointmentStatus.COMPLETED,
      },
    });

    // إنشاء أو تحديث الروشتة للزيارة (كل زيارة يجب أن يكون لها روشتة)
    try {
      const existingPrescription = await prisma.prescription.findFirst({
        where: { visitId: existingVisit.id },
      });

      // إذا لم تكن هناك روشتة موجودة، إنشاء واحدة جديدة
      if (!existingPrescription) {
        await createPrescription(prisma, {
          visitId: existingVisit.id,
          notes: data.notes || undefined,
          items: [], // روشتة بدون أدوية منظمة، فقط ملاحظات
        });
      } else {
        // إذا كانت هناك روشتة موجودة، تحديث الملاحظات
        await prisma.prescription.update({
          where: { id: existingPrescription.id },
          data: { notes: data.notes || null },
        });
      }
    } catch (error) {
      // في حالة فشل حفظ الروشتة، لا نوقف عملية حفظ الزيارة
      console.error("Error creating/updating prescription from visit notes:", error);
    }

    return updatedVisit;
  }

  // إنشاء زيارة جديدة
  const newVisit = await prisma.medicalVisit.create({
    data: {
      appointmentId: data.appointmentId,
      patientId: data.patientId,
      doctorId: data.doctorId,
      visitDate: data.visitDate,
      visitStartTime: data.visitStartTime,
      visitEndTime: data.visitEndTime,
      chiefComplaint: data.chiefComplaint || null,
      symptoms: data.symptoms || null,
      weight: data.weight ? data.weight : null,
      bloodPressureSystolic: data.bloodPressureSystolic || null,
      bloodPressureDiastolic: data.bloodPressureDiastolic || null,
      temperature: data.temperature || null,
      pulse: data.pulse || null,
      examinationFindings: data.examinationFindings || null,
      treatmentPlan: data.treatmentPlan || null,
      recommendations: data.recommendations || null,
      nextVisitDate: data.nextVisitDate || null,
      notes: data.notes || null,
      isDraft: false, // زيارة جديدة = غير مسودة
    },
  });

  // تحديث حالة الموعد إلى مكتمل
  await prisma.appointment.update({
    where: { id: data.appointmentId },
    data: {
      status: AppointmentStatus.COMPLETED,
    },
  });

  // إنشاء روشتة للزيارة (كل زيارة يجب أن يكون لها روشتة)
  try {
    await createPrescription(prisma, {
      visitId: newVisit.id,
      notes: data.notes || undefined,
      items: [], // روشتة بدون أدوية منظمة، فقط ملاحظات
    });
  } catch (error) {
    // في حالة فشل حفظ الروشتة، لا نوقف عملية حفظ الزيارة
    console.error("Error creating prescription from visit notes:", error);
  }

  return newVisit;
}

export async function updateVisit(
  prisma: PrismaClient,
  visitId: number,
  data: UpdateVisitData
) {
  return await prisma.medicalVisit.update({
    where: { id: visitId },
    data,
  });
}

export async function deleteVisit(
  prisma: PrismaClient,
  visitId: number
) {
  return await prisma.medicalVisit.delete({
    where: { id: visitId },
  });
}

export async function completeVisit(
  prisma: PrismaClient,
  visitId: number,
  visitEndTime?: Date
) {
  return await prisma.medicalVisit.update({
    where: { id: visitId },
    data: {
      completedAt: visitEndTime || new Date(),
      visitEndTime: visitEndTime || new Date(),
      isDraft: false, // الزيارة المكتملة ليست مسودة
    },
  });
}

