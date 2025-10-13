import { CrabStatus } from "@/src/modules/inventory/types";
import { inventoryUseCase } from "@/src/usecases/inventory/inventory.usecase";
import { Router, Request, Response, NextFunction } from "express";

// Router for Inventory. Mount as: app.use("/inventory", inventoryRouter)
export const inventoryRouter = Router();

inventoryRouter.get("/overview", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await inventoryUseCase.getInventoryOverview(); 
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

// List inventory items
inventoryRouter.get("/current", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await inventoryUseCase.getCurrentInventory();
    res.status(200).json({ items: data });
  } catch (err) {
    next(err);
  }
});

// Add new crab to box
inventoryRouter.post("/:boxId/checkIn", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const boxId = parseInt(req.params.boxId);
    const crabData = req.body;
    const data = await inventoryUseCase.newCrabCheckin({boxId, data: crabData});
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

inventoryRouter.post("/:boxId/checkOut", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const boxId = parseInt(req.params.boxId);
    const { status } = req.body;

    if (status !== CrabStatus.SOLD && status !== CrabStatus.DEAD) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const data = await inventoryUseCase.updateCrabCheckout({ boxId, status });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});