import { Router, Request, Response } from "express";
import { User } from "../models/User";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth, requireRole } from "../middleware/auth";

const r = Router();

// Get all users (for admin management)
r.get(
  "/users",
  requireAuth(),
  requireRole(["SuperAdmin"]),
  asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find()
      .select("name forceNo role active createdAt")
      .sort({ createdAt: -1 });
    res.json(users);
  })
);

// Create new admin user
r.post(
  "/users",
  requireAuth(),
  requireRole(["SuperAdmin"]),
  asyncHandler(async (req: Request, res: Response) => {
    const { forceNo, name, password, role } = req.body;
    
    if (!forceNo || !name || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ forceNo });
    if (existingUser) {
      return res.status(400).json({ message: "User with this force number already exists" });
    }

    const user = await User.create({
      slNo: forceNo,
      forceNo,
      name,
      password,
      role,
      active: true,
    });

    res.status(201).json({
      id: user._id,
      forceNo: user.forceNo,
      name: user.name,
      role: user.role,
      active: user.active,
    });
  })
);

// Update user role (promote/demote)
r.put(
  "/users/:id/role",
  requireAuth(),
  requireRole(["SuperAdmin"]),
  asyncHandler(async (req: Request, res: Response) => {
    const { role } = req.body;
    const { id } = req.params;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select("name forceNo role active");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  })
);

// Activate/Deactivate user
r.put(
  "/users/:id/status",
  requireAuth(),
  requireRole(["SuperAdmin"]),
  asyncHandler(async (req: Request, res: Response) => {
    const { active } = req.body;
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    ).select("name forceNo role active");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  })
);

// Reset user password
r.put(
  "/users/:id/password",
  requireAuth(),
  requireRole(["SuperAdmin"]),
  asyncHandler(async (req: Request, res: Response) => {
    const { password } = req.body;
    const { id } = req.params;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { password },
      { new: true }
    ).select("name forceNo role active");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Password updated successfully" });
  })
);

// Get role statistics
r.get(
  "/stats",
  requireAuth(),
  requireRole(["SuperAdmin"]),
  asyncHandler(async (req: Request, res: Response) => {
    const stats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
          active: {
            $sum: { $cond: ["$active", 1, 0] }
          }
        }
      }
    ]);

    res.json(stats);
  })
);

export default r;

// Update leave entitlements (EL/CL totals) for a user
r.put(
  "/users/:id/entitlements",
  requireAuth(),
  requireRole(["SuperAdmin"]),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { elTotal, clTotal, resetUsed } = req.body as {
      elTotal?: number;
      clTotal?: number;
      resetUsed?: boolean;
    };

    const update: Record<string, any> = {};
    if (typeof elTotal === "number") update.elTotal = elTotal;
    if (typeof clTotal === "number") update.clTotal = clTotal;
    if (resetUsed) {
      update.elUsed = 0;
      update.clUsed = 0;
    }

    const user = await User.findByIdAndUpdate(id, update, { new: true })
      .select("name forceNo elTotal elUsed clTotal clUsed role active");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  })
);
