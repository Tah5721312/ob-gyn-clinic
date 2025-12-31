import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getDoctorsList,
  getDoctorsCount,
  DoctorFilters,
  createDoctor,
  CreateDoctorData,
} from "@/lib/doctors";

/**
 * GET /api/doctors
 * جلب قائمة الأطباء مع البحث والفلترة
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: DoctorFilters = {
      search: searchParams.get("search") || undefined,
      specialization: searchParams.get("specialization") || undefined,
      isActive:
        searchParams.get("isActive") !== null && searchParams.get("isActive") !== undefined
          ? searchParams.get("isActive") === "true"
          : undefined,
    };

    const doctors = await getDoctorsList(prisma, filters);
    const count = await getDoctorsCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: doctors,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching doctors:", error);
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
 * POST /api/doctors
 * إنشاء طبيب جديد
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateDoctorData = await request.json();

    if (
      !body.nationalId ||
      !body.firstName ||
      !body.lastName ||
      !body.specialization ||
      !body.licenseNumber ||
      !body.phone ||
      !body.consultationFee
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "البيانات المطلوبة: nationalId, firstName, lastName, specialization, licenseNumber, phone, consultationFee",
        },
        { status: 400 }
      );
    }

    const doctor = await createDoctor(prisma, body);

    return NextResponse.json(
      {
        success: true,
        data: doctor,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating doctor:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء الطبيب",
      },
      { status: 500 }
    );
  }
}

