import { Router } from "express";
import axios from "axios";
import { requireAuth } from "../../middleware/auth.js";
import { env } from "../../config/env.js";
import { User } from "../../models/User.js";
import { JobRole } from "../../models/JobRole.js";
import { AnalysisSnapshot } from "../../models/AnalysisSnapshot.js";
import { AssessmentAttempt } from "../../models/AssessmentAttempt.js";

const router = Router();

router.post("/run", requireAuth, async (req, res, next) => {
  try {
    const { jobRoleId, jobDescription } = req.body;
    const user = await User.findById(req.user._id);
    const role = jobRoleId ? await JobRole.findById(jobRoleId) : null;
    const assessmentAttempts = await AssessmentAttempt.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const payload = {
      resumeText: user?.resumeText || "",
      declaredSkills: user?.declaredSkills || [],
      jobDescription: jobDescription || role?.jobDescription || "",
      targetRole: role?.title || user?.targetRole || "Selected role",
      requiredSkills: role?.requiredSkills || [],
      assessmentSignals: assessmentAttempts.map((attempt) => ({
        score: attempt.score,
        answers: attempt.answers
      }))
    };

    const response = await axios.post(`${env.mlServiceUrl}/analyze`, payload);

    const snapshot = await AnalysisSnapshot.create({
      userId: req.user._id,
      jobRoleId: role?._id,
      targetRole: response.data.targetRole,
      readinessScore: response.data.readinessScore,
      matchPercentage: response.data.matchPercentage,
      matchedSkills: response.data.matchedSkills,
      missingSkills: response.data.missingSkills,
      strengths: response.data.strengths,
      improvementPriorities: response.data.improvementPriorities,
      categoryBreakdown: response.data.categoryBreakdown,
      ictIndicator: response.data.ictIndicator
    });

    res.json({ snapshot });
  } catch (error) {
    next(error);
  }
});

router.get("/latest", requireAuth, async (req, res, next) => {
  try {
    const snapshot = await AnalysisSnapshot.findOne({ userId: req.user._id }).sort({
      createdAt: -1
    });
    res.json({ snapshot });
  } catch (error) {
    next(error);
  }
});

export default router;

