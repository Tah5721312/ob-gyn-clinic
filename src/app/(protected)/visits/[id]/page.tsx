import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getVisitById } from "@/lib/visits";
import { VisitDetail } from "@/components/visits/VisitDetail";

export default async function VisitDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  const visitId = parseInt(params.id);

  if (isNaN(visitId)) {
    redirect("/visits/new");
  }

  const visit = await getVisitById(prisma, visitId);

  if (!visit) {
    redirect("/visits/new");
  }

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <VisitDetail visit={visit} />
    </main>
  );
}

