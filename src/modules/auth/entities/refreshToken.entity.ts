import type { RefreshToken as RefreshTokenSchema } from "../schemas/refreshToken.schema";

export class RefreshToken {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly tokenId: string,
    public readonly isRevoked: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  isExpired(expirationDays: number = 14): boolean {
    const expirationDate = new Date(this.createdAt);
    expirationDate.setDate(expirationDate.getDate() + expirationDays);
    return new Date() > expirationDate;
  }

  getDaysOld(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

/**
 * Mapper function to convert DB schema to RefreshToken entity
 */
export function mapToRefreshToken(dbRow: RefreshTokenSchema): RefreshToken {
  return new RefreshToken(
    dbRow.id,
    dbRow.userId,
    dbRow.tokenId,
    dbRow.isRevoked,
    dbRow.createdAt,
    dbRow.updatedAt
  );
}

/**
 * Mapper function to convert array of DB rows to RefreshToken entities
 */
export function mapToRefreshTokens(dbRows: RefreshTokenSchema[]): RefreshToken[] {
  return dbRows.map(mapToRefreshToken);
}
