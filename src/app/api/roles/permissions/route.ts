import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPermissionsList,
  getPermissionsCount,
  PermissionFilters,
  createPermission,
  CreatePermissionData,
} from "@/lib/roles";

/**
 * GET /api/roles/permissions
 * جلب قائمة الصلاحيات
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: PermissionFilters = {
      search: searchParams.get("search") || undefined,
      module: searchParams.get("module") || undefined,
      isActive:
        searchParams.get("isActive") !== null && searchParams.get("isActive") !== undefined
          ? searchParams.get("isActive") === "true"
          : undefined,
    };

    const permissions = await getPermissionsList(prisma, filters);
    const count = await getPermissionsCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: permissions,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching permissions:", error);
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
 * POST /api/roles/permissions
 * إنشاء صلاحية جديدة
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreatePermissionData = await request.json();

    if (!body.permissionName || !body.permissionCode) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: permissionName, permissionCode",
        },
        { status: 400 }
      );
    }

    const permission = await createPermission(prisma, body);

    return NextResponse.json(
      {
        success: true,
        data: permission,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating permission:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء الصلاحية",
      },
      { status: 500 }
    );
  }
}

