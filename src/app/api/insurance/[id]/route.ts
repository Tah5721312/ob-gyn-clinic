import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getInsuranceById,
  updateInsurance,
  deleteInsurance,
  UpdateInsuranceData,
} from "@/lib/insurance";

/**
 * GET /api/insurance/[id]
 * جلب تأمين واحد
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const insuranceId = parseInt(params.id);

    if (isNaN(insuranceId)) {
      return NextResponse.json(
        { success: false, error: "معرف التأمين غير صحيح" },
        { status: 400 }
      );
    }

    const insurance = await getInsuranceById(prisma, insuranceId);

    if (!insurance) {
      return NextResponse.json(
        { success: false, error: "التأمين غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: insurance,
    });
  } catch (error: any) {
    console.error("Error fetching insurance:", error);
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
 * PUT /api/insurance/[id]
 * تحديث تأمين
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const insuranceId = parseInt(params.id);

    if (isNaN(insuranceId)) {
      return NextResponse.json(
        { success: false, error: "معرف التأمين غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdateInsuranceData = await request.json();

    const insurance = await updateInsurance(prisma, insuranceId, {
      ...body,
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: insurance,
    });
  } catch (error: any) {
    console.error("Error updating insurance:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث التأمين",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/insurance/[id]
 * حذف تأمين
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const insuranceId = parseInt(params.id);

    if (isNaN(insuranceId)) {
      return NextResponse.json(
        { success: false, error: "معرف التأمين غير صحيح" },
        { status: 400 }
      );
    }

    await deleteInsurance(prisma, insuranceId);

    return NextResponse.json({
      success: true,
      message: "تم حذف التأمين بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting insurance:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف التأمين",
      },
      { status: 500 }
    );
  }
}
