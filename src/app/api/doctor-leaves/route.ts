import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getDoctorLeavesList,
  getDoctorLeavesCount,
  DoctorLeaveFilters,
  createDoctorLeave,
  CreateDoctorLeaveData,
} from "@/lib/doctor-leaves";

/**
 * GET /api/doctor-leaves
 * جلب قائمة إجازات الأطباء
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: DoctorLeaveFilters = {
      doctorId: searchParams.get("doctorId") ? parseInt(searchParams.get("doctorId")!) : undefined,
      leaveType: searchParams.get("leaveType") || undefined,
      isApproved:
        searchParams.get("isApproved") !== null && searchParams.get("isApproved") !== undefined
          ? searchParams.get("isApproved") === "true"
          : undefined,
      startDate: searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined,
      endDate: searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined,
    };

    const leaves = await getDoctorLeavesList(prisma, filters);
    const count = await getDoctorLeavesCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: leaves,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching doctor leaves:", error);
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
 * POST /api/doctor-leaves
 * إنشاء إجازة طبيب جديدة
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateDoctorLeaveData = await request.json();

    if (!body.doctorId || !body.leaveStartDate || !body.leaveEndDate || !body.leaveType) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: doctorId, leaveStartDate, leaveEndDate, leaveType",
        },
        { status: 400 }
      );
    }

    const leave = await createDoctorLeave(prisma, {
      ...body,
      leaveStartDate: new Date(body.leaveStartDate),
      leaveEndDate: new Date(body.leaveEndDate),
    });

    return NextResponse.json(
      {
        success: true,
        data: leave,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating doctor leave:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء الإجازة",
      },
      { status: 500 }
    );
  }
}

