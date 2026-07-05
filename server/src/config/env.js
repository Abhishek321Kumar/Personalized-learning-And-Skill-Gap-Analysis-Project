import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(
  __dirname,
  "..",
  "..",
  process.env.UPLOAD_DIR || "uploads"
);

export const env = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/skillbridge",
  jwtSecret: process.env.JWT_SECRET || "change-this-in-production",
  mlServiceUrl: process.env.ML_SERVICE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/ml` : "http://127.0.0.1:8001"),
  uploadsDir
};

