import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { DoctorWidgets } from "@/components/dashboard/DoctorWidgets";
import { ReceptionWidgets } from "@/components/dashboard/ReceptionWidgets";
import { AdminWidgets } from "@/components/dashboard/AdminWidgets";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  const userRole = session.user.role as string;
  const userName = session.user.firstName || session.user.name || "المستخدم";

  return (
    <>
      <main className="container mx-auto p-6 min-h-screen bg-gray-50">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-600 mt-2 text-lg">
            مرحباً، {userName}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Doctor Dashboard */}
          {userRole?.toUpperCase() === "DOCTOR" && (
            <DoctorWidgets session={session} />
          )}

          {/* Reception Dashboard */}
          {userRole?.toUpperCase() === "RECEPTIONIST" && (
            <ReceptionWidgets session={session} />
          )}

          {/* Admin Dashboard */}
          {userRole?.toUpperCase() === "ADMIN" && (
            <AdminWidgets session={session} />
          )}

          {/* Default Message if role not recognized */}
          {!["DOCTOR", "RECEPTIONIST", "ADMIN"].includes(
            userRole?.toUpperCase() || ""
          ) && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg">
                دورك في النظام ({userRole}) لم يتم التعرف عليه بعد.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                يرجى الاتصال بمسؤول النظام.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
