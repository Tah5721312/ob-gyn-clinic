import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getDiagnosisById,
  updateDiagnosis,
  deleteDiagnosis,
  UpdateDiagnosisData,
} from "@/lib/diagnoses";

/**
 * GET /api/diagnoses/[id]
 * جلب تشخيص واحد
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const diagnosisId = parseInt(params.id);

    if (isNaN(diagnosisId)) {
      return NextResponse.json(
        { success: false, error: "معرف التشخيص غير صحيح" },
        { status: 400 }
      );
    }

    const diagnosis = await getDiagnosisById(prisma, diagnosisId);

    if (!diagnosis) {
      return NextResponse.json(
        { success: false, error: "التشخيص غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: diagnosis,
    });
  } catch (error: any) {
    console.error("Error fetching diagnosis:", error);
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
 * PUT /api/diagnoses/[id]
 * تحديث تشخيص
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const diagnosisId = parseInt(params.id);

    if (isNaN(diagnosisId)) {
      return NextResponse.json(
        { success: false, error: "معرف التشخيص غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdateDiagnosisData = await request.json();

    if (body.resolutionDate) {
      body.resolutionDate = new Date(body.resolutionDate);
    }

    const diagnosis = await updateDiagnosis(prisma, diagnosisId, body);

    return NextResponse.json({
      success: true,
      data: diagnosis,
    });
  } catch (error: any) {
    console.error("Error updating diagnosis:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث التشخيص",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/diagnoses/[id]
 * حذف تشخيص
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const diagnosisId = parseInt(params.id);

    if (isNaN(diagnosisId)) {
      return NextResponse.json(
        { success: false, error: "معرف التشخيص غير صحيح" },
        { status: 400 }
      );
    }

    await deleteDiagnosis(prisma, diagnosisId);

    return NextResponse.json({
      success: true,
      message: "تم حذف التشخيص بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting diagnosis:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف التشخيص",
      },
      { status: 500 }
    );
  }
}

