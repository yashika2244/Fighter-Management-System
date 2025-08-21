import { Router, Request, Response } from "express";
import { InventoryItem, InventoryMovement } from "../models/Inventory";
import { User } from "../models/User";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth, requireRole } from "../middleware/auth";

const r = Router();

// Get all inventory items
r.get(
  "/items",
  requireAuth(),
  requireRole(["CQMH", "CompanyCommander", "Commander", "SuperAdmin"]),
  asyncHandler(async (req: Request, res: Response) => {
    const items = await InventoryItem.find().sort({ name: 1 });
    res.json(items);
  })
);

// Create new inventory item
r.post(
  "/items",
  requireAuth(),
  requireRole(["CQMH", "CompanyCommander", "Commander", "SuperAdmin"]),
  asyncHandler(async (req: Request, res: Response) => {
    const item = await InventoryItem.create(req.body);
    res.status(201).json(item);
  })
);

// Update inventory item
r.put(
  "/items/:id",
  requireAuth(),
  requireRole(["CQMH", "CompanyCommander", "Commander", "SuperAdmin"]),
  asyncHandler(async (req: Request, res: Response) => {
    const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  })
);

// Delete inventory item
r.delete(
  "/items/:id",
  requireAuth(),
  requireRole(["CQMH", "CompanyCommander", "Commander", "SuperAdmin"]),
  asyncHandler(async (req: Request, res: Response) => {
    const item = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  })
);

// Stock in
r.post(
  "/stock-in",
  requireAuth(),
  requireRole(["CQMH", "CompanyCommander", "Commander", "SuperAdmin"]),
  asyncHandler(async (req: Request, res: Response) => {
    const { itemId, quantity, reason, notes } = req.body;
    const item = await InventoryItem.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Update stock
    item.currentStock += quantity;
    await item.save();

    // Create movement record
    const movement = await InventoryMovement.create({
      item: itemId,
      type: "IN",
      quantity,
      reason,
      notes,
      user: (req as any).auth.userId,
    });

    res.status(201).json({ item, movement });
  })
);

// Stock out
r.post(
  "/stock-out",
  requireAuth(),
  requireRole(["CQMH", "CompanyCommander", "Commander", "SuperAdmin"]),
  asyncHandler(async (req: Request, res: Response) => {
    const { itemId, quantity, reason, notes } = req.body;
    const item = await InventoryItem.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.currentStock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Update stock
    item.currentStock -= quantity;
    await item.save();

    // Create movement record
    const movement = await InventoryMovement.create({
      item: itemId,
      type: "OUT",
      quantity,
      reason,
      notes,
      user: (req as any).auth.userId,
    });

    res.status(201).json({ item, movement });
  })
);

// Get stock history
r.get(
  "/history",
  requireAuth(),
  requireRole(["CQMH", "CompanyCommander", "Commander", "SuperAdmin"]),
  asyncHandler(async (req: Request, res: Response) => {
    const { itemId, from, to } = req.query as any;
    let query: any = {};
    
    if (itemId) query.item = itemId;
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const movements = await InventoryMovement.find(query)
      .populate("item", "name")
      .populate("user", "name forceNo")
      .sort({ date: -1 });

    res.json(movements);
  })
);

export default r;
