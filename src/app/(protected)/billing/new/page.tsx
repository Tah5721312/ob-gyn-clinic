import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { redirect } from "next/navigation";
import InvoiceNew from "@/components/billing/InvoiceNew";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "RECEPTIONIST") {
    redirect("/");
  }

  return (
    <>
      <main className="container mx-auto p-6 min-h-screen bg-gray-50">
        <InvoiceNew />
      </main>
    </>
  );
}
