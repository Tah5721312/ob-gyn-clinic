import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getMedicalHistoryByPatientId,
  createOrUpdateMedicalHistory,
  updateMedicalHistory,
  MedicalHistoryData,
} from "@/lib/medical-history";

/**
 * GET /api/medical-history/[patientId]
 * جلب التاريخ المرضي لمريض
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ patientId: string }> }
) {
  try {
    const params = await context.params;
    const patientId = parseInt(params.patientId);

    if (isNaN(patientId)) {
      return NextResponse.json(
        { success: false, error: "معرف المريض غير صحيح" },
        { status: 400 }
      );
    }

    const history = await getMedicalHistoryByPatientId(prisma, patientId);

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    console.error("Error fetching medical history:", error);
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
 * POST /api/medical-history/[patientId]
 * إنشاء أو تحديث التاريخ المرضي
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ patientId: string }> }
) {
  try {
    const params = await context.params;
    const patientId = parseInt(params.patientId);

    if (isNaN(patientId)) {
      return NextResponse.json(
        { success: false, error: "معرف المريض غير صحيح" },
        { status: 400 }
      );
    }

    const body: MedicalHistoryData = await request.json();
    const history = await createOrUpdateMedicalHistory(prisma, {
      ...body,
      patientId,
    });

    return NextResponse.json(
      {
        success: true,
        data: history,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating/updating medical history:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حفظ التاريخ المرضي",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/medical-history/[patientId]
 * تحديث التاريخ المرضي
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ patientId: string }> }
) {
  try {
    const params = await context.params;
    const patientId = parseInt(params.patientId);

    if (isNaN(patientId)) {
      return NextResponse.json(
        { success: false, error: "معرف المريض غير صحيح" },
        { status: 400 }
      );
    }

    const body: Partial<MedicalHistoryData> = await request.json();
    const history = await updateMedicalHistory(prisma, patientId, body);

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    console.error("Error updating medical history:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث التاريخ المرضي",
      },
      { status: 500 }
    );
  }
}

