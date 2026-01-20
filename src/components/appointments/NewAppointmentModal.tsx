"use client";
import { apiFetch } from "@/lib/api";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Search, User, X, Calendar, Clock } from "lucide-react";
import { AppointmentStatus, AppointmentStatusLabels } from "@/lib/enumdb";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
}

interface AppointmentData {
  id: number;
  patientId: number;
  appointmentDate: Date | string;
  appointmentTime: Date | string;
  durationMinutes: number;
  notes?: string | null;
  status?: string;
}

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialPatientId?: number;
  appointmentToEdit?: AppointmentData | null;
}

export function NewAppointmentModal({ isOpen, onClose, onSuccess, initialPatientId, appointmentToEdit }: NewAppointmentModalProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [bookedTimeSlots, setBookedTimeSlots] = useState<string[]>([]);
  const [bookedAppointmentsCount, setBookedAppointmentsCount] = useState(0);
  const [schedules, setSchedules] = useState<any[]>([]);

  const [formData, setFormData] = useState<{
    appointmentDate: string;
    appointmentTime: string;
    durationMinutes: number;
    notes: string;
    status: string;
  }>({
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: "09:00",
    durationMinutes: 30,
    notes: "",
    status: AppointmentStatus.BOOKED,
  });

  // جلب بيانات الموعد للتعديل
  useEffect(() => {
    if (appointmentToEdit && isOpen) {
      // جلب بيانات المريض
      apiFetch(`/api/patients/${appointmentToEdit.patientId}`)
        .then(res => res.json())
        .then(result => {
          if (result.success && result.data) {
            setSelectedPatient({
              id: result.data.id,
              firstName: result.data.firstName,
              lastName: result.data.lastName,
              phone: result.data.phone,
            });
          } else {
            console.error("Failed to fetch patient data:", result.error);
          }
        })
        .catch(error => console.error("Error fetching patient:", error));

      // تعبئة بيانات النموذج
      const appointmentDate = typeof appointmentToEdit.appointmentDate === 'string'
        ? appointmentToEdit.appointmentDate.split('T')[0]
        : new Date(appointmentToEdit.appointmentDate).toISOString().split('T')[0];

      const appointmentTime = typeof appointmentToEdit.appointmentTime === 'string'
        ? new Date(appointmentToEdit.appointmentTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        : new Date(appointmentToEdit.appointmentTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

      setFormData({
        appointmentDate,
        appointmentTime,
        durationMinutes: appointmentToEdit.durationMinutes || 30,
        notes: appointmentToEdit.notes || "",
        status: (appointmentToEdit.status as string) || AppointmentStatus.BOOKED,
      });
    } else if (initialPatientId && isOpen) {
      // جلب بيانات المريض إذا كان initialPatientId موجود
      apiFetch(`/api/patients/${initialPatientId}`)
        .then(res => res.json())
        .then(result => {
          if (result.success && result.data) {
            setSelectedPatient({
              id: result.data.id,
              firstName: result.data.firstName,
              lastName: result.data.lastName,
              phone: result.data.phone,
            });
          }
        });
    }
  }, [appointmentToEdit, initialPatientId, isOpen]);

  // إعادة تعيين النموذج عند الإغلاق (فقط إذا لم يكن في وضع التعديل)
  useEffect(() => {
    if (!isOpen && !appointmentToEdit) {
      setSelectedPatient(null);
      setSearchTerm("");
      setFormData({
        appointmentDate: new Date().toISOString().split('T')[0],
        appointmentTime: "09:00",
        durationMinutes: 30,
        notes: "",
        status: AppointmentStatus.BOOKED,
      });
    }
  }, [isOpen, appointmentToEdit]);

  // جلب الجداول الزمنية
  useEffect(() => {
    if (isOpen) {
      const doctorId = session?.user?.doctorId || 1;
      apiFetch(`/api/working-schedules?doctorId=${doctorId}&isActive=true`)
        .then(res => res.json())
        .then(result => {
          if (result.success && result.data) {
            setSchedules(result.data);
          }
        })
        .catch(error => console.error("Error fetching schedules:", error));
    }
  }, [isOpen, session]);

  // دالة لجلب المواعيد المحجوزة
  const fetchBookedAppointments = useCallback(async (date: string, excludeAppointmentId?: number) => {
    if (!date) {
      setBookedTimeSlots([]);
      return;
    }

    const doctorId = session?.user?.doctorId || 1;
    try {
      // Add timestamp to prevent caching
      const response = await apiFetch(`/api/appointments?appointmentDate=${date}&doctorId=${doctorId}&_t=${Date.now()}`);
      const result = await response.json();

      if (result.success && result.data) {
        // استخراج الأوقات المحجوزة
        const bookedAppointments = result.data
          .filter((apt: any) => {
            // استبعاد الموعد الحالي إذا كان في وضع التعديل
            if (excludeAppointmentId && apt.id === excludeAppointmentId) {
              return false;
            }
            // استبعاد المواعيد الملغاة
            return apt.status !== AppointmentStatus.CANCELLED && apt.status !== AppointmentStatus.NO_SHOW;
          })
          .map((apt: any) => {
            const time = new Date(apt.appointmentTime);
            const hours = time.getHours().toString().padStart(2, '0');
            const minutes = time.getMinutes().toString().padStart(2, '0');
            return {
              time: `${hours}:${minutes}`,
              duration: apt.durationMinutes || 30,
            };
          });

        // استخراج جميع الأوقات المحجوزة
        const bookedTimes: string[] = [];
        bookedAppointments.forEach((apt: any) => {
          const [startHours, startMinutes] = apt.time.split(':');
          const startTime = new Date();
          startTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + apt.duration);

          const slotDuration = 5; // Check every 5 minutes
          let currentTime = new Date(startTime);

          // Loop while current time is strictly less than end time
          // This ensures the end time slot itself remains available for the next appointment
          while (currentTime < endTime) {
            const hours = currentTime.getHours().toString().padStart(2, '0');
            const minutes = currentTime.getMinutes().toString().padStart(2, '0');
            const timeSlot = `${hours}:${minutes}`;

            if (!bookedTimes.includes(timeSlot)) {
              bookedTimes.push(timeSlot);
            }
            currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
          }
        });

        setBookedTimeSlots(bookedTimes);
        setBookedAppointmentsCount(bookedAppointments.length);
      } else {
        setBookedTimeSlots([]);
      }
    } catch (error) {
      console.error("Error fetching booked appointments:", error);
      // Don't clear booked slots on error to be safe, or handle differently?
      // For now, keeping empty clears it, which is risky, but standard fallback.
      setBookedTimeSlots([]);
    }
  }, [session?.user?.doctorId]);

  // جلب المواعيد المحجوزة عند تغيير التاريخ
  useEffect(() => {
    if (formData.appointmentDate) {
      fetchBookedAppointments(formData.appointmentDate, appointmentToEdit?.id);
    }
  }, [formData.appointmentDate, session?.user?.doctorId, fetchBookedAppointments, appointmentToEdit?.id]);

  // حساب الأوقات المتاحة
  useEffect(() => {
    if (formData.appointmentDate && schedules.length > 0) {
      const selectedDate = new Date(formData.appointmentDate);
      const dayOfWeek = selectedDate.getDay();

      const daySchedule = schedules.find(s => s.dayOfWeek === dayOfWeek && s.isActive);

      if (daySchedule) {
        const slots: string[] = [];
        const startTime = new Date(daySchedule.startTime);
        const endTime = new Date(daySchedule.endTime);
        const slotDuration = daySchedule.slotDurationMinutes || 30;

        let currentTime = new Date(startTime);

        while (currentTime < endTime) {
          const hours = currentTime.getHours().toString().padStart(2, '0');
          const minutes = currentTime.getMinutes().toString().padStart(2, '0');
          const timeSlot = `${hours}:${minutes}`;

          if (!bookedTimeSlots.includes(timeSlot)) {
            slots.push(timeSlot);
          }

          currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
        }

        setAvailableTimeSlots(slots);
        setFormData(prev => ({
          ...prev,
          durationMinutes: daySchedule.slotDurationMinutes || prev.durationMinutes
        }));

        if (bookedTimeSlots.includes(formData.appointmentTime) || !slots.includes(formData.appointmentTime)) {
          // Clear the time if it's no longer available, but don't auto-select
          setFormData(prev => ({ ...prev, appointmentTime: "" }));
        }
      } else {
        setAvailableTimeSlots([]);
      }
    }
  }, [formData.appointmentDate, schedules, bookedTimeSlots]);

  // البحث عن المرضى
  useEffect(() => {
    if (searchTerm.length < 2) {
      setPatients([]);
      return;
    }

    const fetchPatients = async () => {
      try {
        const response = await apiFetch(`/api/patients?search=${encodeURIComponent(searchTerm)}`);
        const result = await response.json();
        if (result.success) {
          setPatients(result.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    const debounceTimer = setTimeout(fetchPatients, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من اختيار المريض
    if (!selectedPatient) {
      alert("يرجى اختيار مريض");
      return;
    }

    // استخدام doctorId من الجلسة أو القيمة الافتراضية (1)
    const doctorId = session?.user?.doctorId || 1;

    if (!appointmentToEdit && bookedTimeSlots.includes(formData.appointmentTime)) {
      alert("هذا الوقت محجوز بالفعل. يرجى اختيار وقت آخر.");
      return;
    }

    setLoading(true);
    try {
      const [hours, minutes] = formData.appointmentTime.split(':');
      const appointmentDateTime = new Date(formData.appointmentDate);
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const isEditMode = !!appointmentToEdit;
      const url = isEditMode
        ? `/api/appointments/${appointmentToEdit.id}`
        : "/api/appointments";
      const method = isEditMode ? "PUT" : "POST";

      const body: any = {
        appointmentDate: formData.appointmentDate,
        appointmentTime: appointmentDateTime.toISOString(),
        durationMinutes: formData.durationMinutes,
        notes: formData.notes || null,
      };

      if (!isEditMode) {
        body.patientId = selectedPatient.id;
        body.doctorId = doctorId;
        body.status = formData.status;
        body.createdBy = session?.user?.id ? parseInt(session.user.id as string) : undefined;
      } else {
        body.status = formData.status;
      }

      const response = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (result.success) {
        await fetchBookedAppointments(formData.appointmentDate, appointmentToEdit?.id);
        onClose();
        if (onSuccess) onSuccess();
      } else {
        alert(result.error || `حدث خطأ أثناء ${isEditMode ? 'تحديث' : 'إضافة'} الموعد`);
      }
    } catch (error: any) {
      console.error(`Error ${appointmentToEdit ? 'updating' : 'creating'} appointment:`, error);
      alert(`حدث خطأ أثناء ${appointmentToEdit ? 'تحديث' : 'إضافة'} الموعد`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative z-10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-5 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold">
            {appointmentToEdit ? "تعديل الموعد" : "موعد جديد"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors duration-200 hover:bg-white/20 p-1 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* اختيار المريض */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              المريض *
            </label>
            {selectedPatient ? (
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{selectedPatient.phone}</p>
                  </div>
                </div>
                {!appointmentToEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPatient(null);
                      setSearchTerm("");
                    }}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث عن مريض..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowPatientSearch(true);
                  }}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {showPatientSearch && patients.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {patients.map((patient) => (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedPatient(patient);
                          setSearchTerm(`${patient.firstName} ${patient.lastName}`);
                          setShowPatientSearch(false);
                        }}
                        className="w-full text-right px-8 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <p className="font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{patient.phone}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* التاريخ والوقت */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                <Calendar className="inline w-4 h-4 mr-2" />
                تاريخ الموعد *
              </label>
              <input
                type="date"
                required
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                className="w-full px-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* حالة الموعد */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                حالة الموعد *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value={AppointmentStatus.BOOKED}>{AppointmentStatusLabels[AppointmentStatus.BOOKED]}</option>
                <option value={AppointmentStatus.CONFIRMED}>{AppointmentStatusLabels[AppointmentStatus.CONFIRMED]}</option>
                <option value={AppointmentStatus.COMPLETED}>{AppointmentStatusLabels[AppointmentStatus.COMPLETED]}</option>
                <option value={AppointmentStatus.CANCELLED}>{AppointmentStatusLabels[AppointmentStatus.CANCELLED]}</option>
                <option value={AppointmentStatus.NO_SHOW}>{AppointmentStatusLabels[AppointmentStatus.NO_SHOW]}</option>
              </select>
            </div>

          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              <Clock className="inline w-4 h-4 mr-2" />
              وقت الموعد *
            </label>

            {formData.appointmentDate && schedules.length > 0 ? (
              <>
                {/* عرض عدد المواعيد المحجوزة */}
                {bookedAppointmentsCount > 0 && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      📅 عدد المواعيد المحجوزة اليوم: <span className="font-bold">{bookedAppointmentsCount}</span>
                    </p>
                  </div>
                )}

                {/* Grid للمواعيد */}
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
                  {(() => {
                    const selectedDate = new Date(formData.appointmentDate);
                    const dayOfWeek = selectedDate.getDay();
                    const daySchedule = schedules.find(s => s.dayOfWeek === dayOfWeek && s.isActive);

                    if (!daySchedule) return null;

                    const allSlots: string[] = [];
                    const startTime = new Date(daySchedule.startTime);
                    const endTime = new Date(daySchedule.endTime);
                    const slotDuration = daySchedule.slotDurationMinutes || 30;

                    let currentTime = new Date(startTime);

                    while (currentTime < endTime) {
                      const hours = currentTime.getHours().toString().padStart(2, '0');
                      const minutes = currentTime.getMinutes().toString().padStart(2, '0');
                      allSlots.push(`${hours}:${minutes}`);
                      currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
                    }

                    return allSlots.map((time) => {
                      const isBooked = bookedTimeSlots.includes(time);
                      const isSelected = formData.appointmentTime === time;

                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => !isBooked && setFormData({ ...formData, appointmentTime: time })}
                          className={`
                              px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                              ${isBooked
                              ? 'bg-red-100 text-red-400 border-2 border-red-200 cursor-not-allowed line-through'
                              : isSelected
                                ? 'bg-blue-600 text-white border-2 border-blue-700 shadow-md scale-105'
                                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                            }
                            `}
                        >
                          {time}
                        </button>
                      );
                    });
                  })()}
                </div>

                {/* الوقت المختار */}
                {formData.appointmentTime && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ⏰ الوقت المختار: <span className="font-bold">{formData.appointmentTime}</span>
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <input
                  type="time"
                  required
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  className="w-full px-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {formData.appointmentDate && (
                  <p className="text-xs text-gray-500 mt-2">
                    {schedules.length > 0
                      ? "لا يوجد جدول زمني لهذا اليوم، يمكنك اختيار الوقت يدوياً"
                      : "لا يوجد جدول زمني، يمكنك اختيار الوقت يدوياً"}
                  </p>
                )}
              </>
            )}
          </div>

          {/* الملاحظات */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              ملاحظات (اختياري)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="أي ملاحظات إضافية..."
            />
          </div>

          {/* رسالة الخطأ إذا لم يتم اختيار المريض */}
          {!selectedPatient && !appointmentToEdit && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm font-medium">⚠️ يرجى اختيار مريض قبل الحفظ</p>
            </div>
          )}

          {/* الأزرار */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? "جاري الحفظ..." : appointmentToEdit ? "تحديث الموعد" : "حفظ الموعد"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
