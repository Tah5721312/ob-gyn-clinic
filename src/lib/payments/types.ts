// lib/payments/types.ts

/**
 * Types for Payment-related operations
 */

export interface PaymentListItem {
  id: number;
  invoiceId: number;
  paymentNumber: string;
  paymentDate: Date;
  paymentTime: Date;
  amount: number;
  paymentMethod: string;
  referenceNumber: string | null;
  bankName: string | null;
  checkNumber: string | null;
  receivedById: number | null;
  receivedByName: string | null;
  isRefunded: boolean;
  refundedAt: Date | null;
  createdAt: Date;
}

export interface PaymentFilters {
  invoiceId?: number;
  paymentDate?: Date;
  paymentMethod?: string;
  receivedById?: number;
  isRefunded?: boolean;
}

export interface PaymentListResponse {
  success: boolean;
  data: PaymentListItem[];
  count: number;
  error?: string;
}

export interface CreatePaymentData {
  invoiceId: number;
  paymentNumber: string;
  paymentDate?: Date;
  paymentTime?: Date;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string | null;
  bankName?: string | null;
  checkNumber?: string | null;
  receivedById?: number | null;
  notes?: string | null;
}

export interface UpdatePaymentData {
  paymentDate?: Date;
  paymentTime?: Date;
  amount?: number;
  paymentMethod?: string;
  referenceNumber?: string | null;
  bankName?: string | null;
  checkNumber?: string | null;
  receivedById?: number | null;
  notes?: string | null;
}

export interface RefundPaymentData {
  refundReason?: string | null;
}

