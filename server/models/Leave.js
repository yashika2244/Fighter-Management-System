// // import mongoose from "mongoose";

// // const leaveSchema = new mongoose.Schema({
// //   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //   from: { type: Date, required: true },
// //   to: { type: Date, required: true },
// //   type: { type: String, enum: ["EL", "CL"], required: true },
// //   reason: { type: String, required: true },
// // }, { timestamps: true });

// // export default mongoose.model("Leave", leaveSchema);
// import mongoose from "mongoose";

// const leaveSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   from: { type: Date, required: true },
//   to: { type: Date, required: true },
//   type: { type: String, enum: ["EL", "CL"], required: true },
//   reason: { type: String, required: true },
//   status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
// }, { timestamps: true });

// export default mongoose.model("Leave", leaveSchema);
import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["EL", "CL"], required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    reason: { type: String },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    noOfDays: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Leave", leaveSchema);
