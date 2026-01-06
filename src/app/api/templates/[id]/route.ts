import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  UpdateTemplateData,
} from "@/lib/templates";

/**
 * GET /api/templates/[id]
 * جلب قالب واحد
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const templateId = parseInt(id);

    if (isNaN(templateId)) {
      return NextResponse.json(
        { success: false, error: "معرف القالب غير صحيح" },
        { status: 400 }
      );
    }

    const template = await getTemplateById(prisma, templateId);

    if (!template) {
      return NextResponse.json(
        { success: false, error: "القالب غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error: any) {
    console.error("Error fetching template:", error);
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
 * PUT /api/templates/[id]
 * تحديث قالب
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const templateId = parseInt(id);

    if (isNaN(templateId)) {
      return NextResponse.json(
        { success: false, error: "معرف القالب غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdateTemplateData = await request.json();

    const template = await updateTemplate(prisma, templateId, body);

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error: any) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث القالب",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/templates/[id]
 * حذف قالب
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const templateId = parseInt(id);

    if (isNaN(templateId)) {
      return NextResponse.json(
        { success: false, error: "معرف القالب غير صحيح" },
        { status: 400 }
      );
    }

    await deleteTemplate(prisma, templateId);

    return NextResponse.json({
      success: true,
      message: "تم حذف القالب بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف القالب",
      },
      { status: 500 }
    );
  }
}

