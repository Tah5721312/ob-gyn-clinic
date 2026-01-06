import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  UpdatePrescriptionData,
} from "@/lib/prescriptions";

/**
 * GET /api/prescriptions/[id]
 * جلب روشتة واحدة
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prescriptionId = parseInt(params.id);

    if (isNaN(prescriptionId)) {
      return NextResponse.json(
        { success: false, error: "معرف الروشتة غير صحيح" },
        { status: 400 }
      );
    }

    const prescription = await getPrescriptionById(prisma, prescriptionId);

    if (!prescription) {
      return NextResponse.json(
        { success: false, error: "الروشتة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: prescription,
    });
  } catch (error: any) {
    console.error("Error fetching prescription:", error);
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
 * PUT /api/prescriptions/[id]
 * تحديث روشتة
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prescriptionId = parseInt(params.id);

    if (isNaN(prescriptionId)) {
      return NextResponse.json(
        { success: false, error: "معرف الروشتة غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdatePrescriptionData = await request.json();

    const prescription = await updatePrescription(prisma, prescriptionId, body);

    return NextResponse.json({
      success: true,
      data: prescription,
    });
  } catch (error: any) {
    console.error("Error updating prescription:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث الروشتة",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/prescriptions/[id]
 * حذف روشتة
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prescriptionId = parseInt(params.id);

    if (isNaN(prescriptionId)) {
      return NextResponse.json(
        { success: false, error: "معرف الروشتة غير صحيح" },
        { status: 400 }
      );
    }

    await deletePrescription(prisma, prescriptionId);

    return NextResponse.json({
      success: true,
      message: "تم حذف الروشتة بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting prescription:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف الروشتة",
      },
      { status: 500 }
    );
  }
}

