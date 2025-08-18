import express from "express";
import DutyAssign from "../models/DutyAssign.js";

const router = express.Router();

// Get all duties (with optional date filter)
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      query = { dutyDate: { $gte: start, $lt: end } };
    }

    // Populate only required fields of user
    const duties = await DutyAssign.find(query).populate(
      "user",
      "forceNo rank name"
    );

    res.json(duties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign new duty
router.post("/", async (req, res) => {
  try {
    const { dutyDate, fromTime, toTime, user, dutyType } = req.body;

    const newDuty = new DutyAssign({
      dutyDate,
      fromTime,
      toTime,
      user,
      dutyType,
    });

    await newDuty.save();

    res.status(201).json(newDuty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
