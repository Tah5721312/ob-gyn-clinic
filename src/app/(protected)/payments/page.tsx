"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, Calendar, DollarSign, FileText, Filter, Edit, Trash2, RotateCcw, X } from "lucide-react";
import { PaymentMethod, PaymentMethodLabels } from "@/lib/enumdb";

interface PaymentListItem {
  id: number;
  invoiceId: number;
  paymentNumber: string;
  paymentDate: Date | string;
  amount: number;
  paymentMethod: string;
  referenceNumber: string | null;
  bankName: string | null;
  checkNumber: string | null;
  receivedByName: string | null;
  receivedById: number | null;
  isRefunded: boolean;
  notes: string | null;
  invoice: {
    invoiceNumber: string;
    patient: {
      firstName: string;
      lastName: string;
    };
  };
}

export default function PaymentsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [payments, setPayments] = useState<PaymentListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentListItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    amount: "",
    paymentMethod: PaymentMethod.CASH,
    paymentDate: "",
    referenceNumber: "",
    bankName: "",
    checkNumber: "",
    notes: "",
  });
  const [refundReason, setRefundReason] = useState("");

  useEffect(() => {
    fetchPayments();
  }, [search, selectedDate, methodFilter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDate) params.append("paymentDate", selectedDate);
      if (methodFilter) params.append("paymentMethod", methodFilter);

      const response = await fetch(`/api/payments?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        let filteredPayments = result.data;
        
        // البحث في أرقام الدفعات وأسماء المرضى
        if (search) {
          filteredPayments = filteredPayments.filter((p: PaymentListItem) =>
            p.paymentNumber.toLowerCase().includes(search.toLowerCase()) ||
            `${p.invoice.patient.firstName} ${p.invoice.patient.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
            p.invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        setPayments(filteredPayments);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleEdit = (payment: PaymentListItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPayment(payment);
    setEditFormData({
      amount: payment.amount.toString(),
      paymentMethod: payment.paymentMethod as PaymentMethod,
      paymentDate: new Date(payment.paymentDate).toISOString().split('T')[0],
      referenceNumber: payment.referenceNumber || "",
      bankName: payment.bankName || "",
      checkNumber: payment.checkNumber || "",
      notes: payment.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (payment: PaymentListItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPayment(payment);
    setIsDeleteModalOpen(true);
  };

  const handleRefund = (payment: PaymentListItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPayment(payment);
    setRefundReason("");
    setIsRefundModalOpen(true);
  };

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;

    try {
      const response = await fetch(`/api/payments/${selectedPayment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(editFormData.amount),
          paymentMethod: editFormData.paymentMethod,
          paymentDate: editFormData.paymentDate,
          referenceNumber: editFormData.referenceNumber || null,
          bankName: editFormData.bankName || null,
          checkNumber: editFormData.checkNumber || null,
          notes: editFormData.notes || null,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsEditModalOpen(false);
        fetchPayments();
      } else {
        alert(result.error || "حدث خطأ أثناء تحديث الدفعة");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("حدث خطأ أثناء تحديث الدفعة");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPayment) return;

    try {
      const response = await fetch(`/api/payments/${selectedPayment.id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        setIsDeleteModalOpen(false);
        fetchPayments();
      } else {
        alert(result.error || "حدث خطأ أثناء حذف الدفعة");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("حدث خطأ أثناء حذف الدفعة");
    }
  };

  const handleConfirmRefund = async () => {
    if (!selectedPayment) return;

    try {
      const response = await fetch(`/api/payments/${selectedPayment.id}/refund`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refundReason: refundReason || null,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsRefundModalOpen(false);
        fetchPayments();
      } else {
        alert(result.error || "حدث خطأ أثناء استرجاع الدفعة");
      }
    } catch (error) {
      console.error("Error refunding payment:", error);
      alert("حدث خطأ أثناء استرجاع الدفعة");
    }
  };

  const totalAmount = payments.reduce((sum, p) => sum + (p.isRefunded ? 0 : p.amount), 0);
  const refundedAmount = payments.reduce((sum, p) => sum + (p.isRefunded ? p.amount : 0), 0);

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50" dir="rtl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الدفعات</h1>
          <p className="text-gray-600 mt-2">
            {loading ? "جاري التحميل..." : `${payments.length} دفعة`}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الدفعات</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalAmount)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">عدد الدفعات</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{payments.length}</p>
              </div>
              <FileText className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المسترجعات</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(refundedAmount)}</p>
              </div>
              <FileText className="w-12 h-12 text-red-500" />
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث برقم الدفعة أو اسم المريض..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date Filter */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            {/* Method Filter */}
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع طرق الدفع</option>
              {Object.values(PaymentMethod).map((method) => (
                <option key={method} value={method}>
                  {PaymentMethodLabels[method]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">جاري التحميل...</div>
          ) : payments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">لا توجد دفعات</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم الدفعة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الفاتورة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المريض</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المبلغ</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">طريقة الدفع</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المستلم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className={`hover:bg-gray-50 ${payment.isRefunded ? 'opacity-60' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-blue-600 font-medium">{payment.paymentNumber}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-600">{payment.invoice.invoiceNumber}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900">
                          {payment.invoice.patient.firstName} {payment.invoice.patient.lastName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-semibold ${payment.isRefunded ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(payment.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-600">
                          {PaymentMethodLabels[payment.paymentMethod as PaymentMethod] || payment.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-600">{payment.receivedByName || "—"}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.isRefunded ? (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            مسترجع
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            نشط
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => router.push(`/billing/${payment.invoiceId}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="عرض الفاتورة"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          {!payment.isRefunded && (
                            <>
                              <button
                                onClick={(e) => handleEdit(payment, e)}
                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                title="تعديل"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleRefund(payment, e)}
                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                title="استرجاع"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={(e) => handleDelete(payment, e)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Edit Modal */}
        {isEditModalOpen && selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative z-10" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">تعديل دفعة</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleUpdatePayment} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={editFormData.amount}
                    onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                    className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">طريقة الدفع *</label>
                  <select
                    value={editFormData.paymentMethod}
                    onChange={(e) => setEditFormData({ ...editFormData, paymentMethod: e.target.value as PaymentMethod })}
                    className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {Object.values(PaymentMethod).map((method) => (
                      <option key={method} value={method}>
                        {PaymentMethodLabels[method]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الدفع *</label>
                  <input
                    type="date"
                    value={editFormData.paymentDate}
                    onChange={(e) => setEditFormData({ ...editFormData, paymentDate: e.target.value })}
                    className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {editFormData.paymentMethod === PaymentMethod.CARD && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم المرجع</label>
                    <input
                      type="text"
                      value={editFormData.referenceNumber}
                      onChange={(e) => setEditFormData({ ...editFormData, referenceNumber: e.target.value })}
                      className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
                {editFormData.paymentMethod === PaymentMethod.BANK_TRANSFER && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">اسم البنك</label>
                      <input
                        type="text"
                        value={editFormData.bankName}
                        onChange={(e) => setEditFormData({ ...editFormData, bankName: e.target.value })}
                        className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">رقم المرجع</label>
                      <input
                        type="text"
                        value={editFormData.referenceNumber}
                        onChange={(e) => setEditFormData({ ...editFormData, referenceNumber: e.target.value })}
                        className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}
                {editFormData.paymentMethod === PaymentMethod.CHECK && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">رقم الشيك</label>
                      <input
                        type="text"
                        value={editFormData.checkNumber}
                        onChange={(e) => setEditFormData({ ...editFormData, checkNumber: e.target.value })}
                        className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">اسم البنك</label>
                      <input
                        type="text"
                        value={editFormData.bankName}
                        onChange={(e) => setEditFormData({ ...editFormData, bankName: e.target.value })}
                        className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
                  <textarea
                    value={editFormData.notes}
                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    تحديث
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative z-10" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">تأكيد الحذف</h2>
                <button onClick={() => setIsDeleteModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  هل أنت متأكد من حذف الدفعة رقم <span className="font-semibold">{selectedPayment.paymentNumber}</span>؟
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  سيتم تحديث الفاتورة تلقائياً بعد الحذف.
                </p>
                <div className="flex gap-4 justify-end">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refund Modal */}
        {isRefundModalOpen && selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsRefundModalOpen(false)} />
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative z-10" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">استرجاع دفعة</h2>
                <button onClick={() => setIsRefundModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleConfirmRefund(); }} className="p-6 space-y-4">
                <div>
                  <p className="text-gray-700 mb-2">
                    الدفعة رقم: <span className="font-semibold">{selectedPayment.paymentNumber}</span>
                  </p>
                  <p className="text-gray-700 mb-2">
                    المبلغ: <span className="font-semibold">{formatCurrency(selectedPayment.amount)}</span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">سبب الاسترجاع</label>
                  <textarea
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    rows={3}
                    className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل سبب الاسترجاع..."
                  />
                </div>
                <p className="text-sm text-gray-500">
                  سيتم تحديث الفاتورة تلقائياً بعد الاسترجاع.
                </p>
                <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsRefundModalOpen(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    استرجاع
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

