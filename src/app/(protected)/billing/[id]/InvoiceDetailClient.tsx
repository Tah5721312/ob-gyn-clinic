"use client";
import { apiFetch } from "@/lib/api";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRight, DollarSign, Calendar, User, FileText, Plus, CheckCircle, XCircle, Clock, Printer, Edit, Trash2 } from "lucide-react";
import { InvoiceItemType, InvoiceItemTypeLabels, PaymentMethod, PaymentMethodLabels, PaymentStatus } from "@/lib/enumdb";
import { DeleteInvoiceDialog } from "@/components/billing/DeleteInvoiceDialog";

interface Invoice {
  id: number;
  invoiceNumber: string;
  patientId: number;
  patient: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
  };
  doctor: {
    id: number;
    firstName: string;
    lastName: string;
  };
  invoiceDate: Date | string;
  subtotal: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  notes: string | null;
  items: Array<{
    id: number;
    itemType: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  payments: Array<{
    id: number;
    paymentNumber: string;
    paymentDate: Date | string;
    amount: number;
    paymentMethod: string;
    referenceNumber: string | null;
    receivedBy: {
      firstName: string;
      lastName: string;
    } | null;
    isRefunded: boolean;
  }>;
}

export default function InvoiceDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    amount: "",
    paymentMethod: PaymentMethod.CASH,
    referenceNumber: "",
    bankName: "",
    checkNumber: "",
    notes: "",
  });

  useEffect(() => {
    if (params.id) {
      fetchInvoice();
    }
  }, [params.id]);

  const fetchInvoice = async () => {
    try {
      const response = await apiFetch(`/api/invoices/${params.id}`);
      const result = await response.json();
      if (result.success) {
        const invoiceData = result.data;
        // تحويل Decimal إلى number
        const processedInvoice = {
          ...invoiceData,
          subtotal: Number(invoiceData.subtotal || 0),
          discount: Number(invoiceData.discount || 0),
          totalAmount: Number(invoiceData.totalAmount || 0),
          paidAmount: Number(invoiceData.paidAmount || 0),
          remainingAmount: Number(invoiceData.remainingAmount || 0),
          items: invoiceData.items?.map((item: any) => ({
            ...item,
            unitPrice: Number(item.unitPrice || 0),
            totalPrice: Number(item.totalPrice || 0),
          })) || [],
          payments: invoiceData.payments?.map((payment: any) => ({
            ...payment,
            amount: Number(payment.amount || 0),
          })) || [],
        };
        setInvoice(processedInvoice);
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;

    const amount = parseFloat(paymentFormData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("يرجى إدخال مبلغ صحيح");
      return;
    }

    if (amount > invoice.remainingAmount) {
      alert(`المبلغ أكبر من المتبقي (${invoice.remainingAmount.toFixed(2)} جنيه)`);
      return;
    }

    try {
      const response = await apiFetch(`/api/invoices/${invoice.id}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          paymentMethod: paymentFormData.paymentMethod,
          referenceNumber: paymentFormData.referenceNumber || null,
          bankName: paymentFormData.bankName || null,
          checkNumber: paymentFormData.checkNumber || null,
          receivedById: session?.user?.id ? parseInt(session.user.id) : null,
          notes: paymentFormData.notes || null,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsPaymentModalOpen(false);
        setPaymentFormData({
          amount: "",
          paymentMethod: PaymentMethod.CASH,
          referenceNumber: "",
          bankName: "",
          checkNumber: "",
          notes: "",
        });
        fetchInvoice();
      } else {
        alert(result.error || "حدث خطأ أثناء إضافة الدفعة");
      }
    } catch (error) {
      console.error("Error adding payment:", error);
      alert("حدث خطأ أثناء إضافة الدفعة");
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoice) return;

    try {
      const response = await apiFetch(`/api/invoices/${invoice.id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        router.push("/billing");
      } else {
        alert(result.error || "حدث خطأ أثناء حذف الفاتورة");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert("حدث خطأ أثناء حذف الفاتورة");
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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string; icon: any }> = {
      PAID: { label: "مدفوع", className: "bg-green-100 text-green-800", icon: CheckCircle },
      PARTIAL: { label: "مدفوع جزئياً", className: "bg-yellow-100 text-yellow-800", icon: Clock },
      UNPAID: { label: "غير مدفوع", className: "bg-red-100 text-red-800", icon: XCircle },
    };
    const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800", icon: FileText };
    const Icon = statusInfo.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.className}`}>
        <Icon className="w-4 h-4" />
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500">جاري التحميل...</div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center text-red-500">الفاتورة غير موجودة</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <button
            onClick={() => router.push("/billing")}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للفواتير
          </button>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">فاتورة #{invoice.invoiceNumber}</h1>
            {getStatusBadge(invoice.paymentStatus)}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(invoice.invoiceDate)}
            </span>
            <span className="inline-flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              الإجمالي: <span className="font-semibold text-gray-900">{formatCurrency(invoice.totalAmount)}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {invoice.paymentStatus !== PaymentStatus.PAID && (
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              إضافة دفعة
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <Printer className="h-4 w-4" />
            طباعة
          </button>
          <button
            onClick={() => router.push(`/billing/new?invoiceId=${invoice.id}`)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <Edit className="h-4 w-4" />
            تعديل
          </button>
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            حذف
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Invoice Info */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-xs font-semibold text-gray-500">المريضة</div>
                <div className="mt-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-semibold text-gray-900">
                    {invoice.patient.firstName} {invoice.patient.lastName}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-600">{invoice.patient.phone}</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-xs font-semibold text-gray-500">الطبيب</div>
                <div className="mt-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-semibold text-gray-900">
                    {invoice.doctor.firstName} {invoice.doctor.lastName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payments History */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-bold text-gray-900">سجل الدفعات</h2>
              <span className="text-sm text-gray-600">{invoice.payments.length} دفعة</span>
            </div>
            {invoice.payments.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-gray-500">
                لا توجد دفعات مسجلة بعد.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-600">رقم الدفعة</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-600">التاريخ</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-600">المبلغ</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-600">الطريقة</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-600">المستلم</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-600">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoice.payments.map((payment) => (
                      <tr key={payment.id} className={payment.isRefunded ? "opacity-50" : "hover:bg-gray-50/60"}>
                        <td className="px-5 py-4 text-sm text-gray-900">{payment.paymentNumber}</td>
                        <td className="px-5 py-4 text-sm text-gray-700">{formatDate(payment.paymentDate)}</td>
                        <td className="px-5 py-4 text-sm font-semibold text-gray-900">{formatCurrency(payment.amount)}</td>
                        <td className="px-5 py-4 text-sm text-gray-700">
                          {PaymentMethodLabels[payment.paymentMethod as PaymentMethod] || payment.paymentMethod}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-700">
                          {payment.receivedBy
                            ? `${payment.receivedBy.firstName} ${payment.receivedBy.lastName}`
                            : "—"}
                        </td>
                        <td className="px-5 py-4 text-sm">
                          {payment.isRefunded ? (
                            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">مسترجع</span>
                          ) : (
                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">نشط</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="space-y-6 lg:sticky lg:top-6">
            {/* Totals */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-bold text-gray-900">ملخص الفاتورة</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex items-center justify-between text-red-700">
                    <span>الخصم</span>
                    <span className="font-semibold">-{formatCurrency(invoice.discount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">الإجمالي</span>
                    <span className="text-base font-bold text-gray-900">{formatCurrency(invoice.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-lg font-bold text-gray-900">حالة الدفع</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">الحالة</span>
                  {getStatusBadge(invoice.paymentStatus)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">المدفوع</span>
                  <span className="font-semibold text-green-700">{formatCurrency(invoice.paidAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">المتبقي</span>
                  <span className="font-semibold text-red-700">{formatCurrency(invoice.remainingAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsPaymentModalOpen(false)} />
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative z-10" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">إضافة دفعة</h2>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>
            <form onSubmit={handleAddPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ المتبقي</label>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(invoice.remainingAmount)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ المدفوع *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={invoice.remainingAmount}
                  value={paymentFormData.amount}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, amount: e.target.value })}
                  className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">طريقة الدفع *</label>
                <select
                  value={paymentFormData.paymentMethod}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, paymentMethod: e.target.value as PaymentMethod })}
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
              {paymentFormData.paymentMethod === PaymentMethod.CARD && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم المرجع</label>
                  <input
                    type="text"
                    value={paymentFormData.referenceNumber}
                    onChange={(e) => setPaymentFormData({ ...paymentFormData, referenceNumber: e.target.value })}
                    className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              {paymentFormData.paymentMethod === PaymentMethod.BANK_TRANSFER && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم البنك</label>
                    <input
                      type="text"
                      value={paymentFormData.bankName}
                      onChange={(e) => setPaymentFormData({ ...paymentFormData, bankName: e.target.value })}
                      className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم المرجع</label>
                    <input
                      type="text"
                      value={paymentFormData.referenceNumber}
                      onChange={(e) => setPaymentFormData({ ...paymentFormData, referenceNumber: e.target.value })}
                      className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
              {paymentFormData.paymentMethod === PaymentMethod.CHECK && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الشيك</label>
                    <input
                      type="text"
                      value={paymentFormData.checkNumber}
                      onChange={(e) => setPaymentFormData({ ...paymentFormData, checkNumber: e.target.value })}
                      className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم البنك</label>
                    <input
                      type="text"
                      value={paymentFormData.bankName}
                      onChange={(e) => setPaymentFormData({ ...paymentFormData, bankName: e.target.value })}
                      className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
                <textarea
                  value={paymentFormData.notes}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  إضافة دفعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Invoice Dialog */}
      {invoice && (
        <DeleteInvoiceDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteInvoice}
          invoiceNumber={invoice.invoiceNumber}
        />
      )}
    </div>
  );
}
