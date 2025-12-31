import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getLabTestById,
  updateLabTest,
  deleteLabTest,
  UpdateLabTestData,
} from "@/lib/lab-tests";

/**
 * GET /api/lab-tests/[id]
 * جلب تحليل معمل واحد
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = parseInt(params.id);

    if (isNaN(testId)) {
      return NextResponse.json(
        { success: false, error: "معرف التحليل غير صحيح" },
        { status: 400 }
      );
    }

    const test = await getLabTestById(prisma, testId);

    if (!test) {
      return NextResponse.json(
        { success: false, error: "التحليل غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: test,
    });
  } catch (error: any) {
    console.error("Error fetching lab test:", error);
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
 * PUT /api/lab-tests/[id]
 * تحديث تحليل معمل
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = parseInt(params.id);

    if (isNaN(testId)) {
      return NextResponse.json(
        { success: false, error: "معرف التحليل غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdateLabTestData = await request.json();
    const test = await updateLabTest(prisma, testId, body);

    return NextResponse.json({
      success: true,
      data: test,
    });
  } catch (error: any) {
    console.error("Error updating lab test:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث التحليل",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/lab-tests/[id]
 * حذف تحليل معمل
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = parseInt(params.id);

    if (isNaN(testId)) {
      return NextResponse.json(
        { success: false, error: "معرف التحليل غير صحيح" },
        { status: 400 }
      );
    }

    await deleteLabTest(prisma, testId);

    return NextResponse.json({
      success: true,
      message: "تم حذف التحليل بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting lab test:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف التحليل",
      },
      { status: 500 }
    );
  }
}

