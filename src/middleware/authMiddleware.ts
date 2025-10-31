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

export function RoleAccessMiddleware(requiredRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;

    if(requiredRoles.length === 0) {
      return next();
    }

    if(requiredRoles.includes('self')) {
      if (user.id === Number(req.params.id)) {
        return next();
      }
    }

    // Check if user has the required role
    const allowedRoles = requiredRoles.filter(role => role !== 'self');
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: "Insufficient role" });
    }
    
    return next();
  }
}