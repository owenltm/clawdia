import { Router, Request, Response, NextFunction } from "express";
import { ListAuthParams, UpdatePasswordParams } from "@/src/modules/auth/types";
import { authUseCase } from "@/src/modules/auth/auth.usecase";
import passport from "passport";
import { ApiKeyMiddleware, JwtAuthMiddleware, RefreshTokenMiddleware, RequestUser, RoleAccessMiddleware } from "@/src/middleware/authMiddleware";
import { Update } from "drizzle-orm";
import { User } from "@/src/modules/auth/entities/user.entity";

export const authRouter = Router();

authRouter.post(
  "/initialize-admin",
  ApiKeyMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authUseCase.initializeAdminUserIfNeeded();
    res.status(200).json({ message: "Admin user initialized" });
  } catch (err) {
    next(err);
  }
});

// Login endpoint
authRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const result = await authUseCase.login(username, password);

    if (!result) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Refresh token endpoint
authRouter.post("/refresh", RefreshTokenMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as RequestUser;
    const result = await authUseCase.refreshToken(user.id, user.tokenId);
    res.status(200).json(result);
  } catch (err) {
    next(err);   
  }
});

// * Apply JWT authentication middleware to all routes below
authRouter.use(JwtAuthMiddleware);

authRouter.post("/logout",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const user = _req.user as RequestUser;

      const result = await authUseCase.logout(user.id, user.tokenId);

      res.status(200).json({ success: result });
    } catch (err) {
      next(err);
    }
  }
)

// List all auth users
authRouter.get("/",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const params = _req.query as ListAuthParams;
      const data = await authUseCase.listUser(params);

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
);

// Get current auth user
authRouter.get("/me",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User;
      if (!user) return res.status(404).json({ message: "Not Found" });

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
);

// Update current user except password
authRouter.patch("/me",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User;
      if (!user) return res.status(404).json({ message: "Not Found" });

      const result = await authUseCase.updateUser(user.id, req.body);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

// Update current user's password
authRouter.patch("/me/password",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User;
      if (!user) return res.status(404).json({ message: "Not Found" });

      const { currentPassword, newPassword } = req.body as UpdatePasswordParams;

      if(!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Both currentPassword and newPassword are required" });
      }

      const result = await authUseCase.updateUserPassword(user.id, currentPassword, newPassword);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

// Register a new user
authRouter.post("/user",
  RoleAccessMiddleware(['admin']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = await authUseCase.createUser(req.body);
      res.status(201).json({ id });
    } catch (err) {
      next(err);
    }
  }
);

// Partially update a user by ID
authRouter.patch(
  "/user/:id",
  RoleAccessMiddleware(['admin']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const ok = await authUseCase.updateUser(id, req.body);
      if (!ok) return res.status(404).json({ message: "Not Found" });
      res.status(200).json({ updated: true });
    } catch (err) {
      next(err);
    }
  }
);

// Delete a user by ID
authRouter.delete(
  "/user/:id",
  RoleAccessMiddleware(['admin']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const ok = await authUseCase.removeUser(id);
      if (!ok) return res.status(404).json({ message: "Not Found" });
      res.status(200).json({ deleted: true });
    } catch (err) {
      next(err);
    }
  }
);