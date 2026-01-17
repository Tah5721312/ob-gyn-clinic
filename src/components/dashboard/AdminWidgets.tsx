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
    <div className='space-y-6'>
      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <StatCard
          title='إجمالي المرضى'
          value={stats.totalPatients.toString()}
          icon={<Users className='w-6 h-6' />}
          color='bg-blue-500'
        />
        <StatCard
          title='مواعيد الشهر'
          value={stats.monthlyAppointments.toString()}
          icon={<Calendar className='w-6 h-6' />}
          color='bg-green-500'
        />
        <StatCard
          title='إيرادات الشهر'
          value={formatCurrency(stats.monthlyRevenue)}
          icon={<FileText className='w-6 h-6' />}
          color='bg-purple-500'
        />
        <StatCard
          title='فواتير معلقة'
          value={stats.pendingInvoices.toString()}
          icon={<Clock className='w-6 h-6' />}
          color='bg-red-500'
        />
      </div>

      {/* Quick Actions */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-bold mb-4 text-gray-800'>إدارة النظام</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <QuickActionButton
            title='إدارة المستخدمين'
            description='إضافة وتعديل المستخدمين'
            icon='👥'
            onClick={() => router.push('/users')}
          />
          <QuickActionButton
            title='لوحة التحكم المالية'
            description='عرض الإحصائيات المالية'
            icon='💰'
            onClick={() => router.push('/financial')}
          />
          <QuickActionButton
            title='التقارير المالية'
            description='عرض التقارير والإحصائيات'
            icon='📊'
            onClick={() => router.push('/reports')}
          />
        </div>
      </div>

      {/* Schedules */}
      <div className='bg-white rounded-lg shadow-md p-4'>
        <button
          onClick={() => router.push('/schedules')}
          className='w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-100 hover:bg-orange-200 rounded-lg text-orange-700 font-medium transition-colors'
        >
          <span className='text-xl'>⏰</span>
          <span>الجداول الزمنية</span>
        </button>
      </div>

      {/* Financial Summary */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-bold mb-4 text-gray-800'>
            ملخص مالي - هذا الشهر
          </h2>
          <div className='space-y-3'>
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

        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-bold mb-4 text-gray-800'>
            إحصائيات سريعة
          </h2>
          <div className='space-y-3'>
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
