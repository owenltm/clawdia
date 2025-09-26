import type { NewBox } from "./box.schema";

export type CreateBoxInput = Omit<NewBox, "id" | "createdAt" | "updatedAt">;
export type UpdateBoxInput = Partial<CreateBoxInput>;

export type Box = {
  id: number;
  label: string;
  status: BoxStatus;
  maxFill: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum BoxStatus {
  FILLED = "filled",
  EMPTY = "empty",
}

export const BOX_STATUS_VALUES = Object.values(BoxStatus) as [BoxStatus, ...BoxStatus[]];