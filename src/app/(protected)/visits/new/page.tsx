"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, User, X, Calendar, ChevronDown, ChevronUp, Save, FileText } from "lucide-react";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
}

interface Appointment {
  id: number;
  appointmentDate: Date;
  appointmentTime: Date;
  appointmentType: string;
}

export default function NewVisitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);


  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    chiefComplaint: "",
    notes: "",
    // تفاصيل إضافية (collapsed)
    weight: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    pulse: "",
    examinationFindings: "",
    treatmentPlan: "",
    nextVisitDate: "",
  });

  // جلب Templates من قاعدة البيانات
  useEffect(() => {
    const loadTemplates = async () => {
      if (!session?.user?.doctorId) return;
      
      try {
        // جلب قوالب الروشتات فقط - استخدام encodeURIComponent للتأكد من encoding صحيح
        const templateType = encodeURIComponent("روشتة");
        const response = await fetch(`/api/templates?doctorId=${session.user.doctorId}&templateType=${templateType}&isActive=true`);
        const result = await response.json();
        
        console.log("Templates API response:", result);
        console.log("Templates count:", result.data?.length || 0);
        
        if (result.success && result.data) {
          // تحويل القوالب إلى الشكل المطلوب
          const allTemplates = result.data
            .map((t: any) => {
              try {
                const content = typeof t.content === 'string' ? JSON.parse(t.content) : t.content;
                return {
                  id: t.id,
                  name: t.templateName,
                  data: content,
                };
              } catch (e) {
                console.error("Error parsing template content:", e, t);
                return null;
              }
            })
            .filter((t: any) => t !== null);
          
          console.log("Parsed templates:", allTemplates.length);
          setTemplates(allTemplates);
        } else {
          console.warn("No templates found or API error:", result);
          setTemplates([]);
        }
      } catch (error) {
        console.error("Error loading templates:", error);
        setTemplates([]);
      }
    };

    loadTemplates();
  }, [session?.user?.doctorId]);

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
            loadAppointments(result.data.id);
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

  // جلب مواعيد المريض
  const loadAppointments = async (patientId: number) => {
    try {
      const response = await fetch(`/api/appointments?patientId=${patientId}&status=BOOKED`);
      const result = await response.json();
      if (result.success) {
        setAppointments(result.data || []);
        // اختيار أول موعد تلقائياً
        if (result.data && result.data.length > 0) {
          setSelectedAppointment(result.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // عند اختيار مريض، جلب مواعيده
  useEffect(() => {
    if (selectedPatient) {
      loadAppointments(selectedPatient.id);
    }
  }, [selectedPatient]);

  // جلب آخر زيارة للمريض
  const loadLastVisit = async () => {
    if (!selectedPatient) return;
    
    try {
      const response = await fetch(`/api/visits?patientId=${selectedPatient.id}`);
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        // ترتيب حسب التاريخ (الأحدث أولاً)
        const sortedVisits = result.data.sort((a: any, b: any) => {
          const dateA = new Date(a.visitDate).getTime();
          const dateB = new Date(b.visitDate).getTime();
          return dateB - dateA;
        });
        
        const lastVisit = sortedVisits[0];
        setFormData(prev => ({
          ...prev,
          chiefComplaint: lastVisit.chiefComplaint || prev.chiefComplaint,
          notes: lastVisit.notes || prev.notes,
          treatmentPlan: lastVisit.treatmentPlan || prev.treatmentPlan,
          examinationFindings: lastVisit.examinationFindings || prev.examinationFindings,
          weight: lastVisit.weight ? lastVisit.weight.toString() : prev.weight,
          bloodPressureSystolic: lastVisit.bloodPressureSystolic ? lastVisit.bloodPressureSystolic.toString() : prev.bloodPressureSystolic,
          bloodPressureDiastolic: lastVisit.bloodPressureDiastolic ? lastVisit.bloodPressureDiastolic.toString() : prev.bloodPressureDiastolic,
          pulse: lastVisit.pulse ? lastVisit.pulse.toString() : prev.pulse,
        }));
        
        // فتح تفاصيل إضافية تلقائياً إذا كانت هناك بيانات
        if (lastVisit.weight || lastVisit.bloodPressureSystolic || lastVisit.pulse || lastVisit.examinationFindings) {
          setShowDetails(true);
        }
      } else {
        alert("لا توجد زيارات سابقة لهذه المريضة");
      }
    } catch (error) {
      console.error("Error fetching last visit:", error);
      alert("حدث خطأ أثناء جلب آخر زيارة");
    }
  };

  // تطبيق قالب الروشتة - يملأ الملاحظات فقط
  const applyTemplate = (template: any) => {
    console.log("Applying template:", template);
    console.log("Template data:", template.data);
    
    let notesText = "";
    
    // إضافة التعليمات العامة
    if (template.data?.generalInstructions) {
      notesText = template.data.generalInstructions;
    }
    
    // إضافة الأدوية
    if (template.data?.medications && Array.isArray(template.data.medications)) {
      const medicationsText = template.data.medications
        .map((med: any) => {
          let medText = med.medicationName || "";
          if (med.dosage) medText += ` - ${med.dosage}`;
          if (med.frequency) medText += ` - ${med.frequency}`;
          if (med.duration) medText += ` - ${med.duration}`;
          if (med.instructions) medText += ` (${med.instructions})`;
          return medText;
        })
        .join("\n");
      
      notesText = notesText ? `${notesText}\n\n${medicationsText}` : medicationsText;
    }
    
    // تطبيق النص في الملاحظات
    if (notesText) {
      setFormData(prev => ({
        ...prev,
        notes: notesText,
      }));
      console.log("Notes updated:", notesText);
    } else {
      console.warn("No content found in template");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !selectedAppointment || !session?.user?.doctorId) {
      alert("يرجى اختيار مريض وموعد");
      return;
    }

    setLoading(true);
    try {
      const visitStartTime = new Date();
      
      const response = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: selectedAppointment.id,
          patientId: selectedPatient.id,
          doctorId: session.user.doctorId,
          visitDate: formData.visitDate,
          visitStartTime: visitStartTime.toISOString(),
          chiefComplaint: formData.chiefComplaint || null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          bloodPressureSystolic: formData.bloodPressureSystolic ? parseInt(formData.bloodPressureSystolic) : null,
          bloodPressureDiastolic: formData.bloodPressureDiastolic ? parseInt(formData.bloodPressureDiastolic) : null,
          pulse: formData.pulse ? parseInt(formData.pulse) : null,
          examinationFindings: formData.examinationFindings || null,
          treatmentPlan: formData.treatmentPlan || null,
          nextVisitDate: formData.nextVisitDate || null,
          notes: formData.notes || null,
          isDraft: false,
        }),
      });

      const result = await response.json();
      if (result.success) {
        router.push(`/visits/${result.data.id}`);
      } else {
        alert(result.error || "حدث خطأ أثناء إنشاء الزيارة");
      }
    } catch (error: any) {
      console.error("Error creating visit:", error);
      alert("حدث خطأ أثناء إنشاء الزيارة");
    } finally {
      setLoading(false);
    }
  };

  const handlePrescription = () => {
    // TODO: فتح صفحة/Modal الروشتة
    alert("سيتم فتح صفحة الروشتة قريباً");
  };

  return (
    <main className="container mx-auto p-6 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">كشف جديد</h1>
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
                    setSelectedAppointment(null);
                    setAppointments([]);
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

          {/* اختيار الموعد - تلقائي إذا كان واحد فقط */}
          {selectedPatient && appointments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الموعد *
              </label>
              {appointments.length === 1 ? (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {new Date(appointments[0].appointmentDate).toLocaleDateString('ar-EG')} - 
                    {new Date(appointments[0].appointmentTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {appointments.map((appointment) => {
                    const date = new Date(appointment.appointmentDate).toLocaleDateString('ar-EG');
                    const time = new Date(appointment.appointmentTime).toLocaleTimeString('ar-EG', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    });
                    
                    return (
                      <button
                        key={appointment.id}
                        type="button"
                        onClick={() => setSelectedAppointment(appointment)}
                        className={`w-full text-right p-3 border-2 rounded-lg transition-colors ${
                          selectedAppointment?.id === appointment.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-medium text-gray-900">{date} - {time}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* قوالب الروشتات */}
          {templates.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-blue-900 mb-3">
                قوالب الروشتات
              </label>
              <div className="flex flex-wrap gap-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("Button clicked, template:", template);
                      applyTemplate(template);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-blue-100 border-2 border-blue-300 rounded-lg text-sm transition-all font-medium text-blue-700 hover:shadow-md"
                  >
                    <span className="text-xl">💊</span>
                    <span>{template.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* نفس الزيارة السابقة */}
          {selectedPatient && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <button
                type="button"
                onClick={loadLastVisit}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 border-2 border-gray-300 rounded-lg text-sm transition-all font-medium text-gray-700 hover:shadow-md w-full justify-center"
              >
                <span className="text-xl">📋</span>
                <span>نفس الزيارة السابقة</span>
              </button>
            </div>
          )}

          {/* الشكوى الرئيسية - سطر واحد */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الشكوى
            </label>
            <input
              type="text"
              value={formData.chiefComplaint}
              onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ما هي شكوى المريضة؟"
            />
          </div>

          {/* ملاحظات سريعة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات سريعة
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ملاحظات سريعة..."
            />
          </div>

          {/* تفاصيل إضافية - Collapsed */}
          <div className="border border-gray-200 rounded-lg">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-700">تفاصيل إضافية</span>
              {showDetails ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {showDetails && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                {/* العلامات الحيوية */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوزن (كجم)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الضغط (علوي)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.bloodPressureSystolic}
                      onChange={(e) => setFormData({ ...formData, bloodPressureSystolic: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الضغط (سفلي)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.bloodPressureDiastolic}
                      onChange={(e) => setFormData({ ...formData, bloodPressureDiastolic: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      النبض
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.pulse}
                      onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* نتائج الفحص */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نتائج الفحص
                  </label>
                  <textarea
                    value={formData.examinationFindings}
                    onChange={(e) => setFormData({ ...formData, examinationFindings: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="نتائج الفحص..."
                  />
                </div>

                {/* خطة العلاج */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    خطة العلاج
                  </label>
                  <textarea
                    value={formData.treatmentPlan}
                    onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="خطة العلاج..."
                  />
                </div>

                {/* موعد المتابعة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    موعد المتابعة القادم
                  </label>
                  <input
                    type="date"
                    value={formData.nextVisitDate}
                    onChange={(e) => setFormData({ ...formData, nextVisitDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
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
              type="button"
              onClick={handlePrescription}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FileText size={18} />
              روشتة
            </button>
            <button
              type="submit"
              disabled={loading || !selectedPatient || !selectedAppointment}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={18} />
              {loading ? "جاري الحفظ..." : "حفظ"}
            </button>
          </div>
        </form>
      </main>
  );
}
