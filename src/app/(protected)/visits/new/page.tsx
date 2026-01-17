import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { redirect } from "next/navigation";
import NewVisitClient from "./NewVisitClient";

export default async function NewVisitPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  // التحقق من الصلاحيات - للأطباء فقط
  if (session.user.role !== "DOCTOR") {
    redirect("/");
  }

  return (
    <main className="container mx-auto p-6 max-w-3xl" dir="rtl">
      <NewVisitClient />
    </main>
  );
}
