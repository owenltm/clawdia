import { Router, Request, Response, NextFunction } from "express";
import { crabService } from "../../modules/inventory/services/crab.service";
import { inventoryUseCase, InventoryUseCase } from "@/src/modules/inventory/inventory.usecase";
import { ApiKeyMiddleware } from "@/src/middleware/authMiddleware";

// Router for Crabs. Mount as: app.use("/crabs", crabRouter)
export const crabRouter = Router();

crabRouter.use(ApiKeyMiddleware);

// List all crabs
crabRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, boxId, orderBy, direction } = req.query;
    const data = await inventoryUseCase.findCrabs({
      status: status as any,
      boxId: boxId === undefined ? undefined : boxId === "null" ? null : Number(boxId),
      orderBy: orderBy as any,
      direction: direction as any,
    });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

// Get a single crab by ID
crabRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const item = await inventoryUseCase.findCrabById(id);
    if (!item) return res.status(404).json({ message: "Not Found" });
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
});

// Create a new crab
crabRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = await inventoryUseCase.createCrab(req.body);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
});

// Replace a crab by ID
crabRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const ok = await inventoryUseCase.updateCrab(id, req.body);
    if (!ok) return res.status(404).json({ message: "Not Found" });
    res.status(200).json({ updated: true });
  } catch (err) {
    next(err);
  }
});

// Partially update a crab by ID
crabRouter.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const ok = await inventoryUseCase.updateCrab(id, req.body);
    if (!ok) return res.status(404).json({ message: "Not Found" });
    res.status(200).json({ updated: true });
  } catch (err) {
    next(err);
  }
});

// Delete a crab by ID
crabRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const ok = await inventoryUseCase.removeCrab(id);
    if (!ok) return res.status(404).json({ message: "Not Found" });
    res.status(200).json({ deleted: true });
  } catch (err) {
    next(err);
  }
});
