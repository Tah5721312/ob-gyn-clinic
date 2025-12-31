import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getDoctorLeaveById,
  updateDoctorLeave,
  deleteDoctorLeave,
  UpdateDoctorLeaveData,
} from "@/lib/doctor-leaves";

/**
 * GET /api/doctor-leaves/[id]
 * جلب إجازة طبيب واحدة
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leaveId = parseInt(params.id);

    if (isNaN(leaveId)) {
      return NextResponse.json(
        { success: false, error: "معرف الإجازة غير صحيح" },
        { status: 400 }
      );
    }

    const leave = await getDoctorLeaveById(prisma, leaveId);

    if (!leave) {
      return NextResponse.json(
        { success: false, error: "الإجازة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: leave,
    });
  } catch (error: any) {
    console.error("Error fetching doctor leave:", error);
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
 * PUT /api/doctor-leaves/[id]
 * تحديث إجازة طبيب
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leaveId = parseInt(params.id);

    if (isNaN(leaveId)) {
      return NextResponse.json(
        { success: false, error: "معرف الإجازة غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdateDoctorLeaveData = await request.json();

    const leave = await updateDoctorLeave(prisma, leaveId, {
      ...body,
      leaveStartDate: body.leaveStartDate ? new Date(body.leaveStartDate) : undefined,
      leaveEndDate: body.leaveEndDate ? new Date(body.leaveEndDate) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: leave,
    });
  } catch (error: any) {
    console.error("Error updating doctor leave:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث الإجازة",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/doctor-leaves/[id]
 * حذف إجازة طبيب
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leaveId = parseInt(params.id);

    if (isNaN(leaveId)) {
      return NextResponse.json(
        { success: false, error: "معرف الإجازة غير صحيح" },
        { status: 400 }
      );
    }

    await deleteDoctorLeave(prisma, leaveId);

    return NextResponse.json({
      success: true,
      message: "تم حذف الإجازة بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting doctor leave:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف الإجازة",
      },
      { status: 500 }
    );
  }
}

