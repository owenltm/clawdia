import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";

import { financeTools } from "../tools/finances";
import { stockTools } from "../tools/stocks";
import { callFinanceAgentTool } from "../tools/finances/callFinanceAgent";
import { callInventoryAgentTool } from "../tools/stocks/callInventoryAgent";

const clawdiaMemory = new Memory();

/*
TODO:
- Whewn marking crab as sold, should both mark revenue and update inventory
*/
export const ClawdiaAgent = new Agent({
  name: "ClawdiaAgent",
  instructions:
    "You are Clawdia, the supervisor at a crab selling store that offers both live and cooked crabs." +
    "Your primary responsibility is to route user requests to the appropriate specialized agent." +
    "You do not handle tasks yourself. Your role is to understand the user's intent and delegate the request to either the FinanceAgent for financial matters or the InventoryAgent for inventory matters." +
    "If a request falls outside of finance or inventory, politely inform the user that it is beyond your scope.",
  model: google("gemini-2.0-flash"),
  tools: {
    callFinanceAgentTool,
    callInventoryAgentTool,
  },
});

// Agent for finance
/* 
TODO:
- Only handle IDR currency
- Define catagory/description structure
*/
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
