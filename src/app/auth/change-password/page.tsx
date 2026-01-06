"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, AlertCircle, CheckCircle } from "lucide-react";

export default function ChangePassword() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // التحقق من تطابق كلمة المرور
    if (formData.newPassword !== formData.confirmPassword) {
      setError("كلمة المرور الجديدة غير متطابقة");
      return;
    }

    // التحقق من طول كلمة المرور
    if (formData.newPassword.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "حدث خطأ أثناء تغيير كلمة المرور");
        setLoading(false);
        return;
      }

      setSuccess(true);
      
      // تحديث الـ session
      await update({
        ...session,
        user: {
          ...session?.user,
          mustChangePassword: false,
        },
      });

      // التوجيه بعد 2 ثانية
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      setError("حدث خطأ أثناء تغيير كلمة المرور");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              تغيير كلمة المرور
            </h2>
            <p className="text-gray-600 mt-2">يجب تغيير كلمة المرور قبل المتابعة</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-green-800 text-sm">تم تغيير كلمة المرور بنجاح! جاري التحويل...</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور الحالية
              </label>
              <input
                id="currentPassword"
                type="password"
                required
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور الجديدة
              </label>
              <input
                id="newPassword"
                type="password"
                required
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                يجب أن تكون 8 أحرف على الأقل
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور الجديدة
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "جاري التغيير..." : "تغيير كلمة المرور"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}