import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { redirect } from "next/navigation";
import PatientDetailClient from "./PatientDetailClient";

export default async function PatientDetailPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  // التحقق من الصلاحيات - للإدارة والاستقبال والأطباء
  const allowedRoles = ["ADMIN", "RECEPTIONIST", "DOCTOR"];
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/");
  }

  return (
    <main className="container mx-auto p-4 md:p-6 max-w-7xl bg-gray-50 min-h-screen" dir="rtl">
      <PatientDetailClient />
    </main>
  );
}
