"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.User = mongoose_1.default.model("User", UserSchema);
