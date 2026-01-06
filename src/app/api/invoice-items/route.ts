import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getInvoiceItemsList,
  getInvoiceItemsCount,
  InvoiceItemFilters,
  createInvoiceItem,
  CreateInvoiceItemData,
} from "@/lib/invoice-items";

/**
 * GET /api/invoice-items
 * جلب قائمة بنود الفواتير
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: InvoiceItemFilters = {
      invoiceId: searchParams.get("invoiceId")
        ? parseInt(searchParams.get("invoiceId")!)
        : undefined,
      itemType: searchParams.get("itemType") || undefined,
    };

    const items = await getInvoiceItemsList(prisma, filters);
    const count = await getInvoiceItemsCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: items,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching invoice items:", error);
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
 * POST /api/invoice-items
 * إضافة بند جديد للفاتورة
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateInvoiceItemData = await request.json();

    if (!body.invoiceId || !body.itemType || !body.description || !body.unitPrice) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: invoiceId, itemType, description, unitPrice",
        },
        { status: 400 }
      );
    }

    const item = await createInvoiceItem(prisma, {
      ...body,
      quantity: body.quantity || 1,
    });

    return NextResponse.json(
      {
        success: true,
        data: item,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating invoice item:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إضافة البند",
      },
      { status: 500 }
    );
  }
}

