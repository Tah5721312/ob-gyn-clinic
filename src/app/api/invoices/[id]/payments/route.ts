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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoiceId = parseInt(id);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoiceId = parseInt(id);

    if (isNaN(invoiceId)) {
      return NextResponse.json(
        { success: false, error: "معرف الفاتورة غير صحيح" },
        { status: 400 }
      );
    }

    const body: any = await request.json();

    if (!body.amount || !body.paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: amount, paymentMethod",
        },
        { status: 400 }
      );
    }

    // توليد رقم الدفعة تلقائياً
    const paymentNumber = `PAY-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const payment = await createPayment(prisma, {
      invoiceId,
      paymentNumber,
      amount: body.amount,
      paymentMethod: body.paymentMethod,
      paymentDate: body.paymentDate ? new Date(body.paymentDate) : undefined,
      paymentTime: body.paymentTime ? new Date(body.paymentTime) : undefined,
      referenceNumber: body.referenceNumber || null,
      bankName: body.bankName || null,
      checkNumber: body.checkNumber || null,
      receivedById: body.receivedById || null,
      notes: body.notes || null,
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
