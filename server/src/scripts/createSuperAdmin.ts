import { connectDB } from "../config/db";
import { User } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

async function createSuperAdmin() {
  try {
    await connectDB(process.env.MONGO_URI || "");
    
    // Check if SuperAdmin already exists
    const existingSuperAdmin = await User.findOne({ role: "SuperAdmin" });
    if (existingSuperAdmin) {
      console.log("✅ SuperAdmin already exists:", existingSuperAdmin.forceNo);
      process.exit(0);
    }

    // Create SuperAdmin account
    const superAdmin = await User.create({
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
  } catch (error) {
    console.error("❌ Error creating SuperAdmin:", error);
    process.exit(1);
  }
}

createSuperAdmin();
