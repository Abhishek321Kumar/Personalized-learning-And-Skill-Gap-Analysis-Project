import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    skill: { type: String, required: true },
    explanation: { type: String, default: "" },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy"
    },
    options: { type: [optionSchema], default: [] },
    correctAnswer: { type: String, required: true }
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    domain: { type: String, required: true },
    timeLimitMinutes: { type: Number, default: 12 },
    totalQuestions: { type: Number, default: 6 },
    questions: { type: [questionSchema], default: [] }
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", quizSchema);

