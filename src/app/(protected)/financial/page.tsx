"use client";
import { apiFetch } from "@/lib/api";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, TrendingUp, TrendingDown, FileText, Users, Calendar, CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";
import { PaymentStatus, PaymentStatusLabels } from "@/lib/enumdb";

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

export default function FinancialDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
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
        const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + inv.paidAmount, 0);
        const totalInvoices = invoices.length;
        const paidInvoices = invoices.filter((inv: any) => inv.paymentStatus === PaymentStatus.PAID).length;
        const partialInvoices = invoices.filter((inv: any) => inv.paymentStatus === PaymentStatus.PARTIAL).length;
        const unpaidInvoices = invoices.filter((inv: any) => inv.paymentStatus === PaymentStatus.UNPAID).length;
        const totalPayments = payments.filter((p: any) => !p.isRefunded).length;

        // حساب اليوم
        const today = new Date().toISOString().split('T')[0];
        const todayPayments = payments.filter((p: any) => 
          !p.isRefunded && new Date(p.paymentDate).toISOString().split('T')[0] === today
        );
        const todayRevenue = todayPayments.reduce((sum: number, p: any) => sum + p.amount, 0);

        // حساب الشهر
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyPayments = payments.filter((p: any) => {
          if (p.isRefunded) return false;
          const paymentDate = new Date(p.paymentDate);
          return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
        });
        const monthlyRevenue = monthlyPayments.reduce((sum: number, p: any) => sum + p.amount, 0);

        // طرق الدفع
        const paymentMethodsMap = new Map<string, { count: number; amount: number }>();
        payments.filter((p: any) => !p.isRefunded).forEach((p: any) => {
          const method = p.paymentMethod;
          const existing = paymentMethodsMap.get(method) || { count: 0, amount: 0 };
          paymentMethodsMap.set(method, {
            count: existing.count + 1,
            amount: existing.amount + p.amount,
          });
        });

        const paymentMethods = Array.from(paymentMethodsMap.entries()).map(([method, data]) => ({
          method,
          ...data,
        }));

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
      console.error("Error fetching stats:", error);
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
      <div className="container mx-auto p-6">
        <div className="text-center text-gray-500">جاري التحميل...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">حدث خطأ أثناء جلب البيانات</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50" dir="rtl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم المالية</h1>
          <p className="text-gray-600 mt-2">نظرة شاملة على الوضع المالي للعيادة</p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">من:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <label className="text-sm font-medium text-gray-700">إلى:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إيرادات اليوم</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.todayRevenue)}</p>
                <p className="text-xs text-gray-500 mt-1">{stats.todayPayments} دفعة</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إيرادات الشهر</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.monthlyRevenue)}</p>
                <p className="text-xs text-gray-500 mt-1">{stats.monthlyPayments} دفعة</p>
              </div>
              <Calendar className="w-12 h-12 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الفواتير</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalInvoices}</p>
              </div>
              <FileText className="w-12 h-12 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Invoice Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مدفوعة بالكامل</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.paidInvoices}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مدفوعة جزئياً</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.partialInvoices}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">غير مدفوعة</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.unpaidInvoices}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        {stats.paymentMethods.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">طرق الدفع</h2>
            <div className="space-y-4">
              {stats.paymentMethods.map((pm) => (
                <div key={pm.method} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-gray-400" />
                    <span className="font-medium text-gray-900">{pm.method}</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{formatCurrency(pm.amount)}</p>
                    <p className="text-sm text-gray-500">{pm.count} دفعة</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => router.push('/billing')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-right"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">الفواتير</h3>
                <p className="text-sm text-gray-600 mt-1">عرض وإدارة جميع الفواتير</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </button>

          <button
            onClick={() => router.push('/payments')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-right"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">الدفعات</h3>
                <p className="text-sm text-gray-600 mt-1">عرض جميع الدفعات</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

