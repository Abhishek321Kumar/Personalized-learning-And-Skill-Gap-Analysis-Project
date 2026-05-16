import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    level: { type: Number, default: 0 },
    category: { type: String, default: "General" },
    source: { type: String, default: "resume" }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    headline: { type: String, default: "" },
    targetRole: { type: String, default: "" },
    experienceLevel: {
      type: String,
      enum: ["Student", "Fresher", "Early Career", "Mid Career"],
      default: "Student"
    },
    learningGoal: { type: String, default: "" },
    resumeText: { type: String, default: "" },
    resumeFileName: { type: String, default: "" },
    declaredSkills: { type: [skillSchema], default: [] },
    accessibilityNeeds: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

