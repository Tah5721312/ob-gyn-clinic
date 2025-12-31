// lib/audit/queries.ts

import { PrismaClient } from "@prisma/client";
import { AuditFilters, AuditLogListItem } from "./types";

function buildWhereClause(filters: AuditFilters) {
  const where: any = {};

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.actionType) {
    where.actionType = filters.actionType;
  }

  if (filters.tableName) {
    where.tableName = filters.tableName;
  }

  if (filters.recordId) {
    where.recordId = filters.recordId;
  }

  if (filters.startDate || filters.endDate) {
    where.actionTimestamp = {};
    if (filters.startDate) {
      where.actionTimestamp.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.actionTimestamp.lte = filters.endDate;
    }
  }

  return where;
}

export async function getAuditLogsList(
  prisma: PrismaClient,
  filters: AuditFilters = {},
  options: { limit?: number; offset?: number } = {}
): Promise<AuditLogListItem[]> {
  const where = buildWhereClause(filters);
  const limit = options.limit || 100;
  const offset = options.offset || 0;

  const logs = await prisma.auditLog.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      actionTimestamp: "desc",
    },
    take: limit,
    skip: offset,
  });

  return logs.map((log) => ({
    id: log.id,
    userId: log.userId,
    userName: log.user?.username || null,
    actionType: log.actionType,
    tableName: log.tableName,
    recordId: log.recordId,
    actionTimestamp: log.actionTimestamp,
    ipAddress: log.ipAddress,
  }));
}

export async function getAuditLogsCount(
  prisma: PrismaClient,
  filters: AuditFilters = {}
): Promise<number> {
  const where = buildWhereClause(filters);
  return await prisma.auditLog.count({ where });
}

export async function getAuditLogById(
  prisma: PrismaClient,
  logId: number
) {
  return await prisma.auditLog.findUnique({
    where: { id: logId },
    include: {
      user: true,
    },
  });
}

