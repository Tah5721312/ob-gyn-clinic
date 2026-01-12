import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { redirect } from "next/navigation";
import { InvoiceList } from "@/components/billing/InvoiceList";
import { prisma } from "@/lib/prisma";
import { getInvoicesList } from "@/lib/invoices";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  // جلب الفواتير - آخر 50 فاتورة
  const initialInvoices = await getInvoicesList(prisma, {}, { limit: 50 });

  return (
    <>
      <main className="container mx-auto p-6 min-h-screen bg-gray-50">
        <InvoiceList initialInvoices={initialInvoices} />
      </main>
    </>
  );
}
