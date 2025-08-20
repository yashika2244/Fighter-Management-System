
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

// routes/dutyAssign.js

// Get subcategories by dutyType
router.get("/subcategories/:dutyType", (req, res) => {
  const { dutyType } = req.params;

  const map = {
    "Camp Security": [
      "Morcha no 1", "Morcha no 2", "Morcha no 3", 
      "Morcha no 4", "Morcha no 5", "Morcha no 6",
      "Patrolling duty","Duty SO","Duty NCO","COY QAT Duty"
    ],
    "Camp Adm Duty": [
      "Mess Duty", "CQMH Store", "Kote Commander Duty", "Tradesman Duty"
    ],
    "Naka Duty": [],
    "Minority Patroling": [],
    "OC Protection Duty": []
  };

  res.json(map[dutyType] || []);
});

// Assign new duty
router.post("/", async (req, res) => {
  try {
    const { dutyDate, fromTime, toTime, user, dutyType, subCategory } = req.body;

    // Optional: extra validation for subCategory before saving
    if ((dutyType === "Camp Security" || dutyType === "Camp Adm Duty") && !subCategory) {
      return res.status(400).json({ error: "subCategory is required for this duty type." });
    }

    const newDuty = new DutyAssign({
      dutyDate,
      fromTime,
      toTime,
      user,
      dutyType,
      subCategory, // include subCategory
    });

    await newDuty.save();

    res.status(201).json(newDuty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
