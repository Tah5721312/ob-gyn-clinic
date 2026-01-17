// lib/invoices/types.ts

export interface InvoiceListItem {
  id: number;
  invoiceNumber: string;
  patientId: number;
  patientName: string;
  visitId: number | null;
  invoiceDate: Date;
  // المبالغ الإجمالية
  subtotalAmount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  netAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  itemsCount: number;
}

export interface InvoiceFilters {
  patientId?: number;
  invoiceDate?: Date;
  paymentStatus?: string | string[];
  search?: string;
}

export interface InvoiceListResponse {
  success: boolean;
  data: InvoiceListItem[];
  count: number;
  error?: string;
}

export interface PaymentListItem {
  id: number;
  paymentNumber: string | null;
  invoiceId: number;
  invoiceNumber: string;
  paymentDate: Date;
  paymentAmount: number;
  paymentMethod: string;
  referenceNumber: string | null;
  isRefund: boolean;
}
