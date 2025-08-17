import { Router, Request, Response, NextFunction } from "express";
import { boxService } from "../../modules/boxes/box.service";

// Router for Boxes. Mount as: app.use("/boxes", boxRouter)
export const boxRouter = Router();

// List all boxes
boxRouter.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await boxService.list();
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

// Get a single box by ID
boxRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const item = await boxService.get(id);
    if (!item) return res.status(404).json({ message: "Not Found" });
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
});

// Create a new box
boxRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = await boxService.create(req.body);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
});

// Replace a box by ID
boxRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const ok = await boxService.update(id, req.body);
    if (!ok) return res.status(404).json({ message: "Not Found" });
    res.status(200).json({ updated: true });
  } catch (err) {
    next(err);
  }
});

// Partially update a box by ID
boxRouter.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const ok = await boxService.update(id, req.body);
    if (!ok) return res.status(404).json({ message: "Not Found" });
    res.status(200).json({ updated: true });
  } catch (err) {
    next(err);
  }
});

// Delete a box by ID
boxRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const ok = await boxService.remove(id);
    if (!ok) return res.status(404).json({ message: "Not Found" });
    res.status(200).json({ deleted: true });
  } catch (err) {
    next(err);
  }
});
