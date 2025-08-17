import { relations, InferInsertModel, InferSelectModel } from "drizzle-orm";
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
  }
);

// Crabs table
export const crabs = mysqlTable(
  "crabs",
  {
    id: int("id").autoincrement().primaryKey(), // switch to char(36) for UUID if desired
    weight: decimal("weight", { precision: 10, scale: 2 }).notNull(),
    supplier: varchar("supplier", { length: 255 }).notNull(),
    status: mysqlEnum("status", ["in", "sold", "dead"]).notNull(),
    checkInDate: date("check_in_date").notNull(),
    boxId: int("box_id").references(() => boxes.id),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    boxIdIdx: index("idx_crabs_box_id").on(table.boxId),
    statusIdx: index("idx_crabs_status").on(table.status),
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
