import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getDiagnosesList,
  getDiagnosesCount,
  DiagnosisFilters,
  createDiagnosis,
  CreateDiagnosisData,
} from "@/lib/diagnoses";

/**
 * GET /api/diagnoses
 * جلب قائمة التشخيصات
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: DiagnosisFilters = {
      search: searchParams.get("search") || undefined,
      patientId: searchParams.get("patientId") ? parseInt(searchParams.get("patientId")!) : undefined,
      visitId: searchParams.get("visitId") ? parseInt(searchParams.get("visitId")!) : undefined,
      diagnosisType: searchParams.get("diagnosisType") || undefined,
      isChronic:
        searchParams.get("isChronic") !== null && searchParams.get("isChronic") !== undefined
          ? searchParams.get("isChronic") === "true"
          : undefined,
      isResolved:
        searchParams.get("isResolved") !== null && searchParams.get("isResolved") !== undefined
          ? searchParams.get("isResolved") === "true"
          : undefined,
    };

    const diagnoses = await getDiagnosesList(prisma, filters);
    const count = await getDiagnosesCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: diagnoses,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching diagnoses:", error);
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
 * POST /api/diagnoses
 * إنشاء تشخيص جديد
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateDiagnosisData = await request.json();

    if (!body.visitId || !body.patientId || !body.diagnosisName || !body.diagnosisType) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: visitId, patientId, diagnosisName, diagnosisType",
        },
        { status: 400 }
      );
    }

    const diagnosis = await createDiagnosis(prisma, {
      ...body,
      diagnosisDate: body.diagnosisDate ? new Date(body.diagnosisDate) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: diagnosis,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating diagnosis:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء التشخيص",
      },
      { status: 500 }
    );
  }
}

