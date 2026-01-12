import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { UserList } from "@/components/users/UserList";
import { prisma } from "@/lib/prisma";
import { getUsersList } from "@/lib/users";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  // التحقق من الصلاحيات - للادمن فقط
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  // جلب المستخدمين
  const initialUsers = await getUsersList(prisma, {}, { limit: 100 });

  return (
    <main className="container mx-auto p-6 min-h-screen bg-gray-50" dir="rtl">
      <UserList initialUsers={initialUsers} />
    </main>
  );
}

