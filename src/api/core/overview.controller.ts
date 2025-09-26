import { overviewUseCase } from "@/src/usecases/overview/overview.usecase";
import { Router, Request, Response, NextFunction } from "express";

// Router for Overview. Mount as: app.use("/overview", overviewRouter)
export const overviewRouter = Router();

// List overview items
overviewRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const data = await inventoryUseCase.getCurrentInventory();
    const financeData = await overviewUseCase.getFinanceOverviewData();
    res.status(200).json({ finance: financeData });
  } catch (err) {
    next(err);
  }
});