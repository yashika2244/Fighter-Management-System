import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ILeave extends Document {
  user: Types.ObjectId;
  type: "EL" | "CL";
  from: Date;
  to: Date;
  reason?: string;
  noOfDays: number;
  status: "Approved";
}

const LeaveSchema = new Schema<ILeave>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["EL", "CL"], required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    reason: { type: String },
    noOfDays: { type: Number, required: true },
    status: { type: String, enum: ["Approved"], default: "Approved" },
  },
  { timestamps: true }
);

export const Leave: Model<ILeave> = mongoose.model<ILeave>("Leave", LeaveSchema);


