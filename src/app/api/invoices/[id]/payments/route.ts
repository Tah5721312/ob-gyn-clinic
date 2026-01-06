import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createPayment,
  getPaymentsByInvoiceId,
  CreatePaymentData,
} from "@/lib/payments";

/**
 * GET /api/invoices/[id]/payments
 * جلب جميع الدفعات الخاصة بفاتورة
 */
export async function GET(
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

    const payments = await getPaymentsByInvoiceId(prisma, invoiceId);

    return NextResponse.json({
      success: true,
      data: payments,
    });
  } catch (error: any) {
    console.error("Error fetching payments:", error);
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

    if (!body.paymentNumber || !body.amount || !body.paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: paymentNumber, amount, paymentMethod",
        },
        { status: 400 }
      );
    }

    const payment = await createPayment(prisma, {
      ...body,
      invoiceId,
      paymentDate: body.paymentDate ? new Date(body.paymentDate) : undefined,
      paymentTime: body.paymentTime ? new Date(body.paymentTime) : undefined,
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
