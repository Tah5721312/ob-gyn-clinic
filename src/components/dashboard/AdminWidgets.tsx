"use client";

import { Session } from "next-auth";
import { BarChart3, Users, Shield, FileText } from "lucide-react";

interface AdminWidgetsProps {
  session: Session;
}

export function AdminWidgets({ session }: AdminWidgetsProps) {
  return (
    <div className="space-y-6">
      {/* System Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            إحصائيات النظام
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">إجمالي المستخدمين</div>
            <div className="text-2xl font-bold text-blue-600">0</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">المرضى النشطين</div>
            <div className="text-2xl font-bold text-green-600">0</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">المواعيد اليوم</div>
            <div className="text-2xl font-bold text-purple-600">0</div>
          </div>
        </div>
      </div>

      {/* Users */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            المستخدمون
          </h2>
        </div>
        <div className="space-y-3">
          {/* Placeholder for users list */}
          <div className="text-gray-500 text-sm">لا يوجد مستخدمون</div>
        </div>
      </div>

      {/* Roles & Permissions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            الأدوار والصلاحيات
          </h2>
        </div>
        <div className="space-y-3">
          {/* Placeholder for roles and permissions */}
          <div className="text-gray-500 text-sm">لا توجد أدوار</div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            سجل التدقيق
          </h2>
        </div>
        <div className="space-y-3">
          {/* Placeholder for audit logs */}
          <div className="text-gray-500 text-sm">لا توجد سجلات تدقيق</div>
        </div>
      </div>
    </div>
  );
}

