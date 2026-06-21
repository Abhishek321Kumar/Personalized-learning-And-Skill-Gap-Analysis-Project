import { Router } from "express";
import axios from "axios";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import { requireAuth } from "../../middleware/auth.js";
import { env } from "../../config/env.js";
import { User } from "../../models/User.js";
import { JobRole } from "../../models/JobRole.js";
import { AnalysisSnapshot } from "../../models/AnalysisSnapshot.js";
import { AssessmentAttempt } from "../../models/AssessmentAttempt.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/parse-resume", upload.single("resume"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file provided." });
    }

    let extractedText = "";
    if (req.file.mimetype === "application/pdf") {
      const data = await pdfParse(req.file.buffer);
      extractedText = data.text;
    } else {
      extractedText = req.file.buffer.toString("utf-8"); // fallback for txt/rtf
    }

    // Basic heuristic parsing
    const emailMatch = extractedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = extractedText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    
    // Try to extract name from the first few lines of the text if possible
    // Otherwise return empty strings so frontend falls back to the user's typed name
    let firstName = "";
    let lastName = "";
    const lines = extractedText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length > 0) {
      const topName = lines[0].split(' ');
      if (topName.length >= 2 && topName.length <= 4) {
        // It might be a name at the top of the resume
        firstName = topName[0];
        lastName = topName.slice(1).join(' ');
      }
    }

    // Education & Internship Heuristics
    const education = {};
    const internship = {};

    const textLower = extractedText.toLowerCase();
    const linesArr = extractedText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    for (let i = 0; i < linesArr.length; i++) {
      const line = linesArr[i];
      const lowerLine = line.toLowerCase();
      
      // Detect Master's / PG
      if (lowerLine.includes("master") || lowerLine.includes("(mca)") || lowerLine.includes("m.sc") || lowerLine.includes("mba")) {
        education.hasPostgrad = true;
        // Map exact degree
        if (lowerLine.includes("mca")) education.pgDegree = "MCA";
        else if (lowerLine.includes("mtech") || lowerLine.includes("m.tech")) education.pgDegree = "MTech";
        else if (lowerLine.includes("mba")) education.pgDegree = "MBA";
        else if (lowerLine.includes("msc") || lowerLine.includes("m.sc")) education.pgDegree = "MSc";
        else if (lowerLine.includes("mcom") || lowerLine.includes("m.com")) education.pgDegree = "MCom";
        else if (lowerLine.includes("me") || lowerLine.includes("m.e")) education.pgDegree = "ME";
        else education.pgDegree = "Other";

        // Try to find University name on the line above
        if (i > 0 && !education.pgUniversity) {
          const prevLine = linesArr[i - 1];
          if (prevLine.toLowerCase() !== "education" && prevLine.length > 5) {
             // Split by comma to drop location (e.g., "Presidency College, Bangalore" -> "Presidency College")
             education.pgUniversity = prevLine.split(',')[0].trim();
          }
        }
        
        // Extract graduation year (e.g. 2025)
        const yearMatch = line.match(/(?:19|20)\d{2}/g);
        if (yearMatch) {
          education.pgYear = yearMatch[yearMatch.length - 1]; // get the last year mentioned (usually graduation)
        }
      }

      // Detect Bachelor's / UG
      if (lowerLine.includes("bachelor") || lowerLine.includes("(bca)") || lowerLine.includes("b.sc") || lowerLine.includes("btech")) {
        if (lowerLine.includes("bca")) education.ugDegree = "BCA";
        else if (lowerLine.includes("btech") || lowerLine.includes("b.tech")) education.ugDegree = "BTech";
        else if (lowerLine.includes("bba")) education.ugDegree = "BBA";
        else if (lowerLine.includes("bsc") || lowerLine.includes("b.sc")) education.ugDegree = "BSc";
        else if (lowerLine.includes("bcom") || lowerLine.includes("b.com")) education.ugDegree = "BCom";
        else if (lowerLine.includes("be") || lowerLine.includes("b.e")) education.ugDegree = "BE";
        else education.ugDegree = "Other";

        // Try to find University name on the line above
        if (i > 0 && !education.ugUniversity) {
          const prevLine = linesArr[i - 1];
          if (prevLine.toLowerCase() !== "education" && prevLine.length > 5) {
             education.ugUniversity = prevLine.split(',')[0].trim();
          }
        }
        
        // Extract graduation year
        const yearMatch = line.match(/(?:19|20)\d{2}/g);
        if (yearMatch) {
          education.ugYear = yearMatch[yearMatch.length - 1];
        }
      }
    }

    // Check for Internships
    const internMatch = extractedText.match(/Internship at ([A-Za-z0-9\s]+?)(?:[.,\n]|$)/i);
    if (internMatch || textLower.includes("internship") || textLower.includes("intern")) {
      internship.hasInternship = true;
      internship.company = internMatch ? internMatch[1].trim() : "";
      internship.title = extractedText.match(/([A-Za-z\s]+ Intern(?:ship)?)/i)?.[1]?.trim() || "Intern";
      internship.duration = "3"; // Mock duration
    }

    res.status(200).json({
      firstName,
      lastName,
      email: emailMatch ? emailMatch[0] : "",
      phone: phoneMatch ? phoneMatch[0] : "",
      city: "Mumbai",
      state: "Maharashtra",
      country: "in",
      pincode: "400001",
      residentialAddress: "Extracted Address St",
      education,
      internship,
      rawText: extractedText.substring(0, 500) // snippet
    });
  } catch (error) {
    next(error);
  }
});

router.post("/run", requireAuth, async (req, res, next) => {
  try {
    const { jobRoleId, jobDescription, targetRole } = req.body;
    const user = await User.findById(req.user._id);
    const role = jobRoleId ? await JobRole.findById(jobRoleId) : null;
    const assessmentAttempts = await AssessmentAttempt.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const payload = {
      resumeText: user?.resumeText || "",
      declaredSkills: user?.declaredSkills || [],
      jobDescription: jobDescription || role?.jobDescription || "",
      targetRole: targetRole || role?.title || user?.targetRole || "Selected role",
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

