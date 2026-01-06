import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFavoriteTemplates, toggleTemplateFavorite } from "@/lib/templates";

/**
 * GET /api/templates/favorites
 * جلب القوالب المفضلة (Quick Actions)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const doctorId = searchParams.get("doctorId");

    if (!doctorId) {
      return NextResponse.json(
        {
          success: false,
          error: "doctorId مطلوب",
        },
        { status: 400 }
      );
    }

    const templates = await getFavoriteTemplates(prisma, parseInt(doctorId));

    console.log("Favorites query result:", {
      doctorId: parseInt(doctorId),
      count: templates.length,
      templates: templates.map((t: any) => ({
        id: t.id,
        name: t.templateName,
        type: t.templateType,
        isFavorite: t.isFavorite,
        isActive: t.isActive,
      })),
    });

    return NextResponse.json({
      success: true,
      data: templates.map((t: any) => {
        try {
          return {
            ...t,
            content: typeof t.content === 'string' ? JSON.parse(t.content) : t.content,
          };
        } catch (e) {
          console.error("Error parsing template content:", e, t);
          return {
            ...t,
            content: t.content, // إرجاع content كما هو إذا فشل parsing
          };
        }
      }),
    });
  } catch (error: any) {
    console.error("Error fetching favorite templates:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء جلب القوالب المفضلة",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/templates/favorites
 * تبديل حالة المفضلة لقالب معين
 * Body: { templateId: number }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId } = body;

    if (!templateId || isNaN(parseInt(templateId))) {
      return NextResponse.json(
        { success: false, error: "templateId مطلوب" },
        { status: 400 }
      );
    }

    const template = await toggleTemplateFavorite(prisma, parseInt(templateId));

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error: any) {
    console.error("Error toggling template favorite:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تبديل حالة المفضلة",
      },
      { status: 500 }
    );
  }
}

