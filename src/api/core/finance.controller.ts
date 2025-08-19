import { Router, Request, Response, NextFunction } from "express";
import { financeService } from "../../modules/finance/finance.service";

// Router for Finance. Mount as: app.use("/finance", financeRouter)
export const financeRouter = Router();

// List finance journal entries
financeRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, category, referenceId, minAmount, maxAmount, startDate, endDate, direction } = req.query as Record<string, string | undefined>;

    const params = {
      type: type as any,
      category,
      referenceId: referenceId !== undefined ? Number(referenceId) : undefined,
      minAmount: minAmount !== undefined ? Number(minAmount) : undefined,
      maxAmount: maxAmount !== undefined ? Number(maxAmount) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      direction: direction as any,
    };

    const data = await financeService.list(params);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

// Get a single finance record by ID
financeRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const item = await financeService.get(id);
    if (!item) return res.status(404).json({ message: "Not Found" });
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
});

// Create a new finance record
financeRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = await financeService.create(req.body);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
});

// Replace a finance record by ID
financeRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const ok = await financeService.update(id, req.body);
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
    const ok = await financeService.update(id, req.body);
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
    const ok = await financeService.remove(id);
    if (!ok) return res.status(404).json({ message: "Not Found" });
    res.status(200).json({ deleted: true });
  } catch (err) {
    next(err);
  }
});
