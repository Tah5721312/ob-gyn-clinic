import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { redirect } from "next/navigation";
import PaymentsClient from "./PaymentsClient";

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  // التحقق من الصلاحيات - للادمن فقط
  // if (session.user.role !== "ADMIN" && session.user.role !== "RECEPTIONIST") {
  if (session.user.role !== "ADMIN" ) {
    redirect("/");
  }
 

  return (
    <main className="container mx-auto p-6 min-h-screen bg-gray-50" dir="rtl">
      <PaymentsClient />
    </main>
  );
}
