"use client";
import { apiFetch } from "@/lib/api";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, User, X } from "lucide-react";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
}

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function NewInvoiceModal({ isOpen, onClose, onSuccess }: NewInvoiceModalProps) {
  const router = useRouter();
  const { data: session } = useSession();
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
    insuranceAmount: "",
    notes: "",
  });

  // إعادة تعيين النموذج عند الإغلاق
  useEffect(() => {
    if (!isOpen) {
      setSelectedPatient(null);
      setSearchTerm("");
      setFormData({
        invoiceDate: new Date().toISOString().split('T')[0],
        subtotal: "",
        discount: "",
        totalAmount: "",
        insuranceAmount: "",
        notes: "",
      });
    }
  }, [isOpen]);

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
    if (!selectedPatient || !session?.user?.doctorId) {
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
          doctorId: session.user.doctorId,
          invoiceDate: formData.invoiceDate,
          subtotal: parseFloat(formData.subtotal) || 0,
          discount: parseFloat(formData.discount) || 0,
          totalAmount: parseFloat(formData.totalAmount) || 0,
          insuranceAmount: formData.insuranceAmount ? parseFloat(formData.insuranceAmount) : null,
          remainingAmount: parseFloat(formData.totalAmount) || 0,
          notes: formData.notes || null,
        }),
      });

      const result = await response.json();
      if (result.success) {
        onClose();
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/billing/${result.data.id}`);
        }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Backdrop with blur */}
    <div 
      className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">فاتورة جديدة</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* اختيار المريض */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المريض *
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
                    placeholder="ابحث عن مريض..."
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

            {/* تاريخ الفاتورة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ الفاتورة *
              </label>
              <input
                type="date"
                required
                value={formData.invoiceDate}
                onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* المبالغ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المجموع الفرعي
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.subtotal}
                  onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الخصم
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المبلغ الإجمالي
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مبلغ التأمين (اختياري)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.insuranceAmount}
                  onChange={(e) => setFormData({ ...formData, insuranceAmount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* الملاحظات */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ملاحظات (اختياري)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="أي ملاحظات إضافية..."
              />
            </div>

            {/* الأزرار */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading || !selectedPatient}
                className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "جاري الحفظ..." : "حفظ الفاتورة"}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
  );
}

