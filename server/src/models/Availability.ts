import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAvailability extends Document {
  user: Types.ObjectId;
  date: Date;
  status: "Available" | "On Duty" | "Leave" | "Restricted";
  note?: string;
}

const AvailabilitySchema = new Schema<IAvailability>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Available", "On Duty", "Leave", "Restricted"],
      default: "Available",
    },
    note: { type: String },
  },
  { timestamps: true }
);

AvailabilitySchema.index({ user: 1, date: 1 }, { unique: true });

export const Availability: Model<IAvailability> = mongoose.model<IAvailability>(
  "Availability",
  AvailabilitySchema
);


