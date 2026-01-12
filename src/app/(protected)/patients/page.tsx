import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PatientList } from "@/components/patients/PatientList";
import { prisma } from "@/lib/prisma";
import { getPatientsList } from "@/lib/patients";

export default async function PatientsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  // جلب البيانات الأولية
  const initialPatients = await getPatientsList(prisma, {}, { limit: 50 });

  return (
    <>
      <main className="container mx-auto p-6 min-h-screen bg-gray-50" dir="rtl">
        <PatientList initialPatients={initialPatients} />
      </main>
    </>
  );
}
