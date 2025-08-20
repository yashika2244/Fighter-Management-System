"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = notFound;
exports.errorHandler = errorHandler;
function notFound(req, res, _next) {
    res.status(404).json({ message: "Not Found" });
}
function errorHandler(err, _req, res, _next) {
    console.error("[ERROR]", err?.stack || err);
    const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    const isValidation = err?.name === "ValidationError";
    const isCast = err?.name === "CastError";
    res.status(isValidation ? 400 : isCast ? 400 : status).json({
        message: err?.message || "Server Error",
        details: isValidation ? err?.errors : undefined,
    });
}
