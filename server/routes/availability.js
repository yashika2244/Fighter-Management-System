import { Router } from "express";
import Availability from "../models/Availability.js";
import User from "../models/User.js";

const r = Router();

r.get("/on-date", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.json({ summary: {}, onLeave: [], available: [] });

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);

    // 1️⃣ Sab active users
    const users = await User.find({ active: true });

    // 2️⃣ Us date ke Availability entries
    const availabilities = await Availability.find({
      date: { $gte: d, $lt: next }
    }).populate("user", "forceNo rank name");

    // 3️⃣ On Leave users
    const onLeave = availabilities
      .filter(a => a.status === "Leave")
      .map(a => ({
        forceNo: a.user.forceNo,
        rank: a.user.rank,
        name: a.user.name,
        type: a.note || "N/A"
      }));

    // 4️⃣ Available users (jo entry nahi hai ya status Available hai)
    const available = users
      .filter(u => !availabilities.some(a => a.user._id.equals(u._id) && a.status !== "Available"))
      .map(u => ({ forceNo: u.forceNo, rank: u.rank, name: u.name }));

    const summary = {
      total: users.length,
      onEL: availabilities.filter(a => a.note === "EL").length,
      onCL: availabilities.filter(a => a.note === "CL").length,
      onLeave: onLeave.length,
      available: available.length
    };

    res.json({ summary, onLeave, available });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default r;
