import { updateStockExit } from "@/src/repository/crabRepository";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const takeOutStock = createTool({
  id: "Take Out Stock",
  description: "Take out stock from the box (Sold, Used, Dead)",
  inputSchema: z.object({
    boxid: z.string().describe("The box id of the stock"),
    exitdt: z.date().default(new Date()),
    exitweight: z.number(),
    exittype: z.enum(['sold', 'use', 'dead']),
  }),
  execute: async ({ context: { boxid, exitdt, exitweight, exittype } }) => {
    try {
      console.log(`Taking out ${boxid}`);

      const formattedExitDt = exitdt instanceof Date
      ? exitdt.toISOString().slice(0, 19).replace('T', ' ')
      : exitdt; // fallback if already string

      const result = await updateStockExit(boxid, formattedExitDt, exitweight, exittype);
      console.log("updated:", result);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to take out stock");
    }
  },
});
