import { mysqlTable, int, varchar, mysqlEnum, timestamp, decimal, date, index } from "drizzle-orm/mysql-core";
import { relations, InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { boxes } from "@/src/modules/boxes/box.schema";
import { CRAB_STATUS_VALUES } from "./types";

export const crabs = mysqlTable(
  "crabs",
  {
    id: int("id").autoincrement().primaryKey(),
    weight: decimal("weight", { precision: 10, scale: 2 }).notNull(),
    supplier: varchar("supplier", { length: 255 }).notNull(),
    status: mysqlEnum("status", CRAB_STATUS_VALUES).notNull(),
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

export const crabsRelations = relations(crabs, ({ one }) => ({
  box: one(boxes, {
    fields: [crabs.boxId],
    references: [boxes.id],
  }),
}));

export type Crab = InferSelectModel<typeof crabs>;
export type NewCrab = InferInsertModel<typeof crabs>;
