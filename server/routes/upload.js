// // // // import { Router } from "express";
// // // // import multer from "multer";
// // // // import { parse } from "csv-parse/sync";
// // // // import fs from "fs";
// // // // import User from "../models/User.js";
// // // // const upload = multer({ dest: "uploads/" });
// // // // const r = Router();

// // // // r.post("/users-csv", upload.single("file"), async (req,res)=>{
// // // //   const csv = fs.readFileSync(req.file.path);
// // // //   const records = parse(csv, { columns:true, skip_empty_lines:true });
// // // //   // const ops = records.map(row => ({
// // // //   //   updateOne:{
// // // //   //     filter:{ serviceNo: row.serviceNo },
// // // //   //     update:{ $set:{
// // // //   //       serviceNo: row.serviceNo,
// // // //   //       name: row.name,
// // // //   //       rank: row.rank,
// // // //   //       trade: row.trade,
// // // //   //       unit: row.unit,
// // // //   //       phone: row.phone,
// // // //   //       email: row.email,
// // // //   //     }},
// // // //   //     upsert:true
// // // //   //   }
// // // //   // }));
// // // //   const ops = records.map((row) => ({
// // // //   updateOne: {
// // // //     filter: { pcrn: row["P/CRN"] },
// // // //     update: {
// // // //       $set: {
// // // //         pcrn: row["P/CRN"],
// // // //         // rank: row["RANK"]
// // // //         name: row["NAME"],
// // // //         mobile: row["MOBILE"],
// // // //         doaCoy: row["DOA COY"],
// // // //         doaUnit: row["DOA UNIT"],
// // // //         dob: row["DOB"],
// // // //         doe: row["DOE"],
// // // //         religion: row["RELIGI"],
// // // //         caste: row["CAST"],
// // // //         bg: row["BG"],
// // // //         state: row["STATE"],
// // // //         dod: row["DOD"],
// // // //         course: row["COURSE"]
// // // //       }
// // // //     },
// // // //     upsert: true
// // // //   }
// // // // }));
// // // //   if(ops.length) await User.bulkWrite(ops);
// // // //   res.json({ imported: ops.length });
// // // // });

// // // // export default r;

// // // import express from "express";
// // // import multer from "multer";
// // // import fs from "fs";
// // // import { parse } from "csv-parse/sync";
// // // import User from "../models/User.js";

// // // const router = express.Router();

// // // // Multer setup
// // // const upload = multer({ dest: "uploads/" });

// // // // POST route: import CSV
// // // router.post("/import", upload.single("file"), async (req, res) => {
// // //   try {
// // //     if (!req.file) {
// // //       return res.status(400).json({ message: "No file uploaded" });
// // //     }

// // //     // Read & parse CSV
// // //     const csvData = fs.readFileSync(req.file.path);
// // //     const records = parse(csvData, {
// // //       columns: true,
// // //       skip_empty_lines: true
// // //     });

// // //     // Prepare operations for bulk insert/update
// // //     const ops = records.map((row) => ({
// // //       updateOne: {
// // //         filter: { forceNo: row["P/CRN"] }, // unique key
// // //         update: {
// // //           $set: {
// // //             slNo: row["P/CRN"],
// // //             forceNo: row["P/CRN"],
// // //             rank: row["RANK"],
// // //             name: row["NAME"],
// // //             mobileNo: row["MOBILE"],
// // //             doaCoy: row["DOA COY"],
// // //             doaUnit: row["DOA UNIT"],
// // //             dob: row["DOB"],
// // //             doe: row["DOE"],
// // //             religion: row["RELIGI"],
// // //             caste: row["CAST"],
// // //             bg: row["BG"],
// // //             state: row["STATE"],
// // //             dod: row["DOD"],
// // //             course: row["COURSE"],
// // //             homeAddress: row["ADDRESS"] || "",
// // //             dependent: row["DEPENDENT"] || "",
// // //             nok: row["NOK"],
// // //             icardNo: row["ICARDNO"]
// // //           }
// // //         },
// // //         upsert: true
// // //       }
// // //     }));

// // //     // Bulk write to DB
// // //     if (ops.length > 0) {
// // //       await User.bulkWrite(ops);
// // //     }

// // //     // Delete uploaded file after processing
// // //     fs.unlinkSync(req.file.path);

// // //     res.json({ message: "CSV Imported Successfully ✅", count: ops.length });
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ message: "Error importing CSV", error: err.message });
// // //   }
// // // });

// // // export default router;

// // import express from "express";
// // import multer from "multer";
// // import fs from "fs";
// // import { parse } from "csv-parse/sync";
// // import User from "../models/User.js";

// // const router = express.Router();

// // // Multer setup
// // const upload = multer({ dest: "uploads/" });

// // // POST route: import CSV
// // router.post("/import", upload.single("file"), async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }

// //     // Read & parse CSV
// //     const csvData = fs.readFileSync(req.file.path);
// //     const records = parse(csvData, {
// //       columns: true,
// //       skip_empty_lines: true,
// //     });

// //     if (!records.length) {
// //       return res.status(400).json({ message: "CSV is empty" });
// //     }

// //     let skipped = 0;
// //     let ops = [];

// //     records.forEach((row, i) => {
// //       // Skip rows missing required fields
// //       if (!row["P/CRN"] || !row["NAME"]) {
// //         console.warn(`Skipping row ${i + 1}: missing P/CRN or NAME`, row);
// //         skipped++;
// //         return;
// //       }

// //       ops.push({
// //         updateOne: {
// //           filter: { forceNo: row["P/CRN"] },
// //           update: {
// //             $set: {
// //               slNo: row["P/CRN"],
// //               forceNo: row["P/CRN"],
// //               rank: row["RANK"] || "",
// //               name: row["NAME"],
// //               mobileNo: row["MOBILE"] || "",
// //               doaCoy: row["DOA COY"] || "",
// //               doaUnit: row["DOA UNIT"] || "",
// //               dob: row["DOB"] || "",
// //               doe: row["DOE"] || "",
// //               religion: row["RELIGI"] || "",
// //               caste: row["CAST"] || "",
// //               bg: row["BG"] || "",
// //               state: row["STATE"] || "",
// //               dod: row["DOD"] || "",
// //               course: row["COURSE"] || "",
// //               homeAddress: row["ADDRESS"] || "",
// //               dependent: row["DEPENDENT"] || "",
// //               nok: row["NOK"] || "",
// //               icardNo: row["ICARDNO"] || "",
// //             },
// //           },
// //           upsert: true,
// //         },
// //       });
// //     });

// //     if (ops.length > 0) {
// //       await User.bulkWrite(ops);
// //     }

// //     // Delete uploaded file after processing
// //     fs.unlinkSync(req.file.path);

// //     res.json({
// //       message: `CSV Imported Successfully ✅`,
// //       imported: ops.length,
// //       skipped,
// //     });
// //   } catch (err) {
// //     console.error("CSV Import Error:", err);
// //     res.status(500).json({ message: "Error importing CSV", error: err.message });
// //   }
// // });

// // export default router;


// import express from "express";
// import multer from "multer";
// import fs from "fs";
// import { parse } from "csv-parse/sync";
// import XLSX from "xlsx"; // ✅ Excel support
// import User from "../models/User.js";

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// router.post("/import", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     let records = [];

//     // ✅ Detect and parse file type
//     if (req.file.originalname.endsWith(".csv")) {
//       const csvData = fs.readFileSync(req.file.path);
//       records = parse(csvData, { columns: true, skip_empty_lines: true });
//     } else if (req.file.originalname.endsWith(".xlsx")) {
//       const workbook = XLSX.readFile(req.file.path);
//       const sheetName = workbook.SheetNames[0];
//       records = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//     } else {
//       return res.status(400).json({ message: "Unsupported file format (use CSV or XLSX)" });
//     }

//     if (!records.length) {
//       return res.status(400).json({ message: "File is empty" });
//     }

//     let skipped = 0;
//     let ops = [];

//     // ✅ Prepare DB operations
//     // records.forEach((row, i) => {
//     //   if (!row["P/CRN"] || !row["NAME"]) {
//     //     skipped++;
//     //     return;
//     //   }

//     //   ops.push({
//     //     updateOne: {
//     //       filter: { forceNo: row["P/CRN"] },
//     //       update: {
//     //         $set: {
//     //           slNo: row["P/CRN"],
//     //           forceNo: row["P/CRN"],
//     //           rank: row["RANK"] || "",
//     //           name: row["NAME"],
//     //           mobileNo: row["MOBILE"] || "",
//     //           doaCoy: row["DOA COY"] || "",
//     //           doaUnit: row["DOA UNIT"] || "",
//     //           dob: row["DOB"] || "",
//     //           doe: row["DOE"] || "",
//     //           religion: row["RELIGI"] || "",
//     //           caste: row["CAST"] || "",
//     //           bg: row["BG"] || "",
//     //           state: row["STATE"] || "",
//     //           dod: row["DOD"] || "",
//     //           course: row["COURSE"] || "",
//     //           homeAddress: row["ADDRESS"] || "",
//     //           dependent: row["DEPENDENT"] || "",
//     //           nok: row["NOK"] || "",
//     //           icardNo: row["ICARDNO"] || "",
//     //         },
//     //       },
//     //       upsert: true,
//     //     },
//     //   });
//     // });
//     records.forEach((row, i) => {
//   const forceNo = row["P/CRN"] || row["FORCE NO"] || row["ForceNo"];
//   const name = row["NAME"] || row["Name"];

//   if (!forceNo || !name) {
//     console.warn(`Skipping row ${i + 1}: missing FORCE NO or NAME`, row);
//     skipped++;
//     return;
//   }

//   // ops.push({
//   //   updateOne: {
//   //     filter: { forceNo },
//   //     update: {
//   //       $set: {
//   //         slNo: row["SL NO"] || "",
//   //         forceNo,
//   //         rank: row["RANK"] || "",
//   //         name,
//   //         mobileNo: row["MOBILE NO"] || "",
//   //         doaCoy: row["DOA COY"] || "",
//   //         doaUnit: row["DOA UNIT"] || "",
//   //         dob: row["DOB"] || "",
//   //         doe: row["DOE"] || "",
//   //         religion: row["RELIGION"] || "",
//   //         caste: row["CAST"] || "",
//   //         bg: row["BG"] || "",
//   //         state: row["STATE"] || "",
//   //         dod: row["DOD"] || "",
//   //         course: row["COURSE"] || "",
//   //         homeAddress: row["HOME ADDRESS"] || "",
//   //         dependent: row["DEPENDENT"] || "",
//   //         nok: row["NOK"] || "",
//   //         icardNo: row["ICARDNO"] || "",
//   //       },
//   //     },
//   //     upsert: true,
//   //   },
//   // });

// ops.push({
//   updateOne: {
//     filter: { forceNo },
//     update: {
//       $set: {
//         slNo: row["SL NO"] || "",
//         forceNo,
//         rank: row["RANK"] || "",
//         name,
//         mobileNo: row["MOBILE NO"] || "",
//         dob: parseDate(row["DOB"]),
//         doe: parseDate(row["DOE"]),
//         doaCoy: parseDate(row["DOA COY"]),
//         doaUnit: parseDate(row["DOA UNIT"]),
//         dop: parseDate(row["DOP"]),
//         dod: parseDate(row["DOD"]),
//         religion: row["RELIGION"] || "",
//         caste: row["CAST"] || "",
//         bg: row["BG"] || "",
//         state: row["STATE"] || "",
//         course: row["COURSE"] || "",
//         homeAddress: row["HOME ADDRESS"] || "",
//         dependent: row["DEPENDENT"] || "",
//         nok: row["NOK"] || "",
//         icardNo: row["ICARDNO"] || "",
//       },
//     },
//     upsert: true,
//   },
// });

// });


//     if (ops.length > 0) {
//       await User.bulkWrite(ops);
//     }

//     // ✅ Delete uploaded file after processing
//     fs.unlinkSync(req.file.path);

//     res.json({
//       message: `Imported Successfully ✅`,
//       imported: ops.length,
//       skipped,
//     });
//   } catch (err) {
//     console.error("Import Error:", err);
//     res.status(500).json({ message: "Error importing file", error: err.message });
//   }
// });

// export default router;
import express from "express";
import multer from "multer";
import fs from "fs";
import { parse } from "csv-parse/sync";
import XLSX from "xlsx";
import User from "../models/User.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * ✅ Parse dates safely (supports Excel numbers + normal strings)
 */
function parseDate(value) {
  if (!value) return null;

  // Excel numeric date (e.g. 44909)
  if (!isNaN(value) && typeof value === "number") {
    try {
      const excelDate = XLSX.SSF.parse_date_code(value);
      return new Date(excelDate.y, excelDate.m - 1, excelDate.d);
    } catch {
      return null;
    }
  }

  // String date
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

router.post("/import", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let records = [];

    // ✅ Detect and parse file type
    if (req.file.originalname.endsWith(".csv")) {
      const csvData = fs.readFileSync(req.file.path);
      records = parse(csvData, { columns: true, skip_empty_lines: true });
    } else if (req.file.originalname.endsWith(".xlsx")) {
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      records = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else {
      return res
        .status(400)
        .json({ message: "Unsupported file format (use CSV or XLSX)" });
    }

    if (!records.length) {
      return res.status(400).json({ message: "File is empty" });
    }

    let skipped = 0;
    let ops = [];

    records.forEach((row, i) => {
      const forceNo = row["P/CRN"] || row["FORCE NO"] || row["ForceNo"];
      const name = row["NAME"] || row["Name"];

      if (!forceNo || !name) {
        console.warn(`Skipping row ${i + 1}: missing FORCE NO or NAME`, row);
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

              // ✅ Parse dates
              dob: parseDate(row["DOB"]),
              doe: parseDate(row["DOE"]),
              doaCoy: parseDate(row["DOA COY"]),
              doaUnit: parseDate(row["DOA UNIT"]),
              dop: parseDate(row["DOP"]),
              dod: parseDate(row["DOD"]),

              // ✅ Other fields
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

    if (ops.length > 0) {
      await User.bulkWrite(ops, { ordered: false }); // ✅ continue on errors
    }

    // ✅ Delete uploaded file after processing
    fs.unlinkSync(req.file.path);

    res.json({
      message: "Imported Successfully ✅",
      imported: ops.length,
      skipped,
    });
  } catch (err) {
    console.error("Import Error:", err.stack || err);
    res
      .status(500)
      .json({ message: "Error importing file", error: err.message });
  }
});

export default router;
