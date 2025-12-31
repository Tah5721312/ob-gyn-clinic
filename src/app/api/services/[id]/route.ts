import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getServiceById,
  updateService,
  deleteService,
  UpdateServiceData,
} from "@/lib/services";

/**
 * GET /api/services/[id]
 * جلب خدمة واحدة بالـ ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = parseInt(params.id);

    if (isNaN(serviceId)) {
      return NextResponse.json(
        { success: false, error: "معرف الخدمة غير صحيح" },
        { status: 400 }
      );
    }

    const service = await getServiceById(prisma, serviceId);

    if (!service) {
      return NextResponse.json(
        { success: false, error: "الخدمة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error: any) {
    console.error("Error fetching service:", error);
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
 * PUT /api/services/[id]
 * تحديث خدمة
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = parseInt(params.id);

    if (isNaN(serviceId)) {
      return NextResponse.json(
        { success: false, error: "معرف الخدمة غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdateServiceData = await request.json();
    const service = await updateService(prisma, serviceId, body);

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error: any) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث الخدمة",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/services/[id]
 * حذف خدمة
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = parseInt(params.id);

    if (isNaN(serviceId)) {
      return NextResponse.json(
        { success: false, error: "معرف الخدمة غير صحيح" },
        { status: 400 }
      );
    }

    await deleteService(prisma, serviceId);

    return NextResponse.json({
      success: true,
      message: "تم حذف الخدمة بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف الخدمة",
      },
      { status: 500 }
    );
  }
}

