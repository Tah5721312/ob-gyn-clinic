"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, User, Plus, Edit, Trash2, CheckCircle, XCircle, Search } from "lucide-react";
import { WorkingScheduleListItem } from "@/lib/working-schedules/types";
import { NewScheduleModal } from "./NewScheduleModal";

interface ScheduleListProps {
  initialSchedules?: WorkingScheduleListItem[];
  userRole?: string;
  doctorId?: number;
}

const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export function ScheduleList({ initialSchedules = [], userRole, doctorId }: ScheduleListProps) {
  const [schedules, setSchedules] = useState<WorkingScheduleListItem[]>(initialSchedules);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<WorkingScheduleListItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);




  // جلب الجداول الزمنية
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (userRole === "DOCTOR" && doctorId) {
        params.append("doctorId", doctorId.toString());
      }

      const response = await fetch(`/api/working-schedules?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setSchedules(result.data);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [userRole, doctorId]);

  const formatTime = (time: Date | string) => {
    const date = typeof time === 'string' ? new Date(time) : time;
    return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  };

  const handleEdit = (schedule: WorkingScheduleListItem) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleDelete = async (scheduleId: number) => {
    try {
      const response = await fetch(`/api/working-schedules/${scheduleId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setSchedules(schedules.filter(s => s.id !== scheduleId));
        setShowDeleteConfirm(null);
      } else {
        alert(result.error || "حدث خطأ أثناء الحذف");
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
    fetchSchedules();
  };

  // تجميع الجداول حسب اليوم
  const schedulesByDay = schedules.reduce((acc, schedule) => {
    const day = schedule.dayName;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(schedule);
    return acc;
  }, {} as Record<string, WorkingScheduleListItem[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الجداول الزمنية</h1>
          <p className="text-gray-600 mt-1 text-sm">
            {loading ? "جاري التحميل..." : `إجمالي ${schedules.length} جدول`}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
        >
          <Plus size={18} />
          إضافة جدول جديد
        </button>
      </div>



      {/* Schedules List */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">جاري التحميل...</div>
      ) : schedules.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">لا توجد جداول زمنية</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(schedulesByDay).map(([day, daySchedules]) => (
            <div key={day} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">{day}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {daySchedules.map((schedule) => (
                  <div key={schedule.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-gray-400" />
                          <span className="font-medium text-gray-900">{schedule.doctorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">
                            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                          </span>
                        </div>
                        <div className="text-gray-600">
                          مدة الموعد: {schedule.slotDurationMinutes} دقيقة
                        </div>
                        <div className="flex items-center gap-2">
                          {schedule.isActive ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              <CheckCircle className="w-4 h-4" />
                              نشط
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                              <XCircle className="w-4 h-4" />
                              غير نشط
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(schedule.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">تأكيد الحذف</h3>
            <p className="text-gray-600 mb-6">هل أنت متأكد من حذف هذا الجدول الزمني؟</p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New/Edit Schedule Modal */}
      <NewScheduleModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        scheduleToEdit={editingSchedule}
        doctorId={userRole === "DOCTOR" ? doctorId : undefined}
      />
    </div>
  );
}

