"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const asyncHandler_1 = require("../middleware/asyncHandler");
const auth_1 = require("../middleware/auth");
const r = (0, express_1.Router)();
// Get all users (for admin management)
r.get("/users", (0, auth_1.requireAuth)(), (0, auth_1.requireRole)(["SuperAdmin"]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const users = await User_1.User.find()
        .select("name forceNo role active createdAt")
        .sort({ createdAt: -1 });
    res.json(users);
}));
// Create new admin user
r.post("/users", (0, auth_1.requireAuth)(), (0, auth_1.requireRole)(["SuperAdmin"]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { forceNo, name, password, role } = req.body;
    if (!forceNo || !name || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user already exists
    const existingUser = await User_1.User.findOne({ forceNo });
    if (existingUser) {
        return res.status(400).json({ message: "User with this force number already exists" });
    }
    const user = await User_1.User.create({
        slNo: forceNo,
        forceNo,
        name,
        password,
        role,
        active: true,
    });
    res.status(201).json({
        id: user._id,
        forceNo: user.forceNo,
        name: user.name,
        role: user.role,
        active: user.active,
    });
}));
// Update user role (promote/demote)
r.put("/users/:id/role", (0, auth_1.requireAuth)(), (0, auth_1.requireRole)(["SuperAdmin"]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { role } = req.body;
    const { id } = req.params;
    if (!role) {
        return res.status(400).json({ message: "Role is required" });
    }
    const user = await User_1.User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true }).select("name forceNo role active");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
}));
// Activate/Deactivate user
r.put("/users/:id/status", (0, auth_1.requireAuth)(), (0, auth_1.requireRole)(["SuperAdmin"]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { active } = req.body;
    const { id } = req.params;
    const user = await User_1.User.findByIdAndUpdate(id, { active }, { new: true }).select("name forceNo role active");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
}));
// Reset user password
r.put("/users/:id/password", (0, auth_1.requireAuth)(), (0, auth_1.requireRole)(["SuperAdmin"]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { password } = req.body;
    const { id } = req.params;
    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }
    const user = await User_1.User.findByIdAndUpdate(id, { password }, { new: true }).select("name forceNo role active");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Password updated successfully" });
}));
// Get role statistics
r.get("/stats", (0, auth_1.requireAuth)(), (0, auth_1.requireRole)(["SuperAdmin"]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const stats = await User_1.User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 },
                active: {
                    $sum: { $cond: ["$active", 1, 0] }
                }
            }
        }
    ]);
    res.json(stats);
}));
exports.default = r;
// Update leave entitlements (EL/CL totals) for a user
r.put("/users/:id/entitlements", (0, auth_1.requireAuth)(), (0, auth_1.requireRole)(["SuperAdmin"]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { elTotal, clTotal, resetUsed } = req.body;
    const update = {};
    if (typeof elTotal === "number")
        update.elTotal = elTotal;
    if (typeof clTotal === "number")
        update.clTotal = clTotal;
    if (resetUsed) {
        update.elUsed = 0;
        update.clUsed = 0;
    }
    const user = await User_1.User.findByIdAndUpdate(id, update, { new: true })
        .select("name forceNo elTotal elUsed clTotal clUsed role active");
    if (!user)
        return res.status(404).json({ message: "User not found" });
    res.json(user);
}));
