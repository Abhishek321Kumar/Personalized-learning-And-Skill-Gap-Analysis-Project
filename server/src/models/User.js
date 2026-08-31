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

const educationSchema = new mongoose.Schema(
  {
    level: { 
      type: String, 
      enum: ["High School", "Undergraduate", "Postgraduate", "PhD", "Other"],
      required: true 
    },
    degree: { type: String, default: "" }, // e.g., Major, or Board
    institution: { type: String, default: "" },
    gradYear: { type: String, default: "" },
    score: { type: String, default: "" } // CGPA or Percentage
  },
  { _id: false }
);

const toTitleCase = (str) => {
  if (!str) return str;
  return str.split(' ').map(w => w ? w[0].toUpperCase() + w.substring(1).toLowerCase() : '').join(' ');
};

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, set: toTitleCase },
    lastName: { type: String, required: true, set: toTitleCase },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    
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

    headline: { type: String, default: "" },
    targetRole: { type: String, default: "" },
    experienceLevel: {
      type: String,
      enum: ["Student", "Fresher", "Early Career", "Mid Career"],
      default: "Student"
    },
    learningGoal: { type: String, default: "" },
    
    // Resume Details
    resumeText: { type: String, default: "" },
    resumeFileName: { type: String, default: "" },
    declaredSkills: { type: [skillSchema], default: [] },
    accessibilityNeeds: { type: [String], default: [] },
    
    // Academic & Experience
    education: { type: [educationSchema], default: [] },
    internships: [
      {
        company: { type: String, default: "" },
        role: { type: String, default: "" },
        duration: { type: String, default: "" }
      }
    ],
    githubUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    
    // Auth & Verification
    otp: { type: String, default: "" },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

