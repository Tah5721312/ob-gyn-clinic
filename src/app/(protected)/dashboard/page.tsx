import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { DoctorWidgets } from "@/components/dashboard/DoctorWidgets";
import { ReceptionWidgets } from "@/components/dashboard/ReceptionWidgets";
import { AccountantWidgets } from "@/components/dashboard/AccountantWidgets";
import { AdminWidgets } from "@/components/dashboard/AdminWidgets";
import { NurseWidgets } from "@/components/dashboard/NurseWidgets";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  const { userType, roleName } = session.user;

  return (
    <main className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-600 mt-2">
          مرحباً، {session.user.name}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Doctor Dashboard */}
        {userType === "DOCTOR" && <DoctorWidgets session={session} />}

        {/* Reception Dashboard */}
        {userType === "STAFF" && roleName === "RECEPTION" && (
          <ReceptionWidgets session={session} />
        )}

        {/* Nurse Dashboard */}
        {userType === "STAFF" && roleName === "NURSE" && (
          <NurseWidgets session={session} />
        )}

        {/* Accountant Dashboard */}
        {userType === "STAFF" && roleName === "ACCOUNTANT" && (
          <AccountantWidgets session={session} />
        )}

        {/* Admin Dashboard */}
        {userType === "ADMIN" && <AdminWidgets session={session} />}
      </div>
    </main>
  );
}
