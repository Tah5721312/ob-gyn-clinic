import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { prisma } from "@/lib/prisma";
import { getAppointmentsList } from "@/lib/appointments";

export default async function AppointmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  // جلب المواعيد - اليوم فقط
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const filters: any = {
    appointmentDate: today,
  };

  // إذا كان دكتور، فقط مواعيده
  if (session.user.role === "DOCTOR" && session.user.doctorId) {
    filters.doctorId = session.user.doctorId;
  }

  const initialAppointments = await getAppointmentsList(prisma, filters, { limit: 100 });

  return (
    <>

      <main className="container mx-auto p-6 min-h-screen bg-gray-50">
        <AppointmentList initialAppointments={initialAppointments} />
      </main>
    </>
  );
}
