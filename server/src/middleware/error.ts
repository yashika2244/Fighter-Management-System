import { Request, Response, NextFunction } from "express";

export function notFound(req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({ message: "Not Found" });
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("[ERROR]", err?.stack || err);
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const isValidation = err?.name === "ValidationError";
  const isCast = err?.name === "CastError";
  res.status(isValidation ? 400 : isCast ? 400 : status).json({
    message: err?.message || "Server Error",
    details: isValidation ? err?.errors : undefined,
  });
}


