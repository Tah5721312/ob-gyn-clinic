// lib/visits/mutations.ts

import { PrismaClient } from "@prisma/client";

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
  visitType?: string;
  examinationFindings?: string;
  treatmentPlan?: string;
  recommendations?: string;
  nextVisitDate?: Date;
  visitStatus?: string;
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
  visitType?: string;
  examinationFindings?: string;
  treatmentPlan?: string;
  recommendations?: string;
  nextVisitDate?: Date;
  visitStatus?: string;
  notes?: string;
}

export async function createVisit(
  prisma: PrismaClient,
  data: CreateVisitData
) {
  return await prisma.medicalVisit.create({
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
      visitStatus: "مكتملة",
      visitEndTime: visitEndTime || new Date(),
    },
  });
}

