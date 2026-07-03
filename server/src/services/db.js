import mongoose from "mongoose";
import { env } from "../config/env.js";

let isConnected = false;

export const connectDatabase = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }
  
  mongoose.set("strictQuery", true);
  const db = await mongoose.connect(env.mongodbUri);
  isConnected = db.connections[0].readyState === 1;
  console.log("MongoDB connected");
};

