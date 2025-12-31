// lib/audit/types.ts

export interface AuditLogListItem {
  id: number;
  userId: number | null;
  userName: string | null;
  actionType: string;
  tableName: string | null;
  recordId: number | null;
  actionTimestamp: Date;
  ipAddress: string | null;
}

export interface AuditFilters {
  userId?: number;
  actionType?: string;
  tableName?: string;
  recordId?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

