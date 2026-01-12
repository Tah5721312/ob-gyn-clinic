"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, Clock, User, Phone, Plus, CheckCircle, XCircle, AlertCircle, Edit, Trash2, ChevronRight, ChevronLeft, User as UserIcon, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppointmentListItem } from "@/lib/appointments/types";
import { NewAppointmentModal } from "./NewAppointmentModal";
import { AppointmentStatus, AppointmentStatusLabels, InvoiceItemType, InvoiceItemTypeLabels } from "@/lib/enumdb";

interface AppointmentListProps {
  initialAppointments?: AppointmentListItem[];
}

export function AppointmentList({ initialAppointments = [] }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<AppointmentListItem[]>(initialAppointments);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentListItem | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  // جلب المواعيد
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (selectedDate) params.append("appointmentDate", selectedDate);
        if (statusFilter) params.append("status", statusFilter);
        if (session?.user?.role === "DOCTOR" && session?.user?.doctorId) {
          params.append("doctorId", session.user.doctorId.toString());
        }

        const response = await fetch(`/api/appointments?${params.toString()}`);
        const result = await response.json();

        if (result.success) {
          setAppointments(result.data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchAppointments();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, selectedDate, statusFilter, session]);

  const formatTime = (time: Date | string) => {
    const date = typeof time === 'string' ? new Date(time) : time;
    return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string; icon: any }> = {
      [AppointmentStatus.BOOKED]: { label: AppointmentStatusLabels[AppointmentStatus.BOOKED], className: "bg-blue-100 text-blue-800", icon: Calendar },
      [AppointmentStatus.CONFIRMED]: { label: AppointmentStatusLabels[AppointmentStatus.CONFIRMED], className: "bg-green-100 text-green-800", icon: CheckCircle },
      [AppointmentStatus.COMPLETED]: { label: AppointmentStatusLabels[AppointmentStatus.COMPLETED], className: "bg-gray-100 text-gray-800", icon: CheckCircle },
      [AppointmentStatus.CANCELLED]: { label: AppointmentStatusLabels[AppointmentStatus.CANCELLED], className: "bg-red-100 text-red-800", icon: XCircle },
      [AppointmentStatus.NO_SHOW]: { label: AppointmentStatusLabels[AppointmentStatus.NO_SHOW], className: "bg-orange-100 text-orange-800", icon: AlertCircle },
    };

    const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800", icon: Calendar };
    const Icon = statusInfo.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        <Icon className="w-3 h-3" />
        {statusInfo.label}
      </span>
    );
  };

  const handleDelete = async (appointmentId: number, patientName: string) => {
    if (!confirm(`هل أنت متأكد من حذف موعد ${patientName}؟`)) {
      return;
    }

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        // إعادة تحميل المواعيد
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (selectedDate) params.append("appointmentDate", selectedDate);
        if (statusFilter) params.append("status", statusFilter);
        if (session?.user?.role === "DOCTOR" && session?.user?.doctorId) {
          params.append("doctorId", session.user.doctorId.toString());
        }

        const refreshResponse = await fetch(`/api/appointments?${params.toString()}`);
        const refreshResult = await refreshResponse.json();
        if (refreshResult.success) {
          setAppointments(refreshResult.data);
        }
      } else {
        alert(result.error || "حدث خطأ أثناء حذف الموعد");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("حدث خطأ أثناء حذف الموعد");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          موعد جديد
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المواعيد</h1>
          <p className="text-gray-600 mt-2">
            {loading ? "جاري التحميل..." : `${appointments.length} موعد`}
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4" dir="rtl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Status Filter */}
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 font-medium">الحالة</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
            >
              <option value="">جميع الحالات</option>
              <option value={AppointmentStatus.BOOKED}>{AppointmentStatusLabels[AppointmentStatus.BOOKED]}</option>
              <option value={AppointmentStatus.CONFIRMED}>{AppointmentStatusLabels[AppointmentStatus.CONFIRMED]}</option>
              <option value={AppointmentStatus.COMPLETED}>{AppointmentStatusLabels[AppointmentStatus.COMPLETED]}</option>
              <option value={AppointmentStatus.CANCELLED}>{AppointmentStatusLabels[AppointmentStatus.CANCELLED]}</option>
              <option value={AppointmentStatus.NO_SHOW}>{AppointmentStatusLabels[AppointmentStatus.NO_SHOW]}</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 font-medium">التاريخ</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="اليوم السابق"
              >
                <ChevronRight size={18} />
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
              />
              <button
                onClick={() => navigateDate('next')}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="اليوم التالي"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 font-medium">بحث</span>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو الهاتف..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden" dir="rtl">
        {loading ? (
          <div className="p-8 text-center text-gray-500">جاري التحميل...</div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">لا توجد مواعيد</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">اسم المريض</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">التاريخ</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">الوقت</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">الطبيب</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">نوع الموعد</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">الحالة</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{appointment.patientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {formatDate(appointment.appointmentDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        {formatTime(appointment.appointmentTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {appointment.doctorName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                        {appointment.appointmentType && Object.values(InvoiceItemType).includes(appointment.appointmentType as InvoiceItemType)
                          ? InvoiceItemTypeLabels[appointment.appointmentType as InvoiceItemType]
                          : appointment.appointmentType || "غير محدد"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(appointment.status)}
                        {appointment.hasVisit && (
                          <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">✓ زيارة</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-start">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/patients/${appointment.patientId}`);
                          }}
                          className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                          title="فتح ملف المريضة"
                        >
                          <User size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/visits/new?patientId=${appointment.patientId}`);
                          }}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="كشف "
                        >
                          <Stethoscope size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAppointment(appointment);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="تعديل الموعد"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(appointment.id, appointment.patientName);
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="حذف الموعد"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal إضافة/تعديل موعد */}
      <NewAppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAppointment(null);
        }}
        appointmentToEdit={editingAppointment}
        onSuccess={() => {
          // إعادة تحميل المواعيد
          const params = new URLSearchParams();
          if (search) params.append("search", search);
          if (selectedDate) params.append("appointmentDate", selectedDate);
          if (statusFilter) params.append("status", statusFilter);
          if (session?.user?.role === "DOCTOR" && session?.user?.doctorId) {
            params.append("doctorId", session.user.doctorId.toString());
          }

          fetch(`/api/appointments?${params.toString()}`)
            .then(res => res.json())
            .then(result => {
              if (result.success) {
                setAppointments(result.data);
              }
            });
          setEditingAppointment(null);
        }}
      />
    </div>
  );
}

