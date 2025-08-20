// import { Router } from "express";
// import UserLeave from "../models/UserLeave.js";
// const r = Router();

// r.post("/", async (req, res) => {
//   try {
//     const leave = await UserLeave.create(req.body);
//     res.json(leave);
//   } catch (e) {
//     res.status(400).json({ message: e.message });
//   }
// });

// r.get("/:userId", async (req, res) => {
//   const leaves = await UserLeave.find({ userId: req.params.userId });
//   res.json(leaves);
// });

// export default r;
