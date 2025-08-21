import express, { Request, Response } from "express";
import { DutyAssign } from "../models/DutyAssign";
import { DutyType } from "../models/DutyType";
import { asyncHandler } from "../middleware/asyncHandler";

const router = express.Router();

// Get all duties (with optional date filter)
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { date } = req.query as { date?: string };
    let query: Record<string, any> = {};
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query = { dutyDate: { $gte: start, $lt: end } };
    }
    const duties = await DutyAssign.find(query).populate("user", "forceNo rank name");
    res.json(duties);
  })
);

// Get subcategories by dutyType
// Duty type CRUD
router.get(
  "/types",
  asyncHandler(async (_req: Request, res: Response) => {
    const types = await DutyType.find({}).sort({ name: 1 });
    res.json(types);
  })
);

router.post(
  "/types",
  asyncHandler(async (req: Request, res: Response) => {
    const created = await DutyType.create(req.body);
    res.status(201).json(created);
  })
);

router.put(
  "/types/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const updated = await DutyType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  })
);

router.delete(
  "/types/:id",
  asyncHandler(async (req: Request, res: Response) => {
    await DutyType.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  })
);

// Subcategories by duty type (from DB)
router.get(
  "/subcategories/:dutyType",
  asyncHandler(async (req: Request, res: Response) => {
    const { dutyType } = req.params;
    const found = await DutyType.findOne({ name: dutyType });
    res.json(found?.subCategories || []);
  })
);

// Assign new duty
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { dutyDate, fromTime, toTime, user, dutyType, subCategory } = req.body as any;
    const type = await DutyType.findOne({ name: dutyType });
    if (type?.requiresSubCategory && !subCategory) {
      return res.status(400).json({ error: "subCategory is required for this duty type." });
    }
    const newDuty = new DutyAssign({ dutyDate, fromTime, toTime, user, dutyType, subCategory });
    await newDuty.save();
    res.status(201).json(newDuty);
  })
);

export default router;


