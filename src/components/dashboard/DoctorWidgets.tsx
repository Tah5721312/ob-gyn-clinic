"use client";

import { Session } from "next-auth";
import { Calendar, Users, Baby, AlertTriangle, Plus } from "lucide-react";

interface DoctorWidgetsProps {
  session: Session;
}

export function DoctorWidgets({ session }: DoctorWidgetsProps) {
  return (
    <div className="space-y-6">
      {/* Today Appointments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            مواعيد اليوم
          </h2>
        </div>
        <div className="space-y-3">
          {/* Placeholder for appointments list */}
          <div className="text-gray-500 text-sm">لا توجد مواعيد اليوم</div>
        </div>
      </div>

      {/* Waiting Patients */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            المرضى في الانتظار
          </h2>
        </div>
        <div className="space-y-3">
          {/* Placeholder for waiting patients */}
          <div className="text-gray-500 text-sm">لا يوجد مرضى في الانتظار</div>
        </div>
      </div>

      {/* Active Pregnancies */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Baby className="w-5 h-5 text-pink-600" />
            حالات الحمل النشطة
          </h2>
        </div>
        <div className="space-y-3">
          {/* Placeholder for active pregnancies */}
          <div className="text-gray-500 text-sm">لا توجد حالات حمل نشطة</div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            تنبيهات (حالات عالية الخطورة / تحاليل حرجة)
          </h2>
        </div>
        <div className="space-y-3">
          {/* Placeholder for alerts */}
          <div className="text-gray-500 text-sm">لا توجد تنبيهات</div>
        </div>
      </div>

      {/* Start Visit Button */}
      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" />
          بدء زيارة
        </button>
      </div>
    </div>
  );
}

