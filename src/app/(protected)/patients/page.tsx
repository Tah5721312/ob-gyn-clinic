import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PatientList } from "@/components/patients/PatientList";
import { prisma } from "@/lib/prisma";

export default async function PatientsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  // جلب البيانات الأولية
  const patients = await prisma.patient.findMany({
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
    take: 50, // Initial load
  });

  // حساب العمر
  const patientsWithAge = patients.map((patient) => {
    const today = new Date();
    const birth = new Date(patient.birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return {
      id: patient.id,
      nationalId: patient.nationalId,
      firstName: patient.firstName,
      lastName: patient.lastName,
      fullName: `${patient.firstName} ${patient.lastName}`,
      phone: patient.phone,
      age,
      city: patient.city,
      hasInsurance: patient.patientInsurance.length > 0,
      isPregnant: patient.pregnancyRecords.length > 0,
      isActive: patient.isActive,
    };
  });

  return (
    <main className="container mx-auto p-6">
      <PatientList initialPatients={patientsWithAge} />
    </main>
  );
}
