import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getRadiologyOrderById,
  updateRadiologyOrder,
  deleteRadiologyOrder,
  UpdateRadiologyOrderData,
} from "@/lib/radiology";

/**
 * GET /api/radiology/[id]
 * جلب طلب أشعة واحد
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: "معرف طلب الأشعة غير صحيح" },
        { status: 400 }
      );
    }

    const order = await getRadiologyOrderById(prisma, orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "طلب الأشعة غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("Error fetching radiology order:", error);
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
 * PUT /api/radiology/[id]
 * تحديث طلب أشعة
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: "معرف طلب الأشعة غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdateRadiologyOrderData = await request.json();

    const order = await updateRadiologyOrder(prisma, orderId, {
      ...body,
      examDate: body.examDate ? new Date(body.examDate) : undefined,
      examTime: body.examTime ? new Date(body.examTime) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("Error updating radiology order:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث طلب الأشعة",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/radiology/[id]
 * حذف طلب أشعة
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: "معرف طلب الأشعة غير صحيح" },
        { status: 400 }
      );
    }

    await deleteRadiologyOrder(prisma, orderId);

    return NextResponse.json({
      success: true,
      message: "تم حذف طلب الأشعة بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting radiology order:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف طلب الأشعة",
      },
      { status: 500 }
    );
  }
}

