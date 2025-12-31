import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getSurgeriesList,
  getSurgeriesCount,
  SurgeryFilters,
  createSurgery,
  CreateSurgeryData,
} from "@/lib/surgeries";

/**
 * GET /api/surgeries
 * جلب قائمة العمليات الجراحية
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: SurgeryFilters = {
      search: searchParams.get("search") || undefined,
      patientId: searchParams.get("patientId") ? parseInt(searchParams.get("patientId")!) : undefined,
      doctorId: searchParams.get("doctorId") ? parseInt(searchParams.get("doctorId")!) : undefined,
      surgeryType: searchParams.get("surgeryType") || undefined,
      status: searchParams.get("status") || undefined,
      scheduledDate: searchParams.get("scheduledDate") ? new Date(searchParams.get("scheduledDate")!) : undefined,
    };

    const surgeries = await getSurgeriesList(prisma, filters);
    const count = await getSurgeriesCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: surgeries,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching surgeries:", error);
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
 * POST /api/surgeries
 * إنشاء عملية جراحية جديدة
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateSurgeryData = await request.json();

    if (!body.patientId || !body.doctorId || !body.surgeryName || !body.surgeryType || !body.scheduledDate) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: patientId, doctorId, surgeryName, surgeryType, scheduledDate",
        },
        { status: 400 }
      );
    }

    const surgery = await createSurgery(prisma, {
      ...body,
      plannedDate: body.plannedDate ? new Date(body.plannedDate) : undefined,
      scheduledDate: new Date(body.scheduledDate),
      scheduledTime: body.scheduledTime ? new Date(body.scheduledTime) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: surgery,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating surgery:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء العملية الجراحية",
      },
      { status: 500 }
    );
  }
}

