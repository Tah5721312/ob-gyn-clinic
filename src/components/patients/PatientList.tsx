"use client";
import { apiFetch } from "@/lib/api";

import { useState, useEffect, useRef } from "react";
import { Search, Phone, Eye, Calendar, Stethoscope, Plus, Users, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PatientListItem, PatientListResponse } from "@/lib/patients";
import { NewPatientModal } from "./NewPatientModal";

interface PatientListProps {
  initialPatients?: PatientListItem[];
}

export function PatientList({ initialPatients = [] }: PatientListProps) {
  const [patients, setPatients] = useState<PatientListItem[]>(initialPatients);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showActions, setShowActions] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<{
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string | Date;
    bloodType?: string | null;
    phone: string;
    phone2?: string | null;
    address?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    emergencyContactRelation?: string | null;
    notes?: string | null;
  } | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const isDoctor = session?.user?.role === "DOCTOR";
  const actionsRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowActions(null);
      }
    };

    if (showActions !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActions]);

  // البحث والفلترة
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);

        const response = await apiFetch(`/api/patients?${params.toString()}`);
        const result: PatientListResponse = await response.json();

        if (result.success) {
          setPatients(result.data);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchPatients();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handleViewProfile = (patientId: number) => {
    router.push(`/patients/${patientId}`);
  };

  const handleNewAppointment = (patientId: number) => {
    router.push(`/appointments?patientId=${patientId}`);
  };

  const handleNewVisit = (patientId: number) => {
    router.push(`/visits/new?patientId=${patientId}`);
  };

  const handleEdit = async (patient: PatientListItem) => {
    try {
      // جلب بيانات المريض الكاملة
      const response = await apiFetch(`/api/patients/${patient.id}`);
      const result = await response.json();

      if (result.success && result.data) {
        setEditingPatient(result.data);
        setIsModalOpen(true);
      } else {
        alert('حدث خطأ أثناء جلب بيانات المريضة');
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
      alert('حدث خطأ أثناء جلب بيانات المريضة');
    }
  };

  const handleDelete = async (patient: PatientListItem) => {
    if (!confirm(`هل أنت متأكد من حذف المريضة ${patient.fullName}؟\n\nهذا الإجراء لا يمكن التراجع عنه.`)) {
      return;
    }

    try {
      const response = await apiFetch(`/api/patients/${patient.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        // إعادة تحميل قائمة المرضى
        const params = new URLSearchParams();
        if (search) params.append("search", search);

        apiFetch(`/api/patients?${params.toString()}`)
          .then(res => res.json())
          .then((result: PatientListResponse) => {
            if (result.success) {
              setPatients(result.data);
            }
          });
      } else {
        alert(result.error || 'حدث خطأ أثناء حذف المريضة');
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('حدث خطأ أثناء حذف المريضة');
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">إجمالي المرضى</p>
              <p className="text-4xl font-bold mt-1">{patients.length}</p>
            </div>
            <Users className="w-12 h-12 opacity-30" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">المرضى</h1>
          <p className="text-gray-600 mt-1 text-sm">
            {loading ? "جاري البحث..." : `إجمالي ${patients.length} مريضة`}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
        >
          <Plus size={18} />
          إضافة مريضة جديدة
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث بالاسم أو رقم الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">جاري التحميل...</div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد مريضات</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">الاسم</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">الهاتف</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">العمر</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">تاريخ التسجيل</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">الحالة</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewProfile(patient.id)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        {patient.fullName}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`tel:${patient.phone}`}
                        className="text-gray-900 hover:text-blue-600 flex items-center gap-2 font-medium"
                      >
                        <Phone className="w-4 h-4 text-blue-500" />
                        {patient.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {patient.age} سنة
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {patient.registrationDate 
                        ? new Date(patient.registrationDate).toLocaleDateString('ar-EG')
                        : '—'
                      }
                    </td>
                    <td className="px-6 py-4">
                      {patient.isActive ? (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          نشط
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          غير نشط
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-start">
                        <button
                          onClick={() => handleViewProfile(patient.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="عرض الملف الشخصي"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleNewAppointment(patient.id)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="موعد جديد"
                        >
                          <Calendar className="w-5 h-5" />
                        </button>
                        {isDoctor && (
                          <button
                            onClick={() => handleNewVisit(patient.id)}
                            className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                            title="زيارة جديدة"
                          >
                            <Stethoscope className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(patient)}
                          className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(patient)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
        )}
      </div>

      {/* Modal إضافة/تعديل مريضة */}
      <NewPatientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPatient(null);
        }}
        patientToEdit={editingPatient}
        onSuccess={() => {
          // إعادة تحميل المرضى
          const params = new URLSearchParams();
          if (search) params.append("search", search);

          apiFetch(`/api/patients?${params.toString()}`)
            .then(res => res.json())
            .then((result: PatientListResponse) => {
              if (result.success) {
                setPatients(result.data);
              }
            });
          setEditingPatient(null);
        }}
      />
    </div>
  );
}

