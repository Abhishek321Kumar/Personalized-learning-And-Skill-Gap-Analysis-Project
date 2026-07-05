import app from "../server/src/app.js";
import { connectDatabase } from "../server/src/services/db.js";

export default async function (req, res) {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Database connection failed:", error);
    return res.status(500).json({ 
      message: `Database Error: ${error.message}`
    });
  }
}
