import { connectDatabase } from "../services/db.js";
import { seedCoreData } from "../services/seed.js";

const run = async () => {
  await connectDatabase();
  await seedCoreData();
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
