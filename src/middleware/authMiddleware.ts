import { NextFunction, Response, Request } from "express";

function ApiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    let message = "Unauthorized: Invalid API key";

    return res.status(401).json({ error: message });
  }

  return next();
}

export default ApiKeyMiddleware;