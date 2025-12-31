import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getInsuranceCompanyById,
  updateInsuranceCompany,
  deleteInsuranceCompany,
  UpdateInsuranceCompanyData,
} from "@/lib/insurance";

/**
 * GET /api/insurance/[id]
 * جلب شركة تأمين واحدة
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const insuranceId = parseInt(params.id);

    if (isNaN(insuranceId)) {
      return NextResponse.json(
        { success: false, error: "معرف شركة التأمين غير صحيح" },
        { status: 400 }
      );
    }

    const company = await getInsuranceCompanyById(prisma, insuranceId);

    if (!company) {
      return NextResponse.json(
        { success: false, error: "شركة التأمين غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: company,
    });
  } catch (error: any) {
    console.error("Error fetching insurance company:", error);
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
 * تحديث شركة تأمين
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const insuranceId = parseInt(params.id);

    if (isNaN(insuranceId)) {
      return NextResponse.json(
        { success: false, error: "معرف شركة التأمين غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdateInsuranceCompanyData = await request.json();

    const company = await updateInsuranceCompany(prisma, insuranceId, {
      ...body,
      contractStartDate: body.contractStartDate ? new Date(body.contractStartDate) : undefined,
      contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: company,
    });
  } catch (error: any) {
    console.error("Error updating insurance company:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث شركة التأمين",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/insurance/[id]
 * حذف شركة تأمين
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const insuranceId = parseInt(params.id);

    if (isNaN(insuranceId)) {
      return NextResponse.json(
        { success: false, error: "معرف شركة التأمين غير صحيح" },
        { status: 400 }
      );
    }

    await deleteInsuranceCompany(prisma, insuranceId);

    return NextResponse.json({
      success: true,
      message: "تم حذف شركة التأمين بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting insurance company:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف شركة التأمين",
      },
      { status: 500 }
    );
  }
}

