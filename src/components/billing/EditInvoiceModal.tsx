"use client";
import { apiFetch } from "@/lib/api";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface EditInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  invoice: {
    id: number;
    invoiceNumber: string;
    invoiceDate: Date | string;
    subtotal: number;
    discount: number;
    totalAmount: number;
    notes: string | null;
  };
}

export function EditInvoiceModal({ isOpen, onClose, onSuccess, invoice }: EditInvoiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    invoiceDate: "",
    subtotal: "",
    discount: "",
    totalAmount: "",
    notes: "",
  });

  // Initialize form data when invoice changes
  useEffect(() => {
    if (invoice && isOpen) {
      const invoiceDate = typeof invoice.invoiceDate === 'string'
        ? invoice.invoiceDate.split('T')[0]
        : new Date(invoice.invoiceDate).toISOString().split('T')[0];

      setFormData({
        invoiceDate,
        subtotal: invoice.subtotal.toString(),
        discount: invoice.discount.toString(),
        totalAmount: invoice.totalAmount.toString(),
        notes: invoice.notes || "",
      });
    }
  }, [invoice, isOpen]);

  // Calculate total amount when subtotal or discount changes
  useEffect(() => {
    const subtotal = parseFloat(formData.subtotal) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const total = subtotal - discount;
    setFormData(prev => ({ ...prev, totalAmount: total > 0 ? total.toString() : "" }));
  }, [formData.subtotal, formData.discount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert date to ISO DateTime format (YYYY-MM-DDTHH:mm:ss.sssZ)
      const invoiceDateTime = new Date(formData.invoiceDate).toISOString();

      const response = await apiFetch(`/api/invoices/${invoice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceDate: invoiceDateTime,
          subtotal: parseFloat(formData.subtotal) || 0,
          discount: parseFloat(formData.discount) || 0,
          totalAmount: parseFloat(formData.totalAmount) || 0,
          notes: formData.notes || null,
        }),
      });

      const result = await response.json();
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        alert(result.error || "حدث خطأ أثناء تحديث الفاتورة");
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      alert("حدث خطأ أثناء تحديث الفاتورة");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-900">تعديل الفاتورة #{invoice.invoiceNumber}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Invoice Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ الفاتورة *
            </label>
            <input
              type="date"
              required
              value={formData.invoiceDate}
              onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المجموع الفرعي *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.subtotal}
                onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                readOnly
              />
            </div>

          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات (اختياري)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="أي ملاحظات إضافية..."
            />
          </div>

          {/* Buttons */}
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
              disabled={loading}
              className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
