"use client";
import { apiFetch } from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, Plus, Stethoscope, Calendar, User, Trash2, Edit, Eye, Clock } from "lucide-react";
import { VisitListItem } from "@/lib/visits/types";

export default function VisitsClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const [visits, setVisits] = useState<VisitListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDraftFilter, setIsDraftFilter] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // جلب الزيارات
  const fetchVisits = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedDate) params.append("visitDate", selectedDate);
      if (isDraftFilter !== "") {
        params.append("isDraft", isDraftFilter);
      }
      if (session?.user?.role === "DOCTOR" && session?.user?.doctorId) {
        params.append("doctorId", session.user.doctorId.toString());
      }

      const response = await apiFetch(`/api/visits?${params.toString()}`);
      const result = await response.json();

      if (result.success && result.data) {
        setVisits(result.data);
      }
    } catch (error) {
      console.error("Error fetching visits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchVisits();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, selectedDate, isDraftFilter, session]);

  const handleDelete = async (visitId: number) => {
    try {
      const response = await apiFetch(`/api/visits/${visitId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setVisits(visits.filter((v) => v.id !== visitId));
        setShowDeleteConfirm(null);
      } else {
        alert(result.error || "حدث خطأ أثناء حذف الزيارة");
      }
    } catch (error) {
      console.error("Error deleting visit:", error);
      alert("حدث خطأ أثناء حذف الزيارة");
    }
  };

  const formatDate = (date: Date | string) => {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الزيارات</h1>
          <p className="text-gray-600 mt-2">
            {loading ? "جاري التحميل..." : `${visits.length} زيارة`}
          </p>
        </div>
        <button
          onClick={() => router.push("/visits/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          زيارة جديدة
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن مريضة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={isDraftFilter}
              onChange={(e) => setIsDraftFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع الزيارات</option>
              <option value="false">مكتملة</option>
              <option value="true">مسودات</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visits List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">جاري التحميل...</div>
      ) : visits.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">لا توجد زيارات</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المريضة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الوقت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الطبيب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الشكوى الرئيسية
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{visit.patientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{formatDate(visit.visitDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {formatTime(visit.visitStartTime)} - {formatTime(visit.visitEndTime)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {visit.doctorName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">
                        {visit.chiefComplaint || "لا توجد شكوى"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {visit.isDraft ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          مسودة
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          مكتملة
                        </span>
                      )}
                      {visit.hasDiagnoses && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          تشخيص
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/visits/new?patientId=${visit.patientId}`)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="اضافة"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => router.push(`/visits/new?patientId=${visit.patientId}&visitId=${visit.id}`)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => router.push(`/patients/${visit.patientId}`)}
                          className="text-purple-600 hover:text-purple-900 transition-colors"
                          title="ملف المريضة"
                        >
                          <User className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(visit.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(null)}
          />
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">تأكيد الحذف</h3>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من حذف الزيارة #{showDeleteConfirm}؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
