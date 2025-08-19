
import { Router } from "express";
import User from "../models/User.js";
const r = Router();

// Create user
r.post("/", async (req, res) => {
  console.log("Received body:", req.body);
  try {
    const doc = await User.create(req.body);
    res.json(doc);
  } catch (e) {
    console.error("Error creating user:", e.message);
    res.status(400).json({ message: e.message });
  }
});

// Update user
r.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// List/search users
r.get("/", async (req, res) => {
  const { q, from, to } = req.query;
  const filter = q
    ? {
        $or: [
          { name: new RegExp(q, "i") },
          { serviceNo: new RegExp(q, "i") },
          { rank: new RegExp(q, "i") },
          { trade: new RegExp(q, "i") },
        ],
      }
    : {};
  const users = await User.find(filter).sort({ createdAt: -1 }).limit(200);
  res.json(users);
});

// Get user by ID
r.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user
r.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default r;
