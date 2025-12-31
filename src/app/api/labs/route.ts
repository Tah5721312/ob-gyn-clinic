import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getLabOrdersList,
  getLabOrdersCount,
  LabFilters,
  createLabOrder,
  CreateLabOrderData,
} from "@/lib/labs";

/**
 * GET /api/labs
 * جلب قائمة طلبات التحاليل مع البحث والفلترة
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: LabFilters = {
      search: searchParams.get("search") || undefined,
      patientId: searchParams.get("patientId") ? parseInt(searchParams.get("patientId")!) : undefined,
      doctorId: searchParams.get("doctorId") ? parseInt(searchParams.get("doctorId")!) : undefined,
      orderDate: searchParams.get("orderDate") ? new Date(searchParams.get("orderDate")!) : undefined,
      status: searchParams.get("status") || undefined,
      priority: searchParams.get("priority") || undefined,
    };

    const orders = await getLabOrdersList(prisma, filters);
    const count = await getLabOrdersCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: orders,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching lab orders:", error);
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
 * POST /api/labs
 * إنشاء طلب تحليل جديد
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateLabOrderData = await request.json();

    if (!body.visitId || !body.patientId || !body.doctorId) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: visitId, patientId, doctorId",
        },
        { status: 400 }
      );
    }

    const order = await createLabOrder(prisma, {
      ...body,
      orderDate: body.orderDate ? new Date(body.orderDate) : undefined,
      expectedResultDate: body.expectedResultDate ? new Date(body.expectedResultDate) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating lab order:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء طلب التحليل",
      },
      { status: 500 }
    );
  }
}

