import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import { parse } from "csv-parse/sync";
import ExcelJS from "exceljs";
import { User } from "../models/User";
import { asyncHandler } from "../middleware/asyncHandler";
import { parseDate } from "../utils/parseDate";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/import",
  upload.single("file"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    let records: any[] = [];
    if (req.file.originalname.endsWith(".csv")) {
      const csvData = fs.readFileSync(req.file.path);
      records = parse(csvData, { columns: true, skip_empty_lines: true });
    } else if (req.file.originalname.endsWith(".xlsx")) {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(req.file.path);
      const sheet = workbook.worksheets[0];
      if (!sheet) return res.status(400).json({ message: "No worksheet found" });
      const headerRow = sheet.getRow(1);
      const headers = headerRow.values as (string | null | undefined)[];
      for (let r = 2; r <= sheet.rowCount; r++) {
        const row = sheet.getRow(r);
        if (!row || row.cellCount === 0) continue;
        const obj: Record<string, any> = {};
        for (let c = 1; c <= headerRow.cellCount; c++) {
          const key = String(headers[c] || "").trim();
          if (!key) continue;
          const cell = row.getCell(c);
          let val: any = cell.value;
          if (val && typeof val === "object" && (val as any).text) {
            val = (val as any).text;
          }
          obj[key] = val;
        }
        if (Object.keys(obj).length) records.push(obj);
      }
    } else {
      return res.status(400).json({ message: "Unsupported file format (use CSV or XLSX)" });
    }

    if (!records.length) return res.status(400).json({ message: "File is empty" });

    let skipped = 0;
    const ops: any[] = [];
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
              dob: parseDate(row["DOB"]),
              doe: parseDate(row["DOE"]),
              doaCoy: parseDate(row["DOA COY"]),
              doaUnit: parseDate(row["DOA UNIT"]),
              dop: parseDate(row["DOP"]),
              dod: parseDate(row["DOD"]),
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

    if (ops.length) await User.bulkWrite(ops, { ordered: false });
    fs.unlinkSync(req.file.path);

    res.json({ message: "Imported Successfully ✅", imported: ops.length, skipped });
  })
);

export default router;


