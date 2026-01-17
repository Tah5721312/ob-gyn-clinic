import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAppointmentsList,
  getAppointmentsCount,
  AppointmentFilters,
  createAppointment,
  CreateAppointmentData,
} from "@/lib/appointments";

/**
 * GET /api/appointments
 * جلب قائمة المواعيد مع البحث والفلترة
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: AppointmentFilters = {
      search: searchParams.get("search") || undefined,
      patientId: searchParams.get("patientId") ? parseInt(searchParams.get("patientId")!) : undefined,
      doctorId: searchParams.get("doctorId") ? parseInt(searchParams.get("doctorId")!) : undefined,
      appointmentDate: searchParams.get("appointmentDate") ? new Date(searchParams.get("appointmentDate")!) : undefined,
      status: searchParams.get("status") || undefined,
    };

    const appointments = await getAppointmentsList(prisma, filters);
    const count = await getAppointmentsCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: appointments,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء جلب البيانات",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/appointments
 * إنشاء موعد جديد
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateAppointmentData = await request.json();

    if (!body.patientId || !body.doctorId || !body.appointmentDate || !body.appointmentTime) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: patientId, doctorId, appointmentDate, appointmentTime",
        },
        { status: 400 }
      );
    }

    const appointment = await createAppointment(prisma, {
      ...body,
      appointmentDate: new Date(body.appointmentDate),
      appointmentTime: new Date(body.appointmentTime),
    });

    return NextResponse.json(
      {
        success: true,
        data: appointment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء الموعد",
      },
      { status: 500 }
    );
  }
}

