import { Router, Request, Response, NextFunction } from "express";
import { financeUseCase } from "../../modules/finance/finance.usecase";

// Router for Finance. Mount as: app.use("/finance", financeRouter)
export const financeRouter = Router();

// GET version with query parameters
financeRouter.get("/overview", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
    
    // Default to start and end of current month if not provided
    const now = new Date();
    const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const defaultEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    
    const data = await financeUseCase.getFinanceOverview(startDate || defaultStartDate, endDate || defaultEndDate);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

// List finance journal entries
financeRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, category, referenceId, minAmount, maxAmount, startDate, endDate, direction } = req.query as Record<string, string | undefined>;

    const params = {
      type: type as any,
      category: category as any,
      referenceId: referenceId !== undefined ? Number(referenceId) : undefined,
      minAmount: minAmount !== undefined ? Number(minAmount) : undefined,
      maxAmount: maxAmount !== undefined ? Number(maxAmount) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      direction: direction as any,
    };

    const data = await financeUseCase.list(params);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

// Get a single finance record by ID
financeRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const item = await financeUseCase.get(id);
    if (!item) return res.status(404).json({ message: "Not Found" });
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
});

// Create a new finance record
financeRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = await financeUseCase.create(req.body);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
});

// Replace a finance record by ID
financeRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const ok = await financeUseCase.update(id, req.body);
    if (!ok) return res.status(404).json({ message: "Not Found" });
    res.status(200).json({ updated: true });
  } catch (err) {
    next(err);
  }
});

// Partially update a finance record by ID
financeRouter.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const ok = await financeUseCase.update(id, req.body);
    if (!ok) return res.status(404).json({ message: "Not Found" });
    res.status(200).json({ updated: true });
  } catch (err) {
    next(err);
  }
});

// Delete a finance record by ID
financeRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const ok = await financeUseCase.remove(id);
    if (!ok) return res.status(404).json({ message: "Not Found" });
    res.status(200).json({ deleted: true });
  } catch (err) {
    next(err);
  }
});
