import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPaymentById,
  updatePayment,
  deletePayment,
  UpdatePaymentData,
} from "@/lib/payments";

/**
 * GET /api/payments/[id]
 * جلب دفعة واحدة بالـ ID
 */
export async function GET(
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

    const payment = await getPaymentById(prisma, paymentId);

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    console.error("Error fetching payment:", error);
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
 * PUT /api/payments/[id]
 * تحديث دفعة
 */
export async function PUT(
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

    const body: UpdatePaymentData = await request.json();
    const payment = await updatePayment(prisma, paymentId, {
      ...body,
      paymentDate: body.paymentDate ? new Date(body.paymentDate) : undefined,
      paymentTime: body.paymentTime ? new Date(body.paymentTime) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث الدفعة",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/payments/[id]
 * حذف دفعة
 */
export async function DELETE(
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

    await deletePayment(prisma, paymentId);

    return NextResponse.json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting payment:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف الدفعة",
      },
      { status: 500 }
    );
  }
}


