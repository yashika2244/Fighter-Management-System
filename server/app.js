
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import users from "./routes/users.js";
import availability from "./routes/availability.js";
import upload from "./routes/upload.js";
import duties from "./routes/DutyAssign.js";

import leaveRoutes from "./routes/leaveRoutes.js";
// CORS setup
const allowedOrigins = ["http://localhost:5173", "https://fighter-management-system-2.onrender.com"];
const app = express();
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // allow this origin
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));


app.use(express.json());
app.use(morgan("dev"));


app.get("/", (req, res) => {
  res.send("Fighter Management System API is running!");
});
// API routes
app.use("/api/users", users);
app.use("/api/availability", availability);
app.use("/api/upload", upload);
// app.use("/api/user-dates", userDatesRoutes);
// app.use("/api/user-leaves", userLeaveRoutes);
// app.use("/api/user-bank", userBankRoutes);
app.use("/api/duties", duties);
app.use("/api/leaves", leaveRoutes);



// Start server
const port = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(port, () => console.log("API & Frontend running on", port));
});
