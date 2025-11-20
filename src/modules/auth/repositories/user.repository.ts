import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "../../../db/client";
import { NewUser, users } from "../schemas/user.schema";
import { mapToDomainUser, mapToDomainUsers, User } from "../entities/user.entity";
import { CreateUserParams } from "../types";

export const UserRepository = {
  async list(params: any = {}): Promise<User[]> {
    const where = [] as any[];

    const persistedUsers = await db
      .select()
      .from(users);

    return mapToDomainUsers(persistedUsers);
  },

  async get(id: number): Promise<User | null> {
    const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if(rows.length < 1) {
      return null;
    }
    return mapToDomainUser(rows[0]) || null;
  },

  async getByUsername(username: string): Promise<User | null> {
    const rows = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if(rows.length < 1) {
      return null;
    }
    return mapToDomainUser(rows[0]) || null;
  },

  async create(data: CreateUserParams): Promise<number> {
    const res = await db.insert(users).values(data as NewUser);
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const insertId = resultObj?.insertId as number | undefined;
    if (typeof insertId === "number") return insertId;
    throw new Error("Insert succeeded but insertId was not returned by the driver");
  },

  async update(id: number, data: Partial<CreateUserParams>): Promise<boolean> {
    const res = await db.update(users).set(data as Partial<NewUser>).where(eq(users.id, id));
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const affectedRows = resultObj?.affectedRows ?? resultObj?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  },

  async remove(id: number): Promise<boolean> {
    const res = await db.delete(users).where(eq(users.id, id));
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const affectedRows = resultObj?.affectedRows ?? resultObj?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  },
};