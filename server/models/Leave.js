
import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["EL", "CL"], required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    reason: { type: String },
    noOfDays: { type: Number, required: true },
    status: { type: String, enum: ["Approved"], default: "Approved" }, // 👈 Direct approved
  },
  { timestamps: true }
);

export default mongoose.model("Leave", leaveSchema);
