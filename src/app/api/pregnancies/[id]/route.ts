import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPregnancyById,
  updatePregnancy,
  deletePregnancy,
  UpdatePregnancyData,
} from "@/lib/pregnancies";

/**
 * GET /api/pregnancies/[id]
 * جلب حالة حمل واحدة بالـ ID
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const pregnancyId = parseInt(params.id);

    if (isNaN(pregnancyId)) {
      return NextResponse.json(
        { success: false, error: "معرف حالة الحمل غير صحيح" },
        { status: 400 }
      );
    }

    const pregnancy = await getPregnancyById(prisma, pregnancyId);

    if (!pregnancy) {
      return NextResponse.json(
        { success: false, error: "حالة الحمل غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pregnancy,
    });
  } catch (error: any) {
    console.error("Error fetching pregnancy:", error);
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
 * PUT /api/pregnancies/[id]
 * تحديث حالة حمل
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const pregnancyId = parseInt(params.id);

    if (isNaN(pregnancyId)) {
      return NextResponse.json(
        { success: false, error: "معرف حالة الحمل غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdatePregnancyData = await request.json();

    // تحويل التواريخ
    if (body.lmpDate) body.lmpDate = new Date(body.lmpDate);
    if (body.eddDate) body.eddDate = new Date(body.eddDate);
    if (body.eddByUltrasound) body.eddByUltrasound = new Date(body.eddByUltrasound);
    if (body.deliveryDate) body.deliveryDate = new Date(body.deliveryDate);

    const pregnancy = await updatePregnancy(prisma, pregnancyId, body);

    return NextResponse.json({
      success: true,
      data: pregnancy,
    });
  } catch (error: any) {
    console.error("Error updating pregnancy:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث حالة الحمل",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/pregnancies/[id]
 * حذف حالة حمل
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const pregnancyId = parseInt(params.id);

    if (isNaN(pregnancyId)) {
      return NextResponse.json(
        { success: false, error: "معرف حالة الحمل غير صحيح" },
        { status: 400 }
      );
    }

    await deletePregnancy(prisma, pregnancyId);

    return NextResponse.json({
      success: true,
      message: "تم حذف حالة الحمل بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting pregnancy:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف حالة الحمل",
      },
      { status: 500 }
    );
  }
}

