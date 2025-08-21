import { createTool } from "@mastra/core/tools";
import { z } from "zod";
 
export const callFinanceAgentTool = createTool({
  id: "Finance agent",
  description: "Calls the finance agent to manage the finance journal.",
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