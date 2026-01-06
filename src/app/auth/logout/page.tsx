"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut, CheckCircle } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const handleLogout = async () => {
      setIsLoggingOut(true);

      try {
        // عرض رسالة النجاح قبل تسجيل الخروج
        setIsComplete(true);

        // الانتظار قليلاً قبل تسجيل الخروج
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // تسجيل الخروج من NextAuth
        await signOut({
          callbackUrl: "/signin",
          redirect: true,
        });
      } catch (error) {
        console.error("Error during logout:", error);
        // في حالة الخطأ، عيد التوجيه يدويًا
        router.push("/signin");
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo/Icon */}
          <div className="text-center mb-8">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
              isComplete
                ? "bg-green-100"
                : "bg-blue-600"
            }`}>
              {isComplete ? (
                <CheckCircle className="text-green-600" size={40} />
              ) : (
                <LogOut className={`${isComplete ? "text-green-600" : "text-white"}`} size={32} />
              )}
            </div>

            {isComplete ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  تم تسجيل الخروج بنجاح
                </h2>
                <p className="text-gray-600">
                  شكراً لاستخدامك نظام عيادة نساء وولادة
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  جاري تسجيل الخروج...
                </h2>
                <p className="text-gray-600">
                  يرجى الانتظار قليلاً
                </p>
              </>
            )}
          </div>

          {/* Loading State or Success Message */}
          <div className="space-y-4">
            {!isComplete && (
              <div className="flex items-center justify-center">
                <div className="relative w-12 h-12">
                  <svg className="animate-spin w-12 h-12" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              </div>
            )}

            {isComplete && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-center text-sm">
                  جاري التوجيه إلى صفحة تسجيل الدخول...
                </p>
              </div>
            )}
          </div>

          {/* Info Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm text-center">
              {isLoggingOut || isComplete
                ? "للدخول مرة أخرى، استخدم بيانات الدخول الخاصة بك"
                : "يتم تسجيل خروجك من النظام بشكل آمن"}
            </p>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>نظام إدارة عيادة النساء والولادة</p>
        </div>
      </div>
    </div>
  );
}
