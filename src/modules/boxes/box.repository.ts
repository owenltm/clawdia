import { eq } from "drizzle-orm";
import { db } from "../../db";
import { boxes, type Box, type NewBox } from "../../db/schema";
import type { CreateBoxInput, UpdateBoxInput } from "./types";

export const BoxRepository = {
  async list(): Promise<Box[]> {
    return db.select().from(boxes);
  },

  async get(id: number): Promise<Box | undefined> {
    const rows = await db.select().from(boxes).where(eq(boxes.id, id)).limit(1);
    return rows[0];
  },

  async create(data: CreateBoxInput): Promise<number> {
    const res = await db.insert(boxes).values(data as NewBox);
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const insertId = resultObj?.insertId as number | undefined;
    if (typeof insertId === "number") return insertId;
    throw new Error("Insert succeeded but insertId was not returned by the driver");
  },

  async update(id: number, data: UpdateBoxInput): Promise<boolean> {
    const res = await db.update(boxes).set(data as Partial<NewBox>).where(eq(boxes.id, id));
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const affectedRows = resultObj?.affectedRows ?? resultObj?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  },

  async remove(id: number): Promise<boolean> {
    const res = await db.delete(boxes).where(eq(boxes.id, id));
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const affectedRows = resultObj?.affectedRows ?? resultObj?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  },
};