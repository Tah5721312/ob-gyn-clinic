import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPregnancyFollowupsList,
  getPregnancyFollowupsCount,
  PregnancyFollowupFilters,
  createPregnancyFollowup,
  CreatePregnancyFollowupData,
} from "@/lib/pregnancy-followups";

/**
 * GET /api/pregnancy-followups
 * جلب قائمة متابعات الحمل
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: PregnancyFollowupFilters = {
      pregnancyId: searchParams.get("pregnancyId") ? parseInt(searchParams.get("pregnancyId")!) : undefined,
      visitId: searchParams.get("visitId") ? parseInt(searchParams.get("visitId")!) : undefined,
      visitDate: searchParams.get("visitDate") ? new Date(searchParams.get("visitDate")!) : undefined,
    };

    const followups = await getPregnancyFollowupsList(prisma, filters);
    const count = await getPregnancyFollowupsCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: followups,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching pregnancy followups:", error);
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
 * POST /api/pregnancy-followups
 * إنشاء متابعة حمل جديدة
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreatePregnancyFollowupData = await request.json();

    if (!body.pregnancyId || !body.visitId || !body.visitDate) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: pregnancyId, visitId, visitDate",
        },
        { status: 400 }
      );
    }

    const followup = await createPregnancyFollowup(prisma, {
      ...body,
      visitDate: new Date(body.visitDate),
      nextVisitDate: body.nextVisitDate ? new Date(body.nextVisitDate) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: followup,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating pregnancy followup:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء المتابعة",
      },
      { status: 500 }
    );
  }
}

