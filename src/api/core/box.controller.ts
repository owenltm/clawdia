import { Router, Request, Response, NextFunction } from "express";

// Router for Boxes. Mount as: app.use("/boxes", boxRouter)
export const boxRouter = Router();

// List all boxes
boxRouter.get("/", async (req: Request, res: Response, _next: NextFunction) => {
  // TODO: implement listing logic
  res.status(200).json({ message: "List boxes - not implemented" });
});

// Get a single box by ID
boxRouter.get("/:id", async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  // TODO: implement fetch logic
  res.status(200).json({ message: "Get box - not implemented", id });
});

// Create a new box
boxRouter.post("/", async (req: Request, res: Response, _next: NextFunction) => {
  const payload = req.body;
  // TODO: implement create logic
  res.status(201).json({ message: "Create box - not implemented", payload });
});

// Replace a box by ID
boxRouter.put("/:id", async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const payload = req.body;
  // TODO: implement replace logic
  res.status(200).json({ message: "Replace box - not implemented", id, payload });
});

// Partially update a box by ID
boxRouter.patch("/:id", async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const payload = req.body;
  // TODO: implement patch logic
  res.status(200).json({ message: "Update box - not implemented", id, payload });
});

// Delete a box by ID
boxRouter.delete("/:id", async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  // TODO: implement delete logic
  res.status(200).json({ message: "Delete box - not implemented", id });
});
