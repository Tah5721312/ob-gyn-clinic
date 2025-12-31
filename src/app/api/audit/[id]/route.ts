import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuditLogById } from "@/lib/audit";

/**
 * GET /api/audit/[id]
 * جلب سجل تدقيق واحد
 * ملاحظة: Audit Logs للقراءة فقط
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const logId = parseInt(params.id);

    if (isNaN(logId)) {
      return NextResponse.json(
        { success: false, error: "معرف السجل غير صحيح" },
        { status: 400 }
      );
    }

    const log = await getAuditLogById(prisma, logId);

    if (!log) {
      return NextResponse.json(
        { success: false, error: "السجل غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: log,
    });
  } catch (error: any) {
    console.error("Error fetching audit log:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء جلب البيانات",
      },
      { status: 500 }
    );
  }
}

