import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  unit: { type: String },
  qty: { type: Number, default: 0 },
  minQty: { type: Number, default: 0 },
  location: { type: String },
  notes:{type:String},
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Inventory", inventorySchema);
