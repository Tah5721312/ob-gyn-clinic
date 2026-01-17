// lib/patients/mutations.ts

import { PrismaClient } from '@prisma/client';

export interface CreatePatientData {
  firstName: string;
  lastName: string;
  birthDate: Date;
  bloodType?: string;
  phone: string;
  phone2?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  notes?: string;
  isActive?: boolean;
}

export interface UpdatePatientData {
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  bloodType?: string;
  phone?: string;
  phone2?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  notes?: string;
  isActive?: boolean;
}

export async function createPatient(
  prisma: PrismaClient,
  data: CreatePatientData
) {
  return await prisma.patient.create({
    data: {
      ...data,
    } as any,
  });
}

export async function updatePatient(
  prisma: PrismaClient,
  patientId: number,
  data: UpdatePatientData
) {
  return await prisma.patient.update({
    where: { id: patientId },
    data,
  });
}

export async function deletePatient(prisma: PrismaClient, patientId: number) {
  // حذف جميع السجلات المرتبطة أولاً بالترتيب الصحيح
  // الترتيب مهم بسبب Foreign Key Constraints

  // 1. جلب جميع الزيارات المرتبطة بالمريض (سواء كانت مرتبطة بالمواعيد أو لا)
  const allVisits = await prisma.medicalVisit.findMany({
    where: { patientId },
    select: { id: true },
  });
  const allVisitIds = allVisits.map((v) => v.id);

  // 2. حذف التشخيصات المرتبطة بجميع الزيارات
  if (allVisitIds.length > 0) {
    await prisma.diagnosis.deleteMany({
      where: { visitId: { in: allVisitIds } },
    });
  }

  // 3. حذف متابعة الحمل المرتبطة بجميع الزيارات (يجب حذفها قبل حذف الزيارات)
  if (allVisitIds.length > 0) {
    await prisma.pregnancyFollowup.deleteMany({
      where: { visitId: { in: allVisitIds } },
    });
  }

  // 4. جلب جميع سجلات الحمل المرتبطة
  const pregnancies = await prisma.pregnancyRecord.findMany({
    where: { patientId },
    select: { id: true },
  });
  const pregnancyIds = pregnancies.map((p) => p.id);

  // 5. حذف متابعة الحمل المرتبطة بسجلات الحمل (للتأكد من حذف جميع السجلات)
  if (pregnancyIds.length > 0) {
    await prisma.pregnancyFollowup.deleteMany({
      where: { pregnancyId: { in: pregnancyIds } },
    });
  }

  // 6. حذف الوصفات الطبية المرتبطة بجميع الزيارات
  if (allVisitIds.length > 0) {
    await prisma.prescription.deleteMany({
      where: { visitId: { in: allVisitIds } },
    });
  }

  // 7. حذف عناصر الفواتير المرتبطة
  const invoices = await prisma.invoice.findMany({
    where: { patientId },
    select: { id: true },
  });
  const invoiceIds = invoices.map((i) => i.id);

  if (invoiceIds.length > 0) {
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: { in: invoiceIds } },
    });

    // 8. حذف المدفوعات المرتبطة
    await prisma.payment.deleteMany({
      where: { invoiceId: { in: invoiceIds } },
    });
  }

  // 9. حذف الفواتير المرتبطة
  await prisma.invoice.deleteMany({
    where: { patientId },
  });

  // 10. جلب جميع المواعيد المرتبطة
  const appointments = await prisma.appointment.findMany({
    where: { patientId },
    select: { id: true },
  });
  const appointmentIds = appointments.map((a) => a.id);

  // 11. جلب جميع الزيارات المرتبطة بالمواعيد
  let visitsFromAppointments: number[] = [];
  if (appointmentIds.length > 0) {
    const visits = await prisma.medicalVisit.findMany({
      where: { appointmentId: { in: appointmentIds } },
      select: { id: true },
    });
    visitsFromAppointments = visits.map((v) => v.id);
  }

  // 12. دمج جميع معرفات الزيارات (المرتبطة بالمواعيد + المرتبطة مباشرة بالمريض)
  const allVisitIdsToDelete = Array.from(new Set([...allVisitIds, ...visitsFromAppointments]));

  // 13. حذف جميع السجلات المرتبطة بالزيارات المرتبطة بالمواعيد (إذا لم يتم حذفها بالفعل)
  if (visitsFromAppointments.length > 0) {
    const newVisitIds = visitsFromAppointments.filter((id) => !allVisitIds.includes(id));
    if (newVisitIds.length > 0) {
      await prisma.diagnosis.deleteMany({
        where: { visitId: { in: newVisitIds } },
      });
      await prisma.pregnancyFollowup.deleteMany({
        where: { visitId: { in: newVisitIds } },
      });
      await prisma.prescription.deleteMany({
        where: { visitId: { in: newVisitIds } },
      });
    }
  }

  // 14. حذف جميع الزيارات الطبية المرتبطة بالمواعيد (يجب حذفها قبل المواعيد)
  if (appointmentIds.length > 0) {
    await prisma.medicalVisit.deleteMany({
      where: { appointmentId: { in: appointmentIds } },
    });
  }

  // 15. حذف الزيارات الطبية المرتبطة مباشرة بالمريض (في حالة عدم وجود موعد)
  await prisma.medicalVisit.deleteMany({
    where: { patientId },
  });

  // 16. حذف المواعيد المرتبطة (بعد حذف جميع الزيارات)
  await prisma.appointment.deleteMany({
    where: { patientId },
  });

  // 17. حذف سجلات الحمل المرتبطة
  await prisma.pregnancyRecord.deleteMany({
    where: { patientId },
  });

  // 18. حذف التاريخ المرضي المرتبط
  await prisma.medicalHistory.deleteMany({
    where: { patientId },
  });

  // 19. أخيراً، حذف المريض نفسه
  return await prisma.patient.delete({
    where: { id: patientId },
  });
}
