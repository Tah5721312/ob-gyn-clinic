import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getTemplatesList,
  getTemplatesCount,
  TemplateFilters,
  createTemplate,
  CreateTemplateData,
} from "@/lib/templates";

/**
 * GET /api/templates
 * جلب قائمة القوالب
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: TemplateFilters = {
      doctorId: searchParams.get("doctorId") ? parseInt(searchParams.get("doctorId")!) : undefined,
      templateType: searchParams.get("templateType") || undefined,
      search: searchParams.get("search") || undefined,
      isActive: searchParams.get("isActive") === "true" ? true : searchParams.get("isActive") === "false" ? false : undefined,
    };

    const templates = await getTemplatesList(prisma, filters);
    const count = await getTemplatesCount(prisma, filters);

    console.log("Templates query:", {
      filters,
      templatesCount: templates.length,
      totalCount: count,
      doctorId: filters.doctorId,
      templates: templates.map((t: any) => ({
        id: t.id,
        name: t.templateName,
        type: t.templateType,
        isActive: t.isActive,
        isFavorite: t.isFavorite,
      })),
    });

    return NextResponse.json({
      success: true,
      data: templates,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching templates:", error);
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
 * POST /api/templates
 * إنشاء قالب جديد
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateTemplateData = await request.json();

    if (!body.doctorId || !body.templateType || !body.templateName || !body.content) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: doctorId, templateType, templateName, content",
        },
        { status: 400 }
      );
    }

    const template = await createTemplate(prisma, body);

    return NextResponse.json(
      {
        success: true,
        data: template,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء القالب",
      },
      { status: 500 }
    );
  }
}

