import { z } from "zod";
import { createTool } from "@mastra/core/tools";

import { inventoryUseCase } from "@/src/usecases/inventory/inventory.usecase";

export const crabCheckOut = createTool({
  id: "Crab Check Out",
  inputSchema: z.object({
    "boxLabel": z.string().max(10).describe("Label of the box where the crab is checked out from"),
    "status": z.enum(["sold", "dead"]).describe("Status of the crab being checked out"),
  }),
  description: `Checks out a crab`,
  execute: async ({ context }) => {
    try {
      const updatecCrab = await inventoryUseCase.updateCrabCheckout(
        context.boxLabel,
        context.status,
      );

      if (!updatecCrab) {
        return "Error during crab check-in, please try again later.";
      }

      return `Crab successfully checked out from box labeled: ${context.boxLabel}`;
    } catch (error) {
      console.error("Error during crab check-in:", error);
      return "Error during crab check-in, please try again later.";
    }
  },
});