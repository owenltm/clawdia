import { and, asc, desc, eq, isNull, gte, lte } from "drizzle-orm";
import { db } from "../../../db";
import { crabs, type Crab, type NewCrab } from "../schemas/crab.schema";
import type { CreateCrabInput, UpdateCrabInput, ListCrabsParams } from "../types";

export const CrabRepository = {
  async list(params: ListCrabsParams = {}): Promise<Crab[]> {
    const { status, boxId, checkedInAfter, checkedInBefore, checkedOutAfter, checkedOutBefore, orderBy = "createdAt", direction = "desc" } = params;

    const where = [];
    if (status) where.push(eq(crabs.status, status));
    if (boxId === null) where.push(isNull(crabs.boxId));
    if (checkedInAfter) where.push(gte(crabs.checkInDate, checkedInAfter));
    if (checkedInBefore) where.push(lte(crabs.checkInDate, checkedInBefore));
    if (checkedOutAfter) where.push(gte(crabs.checkOutDate, checkedOutAfter));
    if (checkedOutBefore) where.push(lte(crabs.checkOutDate, checkedOutBefore));
    else if (typeof boxId === "number") where.push(eq(crabs.boxId, boxId));

    const orderCol =
      orderBy === "updatedAt" ? crabs.updatedAt : orderBy === "weight" ? crabs.weight : crabs.createdAt;

    return db
      .select()
      .from(crabs)
      .where(where.length ? (where.length === 1 ? where[0] : and(...where)) : undefined)
      .orderBy(direction === "asc" ? asc(orderCol) : desc(orderCol));
  },

  async get(id: number): Promise<Crab | undefined> {
    const rows = await db.select().from(crabs).where(eq(crabs.id, id)).limit(1);
    return rows[0];
  },

  async getByBoxId(boxId: number): Promise<Crab> {
    const rows = await db.select().from(crabs).where(eq(crabs.boxId, boxId)).limit(1);
    return rows[0];
  },

  async create(data: CreateCrabInput): Promise<number> {
    const res = await db.insert(crabs).values(data as NewCrab);
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const insertId = resultObj?.insertId as number | undefined;
    if (typeof insertId === "number") return insertId;
    throw new Error("Insert succeeded but insertId was not returned by the driver");
  },

  async update(id: number, data: UpdateCrabInput): Promise<boolean> {
    const res = await db.update(crabs).set(data as Partial<NewCrab>).where(eq(crabs.id, id));
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const affectedRows = resultObj?.affectedRows ?? resultObj?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  },

  async remove(id: number): Promise<boolean> {
    const res = await db.delete(crabs).where(eq(crabs.id, id));
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const affectedRows = resultObj?.affectedRows ?? resultObj?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  },
};
