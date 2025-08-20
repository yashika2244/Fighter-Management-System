

import { Router } from "express";
import Leave from "../models/Leave.js";
import User from "../models/User.js";

const r = Router();

// Create Leave (Direct Approved)

r.post("/", async (req, res) => {
  try {
    const { from, to, type, reason, user } = req.body;

    if (!from || !to || !type || !user) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Calculate number of days (inclusive)
    const noOfDays =
      Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

    const foundUser = await User.findById(user);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Directly update user's leave usage
    if (type === "EL") {
      if (foundUser.elUsed + noOfDays > foundUser.elTotal) {
        return res.status(400).json({ message: "EL limit exceeded" });
      }
      foundUser.elUsed += noOfDays;
    } else if (type === "CL") {
      if (foundUser.clUsed + noOfDays > foundUser.clTotal) {
        return res.status(400).json({ message: "CL limit exceeded" });
      }
      foundUser.clUsed += noOfDays;
    }

    await foundUser.save();

    // ✅ Create leave with Approved status
    const leave = await Leave.create({
      from: fromDate,
      to: toDate,
      type,
      reason,
      user,
      noOfDays,
      status: "Approved",
    });

    res.json({ leave, user: foundUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Get all leaves of a user
r.get("/:userId", async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.params.userId }).sort({ from: -1 });

    const formatted = leaves.map((l) => ({
      ...l.toObject(),
      from: l.from.toISOString(),
      to: l.to.toISOString(),
    }));

    res.json(formatted);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
