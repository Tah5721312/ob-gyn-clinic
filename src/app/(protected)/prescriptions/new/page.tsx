"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, User, X, Plus, Trash2, Save } from "lucide-react";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
}

interface Medication {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function NewPrescriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([
    { medicationName: "", dosage: "", frequency: "", duration: "", instructions: "" }
  ]);
  const [notes, setNotes] = useState("");
  const [visitId, setVisitId] = useState<number | null>(null);

  // جلب visitId من URL إذا كان موجود
  useEffect(() => {
    const visitIdParam = searchParams.get('visitId');
    if (visitIdParam) {
      setVisitId(parseInt(visitIdParam));
    }
  }, [searchParams]);

  // Templates سريعة للأدوية الشائعة
  const commonMedications = [
    { name: "فيتامينات حمل", dosage: "حبة واحدة", frequency: "يومياً", duration: "شهر" },
    { name: "حديد", dosage: "حبة واحدة", frequency: "يومياً", duration: "شهر" },
    { name: "كالسيوم", dosage: "حبتين", frequency: "يومياً", duration: "شهر" },
    { name: "مضاد حيوي", dosage: "حبة واحدة", frequency: "كل 8 ساعات", duration: "أسبوع" },
  ];

  // جلب بيانات المريض إذا كان patientId موجود في URL
  useEffect(() => {
    const patientId = searchParams.get('patientId');
    if (patientId && !selectedPatient) {
      fetch(`/api/patients/${patientId}`)
        .then(res => res.json())
        .then(result => {
          if (result.success && result.data) {
            setSelectedPatient({
              id: result.data.id,
              firstName: result.data.firstName,
              lastName: result.data.lastName,
              phone: result.data.phone,
            });
            setSearchTerm(`${result.data.firstName} ${result.data.lastName}`);
          }
        });
    }
  }, [searchParams, selectedPatient]);

  // البحث عن المرضى
  useEffect(() => {
    if (searchTerm.length < 2) {
      setPatients([]);
      return;
    }

    const fetchPatients = async () => {
      try {
        const response = await fetch(`/api/patients?search=${encodeURIComponent(searchTerm)}`);
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

  // إضافة دواء جديد
  const addMedication = () => {
    setMedications([...medications, { medicationName: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
  };

  // حذف دواء
  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  // تحديث دواء
  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  // تطبيق قالب دواء شائع
  const applyCommonMedication = (med: typeof commonMedications[0]) => {
    const updated = [...medications];
    const lastIndex = medications.length - 1;
    updated[lastIndex] = {
      ...updated[lastIndex],
      medicationName: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      duration: med.duration,
    };
    setMedications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      alert("يرجى اختيار مريضة");
      return;
    }

    // التحقق من وجود دواء واحد على الأقل
    const hasMedication = medications.some(m => m.medicationName.trim() !== "");
    if (!hasMedication) {
      alert("يرجى إضافة دواء واحد على الأقل");
      return;
    }

    setLoading(true);
    try {
      // فلترة الأدوية الفارغة
      const validMedications = medications.filter(m => m.medicationName.trim() !== "");

      const response = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitId: visitId || null, // استخدام visitId من URL أو null
          followupId: null,
          notes: notes || null,
          items: validMedications.map(m => ({
            medicationName: m.medicationName,
            dosage: m.dosage,
            frequency: m.frequency,
            duration: m.duration,
            instructions: m.instructions || null,
          })),
        }),
      });

      const result = await response.json();
      if (result.success) {
        router.push(`/prescriptions/${result.data.id}`);
      } else {
        alert(result.error || "حدث خطأ أثناء إنشاء الروشتة");
      }
    } catch (error: any) {
      console.error("Error creating prescription:", error);
      alert("حدث خطأ أثناء إنشاء الروشتة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">روشتة جديدة</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* اختيار المريض */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المريضة *
            </label>
            {selectedPatient ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{selectedPatient.phone}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPatient(null);
                    setSearchTerm("");
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث عن مريضة..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowPatientSearch(true);
                  }}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {showPatientSearch && patients.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {patients.map((patient) => (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setSearchTerm(`${patient.firstName} ${patient.lastName}`);
                          setShowPatientSearch(false);
                        }}
                        className="w-full text-right px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
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

          {/* الأدوية الشائعة */}
          {selectedPatient && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                أدوية شائعة
              </label>
              <div className="flex flex-wrap gap-2">
                {commonMedications.map((med, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyCommonMedication(med)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                  >
                    {med.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* قائمة الأدوية */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                الأدوية *
              </label>
              <button
                type="button"
                onClick={addMedication}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus size={18} />
                إضافة دواء
              </button>
            </div>

            <div className="space-y-4">
              {medications.map((medication, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">دواء #{index + 1}</span>
                    {medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">اسم الدواء *</label>
                      <input
                        type="text"
                        value={medication.medicationName}
                        onChange={(e) => updateMedication(index, "medicationName", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="اسم الدواء"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">الجرعة</label>
                      <input
                        type="text"
                        value={medication.dosage}
                        onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="مثال: حبة واحدة"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">التكرار</label>
                      <input
                        type="text"
                        value={medication.frequency}
                        onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="مثال: يومياً"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">المدة</label>
                      <input
                        type="text"
                        value={medication.duration}
                        onChange={(e) => updateMedication(index, "duration", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="مثال: شهر"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">تعليمات إضافية</label>
                    <input
                      type="text"
                      value={medication.instructions}
                      onChange={(e) => updateMedication(index, "instructions", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="تعليمات خاصة..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* الملاحظات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات (اختياري)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="أي ملاحظات إضافية عن الروشتة..."
            />
          </div>

          {/* الأزرار */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading || !selectedPatient}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={18} />
              {loading ? "جاري الحفظ..." : "حفظ الروشتة"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

