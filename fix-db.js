import mongoose from "mongoose";
import { AnalysisSnapshot } from "./server/src/models/AnalysisSnapshot.js";
import { env } from "./server/src/config/env.js";

async function run() {
  await mongoose.connect(env.mongodbUri);
  console.log("Connected to MongoDB.");

  // Update all generic "Selected role" to "UX Designer" for demonstration
  const result = await AnalysisSnapshot.updateMany(
    { targetRole: "Selected role" },
    { $set: { targetRole: "UX Designer" } }
  );

  console.log(`Updated ${result.modifiedCount} old snapshots to UX Designer.`);
  process.exit(0);
}

run().catch(console.error);
