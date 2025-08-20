import express from "express";
import Inventory from "../models/Inventory.js";

const router = express.Router();

// Get all items (filter by days)
router.get("/", async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const since = new Date();
  since.setDate(since.getDate() - days);

  try {
    const items = await Inventory.find({ createdAt: { $gte: since } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new item
router.post("/", async (req, res) => {
  const { name, sku, unit, qty, minQty, location, notes} = req.body;
  try {
    const newItem = await Inventory.create({ name, sku, unit, qty, minQty, location,notes});
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Stock IN
router.put("/stock-in/:id", async (req, res) => {
  const { qty } = req.body;
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    item.qty += qty;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Stock OUT
router.put("/stock-out/:id", async (req, res) => {
  const { qty } = req.body;
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    item.qty -= qty;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
