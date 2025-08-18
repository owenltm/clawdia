import type { NewBox } from "../../db/schema";

export type CreateBoxInput = Omit<NewBox, "id" | "createdAt" | "updatedAt">;
export type UpdateBoxInput = Partial<CreateBoxInput>;
