import type { FinanceJournal, HistoryLog, NewFinanceJournal, NewHistoryLog } from "../../db/schema";

export type CreateFinanceInput = Omit<NewFinanceJournal, "id" | "createdAt">;
export type UpdateFinanceInput = Partial<CreateFinanceInput>;

export type ListFinanceParams = {
  type?: FinanceJournal["type"];
  category?: string;
  referenceId?: number;
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
  direction?: "asc" | "desc";
};
