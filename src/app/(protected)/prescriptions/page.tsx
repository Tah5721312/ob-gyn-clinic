"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, FileText, Calendar, User, Trash2, Edit, Eye } from "lucide-react";

interface PrescriptionListItem {
  id: number;
  visitId: number | null;
  followupId: number | null;
  notes: string | null;
  itemsCount: number;
  createdAt: Date;
  visit?: {
    patientId: number;
    visitDate: Date;
    patient?: {
      id: number;
      firstName: string;
      lastName: string;
    };
  };
  followup?: {
    pregnancy?: {
      patientId: number;
      patient?: {
        id: number;
        firstName: string;
        lastName: string;
      };
    };
  };
}

export default function PrescriptionsPage() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<PrescriptionListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // جلب الروشتات
  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/prescriptions`);
      const result = await response.json();

      if (result.success && result.data) {
        // فلترة حسب البحث (اسم المريضة)
        let filtered = result.data;
        if (search) {
          filtered = result.data.filter((prescription: PrescriptionListItem) => {
            const patient = prescription.visit?.patient || prescription.followup?.pregnancy?.patient;
            if (!patient) return false;
            const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
            return fullName.includes(search.toLowerCase());
          });
        }
        setPrescriptions(filtered);
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchPrescriptions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handleDelete = async (prescriptionId: number) => {
    try {
      const response = await fetch(`/api/prescriptions/${prescriptionId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setPrescriptions(prescriptions.filter((p) => p.id !== prescriptionId));
        setShowDeleteConfirm(null);
      } else {
        alert(result.error || "حدث خطأ أثناء حذف الروشتة");
      }
    } catch (error) {
      console.error("Error deleting prescription:", error);
      alert("حدث خطأ أثناء حذف الروشتة");
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPatientName = (prescription: PrescriptionListItem) => {
    const patient = prescription.visit?.patient || prescription.followup?.pregnancy?.patient;
    return patient ? `${patient.firstName} ${patient.lastName}` : "غير محدد";
  };

  const getPatientId = (prescription: PrescriptionListItem) => {
    return prescription.visit?.patientId || prescription.followup?.pregnancy?.patientId || null;
  };

  return (
    <main className="container mx-auto p-6 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الروشتات</h1>
          <p className="text-gray-600 mt-2">
            {loading ? "جاري التحميل..." : `${prescriptions.length} روشتة`}
          </p>
        </div>
        <button
          onClick={() => router.push("/prescriptions/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          روشتة جديدة
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
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
      </div>

      {/* Prescriptions List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">جاري التحميل...</div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">لا توجد روشتات</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الروشتة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المريضة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عدد الأدوية
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prescriptions.map((prescription) => (
                  <tr key={prescription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-gray-900">#{prescription.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{getPatientName(prescription)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">{prescription.itemsCount} دواء</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{formatDate(prescription.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/prescriptions/${prescription.id}`)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="عرض"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => router.push(`/prescriptions/${prescription.id}`)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(prescription.id)}
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
              هل أنت متأكد من حذف الروشتة #{showDeleteConfirm}؟ لا يمكن التراجع عن هذا الإجراء.
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
    </main>
  );
}

