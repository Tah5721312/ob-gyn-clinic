// lib/invoice-items/types.ts

export interface InvoiceItemListItem {
  id: number;
  invoiceId: number;
  itemType: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  totalPrice: number;
  notes: string | null;
}

export interface InvoiceItemFilters {
  invoiceId?: number;
  itemType?: string;
}

export interface CreateInvoiceItemData {
  invoiceId: number;
  itemType: string;
  description: string;
  quantity?: number;
  unitPrice: number;
  discountAmount?: number;
  taxAmount?: number;
  totalPrice?: number;
  notes?: string;
}

export interface UpdateInvoiceItemData {
  itemType?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  discountAmount?: number;
  taxAmount?: number;
  totalPrice?: number;
  notes?: string;
}

