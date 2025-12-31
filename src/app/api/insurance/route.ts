import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getInsuranceCompaniesList,
  getInsuranceCompaniesCount,
  InsuranceFilters,
  createInsuranceCompany,
  CreateInsuranceCompanyData,
} from "@/lib/insurance";

/**
 * GET /api/insurance
 * جلب قائمة شركات التأمين
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: InsuranceFilters = {
      search: searchParams.get("search") || undefined,
      isActive:
        searchParams.get("isActive") !== null && searchParams.get("isActive") !== undefined
          ? searchParams.get("isActive") === "true"
          : undefined,
    };

    const companies = await getInsuranceCompaniesList(prisma, filters);
    const count = await getInsuranceCompaniesCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: companies,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching insurance companies:", error);
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
 * إنشاء شركة تأمين جديدة
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateInsuranceCompanyData = await request.json();

    if (!body.companyCode || !body.companyName) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: companyCode, companyName",
        },
        { status: 400 }
      );
    }

    const company = await createInsuranceCompany(prisma, {
      ...body,
      contractStartDate: body.contractStartDate ? new Date(body.contractStartDate) : undefined,
      contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: company,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating insurance company:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء شركة التأمين",
      },
      { status: 500 }
    );
  }
}

