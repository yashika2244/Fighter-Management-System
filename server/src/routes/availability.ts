import { Router, Request, Response } from "express";
import { Availability } from "../models/Availability";
import { Leave } from "../models/Leave";
import { User } from "../models/User";
import { asyncHandler } from "../middleware/asyncHandler";

const r = Router();

r.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    // Return all availability records normalized for dashboard usage
    const records = await Availability.find({}).select("user date status note");
    const normalized = records.map((a) => ({
      // Normalize to YYYY-MM-DD for easy client-side filtering
      date: a.date.toISOString().split("T")[0],
      // Map "Available" → "Present" to align with dashboard wording
      status: a.status === "Available" ? ("Present" as const) : a.status,
      note: a.note,
      user: a.user,
    }));
    res.json(normalized);
  })
);

r.get(
  "/on-date",
  asyncHandler(async (req: Request, res: Response) => {
    const { date } = req.query as { date?: string };
    if (!date) return res.json({ summary: {}, onLeave: [], available: [] });

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const nextDay = new Date(d.getTime() + 24 * 60 * 60 * 1000);

    const users = await User.find({ active: true });
    const availabilities = await Availability.find({
      date: { $gte: d, $lt: nextDay },
    }).populate("user", "forceNo rank name");

    const leaves = await Leave.find({
      from: { $lt: nextDay },
      to: { $gte: d },
      status: "Approved",
    }).populate("user", "forceNo rank name");

    const onLeave = [
      ...availabilities
        .filter((a) => a.status?.toLowerCase() === "leave")
        .map((a: any) => ({
          forceNo: a.user?.forceNo,
          rank: a.user?.rank,
          name: a.user?.name,
          type: a.note || "Leave",
        })),
      ...leaves.map((l: any) => ({
        forceNo: l.user?.forceNo,
        rank: l.user?.rank,
        name: l.user?.name,
        type: l.type,
        from: l.from,
        to: l.to,
        reason: l.reason,
      })),
    ];

    const unavailableIds = new Set([
      ...availabilities
        .filter((a) => a.status?.toLowerCase() !== "available")
        .map((a: any) => a.user._id.toString()),
      ...leaves.map((l: any) => l.user._id.toString()),
    ]);

    const available = users
      .filter((u: any) => !unavailableIds.has((u._id as any).toString()))
      .map((u: any) => ({ id: (u._id as any).toString(), forceNo: u.forceNo, rank: u.rank, name: u.name }));

    const summary = {
      total: users.length,
      onEL: leaves
        .filter((l) => l.type === "EL")
        .reduce((sum, l: any) => sum + (l.noOfDays || 1), 0),
      onCL: leaves
        .filter((l) => l.type === "CL")
        .reduce((sum, l: any) => sum + (l.noOfDays || 1), 0),
      onLeave: onLeave.length,
      onDuty: availabilities.filter((a) => a.status?.toLowerCase() === "on duty").length,
      restricted: availabilities.filter((a) => a.status?.toLowerCase() === "restricted").length,
      available: available.length,
    } as any;

    res.json({ summary, onLeave, available });
  })
);

export default r;


