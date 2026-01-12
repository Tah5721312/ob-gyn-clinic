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
    const body: any = await request.json();
    const { isPregnant, ...patientData } = body;

    // التحقق من البيانات المطلوبة
    if (!patientData.firstName || !patientData.lastName || !patientData.birthDate || !patientData.phone) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: firstName, lastName, birthDate, phone",
        },
        { status: 400 }
      );
    }

    const patient = await createPatient(prisma, {
      ...patientData,
      birthDate: new Date(patientData.birthDate),
    });

    // إذا كانت المريضة حامل، أنشئ سجل حمل جديد
    if (isPregnant) {
      await prisma.pregnancyRecord.create({
        data: {
          patientId: patient.id,
          pregnancyNumber: 1,
          lmpDate: new Date(),
          isActive: true,
        },
      });
    }

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

