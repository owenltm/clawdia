import { sql, relations, InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  mysqlTable,
  int,
  varchar,
  mysqlEnum,
  timestamp,
  decimal,
  date,
  index,
} from "drizzle-orm/mysql-core";

// Boxes table
export const boxes = mysqlTable(
  "boxes",
  {
    id: int("id").autoincrement().primaryKey(), // switch to char(36) for UUID if desired
    label: varchar("label", { length: 255 }).notNull(),
    status: mysqlEnum("status", ["filled", "empty"]).notNull(),
    maxFill: int("max_fill").notNull().default(1),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    statusIdx: index("idx_boxes_status").on(table.status),
  })
);

// Crabs table
export const crabs = mysqlTable(
  "crabs",
  {
    id: int("id").autoincrement().primaryKey(), // switch to char(36) for UUID if desired
    weight: decimal("weight", { precision: 10, scale: 2 }).notNull(),
    supplier: varchar("supplier", { length: 255 }).notNull(),
    status: mysqlEnum("status", ["in", "sold", "dead"]).notNull(),
    checkInDate: date("check_in_date").notNull().default(sql`(CURRENT_DATE)`),
    checkOutDate: date("check_out_date"),
    boxId: int("box_id").references(() => boxes.id),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    boxIdIdx: index("idx_crabs_box_id").on(table.boxId),
    statusIdx: index("idx_crabs_status").on(table.status),
    checkInDateIdx: index("idx_crabs_check_in_date").on(table.checkInDate),
    checkOutDateIdx: index("idx_crabs_check_out_date").on(table.checkOutDate),
  })
);


// History Log
export const historyLog = mysqlTable(
  "history_log",
  {
    id: int("id").autoincrement().primaryKey(),
    entityType: mysqlEnum("entity_type", ["crab", "box"]).notNull(),
    entityId: int("entity_id").notNull(),
    action: mysqlEnum("action", ["checkin", "checkout", "death", "move"]).notNull(),
    data: varchar("data", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    entityIdx: index("idx_history_log_entity").on(table.entityType, table.entityId),
    actionIdx: index("idx_history_log_action").on(table.action),
    createdAtIdx: index("idx_history_log_created_at").on(table.createdAt),
  })
);

// Finance Journal
export const financeJournal = mysqlTable(
  "finance_journal",
  {
    id: int("id").autoincrement().primaryKey(),
    type: mysqlEnum("type", ["expense", "revenue"]).notNull(),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    category: varchar("category", { length: 50 }).notNull(),
    referenceId: int("reference_id"),
    description: varchar("description", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    createdAtIdx: index("idx_finance_journal_created_at").on(table.createdAt),
    typeCategoryIdx: index("idx_finance_journal_type_category").on(table.type, table.category),
    referenceIdIdx: index("idx_finance_journal_reference_id").on(table.referenceId),
  })
);

// Relations
export const boxesRelations = relations(boxes, ({ many }) => ({
  crabs: many(crabs),
}));

export const crabsRelations = relations(crabs, ({ one }) => ({
  box: one(boxes, {
    fields: [crabs.boxId],
    references: [boxes.id],
  }),
}));

// Types
export type Box = InferSelectModel<typeof boxes>;
export type NewBox = InferInsertModel<typeof boxes>;
export type Crab = InferSelectModel<typeof crabs>;
export type NewCrab = InferInsertModel<typeof crabs>;
export type HistoryLog = InferSelectModel<typeof historyLog>;
export type NewHistoryLog = InferInsertModel<typeof historyLog>;
export type FinanceJournal = InferSelectModel<typeof financeJournal>;
export type NewFinanceJournal = InferInsertModel<typeof financeJournal>;
