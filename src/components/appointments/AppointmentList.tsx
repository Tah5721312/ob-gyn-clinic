"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, Clock, User, Phone, Plus, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppointmentListItem } from "@/lib/appointments/types";
import { NewAppointmentModal } from "./NewAppointmentModal";

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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string; icon: any }> = {
      BOOKED: { label: "محجوز", className: "bg-blue-100 text-blue-800", icon: Calendar },
      CONFIRMED: { label: "مؤكد", className: "bg-green-100 text-green-800", icon: CheckCircle },
      COMPLETED: { label: "مكتمل", className: "bg-gray-100 text-gray-800", icon: CheckCircle },
      CANCELLED: { label: "ملغي", className: "bg-red-100 text-red-800", icon: XCircle },
      NO_SHOW: { label: "لم يحضر", className: "bg-orange-100 text-orange-800", icon: AlertCircle },
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المواعيد</h1>
          <p className="text-gray-600 mt-2">
            {loading ? "جاري التحميل..." : `${appointments.length} موعد`}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          موعد جديد
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو الهاتف..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date Filter */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">جميع الحالات</option>
            <option value="BOOKED">محجوز</option>
            <option value="CONFIRMED">مؤكد</option>
            <option value="COMPLETED">مكتمل</option>
            <option value="CANCELLED">ملغي</option>
            <option value="NO_SHOW">لم يحضر</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">جاري التحميل...</div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">لا توجد مواعيد</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => router.push(`/appointments/${appointment.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.patientName}
                      </h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(appointment.appointmentDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(appointment.appointmentTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {appointment.doctorName}
                      </span>
                      {appointment.hasVisit && (
                        <span className="text-green-600 font-medium">✓ تمت الزيارة</span>
                      )}
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-sm text-gray-500">{appointment.appointmentType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal إضافة موعد جديد */}
      <NewAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
        }}
      />
    </div>
  );
}

