import mongoose from "mongoose";

export async function connectDB(uri = process.env.MONGO_URI || ""): Promise<void> {
  if (!uri) {
    throw new Error("MONGO_URI is not set");
  }
  mongoose.set("strictQuery", true);
  // Enable mongoose debug if env set
  if (process.env.MONGOOSE_DEBUG === "1") {
    mongoose.set("debug", (collectionName, method, query, doc) => {
      console.log(`[MONGOOSE] ${collectionName}.${method}`, JSON.stringify(query), JSON.stringify(doc || {}));
    });
  }
  await mongoose.connect(uri);
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
}


