import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../../models/User.js";
import { env } from "../../config/env.js";
import { emailService } from "../../services/email.service.js";

const router = Router();

const pendingRegistrations = new Map();

router.post("/register/part1", async (req, res, next) => {
  try {
    const { name, email, password, targetRole } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(409).json({ message: "An account already exists for this email." });
      } else {
        // Cleanup old unverified user from DB
        await User.findByIdAndDelete(existingUser._id);
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || "Unknown";
    const lastName = nameParts.slice(1).join(" ") || "Unknown";

    const pendingId = new mongoose.Types.ObjectId().toString();

    pendingRegistrations.set(pendingId, {
      firstName,
      lastName,
      email: email.toLowerCase(),
      passwordHash,
      targetRole: targetRole || "",
      isVerified: false
    });

    res.status(201).json({
      message: "Part 1 successful",
      userId: pendingId
    });
  } catch (error) {
    next(error);
  }
});

router.post("/register/cancel/:userId", async (req, res, next) => {
  try {
    if (pendingRegistrations.has(req.params.userId)) {
      pendingRegistrations.delete(req.params.userId);
    }
    res.status(200).json({ message: "Registration cancelled" });
  } catch (error) {
    next(error);
  }
});

router.post("/register/part2", async (req, res, next) => {
  try {
    const { userId, personalInfo, education, experience, internships, resumeText, resumeFileName, declaredSkills } = req.body;

    const pendingUser = pendingRegistrations.get(userId);
    if (!pendingUser) {
      return res.status(404).json({ message: "User not found or registration session expired." });
    }

    // Generate simulated OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[SIMULATED OTP for ${pendingUser.email}]: ${otp}`);

    if (personalInfo) {
      pendingUser.firstName = personalInfo.firstName || pendingUser.firstName;
      pendingUser.lastName = personalInfo.lastName || pendingUser.lastName;
      pendingUser.gender = personalInfo.gender || pendingUser.gender;
      if (personalInfo.dob) pendingUser.dob = new Date(personalInfo.dob);
      pendingUser.phone = personalInfo.phone || pendingUser.phone;
      pendingUser.address = {
        residentialAddress: personalInfo.residentialAddress || "",
        city: personalInfo.city || "",
        state: personalInfo.state || "",
        pincode: personalInfo.pincode || "",
        country: personalInfo.country || "in"
      };
    }

    pendingUser.education = education || pendingUser.education;
    pendingUser.internships = experience || internships || pendingUser.internships;
    pendingUser.resumeText = resumeText || pendingUser.resumeText;
    pendingUser.resumeFileName = resumeFileName || pendingUser.resumeFileName || "";
    pendingUser.declaredSkills = declaredSkills || pendingUser.declaredSkills;
    pendingUser.otp = otp;
    pendingUser.otpExpires = new Date(Date.now() + 10 * 60000); // 10 mins

    let previewUrl = null;
    try {
      previewUrl = await emailService.sendOTP(pendingUser.email, otp);
    } catch (e) {
      console.error("Failed to send OTP", e);
    }

    res.status(200).json({
      message: "Part 2 successful. OTP sent.",
      userId,
      previewUrl
    });
  } catch (error) {
    next(error);
  }
});

router.post("/register/verify", async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    const pendingUser = pendingRegistrations.get(userId);
    if (!pendingUser) {
      return res.status(404).json({ message: "User not found or registration session expired." });
    }

    if (pendingUser.otp !== otp || pendingUser.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    pendingUser.isVerified = true;
    pendingUser.otp = "";
    
    // Save to MongoDB only now
    const user = await User.create(pendingUser);
    
    // Remove from pending map
    pendingRegistrations.delete(userId);

    const token = jwt.sign({ userId: user._id }, env.jwtSecret, { expiresIn: "7d" });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        targetRole: user.targetRole,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ userId: user._id }, env.jwtSecret, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        targetRole: user.targetRole
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;

