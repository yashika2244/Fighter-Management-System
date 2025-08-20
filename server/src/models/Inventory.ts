import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IInventoryItem extends Document {
  name: string;
  description?: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  location?: string;
  supplier?: string;
  cost?: number;
}

export interface IInventoryMovement extends Document {
  item: Types.ObjectId;
  type: "IN" | "OUT";
  quantity: number;
  reason: string;
  date: Date;
  user: Types.ObjectId;
  notes?: string;
}

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    unit: { type: String, required: true },
    currentStock: { type: Number, default: 0 },
    minStock: { type: Number, default: 0 },
    maxStock: { type: Number },
    location: { type: String },
    supplier: { type: String },
    cost: { type: Number },
  },
  { timestamps: true }
);

const InventoryMovementSchema = new Schema<IInventoryMovement>(
  {
    item: { type: Schema.Types.ObjectId, ref: "InventoryItem", required: true },
    type: { type: String, enum: ["IN", "OUT"], required: true },
    quantity: { type: Number, required: true },
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export const InventoryItem: Model<IInventoryItem> = mongoose.model<IInventoryItem>(
  "InventoryItem",
  InventoryItemSchema
);

export const InventoryMovement: Model<IInventoryMovement> = mongoose.model<IInventoryMovement>(
  "InventoryMovement",
  InventoryMovementSchema
);
