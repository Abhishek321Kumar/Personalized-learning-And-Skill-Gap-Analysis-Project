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
          className="w-full max-w-[1280px] mx-auto"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="font-mono text-[12px] text-[#474747] uppercase tracking-wider block mb-2 pt-16">Assessment Setup</span>
            <h1 className="text-3xl md:text-4xl font-medium text-[#1a1c1c] tracking-tight">Define Your Target Role</h1>
            <div className="h-px bg-[#c3c5d9] w-full mt-4"></div>
          </motion.div>

          {/* Bento Card Form */}
          <motion.div variants={fadeUp} className="bg-white border border-[#c3c5d9] p-8 rounded shadow-sm max-w-3xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Role Selection */}
              <div>
                <label className="block font-mono text-[12px] text-[#474747] mb-2 uppercase" htmlFor="role-select">Target Role <span className="text-red-500">*</span></label>
                <div className="relative">
                  <motion.input 
                    animate={roleError ? "shake" : false}
                    variants={shakeAnimation}
                    className={`w-full border ${roleError ? 'border-red-500 focus:ring-red-500' : 'border-[#c3c5d9] focus:ring-blue-600 focus:border-blue-600'} bg-[#f9f9f8] px-4 py-3 text-sm text-[#1a1c1c] focus:outline-none focus:ring-1 transition-colors`}
                    id="role-select" 
                    list="role-options" 
                    placeholder="e.g. Full-stack Engineer" 
                    type="text"
                    value={role}
                    onChange={(e) => {
                      setRoleError("");
                      setRole(e.target.value);
                    }}
                  />
                  <datalist id="role-options">
                    <option value="Full-stack Engineer"></option>
                    <option value="Product Manager"></option>
                    <option value="Data Scientist"></option>
                    <option value="UX Designer"></option>
                    <option value="Marketing Manager"></option>
                  </datalist>
                </div>
                <AnimatePresence>
                  {roleError && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 text-sm text-red-500">
                      {roleError}
                    </motion.p>
                  )}
                </AnimatePresence>
                {!roleError && <p className="mt-2 text-sm text-[#434656]">Select from the list or type a custom role.</p>}
              </div>

              {/* Job Description */}
              <div>
                <label className="block font-mono text-[12px] text-[#474747] mb-2 uppercase" htmlFor="job-description">Job Description / Requirements <span className="text-red-500">*</span></label>
                <motion.textarea 
                  animate={jdError ? "shake" : false}
                  variants={shakeAnimation}
                  className={`w-full border ${jdError ? 'border-red-500 focus:ring-red-500' : 'border-[#c3c5d9] focus:ring-blue-600 focus:border-blue-600'} bg-[#f9f9f8] px-4 py-3 text-sm text-[#1a1c1c] focus:outline-none focus:ring-1 transition-colors resize-y`}
                  id="job-description" 
                  placeholder="Paste or type the job description here. If you select a common role above, we'll provide a starting template." 
                  rows="6"
                  value={jd}
                  onChange={(e) => {
                    setJdError("");
                    setJd(e.target.value);
                  }}
                ></motion.textarea>
                <AnimatePresence>
                  {jdError && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 text-sm text-red-500">
                      {jdError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-[#c3c5d9]">
                <button 
                  className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors group disabled:opacity-50" 
                  type="submit"
                  disabled={loading || !role.trim() || !jd.trim()}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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
