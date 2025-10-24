import { NextFunction, Response, Request } from "express";
import { verifyAuthToken } from "../modules/auth/utils";
import { authUseCase } from "../modules/auth/auth.usecase";

export function ApiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    let message = "Unauthorized: Invalid API key";

    return res.status(401).json({ error: message });
  }

  return next();
}

export async function JwtAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const payload = verifyAuthToken(token) as any;
  if (!payload) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }

  const id = payload.sub;
  const user = await authUseCase.getUserById(id);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized: User not found" });
  }
  
  req.user = user;
  next();
}

type User = {
  id: number;
  username: string;
  role: string;
}

export function RoleAccessMiddleware(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;

    if(user.role !== requiredRole) {
      return res.status(403).json({ error: "Insufficient role" });
    }
    next();
  }
}