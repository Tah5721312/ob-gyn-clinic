import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPregnancyFollowupById,
  updatePregnancyFollowup,
  deletePregnancyFollowup,
  UpdatePregnancyFollowupData,
} from "@/lib/pregnancy-followups";

/**
 * GET /api/pregnancy-followups/[id]
 * جلب متابعة حمل واحدة
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const followupId = parseInt(params.id);

    if (isNaN(followupId)) {
      return NextResponse.json(
        { success: false, error: "معرف المتابعة غير صحيح" },
        { status: 400 }
      );
    }

    const followup = await getPregnancyFollowupById(prisma, followupId);

    if (!followup) {
      return NextResponse.json(
        { success: false, error: "المتابعة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: followup,
    });
  } catch (error: any) {
    console.error("Error fetching pregnancy followup:", error);
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
 * PUT /api/pregnancy-followups/[id]
 * تحديث متابعة حمل
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const followupId = parseInt(params.id);

    if (isNaN(followupId)) {
      return NextResponse.json(
        { success: false, error: "معرف المتابعة غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdatePregnancyFollowupData = await request.json();

    const followup = await updatePregnancyFollowup(prisma, followupId, {
      ...body,
      nextVisitDate: body.nextVisitDate ? new Date(body.nextVisitDate) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: followup,
    });
  } catch (error: any) {
    console.error("Error updating pregnancy followup:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث المتابعة",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/pregnancy-followups/[id]
 * حذف متابعة حمل
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const followupId = parseInt(params.id);

    if (isNaN(followupId)) {
      return NextResponse.json(
        { success: false, error: "معرف المتابعة غير صحيح" },
        { status: 400 }
      );
    }

    await deletePregnancyFollowup(prisma, followupId);

    return NextResponse.json({
      success: true,
      message: "تم حذف المتابعة بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting pregnancy followup:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف المتابعة",
      },
      { status: 500 }
    );
  }
}

