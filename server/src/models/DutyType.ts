import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDutyType extends Document {
  name: string;
  requiresSubCategory?: boolean;
  subCategories: string[];
  active: boolean;
}

const DutyTypeSchema = new Schema<IDutyType>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    requiresSubCategory: { type: Boolean, default: false },
    subCategories: { type: [String], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DutyType: Model<IDutyType> = mongoose.model<IDutyType>(
  "DutyType",
  DutyTypeSchema
);


