"use client";
import { apiFetch } from "@/lib/api";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FileText,
  Save,
  Trash2,
  Plus,
  X,
  User,
  Calendar,
  ArrowRight,
  Edit,
  ArrowLeft,
} from "lucide-react";

interface Medication {
  id?: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Prescription {
  id: number;
  visitId: number | null;
  followupId: number | null;
  notes: string | null;
  createdAt: Date;
  items: Medication[];
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

export default function PrescriptionDetailClient() {
  const router = useRouter();
  const params = useParams();
  const prescriptionId = parseInt(params.id as string);

  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // جلب الروشتة
  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await apiFetch(`/api/prescriptions/${prescriptionId}`);
        const result = await response.json();

        if (result.success && result.data) {
          const data = result.data;
          setPrescription(data);
          setNotes(data.notes || "");
          setMedications(
            data.items.map((item: any) => ({
              id: item.id,
              medicationName: item.medicationName,
              dosage: item.dosage,
              frequency: item.frequency,
              duration: item.duration,
              instructions: item.instructions || "",
            }))
          );
        } else {
          alert("الروشتة غير موجودة");
          router.push("/prescriptions");
        }
      } catch (error) {
        console.error("Error fetching prescription:", error);
        alert("حدث خطأ أثناء جلب الروشتة");
        router.push("/prescriptions");
      } finally {
        setLoading(false);
      }
    };

    if (prescriptionId) {
      fetchPrescription();
    }
  }, [prescriptionId, router]);

  const handleSave = async () => {
    if (medications.length === 0) {
      alert("يجب إضافة على الأقل دواء واحد");
      return;
    }

    setSaving(true);
    try {
      const response = await apiFetch(`/api/prescriptions/${prescriptionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes,
          items: medications.map((m) => ({
            medicationName: m.medicationName,
            dosage: m.dosage,
            frequency: m.frequency,
            duration: m.duration,
            instructions: m.instructions,
          })),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsEditing(false);
        // تحديث البيانات المحلية
        if (prescription) {
          setPrescription({
            ...prescription,
            notes,
            items: medications,
          });
        }
        alert("تم حفظ التعديلات بنجاح");
      } else {
        alert(result.error || "حدث خطأ أثناء حفظ التعديلات");
      }
    } catch (error) {
      console.error("Error saving prescription:", error);
      alert("حدث خطأ أثناء حفظ التعديلات");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await apiFetch(`/api/prescriptions/${prescriptionId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        alert("تم حذف الروشتة بنجاح");
        router.push("/prescriptions");
      } else {
        alert(result.error || "حدث خطأ أثناء حذف الروشتة");
      }
    } catch (error) {
      console.error("Error deleting prescription:", error);
      alert("حدث خطأ أثناء حذف الروشتة");
    }
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        medicationName: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
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

  const getPatientName = () => {
    const patient =
      prescription?.visit?.patient || prescription?.followup?.pregnancy?.patient;
    return patient ? `${patient.firstName} ${patient.lastName}` : "غير محدد";
  };

  const getPatientId = () => {
    return (
      prescription?.visit?.patientId ||
      prescription?.followup?.pregnancy?.patientId ||
      null
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">جاري التحميل...</div>
    );
  }

  if (!prescription) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">الروشتة غير موجودة</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">روشتة #{prescription.id}</h1>
          <p className="text-gray-600 mt-2">{formatDate(prescription.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-5 h-5" />
                تعديل
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                حذف
              </button>
              <button
                onClick={() => router.push(`/prescriptions`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                العودة للروشتات
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  // استعادة البيانات الأصلية
                  if (prescription) {
                    setNotes(prescription.notes || "");
                    setMedications(
                      prescription.items.map((item: any) => ({
                        id: item.id,
                        medicationName: item.medicationName,
                        dosage: item.dosage,
                        frequency: item.frequency,
                        duration: item.duration,
                        instructions: item.instructions || "",
                      }))
                    );
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-5 h-5" />
                {saving ? "جاري الحفظ..." : "حفظ"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Patient Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4">
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{getPatientName()}</p>
            {getPatientId() && (
              <button
                onClick={() => router.push(`/patients/${getPatientId()}`)}
                className="text-sm text-blue-600 hover:text-blue-800 mt-1 flex items-center gap-1"
              >
                عرض الملف الشخصي
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">ملاحظات</h2>
        {isEditing ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="ملاحظات..."
          />
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">
            {notes || "لا توجد ملاحظات"}
          </p>
        )}
      </div>

      {/* Medications */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">الأدوية</h2>
          {isEditing && (
            <button
              onClick={addMedication}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              إضافة دواء
            </button>
          )}
        </div>

        {medications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>لا توجد أدوية</p>
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((medication, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                {isEditing && (
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => removeMedication(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم الدواء
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={medication.medicationName}
                        onChange={(e) =>
                          updateMedication(index, "medicationName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="اسم الدواء"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {medication.medicationName || "غير محدد"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الجرعة
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={medication.dosage}
                        onChange={(e) =>
                          updateMedication(index, "dosage", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="الجرعة"
                      />
                    ) : (
                      <p className="text-gray-900">{medication.dosage || "غير محدد"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      التكرار
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={medication.frequency}
                        onChange={(e) =>
                          updateMedication(index, "frequency", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="التكرار"
                      />
                    ) : (
                      <p className="text-gray-900">{medication.frequency || "غير محدد"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المدة
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={medication.duration}
                        onChange={(e) =>
                          updateMedication(index, "duration", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="المدة"
                      />
                    ) : (
                      <p className="text-gray-900">{medication.duration || "غير محدد"}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تعليمات
                    </label>
                    {isEditing ? (
                      <textarea
                        value={medication.instructions}
                        onChange={(e) =>
                          updateMedication(index, "instructions", e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="تعليمات الاستخدام"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {medication.instructions || "لا توجد تعليمات"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">تأكيد الحذف</h3>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من حذف الروشتة #{prescription.id}؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
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
