import { mysqlTable, int, varchar, mysqlEnum, timestamp, index, boolean } from "drizzle-orm/mysql-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { users } from "./user.schema";

export const refreshTokens = mysqlTable(
  "refresh_tokens",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenId: varchar("token_id", { length: 255 }).notNull().unique(),
    isRevoked: boolean("is_revoked").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    userIdIdx: index("idx_refresh_tokens_user_id").on(table.userId),
  })
);

export type RefreshToken = InferSelectModel<typeof refreshTokens>;
export type NewRefreshToken = InferInsertModel<typeof refreshTokens>;

