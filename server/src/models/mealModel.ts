import mongoose, { Schema, Document } from "mongoose";

export interface IMeal extends Document {
  meal_date: string;
  meal_type: "Breakfast" | "Lunch" | "Dinner";
  headcount: number;
  created_at: Date;
}

const MealSchema: Schema = new Schema(
  {
    meal_date: { type: String, required: true },
    meal_type: { type: String, enum: ["Breakfast", "Lunch", "Dinner"], required: true },
    headcount: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IMeal>("Meal", MealSchema);
