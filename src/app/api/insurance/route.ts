import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getInsurancesList,
  getInsurancesCount,
  InsuranceFilters,
  createInsurance,
  CreateInsuranceData,
} from "@/lib/insurance";

/**
 * GET /api/insurance
 * جلب قائمة التأمينات
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: InsuranceFilters = {
      patientId:
        searchParams.get("patientId") !== null && searchParams.get("patientId") !== undefined
          ? parseInt(searchParams.get("patientId")!)
          : undefined,
      isActive:
        searchParams.get("isActive") !== null && searchParams.get("isActive") !== undefined
          ? searchParams.get("isActive") === "true"
          : undefined,
      expiryDate:
        searchParams.get("expiryDate") !== null && searchParams.get("expiryDate") !== undefined
          ? new Date(searchParams.get("expiryDate")!)
          : undefined,
    };

    const insurances = await getInsurancesList(prisma, filters);
    const count = await getInsurancesCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: insurances,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching insurances:", error);
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
 * POST /api/insurance
 * إنشاء تأمين جديد
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
    console.error("Error creating insurance:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء التأمين",
      },
      { status: 500 }
    );
  }
}
