import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "../../db";
import { historyLog, type HistoryLog, type NewHistoryLog } from "./history.schema";
import type { CreateHistoryInput, UpdateHistoryInput, ListHistoryParams } from "./types";

export const HistoryRepository = {
  async list(params: ListHistoryParams = {}): Promise<HistoryLog[]> {
    const { entityType, entityId, action, startDate, endDate, orderBy = "createdAt", direction = "desc" } = params;

    const where = [] as any[];
    if (entityType) where.push(eq(historyLog.entityType, entityType));
    if (typeof entityId === "number") where.push(eq(historyLog.entityId, entityId));
    if (action) where.push(eq(historyLog.action, action));
    if (startDate) where.push(gte(historyLog.createdAt, startDate));
    if (endDate) where.push(lte(historyLog.createdAt, endDate));

    const orderCol = historyLog.createdAt;

    return db
      .select()
      .from(historyLog)
      .where(where.length ? (where.length === 1 ? where[0] : and(...where)) : undefined)
      .orderBy(direction === "asc" ? asc(orderCol) : desc(orderCol));
  },

  async get(id: number): Promise<HistoryLog | undefined> {
    const rows = await db.select().from(historyLog).where(eq(historyLog.id, id)).limit(1);
    return rows[0];
  },

  async create(data: CreateHistoryInput): Promise<number> {
    const res = await db.insert(historyLog).values(data as NewHistoryLog);
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const insertId = resultObj?.insertId as number | undefined;
    if (typeof insertId === "number") return insertId;
    throw new Error("Insert succeeded but insertId was not returned by the driver");
  },

  async update(id: number, data: UpdateHistoryInput): Promise<boolean> {
    const res = await db.update(historyLog).set(data as Partial<NewHistoryLog>).where(eq(historyLog.id, id));
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const affectedRows = resultObj?.affectedRows ?? resultObj?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  },

  async remove(id: number): Promise<boolean> {
    const res = await db.delete(historyLog).where(eq(historyLog.id, id));
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const affectedRows = resultObj?.affectedRows ?? resultObj?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  },
};

