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
exports.DutyAssign = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DutyAssignSchema = new mongoose_1.Schema({
    dutyDate: { type: Date, required: true },
    fromTime: { type: String, required: true },
    toTime: { type: String, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    dutyType: {
        type: String,
        enum: [
            "Naka Duty",
            "Minority Patroling",
            "Camp Security",
            "Camp Adm Duty",
            "OC Protection Duty",
        ],
        required: true,
    },
    subCategory: {
        type: String,
        required: function () {
            return this.dutyType === "Camp Security" || this.dutyType === "Camp Adm Duty";
        },
        validate: {
            validator: function (value) {
                if (this.dutyType === "Camp Security") {
                    return [
                        "Morcha no 1",
                        "Morcha no 2",
                        "Morcha no 3",
                        "Morcha no 4",
                        "Morcha no 5",
                        "Morcha no 6",
                        "Patrolling duty",
                        "Duty SO",
                        "Duty NCO",
                        "COY QAT Duty",
                    ].includes(value);
                }
                if (this.dutyType === "Camp Adm Duty") {
                    return [
                        "Mess Duty",
                        "CQMH Store",
                        "Kote Commander Duty",
                        "Tradesman Duty",
                    ].includes(value);
                }
                return true;
            },
            message: (props) => `${props.value} is not a valid sub-category for ${props.instance.dutyType}`,
        },
    },
}, { timestamps: true });
exports.DutyAssign = mongoose_1.default.model("DutyAssign", DutyAssignSchema);
