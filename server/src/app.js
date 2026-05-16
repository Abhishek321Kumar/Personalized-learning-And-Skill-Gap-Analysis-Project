import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { env } from "./config/env.js";
import { moduleConfig, isModuleEnabled } from "./config/modules.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";
import jobsRoutes from "./modules/jobs/jobs.routes.js";
import analysisRoutes from "./modules/analysis/analysis.routes.js";
import assessmentRoutes from "./modules/assessment/assessment.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

fs.mkdirSync(env.uploadsDir, { recursive: true });

const app = express();

app.use(
  cors({
    origin: env.clientUrl
  })
);
app.use(express.json({ limit: "5mb" }));
app.use("/uploads", express.static(path.resolve(env.uploadsDir)));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "skillbridge-api" });
});

app.get("/api/meta/modules", (_req, res) => {
  res.json({ modules: moduleConfig });
});

if (isModuleEnabled("M1")) {
  app.use("/api/auth", authRoutes);
  app.use("/api/profile", profileRoutes);
}

if (isModuleEnabled("M2") || isModuleEnabled("M3")) {
  app.use("/api/jobs", jobsRoutes);
  app.use("/api/analysis", analysisRoutes);
}

if (isModuleEnabled("M4")) {
  app.use("/api/assessment", assessmentRoutes);
}

if (isModuleEnabled("M7")) {
  app.use("/api/dashboard", dashboardRoutes);
}

app.use(errorHandler);

export default app;

