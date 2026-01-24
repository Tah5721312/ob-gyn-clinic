import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPrescriptionsList,
  getPrescriptionsCount,
  PrescriptionFilters,
  createPrescription,
  CreatePrescriptionData,
} from "@/lib/prescriptions";

/**
 * GET /api/prescriptions
 * جلب قائمة الروشتات
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: PrescriptionFilters = {
      visitId: searchParams.get("visitId") ? parseInt(searchParams.get("visitId")!) : undefined,
      followupId: searchParams.get("followupId") ? parseInt(searchParams.get("followupId")!) : undefined,
      patientId: searchParams.get("patientId") ? parseInt(searchParams.get("patientId")!) : undefined,
    };

    const prescriptions = await getPrescriptionsList(prisma, filters);
    const count = await getPrescriptionsCount(prisma, filters);

    return NextResponse.json({
      success: true,
      data: prescriptions,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching prescriptions:", error);
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
 * POST /api/prescriptions
 * إنشاء روشتة جديدة
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreatePrescriptionData = await request.json();

    // السماح بروشتة بدون أدوية إذا كانت هناك ملاحظات (مثل الروشتات المكتوبة في الزيارة)
    if ((!body.items || body.items.length === 0) && !body.notes) {
      return NextResponse.json(
        {
          success: false,
          error: "يجب إضافة على الأقل دواء واحد أو ملاحظات",
        },
        { status: 400 }
      );
    }

    // السماح بروشتة مستقلة (بدون visitId أو followupId)
    // if (!body.visitId && !body.followupId) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: "يجب تحديد visitId أو followupId",
    //     },
    //     { status: 400 }
    //   );
    // }

    const prescription = await createPrescription(prisma, body);

    return NextResponse.json(
      {
        success: true,
        data: prescription,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating prescription:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء إنشاء الروشتة",
      },
      { status: 500 }
    );
  }
}

