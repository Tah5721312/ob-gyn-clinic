"use client";

import { Session } from "next-auth";
import { Users, ClipboardList, Heart } from "lucide-react";

interface NurseWidgetsProps {
  session: Session;
}

export function NurseWidgets({ session }: NurseWidgetsProps) {
  return (
    <div className="space-y-6">
      {/* Patients */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            المرضى
          </h2>
        </div>
        <div className="space-y-3">
          {/* Placeholder for patients list */}
          <div className="text-gray-500 text-sm">لا يوجد مرضى</div>
        </div>
      </div>

      {/* Vital Signs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            العلامات الحيوية
          </h2>
        </div>
        <div className="space-y-3">
          {/* Placeholder for vital signs */}
          <div className="text-gray-500 text-sm">لا توجد علامات حيوية مسجلة</div>
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-green-600" />
            المهام
          </h2>
        </div>
        <div className="space-y-3">
          {/* Placeholder for tasks */}
          <div className="text-gray-500 text-sm">لا توجد مهام</div>
        </div>
      </div>
    </div>
  );
}

