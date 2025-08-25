import { mysqlTable, int, varchar, mysqlEnum, timestamp, index } from "drizzle-orm/mysql-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { HISTORY_ACTION_VALUES, HISTORY_ENTITY_TYPE_VALUES } from "./types";

export const historyLog = mysqlTable(
  "history_log",
  {
    id: int("id").autoincrement().primaryKey(),
    entityType: mysqlEnum("entity_type", HISTORY_ENTITY_TYPE_VALUES).notNull(),
    entityId: int("entity_id").notNull(),
    action: mysqlEnum("action", HISTORY_ACTION_VALUES).notNull(),
    data: varchar("data", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    entityIdx: index("idx_history_log_entity").on(table.entityType, table.entityId),
    actionIdx: index("idx_history_log_action").on(table.action),
    createdAtIdx: index("idx_history_log_created_at").on(table.createdAt),
  })
);

export type HistoryLog = InferSelectModel<typeof historyLog>;
export type NewHistoryLog = InferInsertModel<typeof historyLog>;
