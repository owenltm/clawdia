import { FinanceJournal as FinanceJournalSchema } from "./schemas/finance.schema";
import { FinanceJournal } from "./entities/finance.entity";

export type CreateFinanceInput = Omit<FinanceJournalSchema, "id" | "createdAt">;
export type UpdateFinanceInput = Partial<CreateFinanceInput>;

export enum FinanceType {
  EXPENSE = "expense",
  REVENUE = "revenue",
}

export const FINANCE_TYPE_VALUES = Object.values(FinanceType) as [FinanceType, ...FinanceType[]];

export enum FinanceCategory {
  SALES = "sales",
  OTHER = "other_revenue",
  SUPPLIES = "supplies",
  BILLS = "bills",
  STOCK = "stock",
  MAINTENANCE = "maintenance",
}
export const FINANCE_CATEGORY_VALUES = Object.values(FinanceCategory) as [FinanceCategory, ...FinanceCategory[]];
export interface DailyFinanceSummary {
  date: string; // ISO date string (YYYY-MM-DD)
  revenues: FinanceJournal[];
  expenses: FinanceJournal[];
}

export type ListFinanceParams = {
  type?: FinanceType;
  category?: FinanceCategory;
  referenceId?: number;
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
  direction?: "asc" | "desc";
};

export type CreateFinanceParam = {
   type: "revenue" | "expense",
   amount: number,
   category: string,
   date: string,
   referenceId?: number,
   description?: string,
}