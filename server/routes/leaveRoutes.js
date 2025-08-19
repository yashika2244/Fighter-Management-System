import { Router } from "express";
import Leave from "../models/Leave.js";
import User from "../models/User.js";

const r = Router();

// Create Leave
r.post("/", async (req, res) => {
  try {
    const { from, to, type, reason, user } = req.body;

    if (!from || !to || !type || !user) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Calculate number of days (inclusive)
    const noOfDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

    const leave = await Leave.create({
      from: fromDate,
      to: toDate,
      type,
      reason,
      user,
      noOfDays,
    });
    res.json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all leaves of a user
r.get("/:userId", async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.params.userId }).sort({
      from: -1,
    });
    res.json(leaves);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update leave status (approve/reject)
r.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    const user = await User.findById(leave.user);

    if (status === "Approved") {
      const from = new Date(leave.from);
      const to = new Date(leave.to);
      const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

      if (leave.type === "EL") {
        if (user.elUsed + days > user.elTotal) {
          return res.status(400).json({ message: "EL limit exceeded" });
        }
        user.elUsed += days;
      } else if (leave.type === "CL") {
        if (user.clUsed + days > user.clTotal) {
          return res.status(400).json({ message: "CL limit exceeded" });
        }
        user.clUsed += days;
      }

      await user.save();
    }

    leave.status = status;
    await leave.save();

    res.json({ leave, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete multiple leaves
r.post("/delete", async (req, res) => {
  try {
    const { ids } = req.body; // array of leave IDs
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    await Leave.deleteMany({ _id: { $in: ids } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default r;
