import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getStaffById,
  updateStaff,
  deleteStaff,
  UpdateStaffData,
} from "@/lib/staff";

/**
 * GET /api/staff/[id]
 * جلب موظف واحد
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const staffId = parseInt(params.id);

    if (isNaN(staffId)) {
      return NextResponse.json(
        { success: false, error: "معرف الموظف غير صحيح" },
        { status: 400 }
      );
    }

    const staff = await getStaffById(prisma, staffId);

    if (!staff) {
      return NextResponse.json(
        { success: false, error: "الموظف غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: staff,
    });
  } catch (error: any) {
    console.error("Error fetching staff:", error);
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
 * PUT /api/staff/[id]
 * تحديث موظف
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const staffId = parseInt(params.id);

    if (isNaN(staffId)) {
      return NextResponse.json(
        { success: false, error: "معرف الموظف غير صحيح" },
        { status: 400 }
      );
    }

    const body: UpdateStaffData = await request.json();

    const staff = await updateStaff(prisma, staffId, {
      ...body,
      terminationDate: body.terminationDate ? new Date(body.terminationDate) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: staff,
    });
  } catch (error: any) {
    console.error("Error updating staff:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث الموظف",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/staff/[id]
 * حذف موظف
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const staffId = parseInt(params.id);

    if (isNaN(staffId)) {
      return NextResponse.json(
        { success: false, error: "معرف الموظف غير صحيح" },
        { status: 400 }
      );
    }

    await deleteStaff(prisma, staffId);

    return NextResponse.json({
      success: true,
      message: "تم حذف الموظف بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting staff:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف الموظف",
      },
      { status: 500 }
    );
  }
}

