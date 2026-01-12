"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, User, X, Calendar, ChevronDown, ChevronUp, Save, FileText, ArrowRight, ChevronRight } from "lucide-react";

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
  const [showPrescriptionsModal, setShowPrescriptionsModal] = useState(false);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
  const [hasPreviousVisits, setHasPreviousVisits] = useState(false);


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
          // تحويل القوالب إلى الشكل المطلوب - المحتوى كنص عادي
          const allTemplates = result.data
            .map((t: any) => {
              // استخدام المحتوى مباشرة كنص (بدون parse)
              return {
                id: t.id,
                name: t.templateName,
                data: t.content || "", // المحتوى كنص عادي
                content: t.content || "", // أيضاً حفظه في content للتوافق
              };
            })
            .filter((t: any) => t !== null);
          
          setTemplates(allTemplates);
        } else {
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
    const visitId = searchParams.get('visitId');
    
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
            
            // إذا كان visitId موجود، جلب بيانات الزيارة وملء النموذج
            if (visitId) {
              fetch(`/api/visits/${visitId}`)
                .then(res => res.json())
                .then(visitResult => {
                  if (visitResult.success && visitResult.data) {
                    const visit = visitResult.data;
                    setFormData({
                      visitDate: visit.visitDate ? new Date(visit.visitDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                      chiefComplaint: visit.chiefComplaint || "",
                      notes: visit.notes || "",
                      weight: visit.weight ? visit.weight.toString() : "",
                      bloodPressureSystolic: visit.bloodPressureSystolic ? visit.bloodPressureSystolic.toString() : "",
                      bloodPressureDiastolic: visit.bloodPressureDiastolic ? visit.bloodPressureDiastolic.toString() : "",
                      pulse: visit.pulse ? visit.pulse.toString() : "",
                      examinationFindings: visit.examinationFindings || "",
                      treatmentPlan: visit.treatmentPlan || "",
                      nextVisitDate: visit.nextVisitDate ? new Date(visit.nextVisitDate).toISOString().split('T')[0] : "",
                    });
                    
                    // فتح تفاصيل إضافية إذا كانت هناك بيانات
                    if (visit.weight || visit.bloodPressureSystolic || visit.pulse || visit.examinationFindings) {
                      setShowDetails(true);
                    }
                  }
                })
                .catch(error => {
                  console.error("Error loading visit data:", error);
                });
            }
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
        const allAppointments = result.data || [];
        // ترتيب المواعيد حسب التاريخ والوقت (الأحدث أولاً)
        const sortedAppointments = allAppointments.sort((a: Appointment, b: Appointment) => {
          const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`).getTime();
          const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`).getTime();
          return dateB - dateA; // الأحدث أولاً
        });
        setAppointments(sortedAppointments);
        // اختيار أحدث موعد تلقائياً
        if (sortedAppointments.length > 0) {
          setSelectedAppointment(sortedAppointments[0]);
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

  // التحقق من وجود زيارات سابقة
  useEffect(() => {
    const checkPreviousVisits = async () => {
      if (!selectedPatient) {
        setHasPreviousVisits(false);
        return;
      }

      try {
        const response = await fetch(`/api/visits?patientId=${selectedPatient.id}`);
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          setHasPreviousVisits(true);
        } else {
          setHasPreviousVisits(false);
        }
      } catch (error) {
        console.error("Error checking previous visits:", error);
        setHasPreviousVisits(false);
      }
    };

    checkPreviousVisits();
  }, [selectedPatient]);

  // جلب آخر زيارة للمريض
  const loadLastVisit = async () => {
    if (!selectedPatient) {
      alert("يرجى اختيار مريضة أولاً");
      return;
    }
    
    try {
      const response = await fetch(`/api/visits?patientId=${selectedPatient.id}`);
      const result = await response.json();
      
      console.log("Last visit API response:", result);
      
      if (result.success && result.data && result.data.length > 0) {
        // ترتيب حسب التاريخ (الأحدث أولاً)
        const sortedVisits = result.data.sort((a: any, b: any) => {
          const dateA = new Date(a.visitDate).getTime();
          const dateB = new Date(b.visitDate).getTime();
          return dateB - dateA;
        });
        
        const lastVisit = sortedVisits[0];
        console.log("Last visit data:", lastVisit);
        
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
        
        alert("تم تحميل بيانات آخر زيارة بنجاح");
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
    // المحتوى الآن نص عادي دائماً
    const notesText = template.data || template.content || "";
    
    // تطبيق النص في الملاحظات
    if (notesText) {
      setFormData(prev => ({
        ...prev,
        notes: notesText,
      }));
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
        router.push(`/appointments`);
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

  // جلب روشتات المريضة
  const loadPrescriptions = async () => {
    if (!selectedPatient) return;
    
    setLoadingPrescriptions(true);
    try {
      const response = await fetch(`/api/prescriptions?patientId=${selectedPatient.id}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        // الروشتات مرتبة من الأحدث (API يرجعها مرتبة)
        setPrescriptions(result.data);
        setShowPrescriptionsModal(true);
      } else {
        setPrescriptions([]);
        setShowPrescriptionsModal(true);
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      setPrescriptions([]);
      setShowPrescriptionsModal(true);
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  const handlePrescription = () => {
    if (!selectedPatient) {
      alert("يرجى اختيار مريضة أولاً");
      return;
    }
    loadPrescriptions();
  };

  return (
    <main className="container mx-auto p-6 max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">كشف جديد</h1>
          <button
            onClick={() => router.push(`/appointments`)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="العودة للمواعيد"
          >
            <ChevronRight className="w-4 h-4" />
            العودة للمواعيد
          </button>
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

          {/* اختيار الموعد - عرض أحدث موعد فقط */}
          {selectedPatient && appointments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الموعد * {appointments.length > 1 && (
                  <span className="text-xs text-gray-500 font-normal">
                    (أحدث موعد من {appointments.length} مواعيد)
                  </span>
                )}
              </label>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-900 font-medium">
                  {new Date(appointments[0].appointmentDate).toLocaleDateString('ar-EG')} - 
                  {new Date(appointments[0].appointmentTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </p>
              
              </div>
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
          {selectedPatient && hasPreviousVisits && (
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
              disabled={!selectedPatient}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

        {/* Modal الروشتات */}
        {showPrescriptionsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowPrescriptionsModal(false)}
            />

            {/* Modal */}
            <div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
              dir="rtl"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  روشتات {selectedPatient?.firstName} {selectedPatient?.lastName}
                </h2>
                <button
                  onClick={() => setShowPrescriptionsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {loadingPrescriptions ? (
                  <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
                ) : prescriptions.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">لا توجد روشتات سابقة</p>
                    <button
                      onClick={() => {
                        setShowPrescriptionsModal(false);
                        router.push(`/prescriptions/new?patientId=${selectedPatient?.id}${selectedAppointment ? `&visitId=${selectedAppointment.id}` : ''}`);
                      }}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      إنشاء روشتة جديدة
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <button
                        onClick={() => {
                          setShowPrescriptionsModal(false);
                          router.push(`/prescriptions/new?patientId=${selectedPatient?.id}${selectedAppointment ? `&visitId=${selectedAppointment.id}` : ''}`);
                        }}
                        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        + روشتة جديدة
                      </button>
                    </div>
                    <div className="space-y-3">
                      {prescriptions.map((prescription) => (
                        <div
                          key={prescription.id}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => {
                            setShowPrescriptionsModal(false);
                            router.push(`/prescriptions/${prescription.id}`);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-4 h-4 text-purple-600" />
                                <p className="font-medium text-gray-900">
                                  روشتة #{prescription.id}
                                </p>
                              </div>
                              <p className="text-sm text-gray-600">
                                {new Date(prescription.createdAt).toLocaleDateString('ar-EG', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              {prescription.itemsCount > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {prescription.itemsCount} دواء
                                </p>
                              )}
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
  );
}
