import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getInvoicesList,
  getInvoicesCount,
  InvoiceFilters,
  createInvoice,
  CreateInvoiceData,
} from "@/lib/invoices";

/**
 * GET /api/invoices
 * جلب قائمة الفواتير مع البحث والفلترة
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: InvoiceFilters = {
      search: searchParams.get("search") || undefined,
      patientId: searchParams.get("patientId") ? parseInt(searchParams.get("patientId")!) : undefined,
      invoiceDate: searchParams.get("invoiceDate") ? new Date(searchParams.get("invoiceDate")!) : undefined,
      paymentStatus: searchParams.get("paymentStatus") || undefined,
    };

    const invoices = await getInvoicesList(prisma, filters);
    const count = await getInvoicesCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: invoices,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
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
 * POST /api/invoices
 * إنشاء فاتورة جديدة
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateInvoiceData = await request.json();

    if (!body.invoiceNumber || !body.patientId) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: invoiceNumber, patientId",
        },
        { status: 400 }
      );
    }

    const invoice = await createInvoice(prisma, {
      ...body,
      invoiceDate: body.invoiceDate ? new Date(body.invoiceDate) : undefined,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: invoice,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء الفاتورة",
      },
      { status: 500 }
    );
  }
}

