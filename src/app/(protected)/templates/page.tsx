import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { redirect } from "next/navigation";
import { TemplateList } from "@/components/templates/TemplateList";
import { prisma } from "@/lib/prisma";
import { getTemplatesList } from "@/lib/templates";

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

   // التحقق من الصلاحيات - للطبيب فقط
    if (session.user.role !== "DOCTOR") {
      redirect("/");
    }

  // جلب القوالب للدكتور الحالي
  const initialTemplates = await getTemplatesList(
    prisma,
    { doctorId: session.user.doctorId as number },
    { limit: 1000 } // زيادة الحد الأقصى
  );

  return (
    <main className="container mx-auto p-6 min-h-screen bg-gray-50">
      <TemplateList 
        initialTemplates={initialTemplates} 
        doctorId={session.user.doctorId as number}
      />
    </main>
  );
}

