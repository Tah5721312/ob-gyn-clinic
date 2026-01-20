'use client';
import { apiFetch } from '@/lib/api';

import { useRouter } from 'next/navigation';
import { Calendar, Users, FileText, Clock } from 'lucide-react';
import { StatCard } from './shared/StatCard';
import { QuickActionButton } from './shared/QuickActionButton';
import { AppointmentCard } from './shared/AppointmentCard';
import { InvoiceCard } from './shared/InvoiceCard';
import { useState, useEffect } from 'react';
import { invoiceStatus } from '@/lib/enumdb';
import { useSession } from 'next-auth/react';

export function ReceptionWidgets({ session }: { session: any }) {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    waiting: 0,
    newPatients: 0,
    pendingInvoices: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);

  // جلب الإحصائيات
  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب مواعيد اليوم
        const today = new Date().toISOString().split('T')[0];
        const appointmentsParams = new URLSearchParams();
        appointmentsParams.append('appointmentDate', today);

        const appointmentsResponse = await apiFetch(
          `/api/appointments?${appointmentsParams.toString()}`
        );
        const appointmentsResult = await appointmentsResponse.json();

        if (appointmentsResult.success) {
          const appointments = appointmentsResult.data || [];
          setStats((prev) => ({
            ...prev,
            todayAppointments: appointments.length,
            waiting: appointments.filter((a: any) => a.status === 'BOOKED')
              .length,
          }));
          setTodayAppointments(appointments.slice(0, 3));
        }

        // جلب الفواتير المعلقة
        const invoicesParams = new URLSearchParams();
        invoicesParams.append('paymentStatus', 'UNPAID');
        invoicesParams.append('paymentStatus', 'PARTIAL');

        const invoicesResponse = await apiFetch(
          `/api/invoices?${invoicesParams.toString()}`
        );
        const invoicesResult = await invoicesResponse.json();

        if (invoicesResult.success) {
          const invoices = invoicesResult.data || [];
          setStats((prev) => ({
            ...prev,
            pendingInvoices: invoices.length,
          }));
          setPendingInvoices(invoices.slice(0, 2));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [sessionData]);

  return (
    <div className='space-y-8'>
      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <StatCard
          title='مواعيد اليوم'
          value={stats.todayAppointments.toString()}
          icon={<Calendar className='w-6 h-6' />}
          color='bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30'
        />
        <StatCard
          title='في الانتظار'
          value={stats.waiting.toString()}
          icon={<Clock className='w-6 h-6' />}
          color='bg-gradient-to-br from-amber-500 via-yellow-600 to-orange-600 shadow-lg shadow-yellow-500/30'
        />
        <StatCard
          title='مرضى جدد'
          value={stats.newPatients.toString()}
          icon={<Users className='w-6 h-6' />}
          color='bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 shadow-lg shadow-green-500/30'
        />
        <StatCard
          title='فواتير معلقة'
          value={stats.pendingInvoices.toString()}
          icon={<FileText className='w-6 h-6' />}
          color='bg-gradient-to-br from-rose-500 via-red-600 to-pink-600 shadow-lg shadow-red-500/30'
        />
      </div>

      {/* Quick Actions */}
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8'>
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-8 bg-blue-600 rounded-full inline-block"></span>
          <h2 className='text-2xl font-bold text-gray-800'>إجراءات سريعة</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <QuickActionButton
            title='حجز موعد جديد'
            description='إضافة موعد للمريضة'
            icon='📝'
            onClick={() => router.push('/appointments')}
          />
          <QuickActionButton
            title='تسجيل مريضة جديدة'
            description='إضافة مريضة للنظام'
            icon='👤'
            onClick={() => router.push('/patients')}
          />
          <QuickActionButton
            title='بحث عن مريضة'
            description='البحث في السجلات'
            icon='🔍'
            onClick={() => router.push('/patients')}
          />
          <QuickActionButton
            title='إنشاء فاتورة'
            description='إصدار فاتورة جديدة'
            icon='💰'
            onClick={() => router.push('/billing')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Appointments */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full'>
          <div className='flex justify-between items-center mb-6'>
            <div className="flex items-center gap-3">
              <span className="w-2 h-8 bg-indigo-600 rounded-full inline-block"></span>
              <h2 className='text-2xl font-bold text-gray-800'>مواعيد اليوم</h2>
            </div>
            <button
              onClick={() => router.push('/appointments')}
              className='text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm'
            >
              عرض الكل
            </button>
          </div>
          <div className='space-y-4'>
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appointment: any) => {
                const time = new Date(
                  appointment.appointmentTime
                ).toLocaleTimeString('ar-EG', {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const status =
                  appointment.status === 'BOOKED'
                    ? 'waiting'
                    : appointment.status === 'COMPLETED'
                      ? 'completed'
                      : 'upcoming';

                return (
                  <AppointmentCard
                    key={appointment.id}
                    time={time}
                    patientName={appointment.patientName}
                    reason=""
                    status={status}
                    showActions
                    onActionClick={() => router.push(`/appointments/${appointment.id}`)}
                  />
                );
              })
            ) : (
              <p className='text-gray-500 text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200'>
                لا توجد مواعيد اليوم
              </p>
            )}
          </div>
        </div>

        {/* Pending Invoices */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full'>
          <div className='flex justify-between items-center mb-6'>
            <div className="flex items-center gap-3">
              <span className="w-2 h-8 bg-rose-600 rounded-full inline-block"></span>
              <h2 className='text-2xl font-bold text-gray-800'>فواتير معلقة</h2>
            </div>
            <button
              onClick={() => router.push('/billing')}
              className='text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm'
            >
              عرض الكل
            </button>
          </div>
          <div className='space-y-4'>
            {pendingInvoices.length > 0 ? (
              pendingInvoices.map((invoice: any) => {
                const status =
                  invoice.paymentStatus === 'PAID'
                    ? invoiceStatus.PAID
                    : invoice.paymentStatus === 'PARTIAL'
                      ? invoiceStatus.PARTIAL
                      : invoiceStatus.UNPAID;

                return (
                  <InvoiceCard
                    key={invoice.id}
                    invoiceNumber={invoice.invoiceNumber}
                    patientName={invoice.patientName}
                    amount={invoice.totalAmount.toString()}
                    paid={invoice.paidAmount.toString()}
                    status={status}
                    onPaymentClick={() => router.push(`/billing/${invoice.id}`)}
                  />
                );
              })
            ) : (
              <p className='text-gray-500 text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200'>
                لا توجد فواتير معلقة
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
