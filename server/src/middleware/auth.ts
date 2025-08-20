import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUserPayload {
  userId: string;
  role: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthUserPayload;
    }
  }
}

export function requireAuth() {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: "Server misconfigured" });
    try {
      const payload = jwt.verify(token, secret) as AuthUserPayload;
      req.auth = payload;
      next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

export function requireRole(allowed: string[]) {
  const normalizedAllowed = allowed.map((r) => r.toLowerCase());
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) return res.status(401).json({ message: "Unauthorized" });
    const role = (req.auth.role || "").toLowerCase();
    // SuperAdmin can access everything
    if (role === "superadmin") return next();
    if (!normalizedAllowed.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}


