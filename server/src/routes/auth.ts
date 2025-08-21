import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { asyncHandler } from "../middleware/asyncHandler";

const r = Router();

// Login by forceNo + password, denies role Other
r.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const { forceNo, password } = req.body as { forceNo: string; password: string };
    if (!forceNo || !password) return res.status(400).json({ message: "Provide forceNo and password" });
    const user = await User.findOne({ forceNo }).select("name forceNo role password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (user.password !== password) return res.status(401).json({ message: "Invalid credentials" });
    if ((user.role || "").toLowerCase() === "other" || (user.role || "").toLowerCase() === "others") {
      return res.status(403).json({ message: "Access denied for role: Others" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: "Server misconfigured" });
    const token = jwt.sign({ userId: (user as any)._id.toString(), role: user.role }, secret, { expiresIn: "12h" });
    res.json({ token, user: { id: (user as any)._id, name: user.name, forceNo: user.forceNo, role: user.role } });
  })
);

export default r;


