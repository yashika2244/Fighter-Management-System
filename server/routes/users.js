import { Router } from "express";
import User from "../models/User.js";
const r = Router();

// create
r.post("/", async (req,res)=> {
    console.log("Received body:", req.body); 
  try { const doc = await User.create(req.body); res.json(doc); }
  catch(e){
    console.error("Error creating user:", e.message); // backend me exact reason log hoga
    res.status(400).json({ message: e.message }); // frontend me bhi dikhayega
  }
});

// list + search
r.get("/", async (req,res)=>{
  const { q, from, to } = req.query;
  const filter = q ? { $or:[
      { name: new RegExp(q,"i") },
      { serviceNo: new RegExp(q,"i") },
      { rank: new RegExp(q,"i") },
      { trade: new RegExp(q,"i") },
    ] } : {};
  const users = await User.find(filter).sort({ createdAt:-1 }).limit(200);
  res.json(users);
});

// get by id
r.get("/:id", async (req,res)=> res.json(await User.findById(req.params.id)));

// update
r.put("/:id", async (req,res)=> res.json(await User.findByIdAndUpdate(req.params.id, req.body, {new:true})));

// delete
r.delete("/:id", async (req,res)=> { await User.findByIdAndDelete(req.params.id); res.json({ok:true}); });

export default r;
