'use client';

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
        // جلب عدد المرضى
        const patientsResponse = await fetch('/api/patients');
        const patientsResult = await patientsResponse.json();
        if (patientsResult.success) {
          setStats(prev => ({ ...prev, totalPatients: patientsResult.count || patientsResult.data?.length || 0 }));
        }

        // جلب الفواتير المعلقة
        const invoicesParams = new URLSearchParams();
        invoicesParams.append('paymentStatus', 'UNPAID');
        invoicesParams.append('paymentStatus', 'PARTIAL');
        
        const invoicesResponse = await fetch(`/api/invoices?${invoicesParams.toString()}`);
        const invoicesResult = await invoicesResponse.json();
        if (invoicesResult.success) {
          setStats(prev => ({ ...prev, pendingInvoices: invoicesResult.count || invoicesResult.data?.length || 0 }));
          
          // حساب الملخص المالي
          const invoices = invoicesResult.data || [];
          const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + inv.totalAmount, 0);
          const paid = invoices.reduce((sum: number, inv: any) => sum + inv.paidAmount, 0);
          const remaining = totalRevenue - paid;
          
          setFinancialSummary({
            totalRevenue,
            cash: paid * 0.7, // تقدير
            card: paid * 0.3, // تقدير
            remaining,
          });
        }

        // جلب مواعيد الشهر
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const appointmentsParams = new URLSearchParams();
        appointmentsParams.append('appointmentDate', startOfMonth.toISOString().split('T')[0]);
        
        const appointmentsResponse = await fetch(`/api/appointments?${appointmentsParams.toString()}`);
        const appointmentsResult = await appointmentsResponse.json();
        if (appointmentsResult.success) {
          setStats(prev => ({ ...prev, monthlyAppointments: appointmentsResult.count || appointmentsResult.data?.length || 0 }));
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
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي المرضى"
          value={stats.totalPatients.toString()}
          icon={<Users className="w-6 h-6" />}
          color="bg-blue-500"
        />
        <StatCard
          title="مواعيد الشهر"
          value={stats.monthlyAppointments.toString()}
          icon={<Calendar className="w-6 h-6" />}
          color="bg-green-500"
        />
        <StatCard
          title="إيرادات الشهر"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={<FileText className="w-6 h-6" />}
          color="bg-purple-500"
        />
        <StatCard
          title="فواتير معلقة"
          value={stats.pendingInvoices.toString()}
          icon={<Clock className="w-6 h-6" />}
          color="bg-red-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          إدارة النظام
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionButton
            title="إدارة المستخدمين"
            description="إضافة وتعديل المستخدمين"
            icon="👥"
            onClick={() => router.push('/users')}
          />
          <QuickActionButton
            title="التقارير المالية"
            description="عرض التقارير والإحصائيات"
            icon="📊"
            onClick={() => router.push('/reports')}
          />
          <QuickActionButton
            title="إعدادات النظام"
            description="ضبط إعدادات العيادة"
            icon="⚙️"
            onClick={() => router.push('/settings')}
          />
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            ملخص مالي - هذا الشهر
          </h2>
          <div className="space-y-3">
            <FinancialRow label="إجمالي الإيرادات" value={formatCurrency(financialSummary.totalRevenue)} />
            <FinancialRow label="المدفوع نقداً" value={formatCurrency(financialSummary.cash)} />
            <FinancialRow label="المدفوع بالكارت" value={formatCurrency(financialSummary.card)} />
            <FinancialRow label="المتبقي" value={formatCurrency(financialSummary.remaining)} color="text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            إحصائيات سريعة
          </h2>
          <div className="space-y-3">
            <FinancialRow label="عدد الزيارات" value={quickStats.visits.toString()} />
            <FinancialRow label="مرضى جدد" value={quickStats.newPatients.toString()} />
            <FinancialRow label="متابعات حمل" value={quickStats.pregnancyFollowups.toString()} />
            <FinancialRow label="حالات سونار" value={quickStats.ultrasounds.toString()} />
          </div>
        </div>
      </div>
    </div>
  );
}
