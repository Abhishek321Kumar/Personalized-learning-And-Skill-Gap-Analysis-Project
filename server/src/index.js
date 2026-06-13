import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./services/db.js";
import { seedCoreData } from "./services/seed.js";

const start = async () => {
  try {
    await connectDatabase();
    await seedCoreData();
    app.listen(env.port, () => {
      console.log(`SkillBridge API running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start API server", error);
    process.exit(1);
  }
};

start();

