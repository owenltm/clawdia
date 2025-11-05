import { eq, and } from "drizzle-orm";
import { db } from "../../../db/client";
import { refreshTokens, NewRefreshToken } from "../schemas/refreshToken.schema";
import { RefreshToken, mapToRefreshToken, mapToRefreshTokens } from "../entities/refreshToken.entity";
import type { CreateRefreshTokenInput, UpdateRefreshTokenInput, ListRefreshTokenParams } from "../types";

export const RefreshTokenRepository = {
  async list(params: ListRefreshTokenParams = {}): Promise<RefreshToken[]> {
    const { userId } = params;

    const where = [];
    if (userId !== undefined) where.push(eq(refreshTokens.userId, userId));

    const rows = await db
      .select()
      .from(refreshTokens)
      .where(where.length ? (where.length === 1 ? where[0] : and(...where)) : undefined);

    return mapToRefreshTokens(rows);
  },

  async get(id: number): Promise<RefreshToken | null> {
    const rows = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.id, id))
      .limit(1);
    
    return rows.length > 0 ? mapToRefreshToken(rows[0]) : null;
  },

  async getByTokenId(tokenId: string): Promise<RefreshToken | null> {
    const rows = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenId, tokenId))
      .limit(1);
    
    return rows.length > 0 ? mapToRefreshToken(rows[0]) : null;
  },

  async getByUserId(userId: number): Promise<RefreshToken[]> {
    const rows = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.userId, userId));
    
    return mapToRefreshTokens(rows);
  },

  async create(data: CreateRefreshTokenInput): Promise<number> {
    const newToken: NewRefreshToken = {
      userId: data.userId,
      tokenId: data.tokenId,
    };

    const res = await db.insert(refreshTokens).values(newToken);
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const insertId = resultObj?.insertId as number | undefined;
    
    if (typeof insertId === "number") return insertId;
    throw new Error("Insert succeeded but insertId was not returned by the driver");
  },

  async update(id: number, data: UpdateRefreshTokenInput): Promise<boolean> {
    const updateData: Partial<NewRefreshToken> = {};
    if (data.tokenId !== undefined) updateData.tokenId = data.tokenId;

    const res = await db
      .update(refreshTokens)
      .set(updateData)
      .where(eq(refreshTokens.id, id));
    
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const affectedRows = resultObj?.affectedRows ?? resultObj?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  },

  async revokeTokenId(tokenId: string): Promise<boolean> {
    const res = await db
      .update(refreshTokens)
      .set({ isRevoked: true })
      .where(eq(refreshTokens.tokenId, tokenId));

    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const affectedRows = resultObj?.affectedRows ?? resultObj?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  },

  async remove(id: number): Promise<boolean> {
    const res = await db.delete(refreshTokens).where(eq(refreshTokens.id, id));
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const affectedRows = resultObj?.affectedRows ?? resultObj?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  },

  async removeByTokenId(tokenId: string): Promise<boolean> {
    const res = await db.delete(refreshTokens).where(eq(refreshTokens.tokenId, tokenId));
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const affectedRows = resultObj?.affectedRows ?? resultObj?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  },

  async removeByUserId(userId: number): Promise<boolean> {
    const res = await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const affectedRows = resultObj?.affectedRows ?? resultObj?.rowsAffected;
    return (affectedRows ?? 0) > 0;
  },

  async removeExpiredTokens(expirationDays: number = 14): Promise<number> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - expirationDays);

    const res = await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.createdAt, expirationDate));
    
    const resultObj: any = Array.isArray(res) ? res[0] : res;
    const affectedRows = resultObj?.affectedRows ?? resultObj?.rowsAffected;
    return affectedRows ?? 0;
  },
};
