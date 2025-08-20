
import { Router } from "express";
import Availability from "../models/Availability.js";
import Leave from "../models/Leave.js";
import User from "../models/User.js";

const r = Router();



r.get("/on-date", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.json({ summary: {}, onLeave: [], available: [] });
    }

    // 📅 Normalize date (00:00:00)
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    // Next day (exclusive upper bound for availability search)
    const nextDay = new Date(d.getTime() + 24 * 60 * 60 * 1000);

    // 1️⃣ Active users
    const users = await User.find({ active: true });

    // 2️⃣ Availability entries for this date
    const availabilities = await Availability.find({
      date: { $gte: d, $lt: nextDay },
    }).populate("user", "forceNo rank name");

    // 3️⃣ Leave entries for this date (Approved only)
    const leaves = await Leave.find({
      from: { $lt: nextDay },  // leave start < next day
      to: { $gte: d },         // leave end >= current day
      status: "Approved"
    }).populate("user", "forceNo rank name");

    // 4️⃣ On Leave users (from availability + leave collection)
    const onLeave = [
      ...availabilities
        .filter(a => a.status?.toLowerCase() === "leave")
        .map(a => ({
          forceNo: a.user?.forceNo,
          rank: a.user?.rank,
          name: a.user?.name,
          type: a.note || "Leave",
        })),
      ...leaves.map(l => ({
        forceNo: l.user?.forceNo,
        rank: l.user?.rank,
        name: l.user?.name,
        type: l.type,
        from: l.from,
        to: l.to,
        reason: l.reason
      }))
    ];

    // 5️⃣ Available users (na leave hai na restricted/on duty)
    const unavailableIds = new Set([
      ...availabilities
        .filter(a => a.status?.toLowerCase() !== "available")
        .map(a => a.user._id.toString()),
      ...leaves.map(l => l.user._id.toString())
    ]);

    const available = users
      .filter(u => !unavailableIds.has(u._id.toString()))
      .map(u => ({
        forceNo: u.forceNo,
        rank: u.rank,
        name: u.name
      }));

    // 6️⃣ Summary counts
    const summary = {
      total: users.length,
      onEL: leaves
        .filter(l => l.type === "EL")
        .reduce((sum, l) => sum + (l.noOfDays || 1), 0),
      onCL: leaves
        .filter(l => l.type === "CL")
        .reduce((sum, l) => sum + (l.noOfDays || 1), 0),
      onLeave: onLeave.length,
      onDuty: availabilities.filter(a => a.status?.toLowerCase() === "on duty").length,
      restricted: availabilities.filter(a => a.status?.toLowerCase() === "restricted").length,
      available: available.length,
    };

    res.json({ summary, onLeave, available });
  } catch (err) {
    console.error("❌ Error in /on-date:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default r;
