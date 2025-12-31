import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAuditLogsList,
  getAuditLogsCount,
  AuditFilters,
} from "@/lib/audit";

/**
 * GET /api/audit
 * جلب سجل التدقيق (Audit Logs)
 * ملاحظة: Audit Logs للقراءة فقط - لا يمكن إنشاء أو تعديل أو حذف
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: AuditFilters = {
      userId: searchParams.get("userId") ? parseInt(searchParams.get("userId")!) : undefined,
      actionType: searchParams.get("actionType") || undefined,
      tableName: searchParams.get("tableName") || undefined,
      recordId: searchParams.get("recordId") ? parseInt(searchParams.get("recordId")!) : undefined,
      startDate: searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined,
      endDate: searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined,
    };

    const logs = await getAuditLogsList(prisma, filters);
    const count = await getAuditLogsCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: logs,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء جلب البيانات",
      },
      { status: 500 }
    );
  }
}

