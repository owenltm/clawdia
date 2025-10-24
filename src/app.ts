import express, { Request, Response, NextFunction } from "express";
import passport from "passport";

import { ApiKeyMiddleware } from "./middleware/authMiddleware";
import { boxRouter } from "./api/core/box.controller";
import { crabRouter } from "./api/core/crab.controller";
import { financeRouter } from "./api/core/finance.controller";
import { agentRouter } from "./api/agent/agent.controller";
import { inventoryRouter } from "./api/core/inventory.controller";
import { authRouter } from "./api/core/auth.controller";

const app = express();

// Middleware
app.use(express.json());
if (process.env.API_KEY) {
  // app.use("/core", ApiKeyMiddleware);
  app.use("/agent", ApiKeyMiddleware);
}

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "running",
    message: "Clawdia API Service",
    timestamp: new Date().toISOString(),
  });
});

// Agent routes
app.use("/agent", agentRouter);

// Feature routes
app.use("/core/auth", authRouter);
app.use("/core/boxes", boxRouter);
app.use("/core/crabs", crabRouter);
app.use("/core/finance", financeRouter);
app.use("/core/inventory", inventoryRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;