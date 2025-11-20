import type { NewCrab } from "./schemas/crab.schema";
import { Crab } from "./entities";

export type CreateCrabInput = Omit<NewCrab, "id" | "createdAt" | "updatedAt">;
export type UpdateCrabInput = Partial<CreateCrabInput>;

export enum BoxStatus {
  FILLED = "filled",
  EMPTY = "empty",
  UNAVAILABLE = "unavailable",
}

export const BOX_STATUS_VALUES = Object.values(BoxStatus) as [BoxStatus, ...BoxStatus[]];

export enum CrabStatus {
  IN = "in",
  SOLD = "sold",
  DEAD = "dead",
}
export const CRAB_STATUS_VALUES = Object.values(CrabStatus) as [CrabStatus, ...CrabStatus[]];

export type CreateBoxParam = {
  "label": string,
  "status"?: string,
  "maxFill"?: number
}

export type UpdateBoxParam = Partial<CreateBoxParam>;

export type CreateCrabParam = {}

export type UpdateCrabParam = Partial<CreateCrabParam>;

export type ListBoxesParams = {
  status?: BoxStatus
}

export type ListCrabsParams = {
  status?: CrabStatus;
  boxId?: number | null;
  checkedInAfter?: Date;
  checkedInBefore?: Date;
  checkedOutAfter?: Date;
  checkedOutBefore?: Date;
  orderBy?: "createdAt" | "updatedAt" | "weight";
  direction?: "asc" | "desc";
};

export type Inventory = {
  id: number,
  label: string,
  status: BoxStatus,
  maxFill: number,
  content: Crab[]
}