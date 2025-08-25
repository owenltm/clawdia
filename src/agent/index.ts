import { Mastra } from '@mastra/core';
import { ClawdiaAgent, FinanceAgent, InventoryAgent } from './agents';

export const mastra = new Mastra({
  telemetry: {
    enabled: process.env.NODE_ENV != 'production',
  },
  agents: {ClawdiaAgent, FinanceAgent, InventoryAgent},
})