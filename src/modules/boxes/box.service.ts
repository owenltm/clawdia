import { eq } from "drizzle-orm";
import { db } from "../../db";
import { boxes, type Box, type NewBox } from "../../db/schema";

export type CreateBoxInput = Omit<NewBox, "id" | "createdAt" | "updatedAt">;
export type UpdateBoxInput = Partial<CreateBoxInput>;

export class BoxService {
  async list(): Promise<Box[]> {
    return db.select().from(boxes);
  }

  async get(id: number): Promise<Box | undefined> {
    const rows = await db.select().from(boxes).where(eq(boxes.id, id)).limit(1);
    return rows[0];
  }

  async create(data: CreateBoxInput): Promise<number> {
    const res = await db.insert(boxes).values(data as NewBox);
    const insertId = (res as any)?.insertId as number | undefined;
    if (typeof insertId === "number") return insertId;
    throw new Error("Insert succeeded but insertId was not returned by the driver");
  }

  async update(id: number, data: UpdateBoxInput): Promise<boolean> {
    const res = await db.update(boxes).set(data as Partial<NewBox>).where(eq(boxes.id, id));
    const affectedRows = (res as any)?.affectedRows ?? (res as any)?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  }

  async remove(id: number): Promise<boolean> {
    const res = await db.delete(boxes).where(eq(boxes.id, id));
    const affectedRows = (res as any)?.affectedRows ?? (res as any)?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  }
}

export const boxService = new BoxService();
