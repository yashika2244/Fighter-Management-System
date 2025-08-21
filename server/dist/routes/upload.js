"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const sync_1 = require("csv-parse/sync");
const exceljs_1 = __importDefault(require("exceljs"));
const User_1 = require("../models/User");
const asyncHandler_1 = require("../middleware/asyncHandler");
const parseDate_1 = require("../utils/parseDate");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: "uploads/" });
router.post("/import", upload.single("file"), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });
    let records = [];
    if (req.file.originalname.endsWith(".csv")) {
        const csvData = fs_1.default.readFileSync(req.file.path);
        records = (0, sync_1.parse)(csvData, { columns: true, skip_empty_lines: true });
    }
    else if (req.file.originalname.endsWith(".xlsx")) {
        const workbook = new exceljs_1.default.Workbook();
        await workbook.xlsx.readFile(req.file.path);
        const sheet = workbook.worksheets[0];
        if (!sheet)
            return res.status(400).json({ message: "No worksheet found" });
        const headerRow = sheet.getRow(1);
        const headers = headerRow.values;
        for (let r = 2; r <= sheet.rowCount; r++) {
            const row = sheet.getRow(r);
            if (!row || row.cellCount === 0)
                continue;
            const obj = {};
            for (let c = 1; c <= headerRow.cellCount; c++) {
                const key = String(headers[c] || "").trim();
                if (!key)
                    continue;
                const cell = row.getCell(c);
                let val = cell.value;
                if (val && typeof val === "object" && val.text) {
                    val = val.text;
                }
                obj[key] = val;
            }
            if (Object.keys(obj).length)
                records.push(obj);
        }
    }
    else {
        return res.status(400).json({ message: "Unsupported file format (use CSV or XLSX)" });
    }
    if (!records.length)
        return res.status(400).json({ message: "File is empty" });
    let skipped = 0;
    const ops = [];
    records.forEach((row, i) => {
        const forceNo = row["P/CRN"] || row["FORCE NO"] || row["ForceNo"];
        const name = row["NAME"] || row["Name"];
        if (!forceNo || !name) {
            skipped++;
            return;
        }
        ops.push({
            updateOne: {
                filter: { forceNo },
                update: {
                    $set: {
                        slNo: row["SL NO"] || "",
                        forceNo,
                        rank: row["RANK"] || "",
                        name,
                        mobileNo: row["MOBILE NO"] || "",
                        dob: (0, parseDate_1.parseDate)(row["DOB"]),
                        doe: (0, parseDate_1.parseDate)(row["DOE"]),
                        doaCoy: (0, parseDate_1.parseDate)(row["DOA COY"]),
                        doaUnit: (0, parseDate_1.parseDate)(row["DOA UNIT"]),
                        dop: (0, parseDate_1.parseDate)(row["DOP"]),
                        dod: (0, parseDate_1.parseDate)(row["DOD"]),
                        religion: row["RELIGION"] || "",
                        caste: row["CAST"] || "",
                        bg: row["BG"] || "",
                        state: row["STATE"] || "",
                        course: row["COURSE"] || "",
                        homeAddress: row["HOME ADDRESS"] || "",
                        dependent: row["DEPENDENT"] || "",
                        nok: row["NOK"] || "",
                        icardNo: row["ICARDNO"] || "",
                    },
                },
                upsert: true,
            },
        });
    });
    if (ops.length)
        await User_1.User.bulkWrite(ops, { ordered: false });
    fs_1.default.unlinkSync(req.file.path);
    res.json({ message: "Imported Successfully ✅", imported: ops.length, skipped });
}));
exports.default = router;
