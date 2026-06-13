import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionPrompt: { type: String, required: true },
    skill: { type: String, required: true },
    selectedAnswer: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    wasCorrect: { type: Boolean, required: true },
    difficulty: { type: String, required: true }
  },
  { _id: false }
);

const assessmentAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    score: { type: Number, default: 0 },
    readinessImpact: { type: Number, default: 0 },
    adaptiveTrail: { type: [String], default: [] },
    answers: { type: [answerSchema], default: [] }
  },
  { timestamps: true }
);

export const AssessmentAttempt = mongoose.model(
  "AssessmentAttempt",
  assessmentAttemptSchema
);

