"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogIn, LogOut, LayoutDashboard, Stethoscope, Users } from "lucide-react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
      </div>
    );
  }

  if (session?.user) {
    const { userType, roleName, doctorId, mustChangePassword } = session.user;

    // إذا يجب تغيير كلمة المرور
    if (mustChangePassword) {
      return (
        <Link
          href="/auth/change-password"
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
        >
          غير كلمة المرور
        </Link>
      );
    }

    return (
      <div className="flex items-center gap-3">
        {/* زرار Dashboard - للأدمن فقط */}
        {userType === "ADMIN" && (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LayoutDashboard size={18} />
            <span className="hidden sm:inline">لوحة التحكم</span>
          </Link>
        )}

        {/* زرار الزيارات - للأطباء */}
        {userType === "DOCTOR" && doctorId && (
          <Link
            href="/visits"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Stethoscope size={18} />
            <span className="hidden sm:inline">الزيارات</span>
          </Link>
        )}

        {/* زرار للموظفين حسب الدور */}
        {userType === "STAFF" && (
          <>
            {roleName === "Reception" && (
              <Link
                href="/appointments"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Users size={18} />
                <span className="hidden sm:inline">الحجوزات</span>
              </Link>
            )}
            {roleName === "Accountant" && (
              <Link
                href="/billing"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <span className="hidden sm:inline">الفواتير</span>
              </Link>
            )}
          </>
        )}

        {/* معلومات المستخدم */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">
              {session.user.name}
            </span>
            <span className="text-xs text-gray-500">
              {userType === "ADMIN" && "مدير النظام"}
              {userType === "DOCTOR" && "طبيب"}
              {userType === "STAFF" && (roleName || "موظف")}
            </span>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={20} className="text-gray-600" />
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline text-sm">خروج</span>
          </button>
        </div>
      </div>
    );
  }

  // زرار تسجيل الدخول - اختياري للزوار
  return (
    <Link
      href="/auth/signin"
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
    >
      <LogIn size={18} />
      <span>تسجيل الدخول</span>
    </Link>
  );
}