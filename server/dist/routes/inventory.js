"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Inventory_1 = require("../models/Inventory");
const asyncHandler_1 = require("../middleware/asyncHandler");
const auth_1 = require("../middleware/auth");
const r = (0, express_1.Router)();
// Get all inventory items
r.get("/items", (0, auth_1.requireAuth)(), (0, auth_1.requireRole)(["CQMH", "CompanyCommander", "Commander", "SuperAdmin"]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const items = await Inventory_1.InventoryItem.find().sort({ name: 1 });
    res.json(items);
}));
// Create new inventory item
r.post("/items", (0, auth_1.requireAuth)(), (0, auth_1.requireRole)(["CQMH", "CompanyCommander", "Commander", "SuperAdmin"]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const item = await Inventory_1.InventoryItem.create(req.body);
    res.status(201).json(item);
}));
// Update inventory item
r.put("/items/:id", (0, auth_1.requireAuth)(), (0, auth_1.requireRole)(["CQMH", "CompanyCommander", "Commander", "SuperAdmin"]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const item = await Inventory_1.InventoryItem.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!item)
        return res.status(404).json({ message: "Item not found" });
    res.json(item);
}));
// Delete inventory item
r.delete("/items/:id", (0, auth_1.requireAuth)(), (0, auth_1.requireRole)(["CQMH", "CompanyCommander", "Commander", "SuperAdmin"]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const item = await Inventory_1.InventoryItem.findByIdAndDelete(req.params.id);
    if (!item)
        return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
}));
// Stock in
r.post("/stock-in", (0, auth_1.requireAuth)(), (0, auth_1.requireRole)(["CQMH", "CompanyCommander", "Commander", "SuperAdmin"]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { itemId, quantity, reason, notes } = req.body;
    const item = await Inventory_1.InventoryItem.findById(itemId);
    if (!item)
        return res.status(404).json({ message: "Item not found" });
    // Update stock
    item.currentStock += quantity;
    await item.save();
    // Create movement record
    const movement = await Inventory_1.InventoryMovement.create({
        item: itemId,
        type: "IN",
        quantity,
        reason,
        notes,
        user: req.auth.userId,
    });
    res.status(201).json({ item, movement });
}));
// Stock out
r.post("/stock-out", (0, auth_1.requireAuth)(), (0, auth_1.requireRole)(["CQMH", "CompanyCommander", "Commander", "SuperAdmin"]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { itemId, quantity, reason, notes } = req.body;
    const item = await Inventory_1.InventoryItem.findById(itemId);
    if (!item)
        return res.status(404).json({ message: "Item not found" });
    if (item.currentStock < quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
    }
    // Update stock
    item.currentStock -= quantity;
    await item.save();
    // Create movement record
    const movement = await Inventory_1.InventoryMovement.create({
        item: itemId,
        type: "OUT",
        quantity,
        reason,
        notes,
        user: req.auth.userId,
    });
    res.status(201).json({ item, movement });
}));
// Get stock history
r.get("/history", (0, auth_1.requireAuth)(), (0, auth_1.requireRole)(["CQMH", "CompanyCommander", "Commander", "SuperAdmin"]), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { itemId, from, to } = req.query;
    let query = {};
    if (itemId)
        query.item = itemId;
    if (from || to) {
        query.date = {};
        if (from)
            query.date.$gte = new Date(from);
        if (to)
            query.date.$lte = new Date(to);
    }
    const movements = await Inventory_1.InventoryMovement.find(query)
        .populate("item", "name")
        .populate("user", "name forceNo")
        .sort({ date: -1 });
    res.json(movements);
}));
exports.default = r;
