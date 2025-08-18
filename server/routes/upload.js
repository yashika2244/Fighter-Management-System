import { Router } from "express";
import multer from "multer";
import { parse } from "csv-parse/sync";
import fs from "fs";
import User from "../models/User.js";
const upload = multer({ dest: "uploads/" });
const r = Router();

r.post("/users-csv", upload.single("file"), async (req,res)=>{
  const csv = fs.readFileSync(req.file.path);
  const records = parse(csv, { columns:true, skip_empty_lines:true });
  const ops = records.map(row => ({
    updateOne:{
      filter:{ serviceNo: row.serviceNo },
      update:{ $set:{
        serviceNo: row.serviceNo,
        name: row.name,
        rank: row.rank,
        trade: row.trade,
        unit: row.unit,
        phone: row.phone,
        email: row.email,
      }},
      upsert:true
    }
  }));
  if(ops.length) await User.bulkWrite(ops);
  res.json({ imported: ops.length });
});

export default r;
