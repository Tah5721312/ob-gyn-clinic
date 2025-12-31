import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const isActive = searchParams.get("isActive");
    const hasInsurance = searchParams.get("hasInsurance");
    const isPregnant = searchParams.get("isPregnant");
    const city = searchParams.get("city");

    // بناء استعلام البحث
    const where: any = {};

    // البحث في firstName, lastName, phone, nationalId
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { nationalId: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter: isActive
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    // Filter: city
    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }

    // Filter: hasInsurance
    if (hasInsurance === "true") {
      where.patientInsurance = {
        some: {
          isActive: true,
        },
      };
    }

    // Filter: isPregnant (pregnancyStatus = ACTIVE)
    if (isPregnant === "true") {
      where.pregnancyRecords = {
        some: {
          pregnancyStatus: "جارية",
        },
      };
    }

    // جلب البيانات مع العلاقات المطلوبة
    const patients = await prisma.patient.findMany({
      where,
      select: {
        id: true,
        nationalId: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        phone: true,
        city: true,
        isActive: true,
        patientInsurance: {
          where: {
            isActive: true,
          },
          select: {
            isActive: true,
          },
          take: 1,
        },
        pregnancyRecords: {
          where: {
            pregnancyStatus: "جارية",
          },
          select: {
            pregnancyStatus: true,
          },
          take: 1,
        },
      },
      orderBy: {
        registrationDate: "desc",
      },
      take: 100, // Limit to 100 results
    });

    // حساب العمر
    const patientsWithAge = patients.map((patient) => {
      const age = calculateAge(patient.birthDate);
      const hasInsurance = patient.patientInsurance.length > 0;
      const isPregnant = patient.pregnancyRecords.length > 0;

      return {
        id: patient.id,
        nationalId: patient.nationalId,
        firstName: patient.firstName,
        lastName: patient.lastName,
        fullName: `${patient.firstName} ${patient.lastName}`,
        phone: patient.phone,
        age,
        city: patient.city,
        hasInsurance,
        isPregnant,
        isActive: patient.isActive,
      };
    });

    return NextResponse.json({
      success: true,
      data: patientsWithAge,
      count: patientsWithAge.length,
    });
  } catch (error: any) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "حدث خطأ أثناء جلب البيانات",
      },
      { status: 500 }
    );
  }
}

function calculateAge(birthDate: Date): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

