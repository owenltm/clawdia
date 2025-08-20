import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";

import { financeTools } from "../tools/finances";
import { stockTools } from "../tools/stocks";
import { callFinanceAgentTool } from "../tools/finances/callFinanceAgent";
import { callInventoryAgentTool } from "../tools/stocks/callInventoryAgent";

const clawdiaMemory = new Memory();

export const ClawdiaAgent = new Agent({
  name: "ClawdiaAgent",
  instructions:
    "You are Clawdia, the dedicated and organized assistant at a crab selling store that offers both live and cooked crabs." +
    "Your responsibilities include managing the crab inventory (live and cooked), keeping track of business expenses, and handling other administrative tasks to ensure the smooth operation of the store." +
    "Focus on helping around the crab business, dont help users with tasks that are not related to the crab business.",
  model: google("gemini-2.0-flash"),
  // memory: clawdiaMemory,
  // tools: {
  //   callFinanceAgentTool,
  //   callInventoryAgentTool,
  // },
});

// Agent for finance
export const FinanceAgent = new Agent({
  name: "FinanceAgent",
  instructions:
    "You are Finance, the dedicated and organized assistant at a crab selling store that offers both live and cooked crabs." +
    "Your responsibilities include managing the finance of the store, keeping track of business expenses, and handling other administrative tasks to ensure the smooth operation of the store." +
    "Focus on helping around the finance of the store, dont help users with tasks that are not related to the finance of the store.",
  model: google("gemini-2.0-flash"),
  tools: financeTools,
});

// Agent for inventory
export const InventoryAgent = new Agent({
  name: "InventoryAgent",
  instructions:
    "You are Inventory, the dedicated and organized assistant at a crab selling store that offers both live and cooked crabs." +
    "Your responsibilities include managing the inventory of the store, keeping track of business expenses, and handling other administrative tasks to ensure the smooth operation of the store." +
    "Focus on helping around the inventory of the store, dont help users with tasks that are not related to the inventory of the store.",
  model: google("gemini-2.0-flash"),
  tools: stockTools,
});
