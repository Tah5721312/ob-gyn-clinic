import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getMedicationById,
  updateMedication,
  deleteMedication,
  UpdateMedicationData,
} from "@/lib/medications";

/**
 * GET /api/medications/[id]
 * جلب دواء واحد
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const medicationId = parseInt(params.id);

    if (isNaN(medicationId)) {
      return NextResponse.json(
        { success: false, error: "معرف الدواء غير صحيح" },
        { status: 400 }
      );
    }

    const medication = await getMedicationById(prisma, medicationId);

    if (!medication) {
      return NextResponse.json(
        { success: false, error: "الدواء غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: medication,
    });
  } catch (error: any) {
    console.error("Error fetching medication:", error);
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
 * PUT /api/medications/[id]
 * تحديث دواء
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const medicationId = parseInt(params.id);

    if (isNaN(medicationId)) {
      return NextResponse.json(
        { success: false, error: "معرف الدواء غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdateMedicationData = await request.json();
    const medication = await updateMedication(prisma, medicationId, body);

    return NextResponse.json({
      success: true,
      data: medication,
    });
  } catch (error: any) {
    console.error("Error updating medication:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث الدواء",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/medications/[id]
 * حذف دواء
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const medicationId = parseInt(params.id);

    if (isNaN(medicationId)) {
      return NextResponse.json(
        { success: false, error: "معرف الدواء غير صحيح" },
        { status: 400 }
      );
    }

    await deleteMedication(prisma, medicationId);

    return NextResponse.json({
      success: true,
      message: "تم حذف الدواء بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting medication:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف الدواء",
      },
      { status: 500 }
    );
  }
}

