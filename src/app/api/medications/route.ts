import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getMedicationsList,
  getMedicationsCount,
  MedicationFilters,
  createMedication,
  CreateMedicationData,
} from "@/lib/medications";

/**
 * GET /api/medications
 * جلب قائمة الأدوية
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: MedicationFilters = {
      search: searchParams.get("search") || undefined,
    };

    const medications = await getMedicationsList(prisma, filters);
    const count = await getMedicationsCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: medications,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching medications:", error);
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
 * POST /api/medications
 * إنشاء دواء جديد
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateMedicationData = await request.json();

    if (!body.medicationName) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: medicationName",
        },
        { status: 400 }
      );
    }

    const medication = await createMedication(prisma, body);

    return NextResponse.json(
      {
        success: true,
        data: medication,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating medication:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء الدواء",
      },
      { status: 500 }
    );
  }
}

