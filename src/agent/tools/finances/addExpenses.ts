import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { financeService } from "@/src/modules/finance/finance.service";

export const addExpenses = createTool({
  id: "Add Expenses",
  inputSchema: z.object({
    amount: z.number(),
    category: z.string(),
    description: z.string().optional(),
  }),
  description: `Adds expenses to the finance journal`,
  execute: async ({ context: { amount, category, description } }) => {
    // Create a new expense entry in the finance journal
    const newExpense = {
      type: "expense" as const,
      amount: amount.toString(),
      category,
      description,
    };

    const expenseId = await financeService.create(newExpense);

    return { id: expenseId };
  },
});