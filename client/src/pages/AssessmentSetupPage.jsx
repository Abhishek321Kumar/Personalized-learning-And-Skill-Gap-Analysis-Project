import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { motion, AnimatePresence } from "framer-motion";

const roleTemplates = {
  "Full-stack Engineer": "Requires proficiency in both front-end and back-end development. Strong understanding of JavaScript frameworks (React, Angular), Node.js, databases (SQL, NoSQL), and RESTful APIs. Experience with version control (Git) and cloud platforms (AWS, Azure) is a plus. Problem-solving skills and ability to work in agile teams.",
  "Product Manager": "Responsible for guiding the success of a product and leading the cross-functional team that is responsible for improving it. Needs strong analytical skills, market research experience, and the ability to define product vision and roadmap. Excellent communication and stakeholder management skills required.",
  "Data Scientist": "Involves extracting insights from complex data sets. Requires strong statistical analysis, machine learning algorithms, and programming skills (Python, R). Experience with data visualization tools (Tableau, PowerBI) and big data technologies (Hadoop, Spark) preferred. Ability to translate technical findings into business strategy."
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const shakeAnimation = {
  shake: { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } }
};

export function AssessmentSetupPage({ user }) {
  const navigate = useNavigate();
  const [role, setRole] = useState(user?.targetRole || "");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [roleError, setRoleError] = useState("");
  const [jdError, setJdError] = useState("");

  useEffect(() => {
    if (roleTemplates[role]) {
      setJd(roleTemplates[role]);
      setJdError("");
    } else if (Object.values(roleTemplates).includes(jd)) {
      setJd("");
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!role.trim()) {
      setRoleError("Target role is required. Please select or type a role.");
      hasError = true;
    } else {
      setRoleError("");
    }

    if (!jd.trim()) {
      setJdError("Job description cannot be empty.");
      hasError = true;
    } else {
      setJdError("");
    }

    // "No Role Found" simulated validation
    if (role.trim().toLowerCase() === "unknown") {
      setRoleError("No role found matching 'unknown'. Please try another.");
      hasError = true;
    }

    if (hasError) return;
    
    setLoading(true);

    try {
      const response = await api.runAnalysis({
        userId: user?.userId || "user_mock",
        targetRole: role,
        jobDescription: jd || "Standard requirements for " + role
      });

      navigate("/assessments/loading", { state: { analysis: response, targetRole: role } });
    } catch (err) {
      setRoleError(err.message || "Analysis failed.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f9f9f8] text-[#1a1c1c] font-sans min-h-screen flex flex-col pt-16">
      <main className="flex-grow flex items-center justify-center py-10 px-4 md:px-10 pt-16 md:pt-11">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
          className="w-full max-w-[1280px] mx-auto flex flex-col md:flex-row gap-12 items-start"
        >
          <motion.div variants={fadeUp} className="w-full md:w-5/12 pt-8">
            <span className="font-mono text-[12px] text-blue-600 font-bold uppercase tracking-widest block mb-4">Assessment Setup</span>
            <h1 className="text-4xl md:text-[42px] font-medium text-[#1a1c1c] tracking-tight leading-tight mb-4">Define Your Target Role</h1>
            <p className="text-[#434656] text-lg mb-8 leading-relaxed">Provide the details of the role you're aiming for. We'll tailor the assessment questions and readiness analysis to perfectly match these requirements.</p>
            <div className="hidden md:block">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-blue-600">tips_and_updates</span>
                  <h3 className="font-semibold text-blue-900">Pro Tip</h3>
                </div>
                <p className="text-sm text-blue-800">For the most accurate assessment, copy and paste the actual job description from a role you're planning to apply for.</p>
              </div>
            </div>
          </motion.div>

          {/* Bento Card Form */}
          <motion.div variants={fadeUp} className="w-full md:w-7/12 bg-white border border-[#e2e2e2] p-8 md:p-10 rounded-xl shadow-sm">
            <form className="space-y-8" onSubmit={handleSubmit}>
              
              {roleError && roleError.includes("No role found") && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-lg flex items-start gap-3">
                  <span className="material-symbols-outlined text-orange-500 shrink-0">warning</span>
                  <div>
                    <h4 className="font-semibold text-sm">Role Not Found</h4>
                    <p className="text-sm mt-1">{roleError}</p>
                  </div>
                </motion.div>
              )}

              {/* Role Selection */}
              <div>
                <label className="flex items-center text-[13px] font-bold text-gray-700 mb-3" htmlFor="role-select">Target role <span className="text-red-500 ml-1 whitespace-nowrap">*</span></label>
                <div className="relative">
                  <motion.select 
                    animate={roleError && !roleError.includes("No role found") ? "shake" : false}
                    variants={shakeAnimation}
                    className={`w-full border-b-2 ${roleError && !roleError.includes("No role found") ? 'border-red-500' : 'border-gray-300'} bg-transparent px-2 py-3 text-base focus:outline-none focus:border-[#0052ff] transition-colors`}
                    id="role-select" 
                    value={role}
                    onChange={(e) => {
                      setRoleError("");
                      setRole(e.target.value);
                    }}
                  >
                    <option value="">Select a role</option>
                    <option value="Full-stack Engineer">Full-stack Engineer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="UX Designer">UX Designer</option>
                    <option value="Marketing Manager">Marketing Manager</option>
                  </motion.select>
                </div>
                <AnimatePresence>
                  {roleError && !roleError.includes("No role found") && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 text-xs font-medium text-red-500">
                      {roleError}
                    </motion.p>
                  )}
                </AnimatePresence>
                {!roleError && <p className="mt-2 text-xs text-gray-500 font-medium">Select from the list or type a custom role.</p>}
              </div>

              {/* Job Description */}
              <div>
                <label className="flex items-center text-[13px] font-bold text-gray-700 mb-3" htmlFor="job-description">Job description / requirements <span className="text-red-500 ml-1 whitespace-nowrap">*</span></label>
                <motion.textarea 
                  animate={jdError ? "shake" : false}
                  variants={shakeAnimation}
                  className={`w-full border-2 ${jdError ? 'border-red-500' : 'border-gray-200'} rounded-lg p-4 text-base focus:outline-none focus:border-[#0052ff] transition-colors resize-y`}
                  id="job-description" 
                  placeholder="Paste or type the job description here..." 
                  rows="6"
                  value={jd}
                  onChange={(e) => {
                    setJdError("");
                    setJd(e.target.value);
                  }}
                ></motion.textarea>
                <AnimatePresence>
                  {jdError && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 text-xs font-medium text-red-500">
                      {jdError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Action */}
              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button 
                  className="w-full md:w-auto bg-[#0052ff] text-white px-8 py-3.5 rounded font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors group disabled:opacity-50 shadow-sm" 
                  type="submit"
                  disabled={loading || !role.trim() || !jd.trim()}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Profile...
                    </span>
                  ) : "Take me to the Assessment"}
                  {!loading && <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
