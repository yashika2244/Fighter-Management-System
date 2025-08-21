import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { connectDB } from "./config/db";
import users from "./routes/users";
import availability from "./routes/availability";
import upload from "./routes/upload";
import duties from "./routes/DutyAssign";
import leaveRoutes from "./routes/leaveRoutes";
import auth from "./routes/auth";
import admin from "./routes/admin";
import inventory from "./routes/inventory";
import meals from "./routes/mealRoutes";
import { requireAuth, requireRole } from "./middleware/auth";
import { errorHandler, notFound } from "./middleware/error";

const allowedOrigins = [
  "http://localhost:5173",
  "https://fighter-management-system-2.onrender.com",
];

const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());
app.use(morgan("dev"));

// Verbose request logger for debugging (logs body, query, params)
app.use((req, _res, next) => {
  try {
    const bodyPreview =
      req.body && Object.keys(req.body).length
        ? JSON.stringify(req.body)
        : "{}";
    const queryPreview =
      req.query && Object.keys(req.query).length
        ? JSON.stringify(req.query)
        : "{}";
    const paramsPreview =
      req.params && Object.keys(req.params).length
        ? JSON.stringify(req.params)
        : "{}";
    console.log(
      `[REQ] ${req.method} ${req.originalUrl} | params=${paramsPreview} query=${queryPreview} body=${bodyPreview}`
    );
  } catch {}
  next();
});

app.get("/", (_req, res) => {
  res.send("Fighter Management System API is running!");
});

// Keep route paths same as current server
const enforce = process.env.RBAC_ENFORCE === "1";

// Users & Uploads → Writer and above (if enforced)
const usersGuards = enforce
  ? [requireAuth(), requireRole(["Writer","CompanyCommander","CHM","CQMH","MessSO","Commander","SuperAdmin"]) ]
  : [];
app.use("/api/users", ...usersGuards, users);
app.use("/api/upload", ...usersGuards, upload);

// Duties → CHM, CompanyCommander, Commander (if enforced)
const dutiesGuards = enforce ? [requireAuth(), requireRole(["CHM","CompanyCommander","Commander","SuperAdmin"])] : [];
app.use("/api/duties", ...dutiesGuards, duties);

// Inventory → CQMH, CompanyCommander, Commander, SuperAdmin (if enforced)
const inventoryGuards = enforce ? [requireAuth(), requireRole(["CQMH","CompanyCommander","Commander","SuperAdmin"])] : [];
app.use("/api/inventory", ...inventoryGuards, inventory);
// Meals → MessSO, CompanyCommander, SuperAdmin (if enforced)
const mealsGuards = enforce ? [requireAuth(), requireRole(["MessSO","CompanyCommander","SuperAdmin"])] : [];
app.use("/api/meals", ...mealsGuards, meals);
// Admin management → SuperAdmin only (if enforced)
const adminGuards = enforce ? [requireAuth(), requireRole(["SuperAdmin"])] : [];
app.use("/api/admin", ...adminGuards, admin);

// Availability & Leaves → any authenticated role (if enforced)
const authOnly = enforce ? [requireAuth()] : [];
app.use("/api/availability", ...authOnly, availability);
app.use("/api/leaves", ...authOnly, leaveRoutes);
app.use("/api/auth", auth);

// Static uploads passthrough if needed
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5001;

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => console.log("TS API running on", port));
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err.message);
    process.exit(1);
  });


