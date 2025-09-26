import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { financeService } from "@/src/modules/finance/finance.service";
import { FINANCE_CATEGORY_VALUES, FinanceType } from "@/src/modules/finance/types";

export const addExpenses = createTool({
  id: "Add Expenses",
  inputSchema: z.object({
    amount: z.number(),
    category: z.enum(FINANCE_CATEGORY_VALUES),
    description: z.string().optional(),
  }),
  description: `Adds expenses to the finance journal`,
  execute: async ({ context: { amount, category, description } }) => {
    // Create a new expense entry in the finance journal
    const newExpense = {
      type: FinanceType.EXPENSE,
      amount: amount,
      category,
      description,
    };

    const expenseId = await financeService.create(newExpense);

    return { id: expenseId };
  },
});