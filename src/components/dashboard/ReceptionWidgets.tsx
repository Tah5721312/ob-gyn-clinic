"use client";

import { Session } from "next-auth";
import { Calendar, Clock, Plus, X } from "lucide-react";

interface ReceptionWidgetsProps {
  session: Session;
}

export function ReceptionWidgets({ session }: ReceptionWidgetsProps) {
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

      {/* Waiting Room */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            غرفة الانتظار
          </h2>
        </div>
        <div className="space-y-3">
          {/* Placeholder for waiting room */}
          <div className="text-gray-500 text-sm">لا يوجد مرضى في غرفة الانتظار</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <Plus className="w-5 h-5" />
          إضافة موعد
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <X className="w-5 h-5" />
          إلغاء / إعادة جدولة
        </button>
      </div>
    </div>
  );
}

