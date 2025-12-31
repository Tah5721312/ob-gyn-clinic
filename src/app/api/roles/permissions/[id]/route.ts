import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPermissionById,
  updatePermission,
  deletePermission,
  UpdatePermissionData,
} from "@/lib/roles";

/**
 * GET /api/roles/permissions/[id]
 * جلب صلاحية واحدة
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const permissionId = parseInt(params.id);

    if (isNaN(permissionId)) {
      return NextResponse.json(
        { success: false, error: "معرف الصلاحية غير صحيح" },
        { status: 400 }
      );
    }

    const permission = await getPermissionById(prisma, permissionId);

    if (!permission) {
      return NextResponse.json(
        { success: false, error: "الصلاحية غير موجودة" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: permission,
    });
  } catch (error: any) {
    console.error("Error fetching permission:", error);
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
 * PUT /api/roles/permissions/[id]
 * تحديث صلاحية
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const permissionId = parseInt(params.id);

    if (isNaN(permissionId)) {
      return NextResponse.json(
        { success: false, error: "معرف الصلاحية غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdatePermissionData = await request.json();
    const permission = await updatePermission(prisma, permissionId, body);

    return NextResponse.json({
      success: true,
      data: permission,
    });
  } catch (error: any) {
    console.error("Error updating permission:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث الصلاحية",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/roles/permissions/[id]
 * حذف صلاحية
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const permissionId = parseInt(params.id);

    if (isNaN(permissionId)) {
      return NextResponse.json(
        { success: false, error: "معرف الصلاحية غير صحيح" },
        { status: 400 }
      );
    }

    await deletePermission(prisma, permissionId);

    return NextResponse.json({
      success: true,
      message: "تم حذف الصلاحية بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting permission:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف الصلاحية",
      },
      { status: 500 }
    );
  }
}

