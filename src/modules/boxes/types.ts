import type { NewBox } from "./box.schema";

export type CreateBoxInput = Omit<NewBox, "id" | "createdAt" | "updatedAt">;
export type UpdateBoxInput = Partial<CreateBoxInput>;

export enum BoxStatus {
  FILLED = "filled",
  EMPTY = "empty",
}

export const BOX_STATUS_VALUES = Object.values(BoxStatus) as [BoxStatus, ...BoxStatus[]];