import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { ScheduleList } from "@/components/schedules/ScheduleList";
import { prisma } from "@/lib/prisma";
import { getWorkingSchedulesList } from "@/lib/working-schedules";

export default async function SchedulesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  // التحقق من الصلاحيات - للطبيب والادمن فقط
  if (session.user.role !== "DOCTOR" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  // جلب الجداول الزمنية
  const filters: any = {};
  
  // إذا كان دكتور، فقط جداوله
  if (session.user.role === "DOCTOR" && session.user.doctorId) {
    filters.doctorId = session.user.doctorId;
  }

  const initialSchedules = await getWorkingSchedulesList(prisma, filters, { limit: 100 });

  return (
    <main className="container mx-auto p-6 min-h-screen bg-gray-50" dir="rtl">
      <ScheduleList 
        initialSchedules={initialSchedules}
        userRole={session.user.role}
        doctorId={session.user.doctorId as number | undefined}
      />
    </main>
  );
}

