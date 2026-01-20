"use client";

import { apiFetch } from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, User, UserPlus, Calendar, Receipt, FileText, ArrowRight, Save, X } from "lucide-react";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientSearch, setShowPatientSearch] = useState(false);

  const [formData, setFormData] = useState({
    invoiceDate: new Date().toISOString().split('T')[0],
    subtotal: "",
    discount: "",
    totalAmount: "",
    notes: "",
  });

  // Handle patientId from URL
  useEffect(() => {
    const patientId = searchParams.get('patientId');
    if (patientId) {
      // Fetch patient data
      apiFetch(`/api/patients/${patientId}`)
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
        })
        .catch(error => console.error("Error fetching patient:", error));
    }
  }, [searchParams]);

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

  // حساب المبلغ الإجمالي
  useEffect(() => {
    const subtotal = parseFloat(formData.subtotal) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const total = subtotal - discount;
    setFormData(prev => ({ ...prev, totalAmount: total > 0 ? total.toString() : "" }));
  }, [formData.subtotal, formData.discount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert("يرجى اختيار مريض");
      return;
    }

    setLoading(true);
    try {
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

      const response = await apiFetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber,
          patientId: selectedPatient.id,
          invoiceDate: formData.invoiceDate,
          subtotal: parseFloat(formData.subtotal) || 0,
          discount: parseFloat(formData.discount) || 0,
          totalAmount: parseFloat(formData.totalAmount) || 0,
          remainingAmount: parseFloat(formData.totalAmount) || 0,
          notes: formData.notes || null,
        }),
      });

      const result = await response.json();
      if (result.success) {
        router.push(`/billing/${result.data.id}`);
      } else {
        alert(result.error || "حدث خطأ أثناء إنشاء الفاتورة");
      }
    } catch (error: any) {
      console.error("Error creating invoice:", error);
      alert("حدث خطأ أثناء إنشاء الفاتورة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div >
      <div className="max-w-3xl mx-auto space-y-4">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">إنشاء فاتورة جديدة</h1>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 shadow-sm transition-all text-sm font-medium"
          >
            <ArrowRight className="w-4 h-4 ml-1" />
            عودة للفواتير
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <form onSubmit={handleSubmit} className="p-6 md:p-5 space-y-6" dir="rtl">

            {/* Patient Selection Section */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-900 pb-2 border-b border-gray-100">
                <div className=" bg-blue-50 rounded-lg text-blue-600">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold">بيانات المريض</h3>
              </div>

              <div className="max-w-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اختر المريض <span className="text-red-500">*</span>
                </label>

                {selectedPatient ? (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-base">
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">{selectedPatient.phone}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPatient(null);
                        setSearchTerm("");
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-full transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                      <Search className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="ابحث باسم المريض أو رقم الهاتف..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowPatientSearch(true);
                      }}
                      className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none text-sm"
                    />

                    {/* Search Results Dropdown */}
                    {showPatientSearch && patients.length > 0 && (
                      <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {patients.map((patient) => (
                          <button
                            key={patient.id}
                            type="button"
                            onClick={() => {
                              setSelectedPatient(patient);
                              setSearchTerm(`${patient.firstName} ${patient.lastName}`);
                              setShowPatientSearch(false);
                            }}
                            className="w-full text-right px-6 py-4 hover:bg-blue-50/50 border-b border-gray-50 last:border-b-0 flex items-center justify-between group/item transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover/item:bg-blue-100 group-hover/item:text-blue-600 transition-colors">
                                <User className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 group-hover/item:text-blue-700 transition-colors">
                                  {patient.firstName} {patient.lastName}
                                </p>
                                <p className="text-sm text-gray-500">{patient.phone}</p>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all duration-300 transform" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Details Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    تاريخ الفاتورة
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.invoiceDate}
                    onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 focus:bg-white transition-all outline-none text-sm"
                  />
                </div>

                {/* Subtotal */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span className="text-gray-400 font-serif">.00</span>
                    إجمالي المبلغ
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="0.00"
                      value={formData.subtotal}
                      onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 focus:bg-white transition-all outline-none pl-10 font-mono text-sm"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs font-medium">ج.م</span>
                  </div>
                </div>

                {/* Discount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span className="text-gray-400">%</span>
                    الخصم (اختياري)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="0.00"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 focus:bg-white transition-all outline-none pl-10 font-mono text-sm"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs font-medium">ج.م</span>
                  </div>
                </div>

                {/* Total Result */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <CalculatorIcon />
                    صافي الفاتورة
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      readOnly
                      disabled
                      value={formData.totalAmount}
                      className="w-full px-3 py-2 bg-gray-400 border border-gray-900 text-white rounded-lg pl-10 font-mono text-base font-bold"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-xs font-medium">ج.م</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  ملاحظات إضافية
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none resize-none text-sm"
                  placeholder="اكتب أي تفاصيل إضافية هنا..."
                />
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition-all text-sm"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading || !selectedPatient || !formData.subtotal}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2 text-sm"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? "جاري الحفظ..." : "حفظ الفاتورة"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

function CalculatorIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" />
    </svg>
  );
}

