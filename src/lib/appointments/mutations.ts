// lib/appointments/mutations.ts

import { PrismaClient } from "@prisma/client";
import { createInvoice, createPayment } from "@/lib/invoices/mutations";

export interface CreateAppointmentData {
  patientId: number;
  doctorId: number;
  appointmentDate: Date;
  appointmentTime: Date;
  status?: string;
  durationMinutes?: number;
  notes?: string;
  receptionNotes?: string;
  createdBy?: number;
  // Payment info
  totalAmount?: number;
  paidAmount?: number;
  paymentMethod?: string;
}

export interface UpdateAppointmentData {
  appointmentDate?: Date;
  appointmentTime?: Date;
  status?: string;
  durationMinutes?: number;
  cancellationReason?: string;
  cancelledBy?: number;
  cancelledAt?: Date;
  arrivalTime?: Date;
  notes?: string;
  receptionNotes?: string;
}

export async function createAppointment(
  prisma: PrismaClient,
  data: CreateAppointmentData
) {
  const { totalAmount, paidAmount, paymentMethod, ...restData } = data;

  const appointment = await prisma.appointment.create({
    data: {
      status: data.status || "BOOKED",
      durationMinutes: data.durationMinutes || 30,
      ...restData,
    },
  });

  // If there's a payment or total amount, create an invoice
  if (totalAmount || (paidAmount && paidAmount > 0)) {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const invoice = await createInvoice(prisma, {
      invoiceNumber,
      patientId: data.patientId,
      doctorId: data.doctorId,
      appointmentId: appointment.id,
      invoiceDate: new Date(),
      totalAmount: totalAmount || (paidAmount || 0), // Default to paid amount if no total specified
      subtotalAmount: totalAmount || (paidAmount || 0),
      notes: "فاتورة حجز موعد"
    });

    // If there's a payment, create payment record
    if (paidAmount && paidAmount > 0 && paymentMethod) {
      await createPayment(prisma, {
        invoiceId: invoice.id,
        paymentAmount: paidAmount,
        paymentMethod: paymentMethod,
        processedBy: data.createdBy,
        notes: "دفعة حجز موعد"
      });
    }
  }

  return appointment;
}

export async function updateAppointment(
  prisma: PrismaClient,
  appointmentId: number,
  data: UpdateAppointmentData
) {
  return await prisma.appointment.update({
    where: { id: appointmentId },
    data,
  });
}

export async function deleteAppointment(
  prisma: PrismaClient,
  appointmentId: number
) {
  // التحقق من وجود زيارة مرتبطة بالموعد
  const visit = await prisma.medicalVisit.findUnique({
    where: { appointmentId },
  });

  // إذا كانت هناك زيارة، حذفها أولاً
  if (visit) {
    await prisma.medicalVisit.delete({
      where: { appointmentId },
    });
  }

  // ثم حذف الموعد
  return await prisma.appointment.delete({
    where: { id: appointmentId },
  });
}

export async function cancelAppointment(
  prisma: PrismaClient,
  appointmentId: number,
  reason: string,
  cancelledBy?: number
) {
  return await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status: "CANCELLED",
      notes: reason, // استخدام notes بدلاً من cancellationReason
      updatedAt: new Date(),
    },
  });
}

