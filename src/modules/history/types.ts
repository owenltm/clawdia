import type { HistoryLog, NewHistoryLog } from "./history.schema";

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

export enum HistoryEntityType {
  CRAB = "crab",
  BOX = "box",
}

export const HISTORY_ENTITY_TYPE_VALUES = Object.values(HistoryEntityType) as [HistoryEntityType, ...HistoryEntityType[]];

export enum HistoryAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  CHECKIN = "checkin",
  CHECKOUT = "checkout",
  TRANSFER = "transfer",
}

export const HISTORY_ACTION_VALUES = Object.values(HistoryAction) as [HistoryAction, ...HistoryAction[]];
