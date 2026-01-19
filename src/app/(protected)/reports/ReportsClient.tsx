'use client';
import { apiFetch } from '@/lib/api';
import { useState, useEffect } from 'react';
import {
  DollarSign,
  FileText,
  Users,
  Calendar,
  Activity,
  TrendingUp,
  Download,
  Filter,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { PaymentStatus, PaymentStatusLabels } from '@/lib/enumdb';

interface ReportStats {
  financial: {
    totalRevenue: number;
    totalInvoices: number;
    paidInvoices: number;
    partialInvoices: number;
    unpaidInvoices: number;
    totalPayments: number;
    cashPayments: number;
    cardPayments: number;
    averageInvoiceAmount: number;
  };
  medical: {
    totalVisits: number;
    totalAppointments: number;
    completedVisits: number;
    draftVisits: number;
    totalPatients: number;
    activePatients: number;
    newPatients: number;
    totalPrescriptions: number;
  };
  period: {
    startDate: string;
    endDate: string;
  };
}

export default function ReportsClient() {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<'financial' | 'medical' | 'all'>('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // جلب الفواتير
      const invoicesResponse = await apiFetch('/api/invoices');
      const invoicesResult = await invoicesResponse.json();

      // جلب الدفعات
      const paymentsResponse = await apiFetch('/api/payments');
      const paymentsResult = await paymentsResponse.json();

      // جلب المرضى
      const patientsResponse = await apiFetch('/api/patients');
      const patientsResult = await patientsResponse.json();

      // جلب المواعيد
      const appointmentsResponse = await apiFetch('/api/appointments');
      const appointmentsResult = await appointmentsResponse.json();

      // جلب الزيارات
      const visitsResponse = await apiFetch('/api/visits');
      const visitsResult = await visitsResponse.json();

      // جلب الوصفات الطبية
      const prescriptionsResponse = await apiFetch('/api/prescriptions');
      const prescriptionsResult = await prescriptionsResponse.json();

      if (
        invoicesResult.success &&
        paymentsResult.success &&
        patientsResult.success &&
        appointmentsResult.success &&
        visitsResult.success &&
        prescriptionsResult.success
      ) {
        const invoices = invoicesResult.data || [];
        const payments = paymentsResult.data || [];
        const patients = patientsResult.data || [];
        const appointments = appointmentsResult.data || [];
        const visits = visitsResult.data || [];
        const prescriptions = prescriptionsResult.data || [];

        // تصفية البيانات حسب النطاق الزمني
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);

        const filteredInvoices = invoices.filter((inv: any) => {
          const invDate = new Date(inv.invoiceDate);
          return invDate >= startDate && invDate <= endDate;
        });

        const filteredPayments = payments.filter((p: any) => {
          const payDate = new Date(p.paymentDate);
          return payDate >= startDate && payDate <= endDate && !p.isRefunded;
        });

        const filteredVisits = visits.filter((v: any) => {
          const visitDate = new Date(v.visitDate);
          return visitDate >= startDate && visitDate <= endDate;
        });

        const filteredAppointments = appointments.filter((apt: any) => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate >= startDate && aptDate <= endDate;
        });

        const filteredPatients = patients.filter((p: any) => {
          const regDate = new Date(p.registrationDate || p.createdAt);
          return regDate >= startDate && regDate <= endDate;
        });

        // حساب الإحصائيات المالية
        const totalRevenue = filteredPayments.reduce(
          (sum: number, p: any) => sum + p.amount,
          0
        );
        const totalInvoices = filteredInvoices.length;
        const paidInvoices = filteredInvoices.filter(
          (inv: any) => inv.paymentStatus === PaymentStatus.PAID
        ).length;
        const partialInvoices = filteredInvoices.filter(
          (inv: any) => inv.paymentStatus === PaymentStatus.PARTIAL
        ).length;
        const unpaidInvoices = filteredInvoices.filter(
          (inv: any) => inv.paymentStatus === PaymentStatus.UNPAID
        ).length;
        const totalPayments = filteredPayments.length;
        const cashPayments = filteredPayments.filter(
          (p: any) => p.paymentMethod === 'CASH'
        ).reduce((sum: number, p: any) => sum + p.amount, 0);
        const cardPayments = filteredPayments.filter(
          (p: any) => p.paymentMethod === 'CARD'
        ).reduce((sum: number, p: any) => sum + p.amount, 0);
        const averageInvoiceAmount =
          totalInvoices > 0
            ? filteredInvoices.reduce(
              (sum: number, inv: any) => sum + inv.totalAmount,
              0
            ) / totalInvoices
            : 0;

        // حساب الإحصائيات الطبية
        const totalVisits = filteredVisits.length;
        const completedVisits = filteredVisits.filter(
          (v: any) => !v.isDraft
        ).length;
        const draftVisits = filteredVisits.filter((v: any) => v.isDraft).length;
        const totalAppointments = filteredAppointments.length;
        const totalPatientsCount = patients.length;
        const activePatients = patients.filter((p: any) => p.isActive).length;
        const newPatients = filteredPatients.length;
        const totalPrescriptions = prescriptions.length;

        setStats({
          financial: {
            totalRevenue,
            totalInvoices,
            paidInvoices,
            partialInvoices,
            unpaidInvoices,
            totalPayments,
            cashPayments,
            cardPayments,
            averageInvoiceAmount,
          },
          medical: {
            totalVisits,
            totalAppointments,
            completedVisits,
            draftVisits,
            totalPatients: totalPatientsCount,
            activePatients,
            newPatients,
            totalPrescriptions,
          },
          period: {
            startDate: dateRange.start,
            endDate: dateRange.end,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const exportReport = () => {
    if (!stats) return;

    const reportData = {
      period: {
        from: formatDate(stats.period.startDate),
        to: formatDate(stats.period.endDate),
      },
      financial: stats.financial,
      medical: stats.medical,
      generatedAt: new Date().toLocaleString('ar-EG'),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${dateRange.start}-${dateRange.end}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center text-gray-500 animate-pulse'>
          جاري تحميل التقارير...
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center text-red-500 bg-red-50 px-6 py-4 rounded-lg'>
          حدث خطأ أثناء جلب البيانات
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50/30 p-4 md:p-8 font-sans'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-3'>
              <BarChart3 className='w-8 h-8 text-blue-600' />
              التقارير والإحصائيات
            </h1>
            <p className='text-gray-500 text-sm mt-2'>
              تقارير شاملة عن أداء العيادة
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <button
              onClick={exportReport}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              <Download className='w-5 h-5' />
              <span>تصدير التقرير</span>
            </button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
          <div className='flex items-center gap-2 mb-4'>
            <Filter className='w-5 h-5 text-gray-400' />
            <h2 className='text-lg font-bold text-gray-900'>فلترة حسب التاريخ</h2>
          </div>
          <div className='flex flex-col md:flex-row items-center gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium text-gray-600'>من:</span>
              <input
                type='date'
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className='bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
              />
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium text-gray-600'>إلى:</span>
              <input
                type='date'
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className='bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
              />
            </div>
            <div className='text-sm text-gray-500'>
              الفترة: {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
            </div>
          </div>
        </div>

        {/* Report Type Tabs */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4'>
          <div className='flex gap-2'>
            <button
              onClick={() => setReportType('all')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${reportType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              جميع التقارير
            </button>
            <button
              onClick={() => setReportType('financial')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${reportType === 'financial'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              التقارير المالية
            </button>
            <button
              onClick={() => setReportType('medical')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${reportType === 'medical'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              التقارير الطبية
            </button>
          </div>
        </div>

        {/* Financial Reports */}
        {(reportType === 'all' || reportType === 'financial') && (
          <div className='space-y-6'>
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
                <DollarSign className='w-6 h-6 text-green-600' />
                التقارير المالية
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                <StatCard
                  title='إجمالي الإيرادات'
                  value={formatCurrency(stats.financial.totalRevenue)}
                  icon={DollarSign}
                  color='emerald'
                />
                <StatCard
                  title='إجمالي الفواتير'
                  value={stats.financial.totalInvoices.toString()}
                  icon={FileText}
                  color='blue'
                />
                <StatCard
                  title='إجمالي الدفعات'
                  value={stats.financial.totalPayments.toString()}
                  icon={TrendingUp}
                  color='indigo'
                />
                <StatCard
                  title='متوسط قيمة الفاتورة'
                  value={formatCurrency(stats.financial.averageInvoiceAmount)}
                  icon={PieChart}
                  color='purple'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Invoice Status */}
                <div className='bg-gray-50 rounded-xl p-6'>
                  <h3 className='text-lg font-bold text-gray-900 mb-4'>
                    حالة الفواتير
                  </h3>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between p-3 bg-green-50 rounded-lg'>
                      <span className='text-gray-700 font-medium'>مدفوعة بالكامل</span>
                      <span className='text-green-700 font-bold text-lg'>
                        {stats.financial.paidInvoices}
                      </span>
                    </div>
                    <div className='flex items-center justify-between p-3 bg-yellow-50 rounded-lg'>
                      <span className='text-gray-700 font-medium'>مدفوعة جزئياً</span>
                      <span className='text-yellow-700 font-bold text-lg'>
                        {stats.financial.partialInvoices}
                      </span>
                    </div>
                    <div className='flex items-center justify-between p-3 bg-red-50 rounded-lg'>
                      <span className='text-gray-700 font-medium'>غير مدفوعة</span>
                      <span className='text-red-700 font-bold text-lg'>
                        {stats.financial.unpaidInvoices}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className='bg-gray-50 rounded-xl p-6'>
                  <h3 className='text-lg font-bold text-gray-900 mb-4'>
                    طرق الدفع
                  </h3>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between p-3 bg-blue-50 rounded-lg'>
                      <span className='text-gray-700 font-medium'>نقداً</span>
                      <span className='text-blue-700 font-bold text-lg'>
                        {formatCurrency(stats.financial.cashPayments)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between p-3 bg-purple-50 rounded-lg'>
                      <span className='text-gray-700 font-medium'>بطاقة</span>
                      <span className='text-purple-700 font-bold text-lg'>
                        {formatCurrency(stats.financial.cardPayments)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medical Reports */}
        {(reportType === 'all' || reportType === 'medical') && (
          <div className='space-y-6'>
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
              <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
                <Activity className='w-6 h-6 text-blue-600' />
                التقارير الطبية
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                <StatCard
                  title='إجمالي الزيارات'
                  value={stats.medical.totalVisits.toString()}
                  icon={Activity}
                  color='blue'
                />
                <StatCard
                  title='الزيارات المكتملة'
                  value={stats.medical.completedVisits.toString()}
                  icon={Calendar}
                  color='green'
                />
                <StatCard
                  title='إجمالي المواعيد'
                  value={stats.medical.totalAppointments.toString()}
                  icon={Calendar}
                  color='indigo'
                />
                <StatCard
                  title='إجمالي المرضى'
                  value={stats.medical.totalPatients.toString()}
                  icon={Users}
                  color='purple'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <StatCard
                  title='المرضى النشطون'
                  value={stats.medical.activePatients.toString()}
                  icon={Users}
                  color='green'
                />
                <StatCard
                  title='مرضى جدد'
                  value={stats.medical.newPatients.toString()}
                  icon={Users}
                  color='blue'
                />
                <StatCard
                  title='الزيارات المسودة'
                  value={stats.medical.draftVisits.toString()}
                  icon={FileText}
                  color='yellow'
                />
                <StatCard
                  title='إجمالي الوصفات'
                  value={stats.medical.totalPrescriptions.toString()}
                  icon={FileText}
                  color='indigo'
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Component
function StatCard({ title, value, icon: Icon, color }: any) {
  const colorClasses: any = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className='bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-gray-500 mb-1'>{title}</p>
          <h3 className='text-2xl font-bold text-gray-900'>{value}</h3>
        </div>
        <div
          className={`p-3 rounded-lg ${colorClasses[color] || 'bg-gray-100 text-gray-600'
            }`}
        >
          <Icon className='w-6 h-6' />
        </div>
      </div>
    </div>
  );
}

