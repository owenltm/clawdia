import type { NewCrab } from "./crab.schema";

export type CreateCrabInput = Omit<NewCrab, "id" | "createdAt" | "updatedAt">;
export type UpdateCrabInput = Partial<CreateCrabInput>;

export type Crab = {
  id: number;
  weight: number;
  supplier: string;
  status: CrabStatus;
  checkInDate: Date;
  checkOutDate?: Date | null;
  boxId?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ListCrabsParams = {
  status?: CrabStatus;
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