"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Leave_1 = require("../models/Leave");
const User_1 = require("../models/User");
const asyncHandler_1 = require("../middleware/asyncHandler");
const r = (0, express_1.Router)();
// List leaves (optionally filter by a specific date)
r.get("/", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { date } = req.query;
    let query = {};
    if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
        // Overlap: leave spans the requested day
        query = { from: { $lt: end }, to: { $gte: start } };
    }
    const leaves = await Leave_1.Leave.find(query)
        .sort({ from: -1 })
        .populate("user", "name forceNo rank");
    const formatted = leaves.map((l) => ({
        ...l.toObject(),
        from: l.from.toISOString(),
        to: l.to.toISOString(),
        // Normalize a single-day display field used by the dashboard
        date: l.from.toISOString().split("T")[0],
    }));
    res.json(formatted);
}));
// Create Leave (Direct Approved)
r.post("/", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    console.log("Leave creation request body:", req.body);
    const { from, to, type, reason, user } = req.body;
    if (!from || !to || !type || !user) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return res.status(400).json({ message: "Invalid date values" });
    }
    const noOfDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const foundUser = await User_1.User.findById(user);
    if (!foundUser)
        return res.status(404).json({ message: "User not found" });
    console.log("Found user:", {
        id: foundUser._id,
        name: foundUser.name,
        elTotal: foundUser.elTotal,
        elUsed: foundUser.elUsed,
        clTotal: foundUser.clTotal,
        clUsed: foundUser.clUsed
    });
    if (type === "EL") {
        if ((foundUser.elUsed || 0) + noOfDays > (foundUser.elTotal || 60)) {
            return res.status(400).json({ message: "EL limit exceeded" });
        }
        foundUser.elUsed = (foundUser.elUsed || 0) + noOfDays;
    }
    else if (type === "CL") {
        if ((foundUser.clUsed || 0) + noOfDays > (foundUser.clTotal || 15)) {
            return res.status(400).json({ message: "CL limit exceeded" });
        }
        foundUser.clUsed = (foundUser.clUsed || 0) + noOfDays;
    }
    await foundUser.save();
    const leave = await Leave_1.Leave.create({
        from: fromDate,
        to: toDate,
        type,
        reason,
        user,
        noOfDays,
        status: "Approved",
    });
    console.log("Leave created successfully:", leave._id);
    res.status(201).json({ leave, user: foundUser });
}));
// Get all leaves of a user
r.get("/:userId", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const leaves = await Leave_1.Leave.find({ user: req.params.userId }).sort({ from: -1 });
    const formatted = leaves.map((l) => ({
        ...l.toObject(),
        from: l.from.toISOString(),
        to: l.to.toISOString(),
    }));
    res.json(formatted);
}));
// Delete multiple leaves
r.post("/delete", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "No IDs provided" });
    }
    await Leave_1.Leave.deleteMany({ _id: { $in: ids } });
    res.json({ success: true });
}));
exports.default = r;
