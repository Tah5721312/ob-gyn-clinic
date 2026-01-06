"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, DollarSign, FileText, Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { InvoiceListItem } from "@/lib/invoices/types";
import { NewInvoiceModal } from "./NewInvoiceModal";

interface InvoiceListProps {
  initialInvoices?: InvoiceListItem[];
}

export function InvoiceList({ initialInvoices = [] }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>(initialInvoices);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // جلب الفواتير
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (selectedDate) params.append("invoiceDate", selectedDate);
        if (statusFilter) params.append("paymentStatus", statusFilter);

        const response = await fetch(`/api/invoices?${params.toString()}`);
        const result = await response.json();

        if (result.success) {
          setInvoices(result.data);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchInvoices();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, selectedDate, statusFilter]);

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
      PARTIAL: { label: "جزئي", className: "bg-yellow-100 text-yellow-800", icon: Clock },
      UNPAID: { label: "غير مدفوع", className: "bg-red-100 text-red-800", icon: XCircle },
      CANCELLED: { label: "ملغي", className: "bg-gray-100 text-gray-800", icon: XCircle },
    };

    const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800", icon: FileText };
    const Icon = statusInfo.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        <Icon className="w-3 h-3" />
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الفواتير</h1>
          <p className="text-gray-600 mt-2">
            {loading ? "جاري التحميل..." : `${invoices.length} فاتورة`}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          فاتورة جديدة
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث برقم الفاتورة أو اسم المريض..."
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

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">جميع الحالات</option>
            <option value="PAID">مدفوع</option>
            <option value="PARTIAL">جزئي</option>
            <option value="UNPAID">غير مدفوع</option>
            <option value="CANCELLED">ملغي</option>
          </select>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">جاري التحميل...</div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center text-gray-500">لا توجد فواتير</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم الفاتورة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المريض</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المبلغ الإجمالي</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المدفوع</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المتبقي</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/billing/${invoice.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-blue-600 font-medium">{invoice.invoiceNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">{invoice.patientName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {formatDate(invoice.invoiceDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">{formatCurrency(invoice.totalAmount)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-green-600">{formatCurrency(invoice.paidAmount)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-red-600">{formatCurrency(invoice.remainingAmount)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.paymentStatus)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal إضافة فاتورة جديدة */}
      <NewInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // إعادة تحميل الفواتير
          const params = new URLSearchParams();
          if (search) params.append("search", search);
          if (selectedDate) params.append("invoiceDate", selectedDate);
          if (statusFilter) params.append("paymentStatus", statusFilter);

          fetch(`/api/invoices?${params.toString()}`)
            .then(res => res.json())
            .then(result => {
              if (result.success) {
                setInvoices(result.data);
              }
            });
        }}
      />
    </div>
  );
}

