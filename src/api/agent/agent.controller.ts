import { Router, Request, Response, NextFunction } from "express";

import { mastra } from '@/src/agent/index';

// Router for Boxes. Mount as: app.use("/agent", agentRouter)
export const agentRouter = Router();

// List all boxes
agentRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agent = mastra.getAgent("ClawdiaAgent");
    const result = await agent.generate(req.body.query);
    res.status(200).json({
      result: result.text,
    });
  } catch (err) {
    next(err);
  }
});