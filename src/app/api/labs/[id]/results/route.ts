import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addLabResult, CreateLabResultData } from "@/lib/labs";

/**
 * POST /api/labs/[id]/results
 * إضافة نتيجة تحليل
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: "معرف طلب التحليل غير صحيح" },
        { status: 400 }
      );
    }

    const body: CreateLabResultData = await request.json();

    if (!body.testId) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: testId",
        },
        { status: 400 }
      );
    }

    const result = await addLabResult(prisma, {
      ...body,
      orderId,
      resultDate: body.resultDate ? new Date(body.resultDate) : undefined,
      resultTime: body.resultTime ? new Date(body.resultTime) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding lab result:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إضافة نتيجة التحليل",
      },
      { status: 500 }
    );
  }
}

