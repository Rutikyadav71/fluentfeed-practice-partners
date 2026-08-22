import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function currentUser(req: Request, _res: Response, next: NextFunction): void {
  const headerValue = req.header("x-user-id");
  req.userId = headerValue && headerValue.trim().length > 0 ? headerValue.trim() : undefined;
  next();
}
