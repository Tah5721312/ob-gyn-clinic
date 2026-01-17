"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, Clock, User, FileText, Pill, Edit, Printer } from "lucide-react";

interface VisitDetailProps {
  visit: any;
}

export function VisitDetail({ visit }: VisitDetailProps) {
  const router = useRouter();

  const formatDate = (date: Date | string | null) => {
    if (!date) return "غير محدد";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date | string | null) => {
    if (!date) return "غير محدد";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تفاصيل الزيارة</h1>
          <p className="text-gray-600 mt-2">
            {formatDate(visit.visitDate)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/prescriptions/new?visitId=${visit.id}&patientId=${visit.patientId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Pill size={18} />
            روشتة جديدة
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Printer size={18} />
            طباعة
          </button>
        </div>
      </div>

      {/* معلومات المريضة */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          معلومات المريضة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">الاسم</p>
            <p className="text-lg font-medium text-gray-900">
              {visit.patient.firstName} {visit.patient.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">الهاتف</p>
            <p className="text-lg font-medium text-gray-900">{visit.patient.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">العمر</p>
            <p className="text-lg font-medium text-gray-900">
              {visit.patient.dateOfBirth
                ? new Date().getFullYear() - new Date(visit.patient.dateOfBirth).getFullYear()
                : "غير محدد"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">الطبيب</p>
            <p className="text-lg font-medium text-gray-900">
              د. {visit.doctor.firstName} {visit.doctor.lastName}
            </p>
          </div>
        </div>
      </div>

      {/* معلومات الموعد */}
      {visit.appointment && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            معلومات الموعد
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">التاريخ</p>
              <p className="text-lg font-medium text-gray-900">
                {formatDate(visit.appointment.appointmentDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">الوقت</p>
              <p className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {formatTime(visit.appointment.appointmentTime)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">مدة الزيارة</p>
              <p className="text-lg font-medium text-gray-900">
                {visit.visitStartTime && visit.visitEndTime
                  ? `${Math.round(
                      (new Date(visit.visitEndTime).getTime() -
                        new Date(visit.visitStartTime).getTime()) /
                        60000
                    )} دقيقة`
                  : "غير محدد"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* الشكوى */}
      {visit.chiefComplaint && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">الشكوى الرئيسية</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{visit.chiefComplaint}</p>
        </div>
      )}

      {/* العلامات الحيوية */}
      {(visit.weight || visit.bloodPressureSystolic || visit.pulse || visit.temperature) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">العلامات الحيوية</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {visit.weight && (
              <div>
                <p className="text-sm text-gray-600">الوزن</p>
                <p className="text-lg font-medium text-gray-900">{visit.weight} كجم</p>
              </div>
            )}
            {(visit.bloodPressureSystolic || visit.bloodPressureDiastolic) && (
              <div>
                <p className="text-sm text-gray-600">الضغط</p>
                <p className="text-lg font-medium text-gray-900">
                  {visit.bloodPressureSystolic}/{visit.bloodPressureDiastolic} ملم زئبق
                </p>
              </div>
            )}
            {visit.pulse && (
              <div>
                <p className="text-sm text-gray-600">النبض</p>
                <p className="text-lg font-medium text-gray-900">{visit.pulse} / دقيقة</p>
              </div>
            )}
            {visit.temperature && (
              <div>
                <p className="text-sm text-gray-600">درجة الحرارة</p>
                <p className="text-lg font-medium text-gray-900">{visit.temperature}°C</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* نتائج الفحص */}
      {visit.examinationFindings && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">نتائج الفحص</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{visit.examinationFindings}</p>
        </div>
      )}

      {/* خطة العلاج */}
      {visit.treatmentPlan && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">خطة العلاج</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{visit.treatmentPlan}</p>
        </div>
      )}

      {/* الملاحظات */}
      {visit.notes && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            الملاحظات
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">{visit.notes}</p>
        </div>
      )}

      {/* الروشتات */}
      {visit.prescriptions && visit.prescriptions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Pill className="w-5 h-5" />
            الروشتات ({visit.prescriptions.length})
          </h2>
          <div className="space-y-3">
            {visit.prescriptions.map((prescription: any) => (
              <div
                key={prescription.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => router.push(`/prescriptions/${prescription.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      روشتة #{prescription.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(prescription.createdAt)}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* موعد المتابعة */}
      {visit.nextVisitDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-2">موعد المتابعة القادم</h2>
          <p className="text-lg text-blue-700">{formatDate(visit.nextVisitDate)}</p>
        </div>
      )}

      {/* الأزرار */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          رجوع
        </button>
        <button
          onClick={() => router.push(`/prescriptions/new?visitId=${visit.id}&patientId=${visit.patientId}`)}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Pill size={18} />
          إضافة روشتة
        </button>
      </div>
    </div>
  );
}

