import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { db } from "../../db";
import { crabs, type Crab, type NewCrab } from "../../db/schema";

export type CreateCrabInput = Omit<NewCrab, "id" | "createdAt" | "updatedAt">;
export type UpdateCrabInput = Partial<CreateCrabInput>;

export type ListCrabsParams = {
  status?: Crab["status"];
  boxId?: number | null;
  orderBy?: "createdAt" | "updatedAt" | "weight";
  direction?: "asc" | "desc";
};

export const CrabRepository = {
  async list(params: ListCrabsParams = {}): Promise<Crab[]> {
    const { status, boxId, orderBy = "createdAt", direction = "desc" } = params;

    const where = [] as any[];
    if (status) where.push(eq(crabs.status, status));
    if (boxId === null) where.push(isNull(crabs.boxId));
    else if (typeof boxId === "number") where.push(eq(crabs.boxId, boxId));

    const orderCol =
      orderBy === "updatedAt" ? crabs.updatedAt : orderBy === "weight" ? crabs.weight : crabs.createdAt;

    return db
      .select()
      .from(crabs)
      .where(where.length ? (where.length === 1 ? where[0] : (and as any)(...where)) : undefined as any)
      .orderBy(direction === "asc" ? (asc as any)(orderCol) : (desc as any)(orderCol));
  },

  async get(id: number): Promise<Crab | undefined> {
    const rows = await db.select().from(crabs).where(eq(crabs.id, id)).limit(1);
    return rows[0];
  },

  async create(data: CreateCrabInput): Promise<number> {
    const res = await db.insert(crabs).values(data as NewCrab);
    const insertId = (res as any)?.insertId as number | undefined;
    if (typeof insertId === "number") return insertId;
    throw new Error("Insert succeeded but insertId was not returned by the driver");
  },

  async update(id: number, data: UpdateCrabInput): Promise<boolean> {
    const res = await db.update(crabs).set(data as Partial<NewCrab>).where(eq(crabs.id, id));
    const affectedRows = (res as any)?.affectedRows ?? (res as any)?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  },

  async remove(id: number): Promise<boolean> {
    const res = await db.delete(crabs).where(eq(crabs.id, id));
    const affectedRows = (res as any)?.affectedRows ?? (res as any)?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  },
};