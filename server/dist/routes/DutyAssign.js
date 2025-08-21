"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DutyAssign_1 = require("../models/DutyAssign");
const DutyType_1 = require("../models/DutyType");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = express_1.default.Router();
// Get all duties (with optional date filter)
router.get("/", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { date } = req.query;
    let query = {};
    if (date) {
        const start = new Date(date);
        const end = new Date(date);
        end.setDate(end.getDate() + 1);
        query = { dutyDate: { $gte: start, $lt: end } };
    }
    const duties = await DutyAssign_1.DutyAssign.find(query).populate("user", "forceNo rank name");
    res.json(duties);
}));
// Get subcategories by dutyType
// Duty type CRUD
router.get("/types", (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const types = await DutyType_1.DutyType.find({}).sort({ name: 1 });
    res.json(types);
}));
router.post("/types", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const created = await DutyType_1.DutyType.create(req.body);
    res.status(201).json(created);
}));
router.put("/types/:id", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const updated = await DutyType_1.DutyType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
}));
router.delete("/types/:id", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await DutyType_1.DutyType.findByIdAndDelete(req.params.id);
    res.json({ success: true });
}));
// Subcategories by duty type (from DB)
router.get("/subcategories/:dutyType", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { dutyType } = req.params;
    const found = await DutyType_1.DutyType.findOne({ name: dutyType });
    res.json(found?.subCategories || []);
}));
// Assign new duty
router.post("/", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { dutyDate, fromTime, toTime, user, dutyType, subCategory } = req.body;
    const type = await DutyType_1.DutyType.findOne({ name: dutyType });
    if (type?.requiresSubCategory && !subCategory) {
        return res.status(400).json({ error: "subCategory is required for this duty type." });
    }
    const newDuty = new DutyAssign_1.DutyAssign({ dutyDate, fromTime, toTime, user, dutyType, subCategory });
    await newDuty.save();
    res.status(201).json(newDuty);
}));
exports.default = router;
