import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getInvoiceItemById,
  updateInvoiceItem,
  deleteInvoiceItem,
  UpdateInvoiceItemData,
} from "@/lib/invoice-items";

/**
 * GET /api/invoice-items/[id]
 * جلب بند فاتورة واحد
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const itemId = parseInt(params.id);

    if (isNaN(itemId)) {
      return NextResponse.json(
        { success: false, error: "معرف البند غير صحيح" },
        { status: 400 }
      );
    }

    const item = await getInvoiceItemById(prisma, itemId);

    if (!item) {
      return NextResponse.json(
        { success: false, error: "البند غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    console.error("Error fetching invoice item:", error);
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
 * PUT /api/invoice-items/[id]
 * تحديث بند فاتورة
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const itemId = parseInt(params.id);

    if (isNaN(itemId)) {
      return NextResponse.json(
        { success: false, error: "معرف البند غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdateInvoiceItemData = await request.json();

    const item = await updateInvoiceItem(prisma, itemId, body);

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    console.error("Error updating invoice item:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث البند",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/invoice-items/[id]
 * حذف بند فاتورة
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const itemId = parseInt(params.id);

    if (isNaN(itemId)) {
      return NextResponse.json(
        { success: false, error: "معرف البند غير صحيح" },
        { status: 400 }
      );
    }

    await deleteInvoiceItem(prisma, itemId);

    return NextResponse.json({
      success: true,
      message: "تم حذف البند بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting invoice item:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف البند",
      },
      { status: 500 }
    );
  }
}

