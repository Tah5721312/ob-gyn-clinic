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
 * جلب قائمة الروشتات مع البحث والفلترة
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: PrescriptionFilters = {
      search: searchParams.get("search") || undefined,
      patientId: searchParams.get("patientId") ? parseInt(searchParams.get("patientId")!) : undefined,
      doctorId: searchParams.get("doctorId") ? parseInt(searchParams.get("doctorId")!) : undefined,
      prescriptionDate: searchParams.get("prescriptionDate") ? new Date(searchParams.get("prescriptionDate")!) : undefined,
      isChronicMedication:
        searchParams.get("isChronicMedication") !== null && searchParams.get("isChronicMedication") !== undefined
          ? searchParams.get("isChronicMedication") === "true"
          : undefined,
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

    if (!body.visitId || !body.patientId || !body.doctorId) {
      return NextResponse.json(
        {
          success: false,
          error: "البيانات المطلوبة: visitId, patientId, doctorId",
        },
        { status: 400 }
      );
    }

    const prescription = await createPrescription(prisma, {
      ...body,
      prescriptionDate: body.prescriptionDate ? new Date(body.prescriptionDate) : undefined,
      validUntil: body.validUntil ? new Date(body.validUntil) : undefined,
    });

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

