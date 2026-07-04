import app from "../server/src/app.js";
import { connectDatabase } from "../server/src/services/db.js";

export default async function (req, res) {
  await connectDatabase();
  return app(req, res);
}
