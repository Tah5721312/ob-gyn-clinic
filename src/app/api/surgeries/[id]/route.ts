import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getSurgeryById,
  updateSurgery,
  deleteSurgery,
  UpdateSurgeryData,
} from "@/lib/surgeries";

/**
 * GET /api/surgeries/[id]
 * جلب عملية جراحية واحدة
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const surgeryId = parseInt(params.id);

    if (isNaN(surgeryId)) {
      return NextResponse.json(
        { success: false, error: "معرف العملية غير صحيح" },
        { status: 400 }
      );
    }

    const surgery = await getSurgeryById(prisma, surgeryId);

    if (!surgery) {
      return NextResponse.json(
        { success: false, error: "العملية غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: surgery,
    });
  } catch (error: any) {
    console.error("Error fetching surgery:", error);
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
 * PUT /api/surgeries/[id]
 * تحديث عملية جراحية
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const surgeryId = parseInt(params.id);

    if (isNaN(surgeryId)) {
      return NextResponse.json(
        { success: false, error: "معرف العملية غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdateSurgeryData = await request.json();

    const surgery = await updateSurgery(prisma, surgeryId, {
      ...body,
      plannedDate: body.plannedDate ? new Date(body.plannedDate) : undefined,
      scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : undefined,
      scheduledTime: body.scheduledTime ? new Date(body.scheduledTime) : undefined,
      actualSurgeryDate: body.actualSurgeryDate ? new Date(body.actualSurgeryDate) : undefined,
      actualStartTime: body.actualStartTime ? new Date(body.actualStartTime) : undefined,
      actualEndTime: body.actualEndTime ? new Date(body.actualEndTime) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: surgery,
    });
  } catch (error: any) {
    console.error("Error updating surgery:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث العملية",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/surgeries/[id]
 * حذف عملية جراحية
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const surgeryId = parseInt(params.id);

    if (isNaN(surgeryId)) {
      return NextResponse.json(
        { success: false, error: "معرف العملية غير صحيح" },
        { status: 400 }
      );
    }

    await deleteSurgery(prisma, surgeryId);

    return NextResponse.json({
      success: true,
      message: "تم حذف العملية بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting surgery:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف العملية",
      },
      { status: 500 }
    );
  }
}

