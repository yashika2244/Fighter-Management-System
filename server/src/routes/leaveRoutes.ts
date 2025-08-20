import { Router, Request, Response } from "express";
import { Leave } from "../models/Leave";
import { User } from "../models/User";
import { asyncHandler } from "../middleware/asyncHandler";

const r = Router();

// List leaves (optionally filter by a specific date)
r.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { date } = req.query as { date?: string };
    let query: Record<string, any> = {};
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      // Overlap: leave spans the requested day
      query = { from: { $lt: end }, to: { $gte: start } };
    }
    const leaves = await Leave.find(query)
      .sort({ from: -1 })
      .populate("user", "name forceNo rank");
    const formatted = leaves.map((l: any) => ({
      ...l.toObject(),
      from: l.from.toISOString(),
      to: l.to.toISOString(),
      // Normalize a single-day display field used by the dashboard
      date: l.from.toISOString().split("T")[0],
    }));
    res.json(formatted);
  })
);

// Create Leave (Direct Approved)
r.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    console.log("Leave creation request body:", req.body);
    
    const { from, to, type, reason, user } = req.body as {
      from: string | Date;
      to: string | Date;
      type: "EL" | "CL";
      reason?: string;
      user: string;
    };

    if (!from || !to || !type || !user) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ message: "Invalid date values" });
    }

    const noOfDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const foundUser = await User.findById(user);
    if (!foundUser) return res.status(404).json({ message: "User not found" });

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
    } else if (type === "CL") {
      if ((foundUser.clUsed || 0) + noOfDays > (foundUser.clTotal || 15)) {
        return res.status(400).json({ message: "CL limit exceeded" });
      }
      foundUser.clUsed = (foundUser.clUsed || 0) + noOfDays;
    }

    await foundUser.save();

    const leave = await Leave.create({
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
  })
);

// Get all leaves of a user
r.get(
  "/:userId",
  asyncHandler(async (req: Request, res: Response) => {
    const leaves = await Leave.find({ user: req.params.userId }).sort({ from: -1 });
    const formatted = leaves.map((l) => ({
      ...l.toObject(),
      from: l.from.toISOString(),
      to: l.to.toISOString(),
    }));
    res.json(formatted);
  })
);

// Delete multiple leaves
r.post(
  "/delete",
  asyncHandler(async (req: Request, res: Response) => {
    const { ids } = req.body as { ids: string[] };
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }
    await Leave.deleteMany({ _id: { $in: ids } });
    res.json({ success: true });
  })
);

export default r;


