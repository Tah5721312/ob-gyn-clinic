import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  assignPermissionToRole,
  removePermissionFromRole,
  AssignPermissionData,
} from "@/lib/roles";

/**
 * POST /api/roles/[id]/permissions
 * إضافة صلاحية لدور
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roleId = parseInt(params.id);

    if (isNaN(roleId)) {
      return NextResponse.json(
        { success: false, error: "معرف الدور غير صحيح" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { permissionId, grantedBy } = body;

    if (!permissionId) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: permissionId",
        },
        { status: 400 }
      );
    }

    const rolePermission = await assignPermissionToRole(prisma, {
      roleId,
      permissionId,
      grantedBy,
    });

    return NextResponse.json(
      {
        success: true,
        data: rolePermission,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error assigning permission:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إضافة الصلاحية",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/roles/[id]/permissions?permissionId=xxx
 * إزالة صلاحية من دور
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roleId = parseInt(params.id);

    if (isNaN(roleId)) {
      return NextResponse.json(
        { success: false, error: "معرف الدور غير صحيح" },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const permissionId = searchParams.get("permissionId");

    if (!permissionId) {
      return NextResponse.json(
        {
          success: false,
          error: "permissionId مطلوب",
        },
        { status: 400 }
      );
    }

    await removePermissionFromRole(prisma, roleId, parseInt(permissionId));

    return NextResponse.json({
      success: true,
      message: "تم إزالة الصلاحية بنجاح",
    });
  } catch (error: any) {
    console.error("Error removing permission:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إزالة الصلاحية",
      },
      { status: 500 }
    );
  }
}

