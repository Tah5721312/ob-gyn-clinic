'use client';

import { useRouter } from 'next/navigation';
import { BigActionCard } from './shared/BigActionCard';
import { QuickActionButton } from '@/components/dashboard/shared/QuickActionButton';
import { Calendar, Users, Search, FileText, Activity, Clock } from 'lucide-react';

export function DoctorWidgets({ session }: { session: any }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
      <BigActionCard
        title="مرضى اليوم"
        description="عرض مواعيد اليوم"
        icon={<Calendar className="w-8 h-8" />}
        onClick={() => router.push('/appointments')}
        color="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-blue-500/20"
      />

      <BigActionCard
        title="بحث عن مريضة"
        description="البحث في السجلات"
        icon={<Search className="w-8 h-8" />}
        onClick={() => router.push('/patients')}
        color="bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 shadow-emerald-500/20"
      />

      <BigActionCard
        title="الروشتات"
        description="إدارة الروشتات الطبية"
        icon={<FileText className="w-8 h-8" />}
        onClick={() => router.push('/prescriptions')}
        color="bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 shadow-purple-500/20"
      />

      <BigActionCard
        title="الزيارات"
        description="سجل الزيارات الطبية"
        icon={<Activity className="w-8 h-8" />}
        onClick={() => router.push('/visits')}
        color="bg-gradient-to-br from-orange-500 via-amber-600 to-red-600 shadow-orange-500/20"
      />

      <BigActionCard
        title="المواعيد"
        description="إدارة المواعيد"
        icon={<Clock className="w-8 h-8" />}
        onClick={() => router.push('/appointments')}
        color="bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 shadow-indigo-500/20"
      />

      <BigActionCard
        title="المرضى"
        description="قائمة المرضى"
        icon={<Users className="w-8 h-8" />}
        onClick={() => router.push('/patients')}
        color="bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-600 shadow-teal-500/20"
      />
    </div>
  );
}
