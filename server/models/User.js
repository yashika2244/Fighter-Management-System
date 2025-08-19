import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    slNo: { type: String, required: true },
    forceNo: { type: String, required: true, unique: true },
    rank: { type: String },
    name: { type: String, required: true },
    mobileNo: { type: String },
    state: { type: String },
    religion: { type: String },
    caste: { type: String },
    bg: { type: String }, // Blood Group
    homeAddress: { type: String },
    height: { type: String },
    dependent: { type: String },
    nok: { type: String }, // Next of Kin
    icardNo: { type: String },

    role: {
      type: String,
      enum: [
        "Writer",
        "CompanyCommander",
        "CHM",
        "CQMH",
        "MessSO",
        "Commander",
        "Other",
      ],
      default: "Writer",
    },

    active: { type: Boolean, default: true },

    // 🔑 Leave fields
    elTotal: { type: Number, default: 60 },
    elUsed: { type: Number, default: 0 },
    clTotal: { type: Number, default: 15 },
    clUsed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
