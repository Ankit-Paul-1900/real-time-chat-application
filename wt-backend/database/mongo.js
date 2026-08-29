import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnect = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    console.log("Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export default dbConnect;