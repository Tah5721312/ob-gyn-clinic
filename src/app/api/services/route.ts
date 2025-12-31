import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getServicesList,
  getServicesCount,
  ServiceFilters,
  createService,
  CreateServiceData,
} from "@/lib/services";

/**
 * GET /api/services
 * جلب قائمة الخدمات مع البحث والفلترة
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: ServiceFilters = {
      search: searchParams.get("search") || undefined,
      serviceCategory: searchParams.get("serviceCategory") || undefined,
      isActive:
        searchParams.get("isActive") !== null && searchParams.get("isActive") !== undefined
          ? searchParams.get("isActive") === "true"
          : undefined,
    };

    const services = await getServicesList(prisma, filters);
    const count = await getServicesCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: services,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching services:", error);
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
 * POST /api/services
 * إنشاء خدمة جديدة
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateServiceData = await request.json();

    if (!body.serviceCode || !body.serviceName || !body.serviceCategory || !body.basePrice) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: serviceCode, serviceName, serviceCategory, basePrice",
        },
        { status: 400 }
      );
    }

    const service = await createService(prisma, body);

    return NextResponse.json(
      {
        success: true,
        data: service,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء الخدمة",
      },
      { status: 500 }
    );
  }
}

