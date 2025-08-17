import { listAllCash } from "@/src/repository/cashRepository";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const listMutation = createTool({
  id: "List All Mutation",
  description: `List all cash mutation`,
  inputSchema: z.object({
    limit: z.number().optional(),
  }),
  execute: async ({context: { limit }}) => {
    const cash = await listAllCash(limit);
    return cash;
  },
});