import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getStaffList,
  getStaffCount,
  StaffFilters,
  createStaff,
  CreateStaffData,
} from "@/lib/staff";

/**
 * GET /api/staff
 * جلب قائمة الموظفين
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: StaffFilters = {
      search: searchParams.get("search") || undefined,
      position: searchParams.get("position") || undefined,
      department: searchParams.get("department") || undefined,
      isActive:
        searchParams.get("isActive") !== null && searchParams.get("isActive") !== undefined
          ? searchParams.get("isActive") === "true"
          : undefined,
    };

    const staff = await getStaffList(prisma, filters);
    const count = await getStaffCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: staff,
      count,
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
 * POST /api/staff
 * إنشاء موظف جديد
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateStaffData = await request.json();

    if (
      !body.employeeNumber ||
      !body.nationalId ||
      !body.firstName ||
      !body.lastName ||
      !body.position ||
      !body.phone ||
      !body.hireDate ||
      !body.employmentType
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "البيانات المطلوبة: employeeNumber, nationalId, firstName, lastName, position, phone, hireDate, employmentType",
        },
        { status: 400 }
      );
    }

    const staff = await createStaff(prisma, {
      ...body,
      hireDate: new Date(body.hireDate),
      terminationDate: body.terminationDate ? new Date(body.terminationDate) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: staff,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating staff:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء الموظف",
      },
      { status: 500 }
    );
  }
}

