import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getWorkingSchedulesList,
  getWorkingSchedulesCount,
  WorkingScheduleFilters,
  createWorkingSchedule,
  CreateWorkingScheduleData,
} from "@/lib/working-schedules";

/**
 * GET /api/working-schedules
 * جلب قائمة جداول العمل
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: WorkingScheduleFilters = {
      doctorId: searchParams.get("doctorId") ? parseInt(searchParams.get("doctorId")!) : undefined,
      dayOfWeek: searchParams.get("dayOfWeek") ? parseInt(searchParams.get("dayOfWeek")!) : undefined,
      isActive:
        searchParams.get("isActive") !== null && searchParams.get("isActive") !== undefined
          ? searchParams.get("isActive") === "true"
          : undefined,
    };

    const schedules = await getWorkingSchedulesList(prisma, filters);
    const count = await getWorkingSchedulesCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: schedules,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching working schedules:", error);
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
 * POST /api/working-schedules
 * إنشاء جدول عمل جديد
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateWorkingScheduleData = await request.json();

    if (!body.doctorId || body.dayOfWeek === undefined || !body.dayName || !body.startTime || !body.endTime) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: doctorId, dayOfWeek, dayName, startTime, endTime",
        },
        { status: 400 }
      );
    }

    const schedule = await createWorkingSchedule(prisma, {
      ...body,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
    });

    return NextResponse.json(
      {
        success: true,
        data: schedule,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating working schedule:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء جدول العمل",
      },
      { status: 500 }
    );
  }
}

