import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getWorkingScheduleById,
  updateWorkingSchedule,
  deleteWorkingSchedule,
  UpdateWorkingScheduleData,
} from "@/lib/working-schedules";

/**
 * GET /api/working-schedules/[id]
 * جلب جدول عمل واحد
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const scheduleId = parseInt(params.id);

    if (isNaN(scheduleId)) {
      return NextResponse.json(
        { success: false, error: "معرف جدول العمل غير صحيح" },
        { status: 400 }
      );
    }

    const schedule = await getWorkingScheduleById(prisma, scheduleId);

    if (!schedule) {
      return NextResponse.json(
        { success: false, error: "جدول العمل غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: schedule,
    });
  } catch (error: any) {
    console.error("Error fetching working schedule:", error);
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
 * PUT /api/working-schedules/[id]
 * تحديث جدول عمل
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const scheduleId = parseInt(params.id);

    if (isNaN(scheduleId)) {
      return NextResponse.json(
        { success: false, error: "معرف جدول العمل غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdateWorkingScheduleData = await request.json();

    const schedule = await updateWorkingSchedule(prisma, scheduleId, {
      ...body,
      startTime: body.startTime ? new Date(body.startTime) : undefined,
      endTime: body.endTime ? new Date(body.endTime) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: schedule,
    });
  } catch (error: any) {
    console.error("Error updating working schedule:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث جدول العمل",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/working-schedules/[id]
 * حذف جدول عمل
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const scheduleId = parseInt(params.id);

    if (isNaN(scheduleId)) {
      return NextResponse.json(
        { success: false, error: "معرف جدول العمل غير صحيح" },
        { status: 400 }
      );
    }

    await deleteWorkingSchedule(prisma, scheduleId);

    return NextResponse.json({
      success: true,
      message: "تم حذف جدول العمل بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting working schedule:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف جدول العمل",
      },
      { status: 500 }
    );
  }
}

