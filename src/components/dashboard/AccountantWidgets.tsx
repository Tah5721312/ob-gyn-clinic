"use client";

import { Session } from "next-auth";
import { DollarSign, FileText, CreditCard, TrendingUp } from "lucide-react";

interface AccountantWidgetsProps {
  session: Session;
}

export function AccountantWidgets({ session }: AccountantWidgetsProps) {
  return (
    <div className="space-y-6">
      {/* Revenue Today */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            الإيرادات اليوم
          </h2>
        </div>
        <div className="text-3xl font-bold text-green-600">0.00 ج.م</div>
      </div>

      {/* Unpaid Invoices */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-600" />
            الفواتير غير المدفوعة
          </h2>
        </div>
        <div className="space-y-3">
          {/* Placeholder for unpaid invoices */}
          <div className="text-gray-500 text-sm">لا توجد فواتير غير مدفوعة</div>
        </div>
      </div>

      {/* Today Payments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            المدفوعات اليوم
          </h2>
        </div>
        <div className="space-y-3">
          {/* Placeholder for today payments */}
          <div className="text-gray-500 text-sm">لا توجد مدفوعات اليوم</div>
        </div>
      </div>

      {/* Insurance Claims */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            مطالبات التأمين
          </h2>
        </div>
        <div className="space-y-3">
          {/* Placeholder for insurance claims */}
          <div className="text-gray-500 text-sm">لا توجد مطالبات تأمين</div>
        </div>
      </div>

      {/* Quick Pay Button */}
      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors">
          <DollarSign className="w-5 h-5" />
          دفع سريع
        </button>
      </div>
    </div>
  );
}

