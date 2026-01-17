import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getVisitById } from "@/lib/visits";
import { VisitDetail } from "@/components/visits/VisitDetail";

export default async function VisitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  const { id } = await params;
  const visitId = parseInt(id);

  if (isNaN(visitId)) {
    return (
      <main className="container mx-auto p-6 max-w-4xl" dir="rtl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">معرّف الزيارة غير صحيح</h1>
          <p className="text-gray-600 mb-6">معرّف الزيارة يجب أن يكون رقماً صحيحاً</p>
          <a href="/visits" className="text-blue-600 hover:text-blue-700 font-semibold">
            العودة إلى الزيارات
          </a>
        </div>
      </main>
    );
  }

  const visit = await getVisitById(prisma, visitId);

  if (!visit) {
    return (
      <main className="container mx-auto p-6 max-w-4xl" dir="rtl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">الزيارة غير موجودة</h1>
          <p className="text-gray-600 mb-6">رقم الزيارة المطلوب ({visitId}) غير موجود في النظام</p>
          <a href="/visits" className="text-blue-600 hover:text-blue-700 font-semibold">
            العودة إلى الزيارات
          </a>
        </div>
      </main>
    );
  }

  // تحويل Decimal objects إلى أرقام عادية للتمرير إلى Client Component
  const visitData = {
    ...visit,
    weight: visit.weight ? Number(visit.weight) : null,
    temperature: visit.temperature ? Number(visit.temperature) : null,
    patient: {
      ...visit.patient,
      birthDate: visit.patient.birthDate,
    },
  };

  return (
    <main className="container mx-auto p-6 max-w-4xl" dir="rtl">
      <VisitDetail visit={visitData} />
    </main>
  );
}

