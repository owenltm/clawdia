import e from "express";
import type { FinanceJournal, NewFinanceJournal } from "./finance.schema";

export type CreateFinanceInput = Omit<NewFinanceJournal, "id" | "createdAt">;
export type UpdateFinanceInput = Partial<CreateFinanceInput>;

export type ListFinanceParams = {
  type?: FinanceJournal["type"];
  category?: FinanceCategory;
  referenceId?: number;
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
  direction?: "asc" | "desc";
};

export enum FinanceType {
  EXPENSE = "expense",
  REVENUE = "revenue",
}

export const FINANCE_TYPE_VALUES = Object.values(FinanceType) as [FinanceType, ...FinanceType[]];

export enum FinanceRevenueCategory {
  SALES = "sales",
  OTHER = "other_revenue",
}

export const FINANCE_REVENUE_CATEGORY_VALUES = Object.values(FinanceRevenueCategory) as [FinanceRevenueCategory, ...FinanceRevenueCategory[]];

export enum FinanceExpenseCategory {
  SUPPLIES = "supplies",
  BILLS = "bills",
  STOCK = "stock",
  MAINTENANCE = "maintenance",
}

export const FINANCE_EXPENSE_CATEGORY_VALUES = Object.values(FinanceExpenseCategory) as [FinanceExpenseCategory, ...FinanceExpenseCategory[]];

export type FinanceCategory = FinanceRevenueCategory | FinanceExpenseCategory;
export const FINANCE_CATEGORY_VALUES = [
  ...FINANCE_REVENUE_CATEGORY_VALUES,
  ...FINANCE_EXPENSE_CATEGORY_VALUES
] as [FinanceCategory, ...FinanceCategory[]];
