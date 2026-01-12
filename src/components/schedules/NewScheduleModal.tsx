"use client";
import { apiFetch } from "@/lib/api";

import { useState, useEffect } from "react";
import { X, Clock, Calendar, User } from "lucide-react";
import { WorkingScheduleListItem } from "@/lib/working-schedules/types";

interface NewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  scheduleToEdit?: WorkingScheduleListItem | null;
  doctorId?: number;
}

const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export function NewScheduleModal({
  isOpen,
  onClose,
  onSuccess,
  scheduleToEdit,
  doctorId
}: NewScheduleModalProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    doctorId: doctorId || 1,
    dayOfWeek: 0,
    dayName: dayNames[0],
    startTime: "09:00",
    endTime: "17:00",
    slotDurationMinutes: 30,
    maxPatientsPerSlot: 1,
    isActive: true,
  });



  // تعبئة البيانات عند التعديل
  useEffect(() => {
    if (scheduleToEdit && isOpen) {
      const startTime = typeof scheduleToEdit.startTime === 'string'
        ? new Date(scheduleToEdit.startTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        : scheduleToEdit.startTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

      const endTime = typeof scheduleToEdit.endTime === 'string'
        ? new Date(scheduleToEdit.endTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        : scheduleToEdit.endTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

      setFormData({
        doctorId: scheduleToEdit.doctorId,
        dayOfWeek: scheduleToEdit.dayOfWeek,
        dayName: scheduleToEdit.dayName,
        startTime,
        endTime,
        slotDurationMinutes: scheduleToEdit.slotDurationMinutes,
        maxPatientsPerSlot: scheduleToEdit.maxPatientsPerSlot,
        isActive: scheduleToEdit.isActive,
      });
    } else if (!scheduleToEdit && isOpen) {
      // إعادة تعيين النموذج
      setFormData({
        doctorId: doctorId || 1,
        dayOfWeek: 0,
        dayName: dayNames[0],
        startTime: "09:00",
        endTime: "17:00",
        slotDurationMinutes: 30,
        maxPatientsPerSlot: 1,
        isActive: true,
      });
    }
  }, [scheduleToEdit, isOpen, doctorId]);

  const handleDayChange = (dayOfWeek: number) => {
    setFormData({
      ...formData,
      dayOfWeek,
      dayName: dayNames[dayOfWeek],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // تحويل الوقت إلى DateTime
      const today = new Date();
      const [startHours, startMinutes] = formData.startTime.split(':');
      const [endHours, endMinutes] = formData.endTime.split(':');

      const startTime = new Date(today);
      startTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

      const endTime = new Date(today);
      endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

      const url = scheduleToEdit
        ? `/api/working-schedules/${scheduleToEdit.id}`
        : '/api/working-schedules';

      const method = scheduleToEdit ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        alert(result.error || "حدث خطأ أثناء الحفظ");
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" dir="rtl">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {scheduleToEdit ? "تعديل جدول زمني" : "إضافة جدول زمني جديد"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">


          {/* Day Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline ml-1" />
              اليوم
            </label>
            <select
              value={formData.dayOfWeek}
              onChange={(e) => handleDayChange(parseInt(e.target.value))}
              className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {dayNames.map((day, index) => (
                <option key={index} value={index}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline ml-1" />
                وقت البداية
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline ml-1" />
                وقت النهاية
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Slot Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مدة الموعد (بالدقائق)
            </label>
            <input
              type="number"
              min="5"
              max="120"
              step="5"
              value={formData.slotDurationMinutes}
              onChange={(e) => setFormData({ ...formData, slotDurationMinutes: parseInt(e.target.value) })}
              className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Max Patients Per Slot */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحد الأقصى للمرضى في الموعد الواحد
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.maxPatientsPerSlot}
              onChange={(e) => setFormData({ ...formData, maxPatientsPerSlot: parseInt(e.target.value) })}
              className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              نشط
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "جاري الحفظ..." : scheduleToEdit ? "تحديث" : "حفظ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

