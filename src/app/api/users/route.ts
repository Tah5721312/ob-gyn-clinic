import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getUsersList,
  getUsersCount,
  UserFilters,
  createUser,
  CreateUserData,
} from "@/lib/users";

/**
 * GET /api/users
 * جلب قائمة المستخدمين مع البحث والفلترة
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: UserFilters = {
      search: searchParams.get("search") || undefined,
      role: searchParams.get("role") || undefined,
      isActive:
        searchParams.get("isActive") !== null && searchParams.get("isActive") !== undefined
          ? searchParams.get("isActive") === "true"
          : undefined,
      doctorId:
        searchParams.get("doctorId") !== null && searchParams.get("doctorId") !== undefined
          ? parseInt(searchParams.get("doctorId")!)
          : undefined,
    };

    const users = await getUsersList(prisma, filters);
    const count = await getUsersCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: users,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
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
 * POST /api/users
 * إنشاء مستخدم جديد
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateUserData = await request.json();

    // التحقق من البيانات المطلوبة
    if (!body.username || !body.passwordHash || !body.role || !body.firstName || !body.lastName || !body.phone) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: username, passwordHash, role, firstName, lastName, phone",
        },
        { status: 400 }
      );
    }

    const user = await createUser(prisma, body);

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء المستخدم",
      },
      { status: 500 }
    );
  }
}


