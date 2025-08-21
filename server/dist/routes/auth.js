"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const asyncHandler_1 = require("../middleware/asyncHandler");
const r = (0, express_1.Router)();
// Login by forceNo + password, denies role Other
r.post("/login", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { forceNo, password } = req.body;
    if (!forceNo || !password)
        return res.status(400).json({ message: "Provide forceNo and password" });
    const user = await User_1.User.findOne({ forceNo }).select("name forceNo role password");
    if (!user)
        return res.status(401).json({ message: "Invalid credentials" });
    if (user.password !== password)
        return res.status(401).json({ message: "Invalid credentials" });
    if ((user.role || "").toLowerCase() === "other" || (user.role || "").toLowerCase() === "others") {
        return res.status(403).json({ message: "Access denied for role: Others" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret)
        return res.status(500).json({ message: "Server misconfigured" });
    const token = jsonwebtoken_1.default.sign({ userId: user._id.toString(), role: user.role }, secret, { expiresIn: "12h" });
    res.json({ token, user: { id: user._id, name: user.name, forceNo: user.forceNo, role: user.role } });
}));
exports.default = r;
