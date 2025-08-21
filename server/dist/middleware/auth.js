"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireAuth() {
    return (req, res, next) => {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
        if (!token)
            return res.status(401).json({ message: "Unauthorized" });
        const secret = process.env.JWT_SECRET;
        if (!secret)
            return res.status(500).json({ message: "Server misconfigured" });
        try {
            const payload = jsonwebtoken_1.default.verify(token, secret);
            req.auth = payload;
            next();
        }
        catch {
            return res.status(401).json({ message: "Invalid token" });
        }
    };
}
function requireRole(allowed) {
    const normalizedAllowed = allowed.map((r) => r.toLowerCase());
    return (req, res, next) => {
        if (!req.auth)
            return res.status(401).json({ message: "Unauthorized" });
        const role = (req.auth.role || "").toLowerCase();
        // SuperAdmin can access everything
        if (role === "superadmin")
            return next();
        if (!normalizedAllowed.includes(role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}
