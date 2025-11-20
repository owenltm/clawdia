import { createTool } from "@mastra/core/tools";
import { z } from "zod";
 
export const callFinanceAgentTool = createTool({
  id: "Finance agent",
  description: "Calls the finance agent to help with tasks related to the store's finances. This includes managing the finance journal, tracking business expenses, and providing information on the store's financial records.",
  inputSchema: z.object({
    topic: z.string()
  }),
  outputSchema: z.object({
    copy: z.string()
  }),
  execute: async ({ context, mastra }) => {
    const { topic } = context;
 
    const agent = mastra!.getAgent("FinanceAgent");
    const result = await agent!.generate(`Help complete user's request of ${topic}`);
 
    return {
      copy: result.text
    };
  }
});