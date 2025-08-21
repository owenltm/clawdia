import { z } from "zod";
import { createTool } from "@mastra/core/tools";

import { inventoryUseCase } from "@/src/usecases/inventory/inventory.usecase";

export const crabCheckIn = createTool({
  id: "Crab Check In",
  inputSchema: z.object({
    "weight": z.number().min(0).max(2000).describe("Weight of the crab in grams"),
    "supplier": z.string().max(1).describe("Supplier of the crab"),
    "checkInDate": z.date().default(new Date()).describe("Date of check-in"),
    "boxLabel": z.string().max(10).describe("Label of the box where the crab is checked in"),
  }),
  description: `Checks in a crab`,
  execute: async ({ context }) => {
    try {
      const newCrabCheckin = await inventoryUseCase.newCrabCheckin(
        {
          weight: context.weight.toString(),
          supplier: context.supplier,
          status: "in",
          checkInDate: context.checkInDate,
        },
        context.boxLabel,
      );

      if(!newCrabCheckin) {
        return "Error during crab check-in, please try again later.";
      }

      return `Crab successfully checked in with ID: ${newCrabCheckin}`;
    } catch (error) {
      console.error("Error during crab check-in:", error);
      return "Error during crab check-in, please try again later.";
    }
  },
});