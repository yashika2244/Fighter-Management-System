"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./config/db");
const users_1 = __importDefault(require("./routes/users"));
const availability_1 = __importDefault(require("./routes/availability"));
const upload_1 = __importDefault(require("./routes/upload"));
const DutyAssign_1 = __importDefault(require("./routes/DutyAssign"));
const leaveRoutes_1 = __importDefault(require("./routes/leaveRoutes"));
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const inventory_1 = __importDefault(require("./routes/inventory"));
const auth_2 = require("./middleware/auth");
const error_1 = require("./middleware/error");
const allowedOrigins = [
    "http://localhost:5173",
    "https://fighter-management-system-2.onrender.com",
];
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
// Verbose request logger for debugging (logs body, query, params)
app.use((req, _res, next) => {
    try {
        const bodyPreview = req.body && Object.keys(req.body).length
            ? JSON.stringify(req.body)
            : "{}";
        const queryPreview = req.query && Object.keys(req.query).length
            ? JSON.stringify(req.query)
            : "{}";
        const paramsPreview = req.params && Object.keys(req.params).length
            ? JSON.stringify(req.params)
            : "{}";
        console.log(`[REQ] ${req.method} ${req.originalUrl} | params=${paramsPreview} query=${queryPreview} body=${bodyPreview}`);
    }
    catch { }
    next();
});
app.get("/", (_req, res) => {
    res.send("Fighter Management System API is running!");
});
// Keep route paths same as current server
const enforce = process.env.RBAC_ENFORCE === "1";
// Users & Uploads → Writer and above (if enforced)
const usersGuards = enforce
    ? [(0, auth_2.requireAuth)(), (0, auth_2.requireRole)(["Writer", "CompanyCommander", "CHM", "CQMH", "MessSO", "Commander", "SuperAdmin"])]
    : [];
app.use("/api/users", ...usersGuards, users_1.default);
app.use("/api/upload", ...usersGuards, upload_1.default);
// Duties → CHM, CompanyCommander, Commander (if enforced)
const dutiesGuards = enforce ? [(0, auth_2.requireAuth)(), (0, auth_2.requireRole)(["CHM", "CompanyCommander", "Commander", "SuperAdmin"])] : [];
app.use("/api/duties", ...dutiesGuards, DutyAssign_1.default);
// Inventory → CQMH, CompanyCommander, Commander, SuperAdmin (if enforced)
const inventoryGuards = enforce ? [(0, auth_2.requireAuth)(), (0, auth_2.requireRole)(["CQMH", "CompanyCommander", "Commander", "SuperAdmin"])] : [];
app.use("/api/inventory", ...inventoryGuards, inventory_1.default);
// Admin management → SuperAdmin only (if enforced)
const adminGuards = enforce ? [(0, auth_2.requireAuth)(), (0, auth_2.requireRole)(["SuperAdmin"])] : [];
app.use("/api/admin", ...adminGuards, admin_1.default);
// Availability & Leaves → any authenticated role (if enforced)
const authOnly = enforce ? [(0, auth_2.requireAuth)()] : [];
app.use("/api/availability", ...authOnly, availability_1.default);
app.use("/api/leaves", ...authOnly, leaveRoutes_1.default);
app.use("/api/auth", auth_1.default);
// Static uploads passthrough if needed
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app.use(error_1.notFound);
app.use(error_1.errorHandler);
const port = process.env.PORT || 5001;
(0, db_1.connectDB)(process.env.MONGO_URI)
    .then(() => {
    app.listen(port, () => console.log("TS API running on", port));
})
    .catch((err) => {
    console.error("Failed to connect DB:", err.message);
    process.exit(1);
});
