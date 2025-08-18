import { Router } from "express";
import Availability from "../models/Availability.js";
const r = Router();

// upsert slot
r.post("/", async (req,res)=> {
  const { user, date, status, note } = req.body;
  const d = new Date(date); d.setHours(0,0,0,0);
  const doc = await Availability.findOneAndUpdate(
    { user, date:d }, { user, date:d, status, note }, { upsert:true, new:true, setDefaultsOnInsert:true }
  );
  res.json(doc);
});

// by date
r.get("/on-date", async (req,res)=>{
  const { date } = req.query;
  const d = new Date(date); d.setHours(0,0,0,0);
  const next = new Date(d); next.setDate(d.getDate()+1);
  const list = await Availability.find({ date: { $gte:d, $lt:next } }).populate("user");
  res.json(list);
});

export default r;
