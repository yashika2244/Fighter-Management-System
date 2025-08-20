// // import { Router } from "express";
// // import Availability from "../models/Availability.js";
// // import User from "../models/User.js";

// // const r = Router();

// // r.get("/on-date", async (req, res) => {
// //   try {
// //     const { date } = req.query;
// //     if (!date) return res.json({ summary: {}, onLeave: [], available: [] });

// //     const d = new Date(date);
// //     d.setHours(0, 0, 0, 0);
// //     const next = new Date(d);
// //     next.setDate(d.getDate() + 1);

// //     // 1️⃣ Sab active users
// //     const users = await User.find({ active: true });

// //     // 2️⃣ Us date ke Availability entries
// //     const availabilities = await Availability.find({
// //       date: { $gte: d, $lt: next }
// //     }).populate("user", "forceNo rank name");

// //     // 3️⃣ On Leave users
// // const onLeave = availabilities
// //   .filter(a => a.status?.toLowerCase() === "leave")
// //   .map(a => ({
// //     forceNo: a.user?.forceNo,
// //     rank: a.user?.rank,
// //     name: a.user?.name,
// //     type: a.note || "N/A"
// //   }));


// //     // 4️⃣ Available users (jo entry nahi hai ya status Available hai)
// //     const available = users
// //       .filter(u => !availabilities.some(a => a.user._id.equals(u._id) && a.status !== "Available"))
// //       .map(u => ({ forceNo: u.forceNo, rank: u.rank, name: u.name }));

// //     // const summary = {
// //     //   total: users.length,
// //     //   onEL: availabilities.filter(a => a.note === "EL").length,
// //     //   onCL: availabilities.filter(a => a.note === "CL").length,
// //     //   onLeave: onLeave.length,
// //     //   available: available.length
// //     // };
// //     const summary = {
// //   total: users.length,
// //   onEL: availabilities.filter(a => a.status?.toLowerCase() === "leave" && a.note === "EL").length,
// //   onCL: availabilities.filter(a => a.status?.toLowerCase() === "leave" && a.note === "CL").length,
// //   onLeave: onLeave.length,
// //   onDuty: availabilities.filter(a => a.status?.toLowerCase() === "on duty").length,
// //   restricted: availabilities.filter(a => a.status?.toLowerCase() === "restricted").length,
// //   available: available.length,
// // };


// //     res.json({ summary, onLeave, available });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "Server error" });
// //   }
// // });

// // export default r;


// import { Router } from "express";
// import Availability from "../models/Availability.js";
// import User from "../models/User.js";

// const r = Router();

// r.get("/on-date", async (req, res) => {
//   try {
//     const { date } = req.query;
//     if (!date) {
//       return res.json({ summary: {}, onLeave: [], available: [] });
//     }

//     // 📅 Date normalize
//     const d = new Date(date);
//     d.setHours(0, 0, 0, 0);
//     const next = new Date(d);
//     next.setDate(d.getDate() + 1);

//     // 1️⃣ Active users
//     const users = await User.find({ active: true });

//     // 2️⃣ Availability entries for this date
//     const availabilities = await Availability.find({
//       date: { $gte: d, $lt: next },
//     }).populate("user", "forceNo rank name");

//     // 3️⃣ On Leave users
//     const onLeave = availabilities
//       .filter((a) => a.status?.toLowerCase() === "leave")
//       .map((a) => ({
//         forceNo: a.user?.forceNo,
//         rank: a.user?.rank,
//         name: a.user?.name,
//         type: a.note || "N/A",
//       }));

//     // 4️⃣ Available users (jo entry nahi hai ya status Available hai)
//     const available = users
//       .filter(
//         (u) =>
//           !availabilities.some(
//             (a) => a.user._id.equals(u._id) && a.status !== "Available"
//           )
//       )
//       .map((u) => ({
//         forceNo: u.forceNo,
//         rank: u.rank,
//         name: u.name,
//       }));

//     // 5️⃣ Summary counts
//     const summary = {
//       total: users.length,
//       onEL: availabilities.filter(
//         (a) => a.status?.toLowerCase() === "leave" && a.note === "EL"
//       ).length,
//       onCL: availabilities.filter(
//         (a) => a.status?.toLowerCase() === "leave" && a.note === "CL"
//       ).length,
//       onLeave: onLeave.length,
//       onDuty: availabilities.filter(
//         (a) => a.status?.toLowerCase() === "on duty"
//       ).length,
//       restricted: availabilities.filter(
//         (a) => a.status?.toLowerCase() === "restricted"
//       ).length,
//       available: available.length,
//     };

//     res.json({ summary, onLeave, available });
//   } catch (err) {
//     console.error("Error in /on-date:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// export default r;


import { Router } from "express";
import Availability from "../models/Availability.js";
import Leave from "../models/Leave.js";   // ✅ Leave model import
import User from "../models/User.js";

const r = Router();

r.get("/on-date", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.json({ summary: {}, onLeave: [], available: [] });
    }

    // 📅 Date normalize
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    // 1️⃣ Active users
    const users = await User.find({ active: true });

    // 2️⃣ Availability entries for this date
    const availabilities = await Availability.find({
      date: { $gte: d, $lt: new Date(d.getTime() + 24*60*60*1000) },
    }).populate("user", "forceNo rank name");

    // 3️⃣ Leave entries for this date (Approved only)
    const leaves = await Leave.find({
      from: { $lte: d },   // leave start <= date
      to: { $gte: d },     // leave end >= date
      status: "Approved"
    }).populate("user", "forceNo rank name");

    // 4️⃣ On Leave users (Availability + Leave dono)
    const onLeave = [
      ...availabilities
        .filter(a => a.status?.toLowerCase() === "leave")
        .map(a => ({
          forceNo: a.user?.forceNo,
          rank: a.user?.rank,
          name: a.user?.name,
          type: a.note || "N/A",
        })),
      ...leaves.map(l => ({
        forceNo: l.user?.forceNo,
        rank: l.user?.rank,
        name: l.user?.name,
        type: l.type
      }))
    ];

    // 5️⃣ Available users (jinpe na leave hai na availability block)
    const unavailableIds = new Set([
      ...availabilities.filter(a => a.status !== "Available").map(a => a.user._id.toString()),
      ...leaves.map(l => l.user._id.toString())
    ]);

    const available = users
      .filter(u => !unavailableIds.has(u._id.toString()))
      .map(u => ({
        forceNo: u.forceNo,
        rank: u.rank,
        name: u.name
      }));

    // 6️⃣ Summary counts
    const summary = {
      total: users.length,
      onEL: leaves.filter(l => l.type === "EL").length,
      onCL: leaves.filter(l => l.type === "CL").length,
      onLeave: onLeave.length,
      onDuty: availabilities.filter(a => a.status?.toLowerCase() === "on duty").length,
      restricted: availabilities.filter(a => a.status?.toLowerCase() === "restricted").length,
      available: available.length,
    };

    res.json({ summary, onLeave, available });
  } catch (err) {
    console.error("Error in /on-date:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default r;
