import { inventoryUseCase } from "@/src/usecases/inventory/inventory.usecase";
import { Router, Request, Response, NextFunction } from "express";

// Router for Inventory. Mount as: app.use("/inventory", inventoryRouter)
export const inventoryRouter = Router();

// List inventory items
inventoryRouter.get("/current", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await inventoryUseCase.getCurrentInventory();
    res.status(200).json({ items: data });
  } catch (err) {
    next(err);
  }
});