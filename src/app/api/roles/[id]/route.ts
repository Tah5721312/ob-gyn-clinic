import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getRoleById,
  updateRole,
  deleteRole,
  UpdateRoleData,
} from "@/lib/roles";

/**
 * GET /api/roles/[id]
 * جلب دور واحد
 */
export async function GET(
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

    const role = await getRoleById(prisma, roleId);

    if (!role) {
      return NextResponse.json(
        { success: false, error: "الدور غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: role,
    });
  } catch (error: any) {
    console.error("Error fetching role:", error);
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
 * PUT /api/roles/[id]
 * تحديث دور
 */
export async function PUT(
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

    const body: UpdateRoleData = await request.json();
    const role = await updateRole(prisma, roleId, body);

    return NextResponse.json({
      success: true,
      data: role,
    });
  } catch (error: any) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث الدور",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/roles/[id]
 * حذف دور
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

    await deleteRole(prisma, roleId);

    return NextResponse.json({
      success: true,
      message: "تم حذف الدور بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف الدور",
      },
      { status: 500 }
    );
  }
}

