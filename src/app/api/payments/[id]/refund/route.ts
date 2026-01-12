import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  refundPayment,
  RefundPaymentData,
} from "@/lib/payments";

/**
 * PATCH /api/payments/[id]/refund
 * استرجاع دفعة
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const paymentId = parseInt(id);

    if (isNaN(paymentId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment ID",
        },
        { status: 400 }
      );
    }

    const body: RefundPaymentData = await request.json();
    const payment = await refundPayment(prisma, paymentId, body);

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    console.error("Error refunding payment:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء استرجاع الدفعة",
      },
      { status: 500 }
    );
  }
}

