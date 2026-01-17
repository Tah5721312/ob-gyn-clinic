import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { redirect } from "next/navigation";
import VisitsClient from "./VisitsClient";

export default async function VisitsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  // التحقق من الصلاحيات - للأطباء والإدمن والاستقبال
  const allowedRoles = ["DOCTOR", "ADMIN", "RECEPTIONIST"];
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/");
  }

  return (
    <main className="container mx-auto p-6 max-w-7xl" dir="rtl">
      <VisitsClient />
    </main>
  );
}
