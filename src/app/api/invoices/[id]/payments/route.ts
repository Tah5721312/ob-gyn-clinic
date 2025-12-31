import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPayment, CreatePaymentData } from "@/lib/invoices";

/**
 * POST /api/invoices/[id]/payments
 * إضافة دفعة للفاتورة
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = parseInt(params.id);

    if (isNaN(invoiceId)) {
      return NextResponse.json(
        { success: false, error: "معرف الفاتورة غير صحيح" },
        { status: 400 }
      );
    }

    const body: CreatePaymentData = await request.json();

    if (!body.paymentAmount || !body.paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: paymentAmount, paymentMethod",
        },
        { status: 400 }
      );
    }

    const payment = await createPayment(prisma, {
      ...body,
      invoiceId,
      paymentDate: body.paymentDate ? new Date(body.paymentDate) : undefined,
      checkDate: body.checkDate ? new Date(body.checkDate) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: payment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إضافة الدفعة",
      },
      { status: 500 }
    );
  }
}

