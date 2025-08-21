"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB(uri = process.env.MONGO_URI || "") {
    if (!uri) {
        throw new Error("MONGO_URI is not set");
    }
    mongoose_1.default.set("strictQuery", true);
    // Enable mongoose debug if env set
    if (process.env.MONGOOSE_DEBUG === "1") {
        mongoose_1.default.set("debug", (collectionName, method, query, doc) => {
            console.log(`[MONGOOSE] ${collectionName}.${method}`, JSON.stringify(query), JSON.stringify(doc || {}));
        });
    }
    await mongoose_1.default.connect(uri);
    mongoose_1.default.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });
}
