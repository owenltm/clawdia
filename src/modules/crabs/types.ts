import type { NewCrab, Crab } from "../../db/schema";

export type CreateCrabInput = Omit<NewCrab, "id" | "createdAt" | "updatedAt">;
export type UpdateCrabInput = Partial<CreateCrabInput>;

export type ListCrabsParams = {
  status?: Crab["status"];
  boxId?: number | null;
  orderBy?: "createdAt" | "updatedAt" | "weight";
  direction?: "asc" | "desc";
};

