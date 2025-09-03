import { Mastra } from '@mastra/core';
import { ClawdiaAgent, FinanceAgent, InventoryAgent } from './agents';

export const mastra = new Mastra({
  telemetry: {
    enabled: false,
  },
  agents: {ClawdiaAgent, FinanceAgent, InventoryAgent},
})