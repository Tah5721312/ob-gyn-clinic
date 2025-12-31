import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPatientInsurancesList,
  createPatientInsurance,
  CreatePatientInsuranceData,
} from "@/lib/insurance";

/**
 * GET /api/insurance/patients?patientId=xxx
 * جلب تأمينات مريض
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get("patientId");

    if (!patientId) {
      return NextResponse.json(
        { success: false, error: "patientId مطلوب" },
        { status: 400 }
      );
    }

    const insurances = await getPatientInsurancesList(prisma, parseInt(patientId));

    return NextResponse.json({
      success: true,
      data: insurances,
    });
  } catch (error: any) {
    console.error("Error fetching patient insurances:", error);
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
 * POST /api/insurance/patients
 * إضافة تأمين لمريض
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreatePatientInsuranceData = await request.json();

    if (!body.patientId || !body.insuranceId || !body.policyNumber || !body.startDate) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: patientId, insuranceId, policyNumber, startDate",
        },
        { status: 400 }
      );
    }

    const insurance = await createPatientInsurance(prisma, {
      ...body,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: insurance,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating patient insurance:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إضافة التأمين",
      },
      { status: 500 }
    );
  }
}

