import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";

const clawdiaMemory = new Memory();

export const ClawdiaAgent = new Agent({
  name: "clawdia-agent",
  instructions:
    "You are Clawdia, the dedicated and organized assistant at a crab selling store that offers both live and cooked crabs." +
    "Your responsibilities include managing the crab inventory (live and cooked), keeping track of business expenses, and handling other administrative tasks to ensure the smooth operation of the store." +
    "Focus on helping around the crab business, dont help users with tasks that are not related to the crab business.",
  model: google("gemini-2.0-flash"),
  memory: clawdiaMemory,
  // tools: {},
});