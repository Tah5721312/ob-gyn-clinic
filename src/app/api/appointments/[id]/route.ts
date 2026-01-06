import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
  UpdateAppointmentData,
} from "@/lib/appointments";

/**
 * GET /api/appointments/[id]
 * جلب موعد واحد بالـ ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointmentId = parseInt(id);

    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { success: false, error: "معرف الموعد غير صحيح" },
        { status: 400 }
      );
    }

    const appointment = await getAppointmentById(prisma, appointmentId);

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: "الموعد غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: appointment,
    });
  } catch (error: any) {
    console.error("Error fetching appointment:", error);
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
 * PUT /api/appointments/[id]
 * تحديث موعد
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointmentId = parseInt(id);

    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { success: false, error: "معرف الموعد غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdateAppointmentData = await request.json();

    if (body.appointmentDate) {
      body.appointmentDate = new Date(body.appointmentDate);
    }
    if (body.appointmentTime) {
      body.appointmentTime = new Date(body.appointmentTime);
    }
    if (body.cancelledAt) {
      body.cancelledAt = new Date(body.cancelledAt);
    }
    if (body.arrivalTime) {
      body.arrivalTime = new Date(body.arrivalTime);
    }

    const appointment = await updateAppointment(prisma, appointmentId, body);

    return NextResponse.json({
      success: true,
      data: appointment,
    });
  } catch (error: any) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث الموعد",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/appointments/[id]
 * حذف موعد
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointmentId = parseInt(id);

    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { success: false, error: "معرف الموعد غير صحيح" },
        { status: 400 }
      );
    }

    await deleteAppointment(prisma, appointmentId);

    return NextResponse.json({
      success: true,
      message: "تم حذف الموعد بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف الموعد",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/appointments/[id]/cancel
 * إلغاء موعد
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointmentId = parseInt(id);

    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { success: false, error: "معرف الموعد غير صحيح" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { reason, cancelledBy } = body;

    if (!reason) {
      return NextResponse.json(
        { success: false, error: "سبب الإلغاء مطلوب" },
        { status: 400 }
      );
    }

    const appointment = await cancelAppointment(prisma, appointmentId, reason, cancelledBy);

    return NextResponse.json({
      success: true,
      data: appointment,
    });
  } catch (error: any) {
    console.error("Error cancelling appointment:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إلغاء الموعد",
      },
      { status: 500 }
    );
  }
}

