import { Router } from "express";
import UserDates from "../models/UserDates.js";
const r = Router();

r.post("/", async (req, res) => {
  try {
    const doc = await UserDates.create(req.body);
    res.json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

r.get("/:userId", async (req, res) => {
  const dates = await UserDates.findOne({ userId: req.params.userId });
  res.json(dates);
});

r.put("/:id", async (req, res) => {
  res.json(await UserDates.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

export default r;
