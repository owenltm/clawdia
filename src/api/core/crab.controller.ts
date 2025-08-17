import { Router, Request, Response, NextFunction } from "express";

// Router for Crabs. Mount as: app.use("/crabs", crabRouter)
export const crabRouter = Router();

// List all crabs
crabRouter.get("/", async (req: Request, res: Response, _next: NextFunction) => {
  // TODO: implement listing logic
  res.status(200).json({ message: "List crabs - not implemented" });
});

// Get a single crab by ID
crabRouter.get("/:id", async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  // TODO: implement fetch logic
  res.status(200).json({ message: "Get crab - not implemented", id });
});

// Create a new crab
crabRouter.post("/", async (req: Request, res: Response, _next: NextFunction) => {
  const payload = req.body;
  // TODO: implement create logic
  res.status(201).json({ message: "Create crab - not implemented", payload });
});

// Replace a crab by ID
crabRouter.put("/:id", async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const payload = req.body;
  // TODO: implement replace logic
  res.status(200).json({ message: "Replace crab - not implemented", id, payload });
});

// Partially update a crab by ID
crabRouter.patch("/:id", async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const payload = req.body;
  // TODO: implement patch logic
  res.status(200).json({ message: "Update crab - not implemented", id, payload });
});

// Delete a crab by ID
crabRouter.delete("/:id", async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  // TODO: implement delete logic
  res.status(200).json({ message: "Delete crab - not implemented", id });
});
