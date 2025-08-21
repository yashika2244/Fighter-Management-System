"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const User_1 = require("../models/User");
const asyncHandler_1 = require("../middleware/asyncHandler");
const parseDate_1 = require("../utils/parseDate");
const r = (0, express_1.Router)();
// Create user
r.post("/", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const payload = { ...req.body };
    console.log("[USERS] Received create payload:", JSON.stringify(payload));
    // prevent invalid _id
    if (payload._id === null ||
        payload._id === undefined ||
        payload._id === "" ||
        payload._id === "null" ||
        payload._id === "undefined") {
        delete payload._id;
    }
    // Apply known alias mappings (client -> schema)
    const aliasMap = {
        bankAcct: "bankac",
        brName: "branchNo",
        ifscCode: "ifsc",
        splDuty: "specialDuty",
        edn: "education",
        jdPet1st: "jdpet1st",
        jdPet2nd: "jdpet2st",
        elDue: "elTotal",
        elAvailed: "elUsed",
        clDue: "clTotal",
        clAvailed: "clUsed",
    };
    for (const [from, to] of Object.entries(aliasMap)) {
        if (payload[from] !== undefined && payload[to] === undefined) {
            payload[to] = payload[from];
            delete payload[from];
        }
    }
    // Normalize date fields on create
    const dateFields = ["dob", "doe", "doaCoy", "doaUnit", "dop", "dod"];
    for (const field of dateFields) {
        if (field in payload) {
            if (payload[field] === null) {
                // allow explicit null to clear
                payload[field] = null;
            }
            else {
                const parsed = (0, parseDate_1.parseDate)(payload[field]);
                if (parsed instanceof Date)
                    payload[field] = parsed;
                else
                    delete payload[field];
            }
        }
    }
    console.log("[USERS] Sanitized create payload:", JSON.stringify(payload));
    const doc = await User_1.User.create(payload);
    res.status(201).json(doc);
}));
// Update user
r.put("/:id", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        return res.status(400).json({ message: "Invalid user id" });
    }
    const update = { ...req.body };
    console.log("[USERS] Update raw body:", JSON.stringify(update));
    // strip accidental _id overrides
    if (update._id)
        delete update._id;
    // Apply known alias mappings (client -> schema)
    const aliasMap = {
        bankAcct: "bankac",
        brName: "branchNo",
        ifscCode: "ifsc",
        splDuty: "specialDuty",
        edn: "education",
        jdPet1st: "jdpet1st",
        jdPet2nd: "jdpet2st",
        elDue: "elTotal",
        elAvailed: "elUsed",
        clDue: "clTotal",
        clAvailed: "clUsed",
    };
    for (const [from, to] of Object.entries(aliasMap)) {
        if (update[from] !== undefined && update[to] === undefined) {
            update[to] = update[from];
            delete update[from];
        }
    }
    // Normalize date fields: drop invalids, coerce valid inputs
    const dateFields = ["dob", "doe", "doaCoy", "doaUnit", "dop", "dod"];
    for (const field of dateFields) {
        if (field in update) {
            if (update[field] === null) {
                update[field] = null;
                continue;
            }
            const parsed = (0, parseDate_1.parseDate)(update[field]);
            if (parsed instanceof Date)
                update[field] = parsed;
            else
                delete update[field];
        }
    }
    console.log("[USERS] Update sanitized body:", JSON.stringify(update));
    const user = await User_1.User.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
    });
    if (!user)
        return res.status(404).json({ message: "User not found" });
    res.json(user);
}));
// List/search users
r.get("/", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { q } = req.query;
    const filter = q
        ? {
            $or: [
                { name: new RegExp(q, "i") },
                { forceNo: new RegExp(q, "i") },
                { rank: new RegExp(q, "i") },
                { trade: new RegExp(q, "i") },
            ],
        }
        : {};
    const users = await User_1.User.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json(users);
}));
// Get user by ID
r.get("/:id", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const doc = await User_1.User.findById(req.params.id);
    if (!doc)
        return res.status(404).json({ message: "User not found" });
    res.json(doc);
}));
// Delete user
r.delete("/:id", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const deleted = await User_1.User.findByIdAndDelete(req.params.id);
    if (!deleted)
        return res.status(404).json({ message: "User not found" });
    res.json({ ok: true });
}));
exports.default = r;
