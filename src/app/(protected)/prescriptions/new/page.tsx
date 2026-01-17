import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { redirect } from "next/navigation";
import NewPrescriptionClient from "./NewPrescriptionClient";

export default async function NewPrescriptionPage() {
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
    <main className="container mx-auto p-6 max-w-4xl" dir="rtl">
      <NewPrescriptionClient />
    </main>
  );
}

