'use client';

import { useRouter } from 'next/navigation';
import { BigActionCard } from './shared/BigActionCard';

export function DoctorWidgets({ session }: { session: any }) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BigActionCard
          title="كشف جديد"
          description="ابدأ كشف مريضة جديدة"
          icon="🩺"
          onClick={() => router.push('/visits/new')}
          color="bg-blue-600"
        />
        <BigActionCard
          title="مرضى اليوم"
          description="عرض مواعيد اليوم"
          icon="📅"
          onClick={() => router.push('/appointments')}
          color="bg-green-600"
        />
        <BigActionCard
          title="الروشتات"
          description="عرض الروشتات"
          icon="💊"
          onClick={() => router.push('/prescriptions')}
          color="bg-purple-600"
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <button
          onClick={() => router.push('/schedules')}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-100 hover:bg-orange-200 rounded-lg text-orange-700 font-medium transition-colors"
        >
          <span className="text-xl">⏰</span>
          <span>الجداول الزمنية</span>
        </button>
      </div>
      
      {/* إدارة القوالب */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <button
          onClick={() => router.push('/templates')}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
        >
          <span className="text-xl">📋</span>
          <span>إدارة القوالب</span>
        </button>
      </div>
    </div>
  );
}
