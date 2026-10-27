
import mongoose from "mongoose";

async function testDatabase() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/imovies");

    console.log("MongoDB connected successfully!");
    console.log("Database: imovies");

    await mongoose.disconnect();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exitCode = 1;
  }
}

testDatabase();