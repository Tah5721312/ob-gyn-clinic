import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  UpdateDoctorData,
} from "@/lib/doctors";

/**
 * GET /api/doctors/[id]
 * جلب طبيب واحد بالـ ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const doctorId = parseInt(params.id);

    if (isNaN(doctorId)) {
      return NextResponse.json(
        { success: false, error: "معرف الطبيب غير صحيح" },
        { status: 400 }
      );
    }

    const doctor = await getDoctorById(prisma, doctorId);

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: "الطبيب غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: doctor,
    });
  } catch (error: any) {
    console.error("Error fetching doctor:", error);
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
 * PUT /api/doctors/[id]
 * تحديث طبيب
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const doctorId = parseInt(params.id);

    if (isNaN(doctorId)) {
      return NextResponse.json(
        { success: false, error: "معرف الطبيب غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdateDoctorData = await request.json();
    const doctor = await updateDoctor(prisma, doctorId, body);

    return NextResponse.json({
      success: true,
      data: doctor,
    });
  } catch (error: any) {
    console.error("Error updating doctor:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث الطبيب",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/doctors/[id]
 * حذف طبيب
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const doctorId = parseInt(params.id);

    if (isNaN(doctorId)) {
      return NextResponse.json(
        { success: false, error: "معرف الطبيب غير صحيح" },
        { status: 400 }
      );
    }

    await deleteDoctor(prisma, doctorId);

    return NextResponse.json({
      success: true,
      message: "تم حذف الطبيب بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting doctor:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف الطبيب",
      },
      { status: 500 }
    );
  }
}

