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