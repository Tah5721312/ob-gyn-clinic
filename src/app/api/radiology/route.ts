import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getRadiologyOrdersList,
  getRadiologyOrdersCount,
  RadiologyFilters,
  createRadiologyOrder,
  CreateRadiologyOrderData,
} from "@/lib/radiology";

/**
 * GET /api/radiology
 * جلب قائمة طلبات الأشعة
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: RadiologyFilters = {
      search: searchParams.get("search") || undefined,
      patientId: searchParams.get("patientId") ? parseInt(searchParams.get("patientId")!) : undefined,
      doctorId: searchParams.get("doctorId") ? parseInt(searchParams.get("doctorId")!) : undefined,
      pregnancyId: searchParams.get("pregnancyId") ? parseInt(searchParams.get("pregnancyId")!) : undefined,
      examType: searchParams.get("examType") || undefined,
      status: searchParams.get("status") || undefined,
      orderDate: searchParams.get("orderDate") ? new Date(searchParams.get("orderDate")!) : undefined,
    };

    const orders = await getRadiologyOrdersList(prisma, filters);
    const count = await getRadiologyOrdersCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: orders,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching radiology orders:", error);
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
 * POST /api/radiology
 * إنشاء طلب أشعة جديد
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateRadiologyOrderData = await request.json();

    if (!body.visitId || !body.patientId || !body.doctorId || !body.examType) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: visitId, patientId, doctorId, examType",
        },
        { status: 400 }
      );
    }

    const order = await createRadiologyOrder(prisma, {
      ...body,
      orderDate: body.orderDate ? new Date(body.orderDate) : undefined,
      examDate: body.examDate ? new Date(body.examDate) : undefined,
      examTime: body.examTime ? new Date(body.examTime) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating radiology order:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء طلب الأشعة",
      },
      { status: 500 }
    );
  }
}

