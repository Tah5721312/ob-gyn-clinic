import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPatientsList,
  getPatientsCount,
  PatientFilters,
  createPatient,
  CreatePatientData,
} from "@/lib/patients";

/**
 * GET /api/patients
 * جلب قائمة المرضى مع البحث والفلترة
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: PatientFilters = {
      search: searchParams.get("search") || undefined,
      isActive:
        searchParams.get("isActive") !== null && searchParams.get("isActive") !== undefined
          ? searchParams.get("isActive") === "true"
          : undefined,
      hasInsurance:
        searchParams.get("hasInsurance") !== null && searchParams.get("hasInsurance") !== undefined
          ? searchParams.get("hasInsurance") === "true"
          : undefined,
      isPregnant:
        searchParams.get("isPregnant") !== null && searchParams.get("isPregnant") !== undefined
          ? searchParams.get("isPregnant") === "true"
          : undefined,
      city: searchParams.get("city") || undefined,
    };

    const patients = await getPatientsList(prisma, filters);
    const count = await getPatientsCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: patients,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching patients:", error);
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
 * POST /api/patients
 * إنشاء مريض جديد
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreatePatientData = await request.json();

    // التحقق من البيانات المطلوبة
    if (!body.nationalId || !body.firstName || !body.lastName || !body.birthDate || !body.phone) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: nationalId, firstName, lastName, birthDate, phone",
        },
        { status: 400 }
      );
    }

    const patient = await createPatient(prisma, {
      ...body,
      birthDate: new Date(body.birthDate),
    });

    return NextResponse.json(
      {
        success: true,
        data: patient,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء المريض",
      },
      { status: 500 }
    );
  }
}

