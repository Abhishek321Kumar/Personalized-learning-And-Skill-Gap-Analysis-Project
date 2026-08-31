import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  targetRole: { type: String, default: "" },
  
  // Demographics & Contact
  dob: { type: Date },
  gender: { type: String, default: "" },
  phone: { type: String, default: "" },
  
  // Address
  address: {
    residentialAddress: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    country: { type: String, default: "in" }
  },

  // Academic & Experience
  education: { type: Array, default: [] },
  internships: { type: Array, default: [] },
  
  // Resume Details
  resumeText: { type: String, default: "" },
  resumeFileName: { type: String, default: "" },
  declaredSkills: { type: Array, default: [] },
  
  // Verification
  otp: { type: String, default: "" },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },

  // Automatic cleanup after 1 hour if not verified
  createdAt: { type: Date, default: Date.now, expires: 3600 }
});

export const PendingUser = mongoose.model("PendingUser", pendingUserSchema);
