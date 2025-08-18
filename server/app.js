import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import users from "./routes/users.js";
import availability from "./routes/availability.js";
import upload from "./routes/upload.js";
import duties from "./routes/DutyAssign.js";
import userDatesRoutes from "./routes/userDatesRoutes.js";
import userLeaveRoutes from "./routes/userLeaveRoutes.js";
import userBankRoutes from "./routes/userBankRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/users", users);
app.use("/api/availability", availability);
app.use("/api/upload", upload);
app.use("/api/user-dates", userDatesRoutes);
app.use("/api/user-leaves", userLeaveRoutes);
app.use("/api/user-bank", userBankRoutes);
app.use("/api/duties", duties);

const port = process.env.PORT || 5000;
connectDB().then(()=>{
  app.listen(port, ()=> console.log("API running on", port));
});