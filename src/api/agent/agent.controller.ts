import { Router, Request, Response, NextFunction } from "express";

// Router for Boxes. Mount as: app.use("/boxes", boxRouter)
export const boxRouter = Router();

// List all boxes
boxRouter.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
});