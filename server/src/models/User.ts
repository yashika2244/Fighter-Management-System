import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  slNo: string;
  forceNo: string;
  password?: string;
  rank?: string;
  name: string;
  mobileNo?: string;
  dob?: Date | null;
  doe?: Date | null;
  doaCoy?: Date | null;
  doaUnit?: Date | null;
  dop?: Date | null;
  dod?: Date | null;
  religion?: string;
  caste?: string;
  course?: string;
  education?: string;
  bg?: string;
  height?: string;
  state?: string;
  homeAddress?: string;
  elTotal: number;
  elUsed: number;
  clTotal: number;
  clUsed: number;
  jdpet1st?: string;
  jdpet2st?: string;
  ame?: string;
  arcf?: string;
  ltc?: string;
  bankac?: string;
  branchNo?: string;
  ifsc?: string;
  micr?: string;
  nok?: string;
  dependent?: string;
  icardNo?: string;
  ppps?: string;
  pln?: string;
  sec?: string;
  specialDuty: boolean;
  role: "SuperAdmin" | "Writer" | "CompanyCommander" | "CHM" | "CQMH" | "MessSO" | "Commander" | "Other";
  active: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    slNo: { type: String, required: true },
    forceNo: { type: String, required: true, unique: true },
    password: { type: String },
    rank: { type: String },
    name: { type: String, required: true },
    mobileNo: { type: String },
    dob: { type: Date },
    doe: { type: Date },
    doaCoy: { type: Date },
    doaUnit: { type: Date },
    dop: { type: Date },
    dod: { type: Date },
    religion: { type: String },
    caste: { type: String },
    course: { type: String },
    education: { type: String },
    bg: { type: String },
    height: { type: String },
    state: { type: String },
    homeAddress: { type: String },
    elTotal: { type: Number, default: 60 },
    elUsed: { type: Number, default: 0 },
    clTotal: { type: Number, default: 15 },
    clUsed: { type: Number, default: 0 },
    jdpet1st: { type: String },
    jdpet2st: { type: String },
    ame: { type: String },
    arcf: { type: String },
    ltc: { type: String },
    bankac: { type: String },
    branchNo: { type: String },
    ifsc: { type: String },
    micr: { type: String },
    nok: { type: String },
    dependent: { type: String },
    icardNo: { type: String },
    ppps: { type: String },
    pln: { type: String },
    sec: { type: String },
    specialDuty: { type: Boolean, default: false },
    role: {
      type: String,
      enum: [
        "SuperAdmin",
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

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);


