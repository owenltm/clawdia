import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "../../db";
import { financeJournal, type FinanceJournal, type NewFinanceJournal } from "./finance.schema";
import type { CreateFinanceInput, UpdateFinanceInput, ListFinanceParams } from "./types";

export const FinanceRepository = {
  async list(params: ListFinanceParams = {}): Promise<FinanceJournal[]> {
    const { type, category, referenceId, minAmount, maxAmount, startDate, endDate, direction = "desc" } = params;

    const where = [] as any[];
    if (type) where.push(eq(financeJournal.type, type));
    if (category) where.push(eq(financeJournal.category, category));
    if (typeof referenceId === "number") where.push(eq(financeJournal.referenceId, referenceId));
    if (typeof minAmount === "number") where.push(gte(financeJournal.amount, String(minAmount)));
    if (typeof maxAmount === "number") where.push(lte(financeJournal.amount, String(maxAmount)));
    if (startDate) where.push(gte(financeJournal.createdAt, startDate));
    if (endDate) where.push(lte(financeJournal.createdAt, endDate));

    const orderCol = financeJournal.createdAt;

    return db
      .select()
      .from(financeJournal)
      .where(where.length ? (where.length === 1 ? where[0] : and(...where)) : undefined)
      .orderBy(direction === "asc" ? asc(orderCol) : desc(orderCol));
  },

  async get(id: number): Promise<FinanceJournal | undefined> {
    const rows = await db.select().from(financeJournal).where(eq(financeJournal.id, id)).limit(1);
    return rows[0];
  },

  async create(data: CreateFinanceInput): Promise<number> {
    const res = await db.insert(financeJournal).values(data as NewFinanceJournal);
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const insertId = resultObj?.insertId as number | undefined;
    if (typeof insertId === "number") return insertId;
    throw new Error("Insert succeeded but insertId was not returned by the driver");
  },

  async update(id: number, data: UpdateFinanceInput): Promise<boolean> {
    const res = await db
      .update(financeJournal)
      .set(data as Partial<NewFinanceJournal>)
      .where(eq(financeJournal.id, id));
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const affectedRows = resultObj?.affectedRows ?? resultObj?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  },

  async remove(id: number): Promise<boolean> {
    const res = await db.delete(financeJournal).where(eq(financeJournal.id, id));
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const affectedRows = resultObj?.affectedRows ?? resultObj?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  },
};

