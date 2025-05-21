import { listAllCrab } from "@/src/repository/crabRepository";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const listStock = createTool({
  id: "List Stock",
  description: `List the current stock of the store`,
  inputSchema: z.object({
    limit: z.number().optional(),
    offset: z.number().optional(),
  }),
  execute: async ({context: { limit, offset }}) => {
    const crabs = await listAllCrab(limit, offset);
    return crabs;
  },
});