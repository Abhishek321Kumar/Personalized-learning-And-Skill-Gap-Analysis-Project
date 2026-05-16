import { Router } from "express";
import { JobRole } from "../../models/JobRole.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const jobs = await JobRole.find().sort({ title: 1 });
    res.json({ jobs });
  } catch (error) {
    next(error);
  }
});

export default router;

