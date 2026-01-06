import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getUserById,
  updateUser,
  deleteUser,
  UpdateUserData,
} from "@/lib/users";

/**
 * GET /api/users/[id]
 * جلب مستخدم واحد بالـ ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    const user = await getUserById(prisma, userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error("Error fetching user:", error);
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
 * PUT /api/users/[id]
 * تحديث مستخدم
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    const body: UpdateUserData = await request.json();
    const user = await updateUser(prisma, userId, body);

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء تحديث المستخدم",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]
 * حذف مستخدم
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    await deleteUser(prisma, userId);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء حذف المستخدم",
      },
      { status: 500 }
    );
  }
}


