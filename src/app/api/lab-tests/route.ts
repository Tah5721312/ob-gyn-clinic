import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getLabTestsList,
  getLabTestsCount,
  LabTestFilters,
  createLabTest,
  CreateLabTestData,
} from "@/lib/lab-tests";

/**
 * GET /api/lab-tests
 * جلب قائمة تحاليل المعمل
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: LabTestFilters = {
      search: searchParams.get("search") || undefined,
      testCategory: searchParams.get("testCategory") || undefined,
      isActive:
        searchParams.get("isActive") !== null && searchParams.get("isActive") !== undefined
          ? searchParams.get("isActive") === "true"
          : undefined,
    };

    const tests = await getLabTestsList(prisma, filters);
    const count = await getLabTestsCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: tests,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching lab tests:", error);
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
 * POST /api/lab-tests
 * إنشاء تحليل معمل جديد
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateLabTestData = await request.json();

    if (!body.testCode || !body.testName || !body.testCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: testCode, testName, testCategory",
        },
        { status: 400 }
      );
    }

    const test = await createLabTest(prisma, body);

    return NextResponse.json(
      {
        success: true,
        data: test,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating lab test:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء التحليل",
      },
      { status: 500 }
    );
  }
}

