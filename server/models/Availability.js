import mongoose from "mongoose";
const AvailabilitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Available","On Duty","Leave","Restricted"], default: "Available" },
    note: String
  },
  { timestamps: true }
);
AvailabilitySchema.index({ user:1, date:1 }, { unique:true });
export default mongoose.model("Availability", AvailabilitySchema);
