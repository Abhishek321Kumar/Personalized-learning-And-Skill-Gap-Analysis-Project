import mongoose from "mongoose";

const analysisSnapshotSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobRoleId: { type: mongoose.Schema.Types.ObjectId, ref: "JobRole" },
    targetRole: { type: String, required: true },
    readinessScore: { type: Number, required: true },
    matchPercentage: { type: Number, required: true },
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    strengths: { type: [String], default: [] },
    improvementPriorities: { type: [String], default: [] },
    categoryBreakdown: { type: Array, default: [] },
    ictIndicator: {
      type: new mongoose.Schema(
        {
          measuredSkills: { type: Number, default: 0 },
          requiredSkills: { type: Number, default: 0 },
          coverageScore: { type: Number, default: 0 }
        },
        { _id: false }
      ),
    },
    resumeScore: { type: Number, default: 0 },
    resumeCategories: { type: Array, default: [] }
  },
  { timestamps: true }
);

export const AnalysisSnapshot = mongoose.model(
  "AnalysisSnapshot",
  analysisSnapshotSchema
);

