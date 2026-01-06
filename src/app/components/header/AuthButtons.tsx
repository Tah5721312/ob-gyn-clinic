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
    const { role, firstName, lastName } = session.user;
    const fullName = `${firstName} ${lastName}`;

    return (
      <div className="flex items-center gap-3">
        {/* معلومات المستخدم */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">
              {fullName}
            </span>
            <span className="text-xs text-gray-500">
              {role === "ADMIN" && "مدير"}
              {role === "DOCTOR" && "طبيب"}
              {role === "RECEPTIONIST" && "استقبال"}
            </span>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={20} className="text-gray-600" />
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
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
      href="/signin"
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
    >
      <LogIn size={18} />
      <span>تسجيل الدخول</span>
    </Link>
  );
}