import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI not defined in env");
    }

    cached.promise = mongoose.connect(process.env.MONGO_URI, {});
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnect;
