// lib/invoices/types.ts

export interface InvoiceListItem {
  id: number;
  invoiceNumber: string;
  patientId: number;
  patientName: string;
  visitId: number | null;
  invoiceDate: Date;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  insuranceId: number | null;
  insuranceName: string | null;
}

export interface InvoiceFilters {
  patientId?: number;
  invoiceDate?: Date;
  paymentStatus?: string;
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

