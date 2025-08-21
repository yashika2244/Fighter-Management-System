"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const User_1 = require("../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function createSuperAdmin() {
    try {
        await (0, db_1.connectDB)(process.env.MONGO_URI || "");
        // Check if SuperAdmin already exists
        const existingSuperAdmin = await User_1.User.findOne({ role: "SuperAdmin" });
        if (existingSuperAdmin) {
            console.log("✅ SuperAdmin already exists:", existingSuperAdmin.forceNo);
            process.exit(0);
        }
        // Create SuperAdmin account
        const superAdmin = await User_1.User.create({
            slNo: "SUPER001",
            forceNo: "SUPER001",
            name: "Super Administrator",
            password: "admin123", // Change this password in production
            role: "SuperAdmin",
            active: true,
            elTotal: 60,
            elUsed: 0,
            clTotal: 15,
            clUsed: 0,
            specialDuty: false,
        });
        console.log("✅ SuperAdmin created successfully!");
        console.log("📋 Login Credentials:");
        console.log("   Force Number: SUPER001");
        console.log("   Password: admin123");
        console.log("   Role: SuperAdmin");
        console.log("\n⚠️  IMPORTANT: Change the password after first login!");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Error creating SuperAdmin:", error);
        process.exit(1);
    }
}
createSuperAdmin();
