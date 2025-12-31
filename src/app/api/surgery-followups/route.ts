import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getSurgeryFollowupsList,
  getSurgeryFollowupsCount,
  SurgeryFollowupFilters,
  createSurgeryFollowup,
  CreateSurgeryFollowupData,
} from "@/lib/surgery-followups";

/**
 * GET /api/surgery-followups
 * جلب قائمة متابعات ما بعد الجراحة
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: SurgeryFollowupFilters = {
      surgeryId: searchParams.get("surgeryId") ? parseInt(searchParams.get("surgeryId")!) : undefined,
      visitId: searchParams.get("visitId") ? parseInt(searchParams.get("visitId")!) : undefined,
      followupDate: searchParams.get("followupDate") ? new Date(searchParams.get("followupDate")!) : undefined,
    };

    const followups = await getSurgeryFollowupsList(prisma, filters);
    const count = await getSurgeryFollowupsCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: followups,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching surgery followups:", error);
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
 * POST /api/surgery-followups
 * إنشاء متابعة ما بعد الجراحة جديدة
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateSurgeryFollowupData = await request.json();

    if (!body.surgeryId || !body.followupDate) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: surgeryId, followupDate",
        },
        { status: 400 }
      );
    }

    const followup = await createSurgeryFollowup(prisma, {
      ...body,
      followupDate: new Date(body.followupDate),
      suturesRemovalDate: body.suturesRemovalDate ? new Date(body.suturesRemovalDate) : undefined,
      nextFollowupDate: body.nextFollowupDate ? new Date(body.nextFollowupDate) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: followup,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating surgery followup:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء المتابعة",
      },
      { status: 500 }
    );
  }
}

