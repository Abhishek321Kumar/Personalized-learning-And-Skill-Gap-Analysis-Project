import mongoose from "mongoose";

const requiredSkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    weight: { type: Number, default: 1 },
    category: { type: String, default: "General" }
  },
  { _id: false }
);

const jobRoleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    domain: { type: String, required: true },
    summary: { type: String, required: true },
    jobDescription: { type: String, required: true },
    requiredSkills: { type: [requiredSkillSchema], default: [] },
    sdgFocus: { type: String, default: "SDG 4.4: job-relevant digital skills" }
  },
  { timestamps: true }
);

export const JobRole = mongoose.model("JobRole", jobRoleSchema);

