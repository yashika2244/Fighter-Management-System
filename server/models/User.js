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

    // Extra: agar role-based access chahiye toh rakh lo
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
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
