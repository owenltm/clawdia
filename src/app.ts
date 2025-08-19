import express, { Request, Response, NextFunction } from "express";
import { boxRouter } from "./api/core/box.controller";
import { crabRouter } from "./api/core/crab.controller";
import { financeRouter } from "./api/core/finance.controller";

const app = express();

// Middleware
app.use(express.json());

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "running",
    message: "Clawdia API Service",
    timestamp: new Date().toISOString(),
  });
});

// Feature routes
app.use("/core/boxes", boxRouter);
app.use("/core/crabs", crabRouter);
app.use("/core/finance", financeRouter);

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
