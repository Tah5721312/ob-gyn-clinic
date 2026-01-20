'use client';
import { apiFetch } from '@/lib/api';

import { useRouter } from 'next/navigation';
import { Calendar, Users, FileText, Clock } from 'lucide-react';
import { StatCard } from './shared/StatCard';
import { QuickActionButton } from './shared/QuickActionButton';
import { FinancialRow } from './shared/FinancialRow';
import { useState, useEffect } from 'react';

export function AdminWidgets({ session }: { session: any }) {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalPatients: 0,
    monthlyAppointments: 0,
    monthlyRevenue: 0,
    pendingInvoices: 0,
  });
  const [financialSummary, setFinancialSummary] = useState({
    totalRevenue: 0,
    cash: 0,
    card: 0,
    remaining: 0,
  });
  const [quickStats, setQuickStats] = useState({
    visits: 0,
    newPatients: 0,
    pregnancyFollowups: 0,
    ultrasounds: 0,
  });

  // جلب الإحصائيات
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiFetch('/api/dashboard/stats');
        const result = await response.json();

        if (result.success) {
          const data = result.data;

          // تحديث جميع الإحصائيات دفعة واحدة
          setStats({
            totalPatients: data.totalPatients,
            monthlyAppointments: data.monthlyAppointments,
            monthlyRevenue: data.monthlyRevenue,
            pendingInvoices: data.pendingInvoices,
          });

          setFinancialSummary(data.financialSummary);
          setQuickStats(data.quickStats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className='space-y-8'>
      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <StatCard
          title='إجمالي المرضى'
          value={stats.totalPatients.toString()}
          icon={<Users className='w-6 h-6' />}
          color='bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30'
        />
        <StatCard
          title='مواعيد الشهر'
          value={stats.monthlyAppointments.toString()}
          icon={<Calendar className='w-6 h-6' />}
          color='bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 shadow-lg shadow-green-500/30'
        />
        <StatCard
          title='إيرادات الشهر'
          value={formatCurrency(stats.monthlyRevenue)}
          icon={<FileText className='w-6 h-6' />}
          color='bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 shadow-lg shadow-purple-500/30'
        />
        <StatCard
          title='فواتير معلقة'
          value={stats.pendingInvoices.toString()}
          icon={<Clock className='w-6 h-6' />}
          color='bg-gradient-to-br from-rose-500 via-red-600 to-orange-600 shadow-lg shadow-red-500/30'
        />
      </div>



      {/* Financial Summary */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-300'>
          <h2 className='text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2'>
            <span className="w-2 h-8 bg-blue-600 rounded-full inline-block"></span>
            ملخص مالي - هذا الشهر
          </h2>
          <div className='space-y-2'>
            <FinancialRow
              label='إجمالي الإيرادات'
              value={formatCurrency(financialSummary.totalRevenue)}
            />
            <FinancialRow
              label='المدفوع نقداً'
              value={formatCurrency(financialSummary.cash)}
            />
            <FinancialRow
              label='المدفوع بالكارت'
              value={formatCurrency(financialSummary.card)}
            />
            <FinancialRow
              label='المتبقي'
              value={formatCurrency(financialSummary.remaining)}
              color='text-red-600'
            />
          </div>
        </div>

        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-300'>
          <h2 className='text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2'>
            <span className="w-2 h-8 bg-purple-600 rounded-full inline-block"></span>
            إحصائيات سريعة
          </h2>
          <div className='space-y-2'>
            <FinancialRow
              label='عدد الزيارات'
              value={quickStats.visits.toString()}
            />
            <FinancialRow
              label='مرضى جدد'
              value={quickStats.newPatients.toString()}
            />
            <FinancialRow
              label='متابعات حمل'
              value={quickStats.pregnancyFollowups.toString()}
            />
            <FinancialRow
              label='حالات سونار'
              value={quickStats.ultrasounds.toString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
