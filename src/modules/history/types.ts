import type { HistoryLog, NewHistoryLog } from "../../db/schema";

export type CreateHistoryInput = Omit<NewHistoryLog, "id" | "createdAt">;
export type UpdateHistoryInput = Partial<CreateHistoryInput>;

export type ListHistoryParams = {
  entityType?: HistoryLog["entityType"];
  entityId?: number;
  action?: HistoryLog["action"];
  startDate?: Date;
  endDate?: Date;
  orderBy?: "createdAt";
  direction?: "asc" | "desc";
};
