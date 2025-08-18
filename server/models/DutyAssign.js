import mongoose from "mongoose";

const DutyAssignSchema = new mongoose.Schema({
  dutyDate: { type: Date, required: true },
  fromTime: { type: String, required: true },
  toTime: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dutyType: { type: String, enum: ["Naka Duty", "Minority Patroling", "Camp Security", "Camp Adm Duty", "OC Protection Duty"], required: true }
}, { timestamps: true });

export default mongoose.model("DutyAssign", DutyAssignSchema);
