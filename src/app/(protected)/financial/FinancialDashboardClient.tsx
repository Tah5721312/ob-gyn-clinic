'use client';
import { apiFetch } from '@/lib/api';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Users,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { PaymentStatus, PaymentStatusLabels } from '@/lib/enumdb';

interface FinancialStats {
  totalRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  partialInvoices: number;
  unpaidInvoices: number;
  totalPayments: number;
  todayRevenue: number;
  todayPayments: number;
  monthlyRevenue: number;
  monthlyPayments: number;
  paymentMethods: {
    method: string;
    count: number;
    amount: number;
  }[];
}

export default function FinancialDashboardClient() {
  const router = useRouter();
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // جلب الفواتير
      const invoicesResponse = await apiFetch('/api/invoices');
      const invoicesResult = await invoicesResponse.json();

      // جلب الدفعات
      const paymentsResponse = await apiFetch('/api/payments');
      const paymentsResult = await paymentsResponse.json();

      if (invoicesResult.success && paymentsResult.success) {
        const invoices = invoicesResult.data || [];
        const payments = paymentsResult.data || [];

        // حساب الإحصائيات
        const totalRevenue = invoices.reduce(
          (sum: number, inv: any) => sum + inv.paidAmount,
          0
        );
        const totalInvoices = invoices.length;
        const paidInvoices = invoices.filter(
          (inv: any) => inv.paymentStatus === PaymentStatus.PAID
        ).length;
        const partialInvoices = invoices.filter(
          (inv: any) => inv.paymentStatus === PaymentStatus.PARTIAL
        ).length;
        const unpaidInvoices = invoices.filter(
          (inv: any) => inv.paymentStatus === PaymentStatus.UNPAID
        ).length;
        const totalPayments = payments.filter((p: any) => !p.isRefunded).length;

        // حساب اليوم
        const today = new Date().toISOString().split('T')[0];
        const todayPayments = payments.filter(
          (p: any) =>
            !p.isRefunded &&
            new Date(p.paymentDate).toISOString().split('T')[0] === today
        );
        const todayRevenue = todayPayments.reduce(
          (sum: number, p: any) => sum + p.amount,
          0
        );

        // حساب الشهر
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyPayments = payments.filter((p: any) => {
          if (p.isRefunded) return false;
          const paymentDate = new Date(p.paymentDate);
          return (
            paymentDate.getMonth() === currentMonth &&
            paymentDate.getFullYear() === currentYear
          );
        });
        const monthlyRevenue = monthlyPayments.reduce(
          (sum: number, p: any) => sum + p.amount,
          0
        );

        // طرق الدفع
        const paymentMethodsMap = new Map<
          string,
          { count: number; amount: number }
        >();
        payments
          .filter((p: any) => !p.isRefunded)
          .forEach((p: any) => {
            const method = p.paymentMethod;
            const existing = paymentMethodsMap.get(method) || {
              count: 0,
              amount: 0,
            };
            paymentMethodsMap.set(method, {
              count: existing.count + 1,
              amount: existing.amount + p.amount,
            });
          });

        const paymentMethods = Array.from(paymentMethodsMap.entries()).map(
          ([method, data]) => ({
            method,
            ...data,
          })
        );

        setStats({
          totalRevenue,
          totalInvoices,
          paidInvoices,
          partialInvoices,
          unpaidInvoices,
          totalPayments,
          todayRevenue,
          todayPayments: todayPayments.length,
          monthlyRevenue,
          monthlyPayments: monthlyPayments.length,
          paymentMethods,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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

  if (loading) {
    return (
      <div className='container mx-auto p-6 min-h-screen flex items-center justify-center'>
        <div className='text-center text-gray-500 animate-pulse'>
          جاري التحميل...
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className='container mx-auto p-6 min-h-screen flex items-center justify-center'>
        <div className='text-center text-red-500 bg-red-50 px-6 py-4 rounded-lg'>
          حدث خطأ أثناء جلب البيانات
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50/30 p-4 md:p-8 font-sans' dir='rtl'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Header & Controls */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              لوحة التحكم المالية
            </h1>
            <p className='text-gray-500 text-sm mt-1'>
              نظرة شاملة على الوضع المالي للعيادة
            </p>
          </div>

          <div className='flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100'>
            <div className='flex items-center gap-2'>
              <span className='text-xs font-medium text-gray-500 ps-2'>
                من:
              </span>
              <input
                type='date'
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className='bg-white border-0 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 py-1.5 px-3 shadow-sm outline-none'
              />
            </div>
            <div className='h-4 w-px bg-gray-300'></div>
            <div className='flex items-center gap-2'>
              <span className='text-xs font-medium text-gray-500'>إلى:</span>
              <input
                type='date'
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className='bg-white border-0 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 py-1.5 px-3 shadow-sm outline-none'
              />
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
          <StatCard
            title='إجمالي الإيرادات'
            value={formatCurrency(stats.totalRevenue)}
            icon={DollarSign}
            color='emerald'
          />
          <StatCard
            title='إيرادات الشهر'
            value={formatCurrency(stats.monthlyRevenue)}
            subtitle={`${stats.monthlyPayments} دفعة`}
            icon={Calendar}
            color='blue'
          />
          <StatCard
            title='إيرادات اليوم'
            value={formatCurrency(stats.todayRevenue)}
            subtitle={`${stats.todayPayments} دفعة`}
            icon={TrendingUp}
            color='indigo'
          />
          <StatCard
            title='إجمالي الفواتير'
            value={stats.totalInvoices.toString()}
            icon={FileText}
            color='orange'
          />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Invoice Status Section */}
          <div className='lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
            <h3 className='text-lg font-bold text-gray-900 mb-6 flex items-center gap-2'>
              <FileText className='w-5 h-5 text-gray-400' />
              حالة الفواتير
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <StatusCard
                label='مدفوعة بالكامل'
                count={stats.paidInvoices}
                color='green'
                icon={CheckCircle}
              />
              <StatusCard
                label='مدفوعة جزئياً'
                count={stats.partialInvoices}
                color='amber'
                icon={Clock}
              />
              <StatusCard
                label='غير مدفوعة'
                count={stats.unpaidInvoices}
                color='red'
                icon={XCircle}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4'>
            <h3 className='text-lg font-bold text-gray-900 mb-2'>
              إجراءات سريعة
            </h3>

            <button
              onClick={() => router.push('/billing')}
              className='flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group w-full'
            >
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform'>
                  <FileText className='w-5 h-5' />
                </div>
                <div className='text-start'>
                  <span className='block font-semibold text-gray-900'>
                    الفواتير
                  </span>
                  <span className='text-xs text-gray-500'>إدارة الفواتير</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/payments')}
              className='flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all group w-full'
            >
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-green-100 text-green-600 rounded-lg group-hover:scale-110 transition-transform'>
                  <DollarSign className='w-5 h-5' />
                </div>
                <div className='text-start'>
                  <span className='block font-semibold text-gray-900'>
                    الدفعات
                  </span>
                  <span className='text-xs text-gray-500'>سجل المدفوعات</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        {stats.paymentMethods.length > 0 && (
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            <div className='p-6 border-b border-gray-100'>
              <h3 className='text-lg font-bold text-gray-900'>
                تفاصيل طرق الدفع
              </h3>
            </div>
            <div className='divide-y divide-gray-100'>
              {stats.paymentMethods.map((pm) => (
                <div
                  key={pm.method}
                  className='flex items-center justify-between p-4 hover:bg-gray-50 transition-colors'
                >
                  <div className='flex items-center gap-4'>
                    <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600'>
                      <CreditCard className='w-5 h-5' />
                    </div>
                    <div>
                      <p className='font-semibold text-gray-900'>{pm.method}</p>
                      <p className='text-xs text-gray-500'>
                        {pm.count} عملية دفع
                      </p>
                    </div>
                  </div>
                  <div className='font-bold text-gray-900'>
                    {formatCurrency(pm.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, subtitle, icon: Icon, color }: any) {
  const colorClasses: any = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between'>
        <div>
          <p className='text-sm font-medium text-gray-500 mb-1'>{title}</p>
          <h3 className='text-2xl font-bold text-gray-900'>{value}</h3>
          {subtitle && <p className='text-xs text-gray-400 mt-1'>{subtitle}</p>}
        </div>
        <div
          className={`p-3 rounded-xl ${
            colorClasses[color] || 'bg-gray-100 text-gray-600'
          }`}
        >
          <Icon className='w-6 h-6' />
        </div>
      </div>
    </div>
  );
}

function StatusCard({ label, count, color, icon: Icon }: any) {
  const colorStyles: any = {
    green: 'bg-green-50 text-green-700 border-green-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    red: 'bg-red-50 text-red-700 border-red-100',
  };

  return (
    <div
      className={`p-4 rounded-xl border ${colorStyles[color]} flex flex-col items-center justify-center text-center hover:bg-opacity-75 transition-colors`}
    >
      <Icon className='w-8 h-8 mb-2 opacity-80' />
      <span className='text-3xl font-bold block mb-1'>{count}</span>
      <span className='text-sm font-medium opacity-90'>{label}</span>
    </div>
  );
}
