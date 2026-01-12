import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getVisitsList,
  getVisitsCount,
  VisitFilters,
  createVisit,
  CreateVisitData,
} from "@/lib/visits";

/**
 * GET /api/visits
 * جلب قائمة الزيارات مع البحث والفلترة
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: VisitFilters = {
      search: searchParams.get("search") || undefined,
      patientId: searchParams.get("patientId") ? parseInt(searchParams.get("patientId")!) : undefined,
      doctorId: searchParams.get("doctorId") ? parseInt(searchParams.get("doctorId")!) : undefined,
      visitDate: searchParams.get("visitDate") ? new Date(searchParams.get("visitDate")!) : undefined,
      isDraft: searchParams.get("isDraft") === "true" ? true : searchParams.get("isDraft") === "false" ? false : undefined,
    };

    const visits = await getVisitsList(prisma, filters);
    const count = await getVisitsCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: visits,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching visits:", error);
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
 * POST /api/visits
 * إنشاء زيارة جديدة
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateVisitData = await request.json();

    if (!body.appointmentId || !body.patientId || !body.doctorId || !body.visitDate) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: appointmentId, patientId, doctorId, visitDate",
        },
        { status: 400 }
      );
    }

    const visit = await createVisit(prisma, {
      ...body,
      visitDate: new Date(body.visitDate),
      visitStartTime: body.visitStartTime ? new Date(body.visitStartTime) : undefined,
      visitEndTime: body.visitEndTime ? new Date(body.visitEndTime) : undefined,
      nextVisitDate: body.nextVisitDate ? new Date(body.nextVisitDate) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: visit,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating visit:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء الزيارة",
      },
      { status: 500 }
    );
  }
}

