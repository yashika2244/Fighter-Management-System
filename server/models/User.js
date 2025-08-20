// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema(
//   {
//     slNo: { type: String, required: true },
//     forceNo: { type: String, required: true, unique: true },
//     rank: { type: String },
//     name: { type: String, required: true },
//     mobileNo: { type: String },
//     doaCoy: { type: String }, // Date of joining Coy
//     doaUnit: { type: String }, // Date of joining Unit
//     dob: { type: String }, // Date of Birth
//     doe: { type: String },
//     state: { type: String },
//       dod: { type: String },   
//     religion: { type: String },
//     caste: { type: String },
//     bg: { type: String }, // Blood Group
//     homeAddress: { type: String },
//     height: { type: String },
//       course: { type: String },
//     dependent: { type: String },
//     nok: { type: String }, // Next of Kin
//     icardNo: { type: String },

//     role: {
//       type: String,
//       enum: [
//         "Writer",
//         "CompanyCommander",
//         "CHM",
//         "CQMH",
//         "MessSO",
//         "Commander",
//         "Other",
//       ],
//       default: "Writer",
//     },

//     active: { type: Boolean, default: true },

//     // 🔑 Leave fields
//     elTotal: { type: Number, default: 60 },
//     elUsed: { type: Number, default: 0 },
//     clTotal: { type: Number, default: 15 },
//     clUsed: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("User", UserSchema);

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // 🔹 Basic Info
    slNo: { type: String, required: true },
    forceNo: { type: String, required: true, unique: true },
    rank: { type: String },
    name: { type: String, required: true },
    mobileNo: { type: String },
 dob: { type: Date },
doe: { type: Date },
doaCoy: { type: Date },
doaUnit: { type: Date },
dop: { type: Date },
dod: { type: Date },       // Date of Discharge (optional)
    
    // 🔹 Background
    religion: { type: String },
    caste: { type: String },
    course: { type: String },
    education: { type: String },

    // 🔹 Medical
    bg: { type: String },         // Blood Group
    height: { type: String },

    // 🔹 Address
    state: { type: String },
    homeAddress: { type: String },

    // 🔹 Leave
    elTotal: { type: Number, default: 60 },
    elUsed: { type: Number, default: 0 },
    clTotal: { type: Number, default: 15 },
    clUsed: { type: Number, default: 0 },

    // 🔹 Service
    jdpet1st: { type: String },
    jdpet2st: { type: String },
    ame: { type: String },
    arcf: { type: String },
    ltc: { type: String },

    // 🔹 Finance
    bankac: { type: String },
    branchNo: { type: String },
    ifsc: { type: String },
    micr: { type: String },

    // 🔹 Other
    nok: { type: String },           // Next of Kin
    dependent: { type: String },
    icardNo: { type: String },
    ppps: { type: String },
    pln: { type: String },
    sec: { type: String },

    // 🔹 Readiness
    specialDuty: { type: Boolean, default: false },

    // 🔹 Role & Status
    role: {
      type: String,
      enum: [
        "Writer",
        "CompanyCommander",
        "CHM",
        "CQMH",
        "MessSO",
        "Commander",
        "Other",
      ],
      default: "Writer",
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
