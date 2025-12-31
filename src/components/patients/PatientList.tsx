"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Phone, MapPin, Shield, Baby, MoreVertical, Eye, Calendar, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PatientListItem, PatientListResponse } from "@/lib/patients";

interface PatientListProps {
  initialPatients?: PatientListItem[];
}

export function PatientList({ initialPatients = [] }: PatientListProps) {
  const [patients, setPatients] = useState<PatientListItem[]>(initialPatients);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    isActive: "",
    hasInsurance: "",
    isPregnant: "",
    city: "",
  });
  const [showActions, setShowActions] = useState<number | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const isDoctor = session?.user?.userType === "DOCTOR";
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
        if (filters.isActive) params.append("isActive", filters.isActive);
        if (filters.hasInsurance) params.append("hasInsurance", filters.hasInsurance);
        if (filters.isPregnant) params.append("isPregnant", filters.isPregnant);
        if (filters.city) params.append("city", filters.city);

        const response = await fetch(`/api/patients?${params.toString()}`);
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
  }, [search, filters]);

  const handleViewProfile = (patientId: number) => {
    router.push(`/patients/${patientId}`);
  };

  const handleNewAppointment = (patientId: number) => {
    router.push(`/appointments/new?patientId=${patientId}`);
  };

  const handleNewVisit = (patientId: number) => {
    router.push(`/visits/new?patientId=${patientId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">قائمة المرضى</h1>
          <p className="text-gray-600 mt-2">
            {loading ? "جاري البحث..." : `تم العثور على ${patients.length} مريض`}
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث بالاسم، رقم الهاتف، أو الرقم القومي..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Active Filter */}
          <select
            value={filters.isActive}
            onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">جميع الحالات</option>
            <option value="true">نشط</option>
            <option value="false">غير نشط</option>
          </select>

          {/* Insurance Filter */}
          <select
            value={filters.hasInsurance}
            onChange={(e) => setFilters({ ...filters, hasInsurance: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">جميع التأمينات</option>
            <option value="true">لديه تأمين</option>
            <option value="false">بدون تأمين</option>
          </select>

          {/* Pregnant Filter */}
          <select
            value={filters.isPregnant}
            onChange={(e) => setFilters({ ...filters, isPregnant: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">جميع الحالات</option>
            <option value="true">حامل</option>
            <option value="false">غير حامل</option>
          </select>

          {/* City Filter */}
          <input
            type="text"
            placeholder="المدينة..."
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">جاري التحميل...</div>
        ) : patients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">لا توجد نتائج</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الاسم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الهاتف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العمر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المدينة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التأمين
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحمل
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
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewProfile(patient.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {patient.fullName}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`tel:${patient.phone}`}
                        className="text-gray-900 hover:text-blue-600 flex items-center gap-1"
                      >
                        <Phone className="w-4 h-4" />
                        {patient.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {patient.age} سنة
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {patient.city ? (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {patient.city}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.hasInsurance ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Shield className="w-3 h-3" />
                          نعم
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.isPregnant ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                          <Baby className="w-3 h-3" />
                          حامل
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.isActive ? (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          نشط
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          غير نشط
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative" ref={actionsRef}>
                        <button
                          onClick={() =>
                            setShowActions(showActions === patient.id ? null : patient.id)
                          }
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {showActions === patient.id && (
                          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  handleViewProfile(patient.id);
                                  setShowActions(null);
                                }}
                                className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                عرض الملف الشخصي
                              </button>
                              <button
                                onClick={() => {
                                  handleNewAppointment(patient.id);
                                  setShowActions(null);
                                }}
                                className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Calendar className="w-4 h-4" />
                                موعد جديد
                              </button>
                              {isDoctor && (
                                <button
                                  onClick={() => {
                                    handleNewVisit(patient.id);
                                    setShowActions(null);
                                  }}
                                  className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <Stethoscope className="w-4 h-4" />
                                  زيارة جديدة
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

