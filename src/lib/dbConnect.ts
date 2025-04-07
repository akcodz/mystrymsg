import mongoose from "mongoose";

let isConnected: boolean = false; // Use a simple boolean for clarity

const dbConnect = async (): Promise<void> => {
  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI not defined in environment variables");
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "your-db-name", // Optional: to be specific
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("MongoDB connection failed");
  }
};

export default dbConnect;
