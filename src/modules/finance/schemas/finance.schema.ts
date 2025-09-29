import { mysqlTable, int, varchar, mysqlEnum, timestamp, decimal, index } from "drizzle-orm/mysql-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { FINANCE_CATEGORY_VALUES, FINANCE_TYPE_VALUES } from "../types";

export const financeJournal = mysqlTable(
  "finance_journal",
  {
    id: int("id").autoincrement().primaryKey(),
    type: mysqlEnum("type", FINANCE_TYPE_VALUES).notNull(),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    category: mysqlEnum("category", FINANCE_CATEGORY_VALUES).notNull(),
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

export type FinanceJournal = InferSelectModel<typeof financeJournal>;
export type NewFinanceJournal = InferInsertModel<typeof financeJournal>;
