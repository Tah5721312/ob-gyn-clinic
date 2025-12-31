import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  UpdateInvoiceData,
} from "@/lib/invoices";

/**
 * GET /api/invoices/[id]
 * جلب فاتورة واحدة بالـ ID
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

    const invoice = await getInvoiceById(prisma, invoiceId);

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "الفاتورة غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: invoice,
    });
  } catch (error: any) {
    console.error("Error fetching invoice:", error);
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
 * PUT /api/invoices/[id]
 * تحديث فاتورة
 */
export async function PUT(
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

    const body: UpdateInvoiceData = await request.json();
    const invoice = await updateInvoice(prisma, invoiceId, body);

    return NextResponse.json({
      success: true,
      data: invoice,
    });
  } catch (error: any) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث الفاتورة",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/invoices/[id]
 * حذف فاتورة
 */
export async function DELETE(
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

    await deleteInvoice(prisma, invoiceId);

    return NextResponse.json({
      success: true,
      message: "تم حذف الفاتورة بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف الفاتورة",
      },
      { status: 500 }
    );
  }
}

