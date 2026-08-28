import { Router } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import axios from "axios";
import { env } from "../../config/env.js";
import { requireAuth } from "../../middleware/auth.js";
import { User } from "../../models/User.js";

const router = Router();

try {
  fs.mkdirSync(env.uploadsDir, { recursive: true });
} catch (e) {
  console.warn("Could not create uploads dir in profile.routes:", e.message);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, safeName);
  }
});

const upload = multer({ storage });

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
      accessibilityNeeds: req.body.accessibilityNeeds || [],
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

    const declaredSkills = Array.isArray(req.body.declaredSkills)
      ? req.body.declaredSkills
      : [];

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...updates, declaredSkills },
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

    const response = await axios.post(`${env.mlServiceUrl}/extract-file`, {
      filePath: path.resolve(req.file.path)
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        resumeText: response.data.text,
        resumeFileName: req.file.originalname
      },
      { new: true }
    ).select("-passwordHash");

    res.json({
      user,
      extractedTextPreview: response.data.text.slice(0, 1200)
    });
  } catch (error) {
    next(error);
  }
});

export default router;

