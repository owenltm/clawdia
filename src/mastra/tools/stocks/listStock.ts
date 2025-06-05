import { listCurrentStock } from "@/src/repository/crabRepository";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const listStock = createTool({
  id: "List Stock",
  description: `List the current stock of the store, optionally filtered by limit, minWeight, and supplier`,
  inputSchema: z.object({
    limit: z.number().optional(),
    minWeight: z.number().optional(),
    supplier: z.string().optional(),
  }),
  execute: async ({context: { limit }}) => {
    const crabs = await listCurrentStock(limit);
    return crabs;
  },
});