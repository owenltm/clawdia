import type { NewCrab, Crab } from "./crab.schema";

export type CreateCrabInput = Omit<NewCrab, "id" | "createdAt" | "updatedAt">;
export type UpdateCrabInput = Partial<CreateCrabInput>;

export type ListCrabsParams = {
  status?: Crab["status"];
  boxId?: number | null;
  orderBy?: "createdAt" | "updatedAt" | "weight";
  direction?: "asc" | "desc";
};

export enum CrabStatus {
  IN = "in",
  SOLD = "sold",
  DEAD = "dead",
}
export const CRAB_STATUS_VALUES = Object.values(CrabStatus) as [CrabStatus, ...CrabStatus[]];