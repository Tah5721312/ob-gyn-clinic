import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getRolesList,
  getRolesCount,
  RoleFilters,
  createRole,
  CreateRoleData,
} from "@/lib/roles";

/**
 * GET /api/roles
 * جلب قائمة الأدوار
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: RoleFilters = {
      search: searchParams.get("search") || undefined,
      isActive:
        searchParams.get("isActive") !== null && searchParams.get("isActive") !== undefined
          ? searchParams.get("isActive") === "true"
          : undefined,
    };

    const roles = await getRolesList(prisma, filters);
    const count = await getRolesCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: roles,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching roles:", error);
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
 * POST /api/roles
 * إنشاء دور جديد
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateRoleData = await request.json();

    if (!body.roleName || !body.roleCode) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: roleName, roleCode",
        },
        { status: 400 }
      );
    }

    const role = await createRole(prisma, body);

    return NextResponse.json(
      {
        success: true,
        data: role,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء الدور",
      },
      { status: 500 }
    );
  }
}

