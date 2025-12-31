import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getSurgeryFollowupById,
  updateSurgeryFollowup,
  deleteSurgeryFollowup,
  UpdateSurgeryFollowupData,
} from "@/lib/surgery-followups";

/**
 * GET /api/surgery-followups/[id]
 * جلب متابعة ما بعد الجراحة واحدة
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

    const followup = await getSurgeryFollowupById(prisma, followupId);

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
    console.error("Error fetching surgery followup:", error);
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
 * PUT /api/surgery-followups/[id]
 * تحديث متابعة ما بعد الجراحة
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

    const body: UpdateSurgeryFollowupData = await request.json();

    const followup = await updateSurgeryFollowup(prisma, followupId, {
      ...body,
      followupDate: body.followupDate ? new Date(body.followupDate) : undefined,
      suturesRemovalDate: body.suturesRemovalDate ? new Date(body.suturesRemovalDate) : undefined,
      nextFollowupDate: body.nextFollowupDate ? new Date(body.nextFollowupDate) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: followup,
    });
  } catch (error: any) {
    console.error("Error updating surgery followup:", error);
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
 * DELETE /api/surgery-followups/[id]
 * حذف متابعة ما بعد الجراحة
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

    await deleteSurgeryFollowup(prisma, followupId);

    return NextResponse.json({
      success: true,
      message: "تم حذف المتابعة بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting surgery followup:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف المتابعة",
      },
      { status: 500 }
    );
  }
}

