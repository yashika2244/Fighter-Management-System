"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Availability_1 = require("../models/Availability");
const Leave_1 = require("../models/Leave");
const User_1 = require("../models/User");
const asyncHandler_1 = require("../middleware/asyncHandler");
const r = (0, express_1.Router)();
r.get("/", (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    // Return all availability records normalized for dashboard usage
    const records = await Availability_1.Availability.find({}).select("user date status note");
    const normalized = records.map((a) => ({
        // Normalize to YYYY-MM-DD for easy client-side filtering
        date: a.date.toISOString().split("T")[0],
        // Map "Available" → "Present" to align with dashboard wording
        status: a.status === "Available" ? "Present" : a.status,
        note: a.note,
        user: a.user,
    }));
    res.json(normalized);
}));
r.get("/on-date", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { date } = req.query;
    if (!date)
        return res.json({ summary: {}, onLeave: [], available: [] });
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const nextDay = new Date(d.getTime() + 24 * 60 * 60 * 1000);
    const users = await User_1.User.find({ active: true });
    const availabilities = await Availability_1.Availability.find({
        date: { $gte: d, $lt: nextDay },
    }).populate("user", "forceNo rank name");
    const leaves = await Leave_1.Leave.find({
        from: { $lt: nextDay },
        to: { $gte: d },
        status: "Approved",
    }).populate("user", "forceNo rank name");
    const onLeave = [
        ...availabilities
            .filter((a) => a.status?.toLowerCase() === "leave")
            .map((a) => ({
            forceNo: a.user?.forceNo,
            rank: a.user?.rank,
            name: a.user?.name,
            type: a.note || "Leave",
        })),
        ...leaves.map((l) => ({
            forceNo: l.user?.forceNo,
            rank: l.user?.rank,
            name: l.user?.name,
            type: l.type,
            from: l.from,
            to: l.to,
            reason: l.reason,
        })),
    ];
    const unavailableIds = new Set([
        ...availabilities
            .filter((a) => a.status?.toLowerCase() !== "available")
            .map((a) => a.user._id.toString()),
        ...leaves.map((l) => l.user._id.toString()),
    ]);
    const available = users
        .filter((u) => !unavailableIds.has(u._id.toString()))
        .map((u) => ({ id: u._id.toString(), forceNo: u.forceNo, rank: u.rank, name: u.name }));
    const summary = {
        total: users.length,
        onEL: leaves
            .filter((l) => l.type === "EL")
            .reduce((sum, l) => sum + (l.noOfDays || 1), 0),
        onCL: leaves
            .filter((l) => l.type === "CL")
            .reduce((sum, l) => sum + (l.noOfDays || 1), 0),
        onLeave: onLeave.length,
        onDuty: availabilities.filter((a) => a.status?.toLowerCase() === "on duty").length,
        restricted: availabilities.filter((a) => a.status?.toLowerCase() === "restricted").length,
        available: available.length,
    };
    res.json({ summary, onLeave, available });
}));
exports.default = r;
