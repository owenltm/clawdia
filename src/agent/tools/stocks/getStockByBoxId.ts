import { getStockByBoxid } from "@/src/repository/crabRepository";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const getStockByBoxId = createTool({
  id: "Get Stock By Box Id",
  description: "Get stock details by box id",
  inputSchema: z.object({
    boxid: z.string().describe("The box id of the stock"),
  }),
  execute: async ({ context: { boxid } }) => {
    const stock = await getStockByBoxid(boxid);
    return stock;
  },
});
