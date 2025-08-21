import { createTool } from "@mastra/core/tools";
import { z } from "zod";
 
export const callInventoryAgentTool = createTool({
  id: "Inventory agent",
  description: "Calls the inventory agent to manage the crab stock.",
  inputSchema: z.object({
    topic: z.string()
  }),
  outputSchema: z.object({
    copy: z.string()
  }),
  execute: async ({ context, mastra }) => {
    const { topic } = context;

    const agent = mastra!.getAgent("InventoryAgent");
    const result = await agent!.generate(`Help complete user's request of ${topic}`);

    return {
      copy: result.text
    };
  }
});