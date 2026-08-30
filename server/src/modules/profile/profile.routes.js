import { Router } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import axios from "axios";
import { env } from "../../config/env.js";
import { requireAuth } from "../../middleware/auth.js";
import { User } from "../../models/User.js";
import { AssessmentAttempt } from "../../models/AssessmentAttempt.js";
import { AnalysisSnapshot } from "../../models/AnalysisSnapshot.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

router.put("/me", requireAuth, async (req, res, next) => {
  try {
    const updates = {
      headline: req.body.headline,
      targetRole: req.body.targetRole,
      learningGoal: req.body.learningGoal,
      experienceLevel: req.body.experienceLevel,
      accessibilityNeeds: req.body.accessibilityNeeds,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      phone: req.body.phone,
      dob: req.body.dob,
      address: req.body.address,
      education: req.body.education,
      internships: req.body.internships
    };
    
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    if (Array.isArray(req.body.declaredSkills)) {
      updates.declaredSkills = req.body.declaredSkills;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select("-passwordHash");

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.delete("/me", requireAuth, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    await AssessmentAttempt.deleteMany({ userId: req.user._id });
    await AnalysisSnapshot.deleteMany({ userId: req.user._id });
    res.json({ message: "Account deleted successfully." });
  } catch (error) {
    next(error);
  }
});

router.post("/resume", requireAuth, upload.single("resume"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a resume file." });
    }

    let extractedText = "";
    if (req.file.mimetype === "application/pdf") {
      const data = await pdfParse(req.file.buffer);
      extractedText = data.text;
    } else {
      extractedText = req.file.buffer.toString("utf-8");
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        resumeText: extractedText,
        resumeFileName: req.file.originalname
      },
      { new: true }
    ).select("-passwordHash");

    res.json({
      user,
      extractedTextPreview: extractedText.slice(0, 1200)
    });
  } catch (error) {
    next(error);
  }
});

export default router;

