import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getVisitById,
  updateVisit,
  deleteVisit,
  completeVisit,
  UpdateVisitData,
} from "@/lib/visits";

/**
 * GET /api/visits/[id]
 * جلب زيارة واحدة بالـ ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const visitId = parseInt(params.id);

    if (isNaN(visitId)) {
      return NextResponse.json(
        { success: false, error: "معرف الزيارة غير صحيح" },
        { status: 400 }
      );
    }

    const visit = await getVisitById(prisma, visitId);

    if (!visit) {
      return NextResponse.json(
        { success: false, error: "الزيارة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: visit,
    });
  } catch (error: any) {
    console.error("Error fetching visit:", error);
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
 * PUT /api/visits/[id]
 * تحديث زيارة
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const visitId = parseInt(params.id);

    if (isNaN(visitId)) {
      return NextResponse.json(
        { success: false, error: "معرف الزيارة غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdateVisitData = await request.json();

    // تحويل التواريخ
    if (body.visitStartTime) body.visitStartTime = new Date(body.visitStartTime);
    if (body.visitEndTime) body.visitEndTime = new Date(body.visitEndTime);
    if (body.nextVisitDate) body.nextVisitDate = new Date(body.nextVisitDate);

    const visit = await updateVisit(prisma, visitId, body);

    return NextResponse.json({
      success: true,
      data: visit,
    });
  } catch (error: any) {
    console.error("Error updating visit:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث الزيارة",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/visits/[id]
 * حذف زيارة
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const visitId = parseInt(params.id);

    if (isNaN(visitId)) {
      return NextResponse.json(
        { success: false, error: "معرف الزيارة غير صحيح" },
        { status: 400 }
      );
    }

    await deleteVisit(prisma, visitId);

    return NextResponse.json({
      success: true,
      message: "تم حذف الزيارة بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting visit:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف الزيارة",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/visits/[id]/complete
 * إكمال زيارة
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const visitId = parseInt(params.id);

    if (isNaN(visitId)) {
      return NextResponse.json(
        { success: false, error: "معرف الزيارة غير صحيح" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const visitEndTime = body.visitEndTime ? new Date(body.visitEndTime) : undefined;

    const visit = await completeVisit(prisma, visitId, visitEndTime);

    return NextResponse.json({
      success: true,
      data: visit,
    });
  } catch (error: any) {
    console.error("Error completing visit:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إكمال الزيارة",
      },
      { status: 500 }
    );
  }
}

