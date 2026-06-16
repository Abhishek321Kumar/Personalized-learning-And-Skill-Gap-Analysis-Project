import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { AnalysisSnapshot } from "../../models/AnalysisSnapshot.js";
import { AssessmentAttempt } from "../../models/AssessmentAttempt.js";

const router = Router();

router.get("/overview", requireAuth, async (req, res, next) => {
  try {
    const latestAnalysis = await AnalysisSnapshot.findOne({ userId: req.user._id }).sort({
      createdAt: -1
    });
    const attempts = await AssessmentAttempt.find({ userId: req.user._id })
      .populate("quizId", "title domain")
      .sort({ createdAt: -1 })
      .limit(8);

    const avgAssessmentScore = attempts.length
      ? Math.round(
          attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length
        )
      : 0;

    res.json({
      latestAnalysis,
      attempts,
      averageAssessmentScore: avgAssessmentScore,
      user: { firstName: req.user.firstName },
      measuredLearnersIndicator: {
        sdgTarget: "4.4",
        sdgIndicator: "4.4.1",
        message:
          "SkillBridge tracks measurable digital skill growth using readiness, assessments, and skill coverage."
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;

