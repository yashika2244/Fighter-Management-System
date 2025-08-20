import { Router, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { User } from "../models/User";
import { asyncHandler } from "../middleware/asyncHandler";
import { parseDate } from "../utils/parseDate";

const r = Router();

// Create user
r.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const payload = { ...req.body } as any;
    console.log("[USERS] Received create payload:", JSON.stringify(payload));
    // prevent invalid _id
    if (
      payload._id === null ||
      payload._id === undefined ||
      payload._id === "" ||
      payload._id === "null" ||
      payload._id === "undefined"
    ) {
      delete payload._id;
    }

    // Apply known alias mappings (client -> schema)
    const aliasMap: Record<string, string> = {
      bankAcct: "bankac",
      brName: "branchNo",
      ifscCode: "ifsc",
      splDuty: "specialDuty",
      edn: "education",
      jdPet1st: "jdpet1st",
      jdPet2nd: "jdpet2st",
      elDue: "elTotal",
      elAvailed: "elUsed",
      clDue: "clTotal",
      clAvailed: "clUsed",
    };
    for (const [from, to] of Object.entries(aliasMap)) {
      if (payload[from] !== undefined && payload[to] === undefined) {
        payload[to] = payload[from];
        delete payload[from];
      }
    }

    // Normalize date fields on create
    const dateFields = ["dob", "doe", "doaCoy", "doaUnit", "dop", "dod"] as const;
    for (const field of dateFields) {
      if (field in payload) {
        if (payload[field] === null) {
          // allow explicit null to clear
          payload[field] = null as any;
        } else {
          const parsed = parseDate(payload[field]);
          if (parsed instanceof Date) payload[field] = parsed as any;
          else delete (payload as any)[field];
        }
      }
    }
    console.log("[USERS] Sanitized create payload:", JSON.stringify(payload));
    const doc = await User.create(payload);
    res.status(201).json(doc);
  })
);

// Update user
r.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const update: any = { ...req.body };
    console.log("[USERS] Update raw body:", JSON.stringify(update));

    // strip accidental _id overrides
    if (update._id) delete update._id;

    // Apply known alias mappings (client -> schema)
    const aliasMap: Record<string, string> = {
      bankAcct: "bankac",
      brName: "branchNo",
      ifscCode: "ifsc",
      splDuty: "specialDuty",
      edn: "education",
      jdPet1st: "jdpet1st",
      jdPet2nd: "jdpet2st",
      elDue: "elTotal",
      elAvailed: "elUsed",
      clDue: "clTotal",
      clAvailed: "clUsed",
    };
    for (const [from, to] of Object.entries(aliasMap)) {
      if (update[from] !== undefined && update[to] === undefined) {
        update[to] = update[from];
        delete update[from];
      }
    }

    // Normalize date fields: drop invalids, coerce valid inputs
    const dateFields = ["dob", "doe", "doaCoy", "doaUnit", "dop", "dod"] as const;
    for (const field of dateFields) {
      if (field in update) {
        if (update[field] === null) {
          update[field] = null;
          continue;
        }
        const parsed = parseDate(update[field]);
        if (parsed instanceof Date) update[field] = parsed;
        else delete update[field];
      }
    }

    console.log("[USERS] Update sanitized body:", JSON.stringify(update));

    const user = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  })
);

// List/search users
r.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query as { q?: string };
    const filter = q
      ? {
          $or: [
            { name: new RegExp(q, "i") },
            { forceNo: new RegExp(q, "i") },
            { rank: new RegExp(q, "i") },
            { trade: new RegExp(q, "i") },
          ],
        }
      : {};
    const users = await User.find(filter as any).sort({ createdAt: -1 }).limit(200);
    res.json(users);
  })
);

// Get user by ID
r.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const doc = await User.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "User not found" });
    res.json(doc);
  })
);

// Delete user
r.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ ok: true });
  })
);

export default r;


