import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { financeUseCase } from "@/src/modules/finance/finance.usecase";
import { FINANCE_CATEGORY_VALUES, FinanceType } from "@/src/modules/finance/types";

export const addRevenue = createTool({
  id: "Add Revenue",
  inputSchema: z.object({
    amount: z.number(),
    category: z.enum(FINANCE_CATEGORY_VALUES),
    description: z.string().optional(),
  }),
  description: `Adds revenue to the finance journal`,
  execute: async ({ context: { amount, category, description } }) => {
    // Create a new revenue entry in the finance journal
    const newRevenue = {
      type: FinanceType.REVENUE,
      amount: amount as number,
      category,
      description,
    };

    const revenueId = await financeUseCase.create(newRevenue);

    return { id: revenueId };
  },
});