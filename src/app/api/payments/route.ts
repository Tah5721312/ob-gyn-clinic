import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPaymentsList,
  getPaymentsCount,
  PaymentFilters,
  createPayment,
  CreatePaymentData,
} from "@/lib/payments";

/**
 * GET /api/payments
 * جلب قائمة الدفعات مع البحث والفلترة
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: PaymentFilters = {
      invoiceId:
        searchParams.get("invoiceId") !== null && searchParams.get("invoiceId") !== undefined
          ? parseInt(searchParams.get("invoiceId")!)
          : undefined,
      paymentDate:
        searchParams.get("paymentDate") !== null && searchParams.get("paymentDate") !== undefined
          ? new Date(searchParams.get("paymentDate")!)
          : undefined,
      paymentMethod: searchParams.get("paymentMethod") || undefined,
      receivedById:
        searchParams.get("receivedById") !== null && searchParams.get("receivedById") !== undefined
          ? parseInt(searchParams.get("receivedById")!)
          : undefined,
      isRefunded:
        searchParams.get("isRefunded") !== null && searchParams.get("isRefunded") !== undefined
          ? searchParams.get("isRefunded") === "true"
          : undefined,
    };

    const payments = await getPaymentsList(prisma, filters);
    const count = await getPaymentsCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: payments,
      count,
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
 * POST /api/payments
 * إنشاء دفعة جديدة
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreatePaymentData = await request.json();

    // التحقق من البيانات المطلوبة
    if (!body.invoiceId || !body.paymentNumber || !body.amount || !body.paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: invoiceId, paymentNumber, amount, paymentMethod",
        },
        { status: 400 }
      );
    }

    const payment = await createPayment(prisma, {
      ...body,
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
        error: error.message || "حدث خطأ أثناء إنشاء الدفعة",
      },
      { status: 500 }
    );
  }
}


