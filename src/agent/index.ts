import { Mastra } from '@mastra/core';
import { ClawdiaAgent } from './agents';

export const mastra = new Mastra({
  agents: {ClawdiaAgent},
})
        