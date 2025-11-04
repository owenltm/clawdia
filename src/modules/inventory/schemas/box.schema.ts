import { mysqlTable, int, varchar, mysqlEnum, timestamp, index } from "drizzle-orm/mysql-core";
import { relations, InferInsertModel, InferSelectModel } from "drizzle-orm";
import { BOX_STATUS_VALUES, BoxStatus } from "../types";

// Boxes table
export const boxes = mysqlTable(
  "boxes",
  {
    id: int("id").autoincrement().primaryKey(), // switch to char(36) for UUID if desired
    label: varchar("label", { length: 255 }).notNull(),
    status: mysqlEnum("status", BOX_STATUS_VALUES).notNull().default(BoxStatus.EMPTY),
    maxFill: int("max_fill").notNull().default(1),
    notes: varchar("notes", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    statusIdx: index("idx_boxes_status").on(table.status),
  })
);

// Types
export type Box = InferSelectModel<typeof boxes>;
export type NewBox = InferInsertModel<typeof boxes>;

export type CreateBoxInput = Omit<NewBox, "id" | "createdAt" | "updatedAt">;
export type UpdateBoxInput = Partial<CreateBoxInput>;