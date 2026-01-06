import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getInsurancesByPatientId,
  createInsurance,
  CreateInsuranceData,
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

    const insurances = await getInsurancesByPatientId(prisma, parseInt(patientId));

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
    const body: CreateInsuranceData = await request.json();

    if (!body.patientId || !body.insuranceCompany || !body.policyNumber || !body.expiryDate) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: patientId, insuranceCompany, policyNumber, expiryDate",
        },
        { status: 400 }
      );
    }

    const insurance = await createInsurance(prisma, {
      ...body,
      expiryDate: new Date(body.expiryDate),
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
