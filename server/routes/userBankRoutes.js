import { Router } from "express";
import UserBank from "../models/UserBank.js";
const r = Router();

r.post("/", async (req, res) => {
  try {
    const bank = await UserBank.create(req.body);
    res.json(bank);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

r.get("/:userId", async (req, res) => {
  const bank = await UserBank.findOne({ userId: req.params.userId });
  res.json(bank);
});

export default r;
