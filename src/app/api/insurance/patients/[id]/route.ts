import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPatientInsuranceById,
  updatePatientInsurance,
  deletePatientInsurance,
  UpdatePatientInsuranceData,
} from "@/lib/insurance";

/**
 * GET /api/insurance/patients/[id]
 * جلب تأمين مريض واحد
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientInsuranceId = parseInt(params.id);

    if (isNaN(patientInsuranceId)) {
      return NextResponse.json(
        { success: false, error: "معرف التأمين غير صحيح" },
        { status: 400 }
      );
    }

    const insurance = await getPatientInsuranceById(prisma, patientInsuranceId);

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
    console.error("Error fetching patient insurance:", error);
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
 * PUT /api/insurance/patients/[id]
 * تحديث تأمين مريض
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientInsuranceId = parseInt(params.id);

    if (isNaN(patientInsuranceId)) {
      return NextResponse.json(
        { success: false, error: "معرف التأمين غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdatePatientInsuranceData = await request.json();

    const insurance = await updatePatientInsurance(prisma, patientInsuranceId, {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      verificationDate: body.verificationDate ? new Date(body.verificationDate) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: insurance,
    });
  } catch (error: any) {
    console.error("Error updating patient insurance:", error);
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
 * DELETE /api/insurance/patients/[id]
 * حذف تأمين مريض
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientInsuranceId = parseInt(params.id);

    if (isNaN(patientInsuranceId)) {
      return NextResponse.json(
        { success: false, error: "معرف التأمين غير صحيح" },
        { status: 400 }
      );
    }

    await deletePatientInsurance(prisma, patientInsuranceId);

    return NextResponse.json({
      success: true,
      message: "تم حذف التأمين بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting patient insurance:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف التأمين",
      },
      { status: 500 }
    );
  }
}

