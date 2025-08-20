import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { financeService } from "@/src/modules/finance/finance.service";

export const addRevenue = createTool({
  id: "Add Revenue",
  inputSchema: z.object({
    amount: z.number(),
    category: z.string(),
    description: z.string().optional(),
  }),
  description: `Adds revenue to the finance journal`,
  execute: async ({ context: { amount, category, description } }) => {
    // Create a new revenue entry in the finance journal
    const newRevenue = {
      type: "revenue" as const,
      amount: amount.toString(),
      category,
      description,
    };

    const revenueId = await financeService.create(newRevenue);

    return { id: revenueId };
  },
});