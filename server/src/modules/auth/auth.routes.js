import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";
import { env } from "../../config/env.js";
import { emailService } from "../../services/email.service.js";

const router = Router();

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
        // User abandoned registration before verifying OTP. 
        // Update their details and let them continue.
        const nameParts = name.trim().split(" ");
        existingUser.firstName = nameParts[0] || "Unknown";
        existingUser.lastName = nameParts.slice(1).join(" ") || "Unknown";
        existingUser.passwordHash = await bcrypt.hash(password, 10);
        existingUser.targetRole = targetRole || existingUser.targetRole;
        await existingUser.save();
        
        return res.status(200).json({
          message: "Part 1 successful (re-registration)",
          userId: existingUser._id
        });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || "Unknown";
    const lastName = nameParts.slice(1).join(" ") || "Unknown";

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      passwordHash,
      targetRole: targetRole || "",
      isVerified: false
    });

    res.status(201).json({
      message: "Part 1 successful",
      userId: user._id
    });
  } catch (error) {
    next(error);
  }
});

router.post("/register/cancel/:userId", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user && !user.isVerified) {
      await User.findByIdAndDelete(req.params.userId);
    }
    res.status(200).json({ message: "Registration cancelled" });
  } catch (error) {
    next(error);
  }
});

router.post("/register/part2", async (req, res, next) => {
  try {
    const { userId, personalInfo, education, experience, internships, resumeText, declaredSkills } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate simulated OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[SIMULATED OTP for ${user.email}]: ${otp}`);

    if (personalInfo) {
      user.firstName = personalInfo.firstName || user.firstName;
      user.lastName = personalInfo.lastName || user.lastName;
      if (personalInfo.dob) user.dob = new Date(personalInfo.dob);
      user.phone = personalInfo.phone || user.phone;
      user.address = {
        residentialAddress: personalInfo.residentialAddress || "",
        city: personalInfo.city || "",
        state: personalInfo.state || "",
        pincode: personalInfo.pincode || "",
        country: personalInfo.country || "in"
      };
    }

    user.education = education || user.education;
    user.internships = experience || internships || user.internships;
    user.resumeText = resumeText || user.resumeText;
    user.declaredSkills = declaredSkills || user.declaredSkills;
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60000); // 10 mins

    await user.save();

    let previewUrl = null;
    try {
      previewUrl = await emailService.sendOTP(user.email, otp);
    } catch (e) {
      console.error("Failed to send OTP", e);
    }

    res.status(200).json({
      message: "Part 2 successful. OTP sent.",
      userId: user._id,
      previewUrl
    });
  } catch (error) {
    next(error);
  }
});

router.post("/register/verify", async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    user.isVerified = true;
    user.otp = "";
    await user.save();

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

