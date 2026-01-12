import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPatientById, updatePatient, deletePatient, UpdatePatientData } from "@/lib/patients";

/**
 * GET /api/patients/[id]
 * جلب مريض واحد بالـ ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patientId = parseInt(id);

    if (isNaN(patientId)) {
      return NextResponse.json(
        { success: false, error: "معرف المريض غير صحيح" },
        { status: 400 }
      );
    }

    const patient = await getPatientById(prisma, patientId);

    if (!patient) {
      return NextResponse.json(
        { success: false, error: "المريض غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: patient,
    });
  } catch (error: any) {
    console.error("Error fetching patient:", error);
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
 * PUT /api/patients/[id]
 * تحديث مريض
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patientId = parseInt(id);

    if (isNaN(patientId)) {
      return NextResponse.json(
        { success: false, error: "معرف المريض غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdatePatientData = await request.json();

    // تحويل birthDate إلى Date إذا كان موجوداً
    if (body.birthDate) {
      body.birthDate = new Date(body.birthDate);
    }

    const patient = await updatePatient(prisma, patientId, body);

    return NextResponse.json({
      success: true,
      data: patient,
    });
  } catch (error: any) {
    console.error("Error updating patient:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث المريض",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/patients/[id]
 * حذف مريض
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patientId = parseInt(id);

    if (isNaN(patientId)) {
      return NextResponse.json(
        { success: false, error: "معرف المريض غير صحيح" },
        { status: 400 }
      );
    }

    await deletePatient(prisma, patientId);

    return NextResponse.json({
      success: true,
      message: "تم حذف المريض بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting patient:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف المريض",
      },
      { status: 500 }
    );
  }
}

