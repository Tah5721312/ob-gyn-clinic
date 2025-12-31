import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getLabOrderById,
  getLabResultsList,
  updateLabOrder,
  deleteLabOrder,
  UpdateLabOrderData,
} from "@/lib/labs";

/**
 * GET /api/labs/[id]
 * جلب طلب تحليل واحد بالـ ID مع النتائج
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: "معرف طلب التحليل غير صحيح" },
        { status: 400 }
      );
    }

    const order = await getLabOrderById(prisma, orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "طلب التحليل غير موجود" },
        { status: 404 }
      );
    }

    const results = await getLabResultsList(prisma, orderId);

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        results,
      },
    });
  } catch (error: any) {
    console.error("Error fetching lab order:", error);
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
 * PUT /api/labs/[id]
 * تحديث طلب تحليل
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: "معرف طلب التحليل غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdateLabOrderData = await request.json();

    if (body.expectedResultDate) {
      body.expectedResultDate = new Date(body.expectedResultDate);
    }
    if (body.sampleCollectedAt) {
      body.sampleCollectedAt = new Date(body.sampleCollectedAt);
    }
    if (body.sampleReceivedAt) {
      body.sampleReceivedAt = new Date(body.sampleReceivedAt);
    }

    const order = await updateLabOrder(prisma, orderId, body);

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("Error updating lab order:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث طلب التحليل",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/labs/[id]
 * حذف طلب تحليل
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: "معرف طلب التحليل غير صحيح" },
        { status: 400 }
      );
    }

    await deleteLabOrder(prisma, orderId);

    return NextResponse.json({
      success: true,
      message: "تم حذف طلب التحليل بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting lab order:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف طلب التحليل",
      },
      { status: 500 }
    );
  }
}

