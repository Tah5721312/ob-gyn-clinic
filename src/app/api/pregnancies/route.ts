import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPregnanciesList,
  getPregnanciesCount,
  PregnancyFilters,
  createPregnancy,
  CreatePregnancyData,
} from "@/lib/pregnancies";

/**
 * GET /api/pregnancies
 * جلب قائمة حالات الحمل مع البحث والفلترة
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: PregnancyFilters = {
      search: searchParams.get("search") || undefined,
      patientId: searchParams.get("patientId") ? parseInt(searchParams.get("patientId")!) : undefined,
      isActive: searchParams.get("isActive") ? searchParams.get("isActive") === "true" : undefined,
    };

    const pregnancies = await getPregnanciesList(prisma, filters);
    const count = await getPregnanciesCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: pregnancies,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching pregnancies:", error);
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
 * POST /api/pregnancies
 * إنشاء حالة حمل جديدة
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreatePregnancyData = await request.json();

    if (!body.patientId || !body.pregnancyNumber || !body.lmpDate) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: patientId, pregnancyNumber, lmpDate",
        },
        { status: 400 }
      );
    }

    const pregnancy = await createPregnancy(prisma, {
      ...body,
      lmpDate: new Date(body.lmpDate),
      eddDate: body.eddDate ? new Date(body.eddDate) : undefined,
      eddByUltrasound: body.eddByUltrasound ? new Date(body.eddByUltrasound) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: pregnancy,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating pregnancy:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء حالة الحمل",
      },
      { status: 500 }
    );
  }
}

