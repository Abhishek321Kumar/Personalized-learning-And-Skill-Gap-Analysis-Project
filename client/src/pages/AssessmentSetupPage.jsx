import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { motion, AnimatePresence } from "framer-motion";

const roleTemplates = {
  "Full-stack Engineer": `What We're Looking For
• 3-6 years of hands-on experience as a full stack engineer
• Strong programming skills in JavaScript/TypeScript, Python
• Frontend experience with React, Next.js, or Angular
• Backend experience building APIs and services using Node.js, Python (FastAPI/Django)
• Solid understanding of web architecture, state management, and performance optimization
• Experience with relational databases such as PostgreSQL or MySQL; familiarity with search or vector databases is a plus
• Exposure to AI/ML concepts such as LLMs, RAG, or prompt engineering is preferred
• Experience with Docker, Kubernetes, and cloud platforms (AWS, GCP, or Azure)
• Familiarity with CI/CD pipelines and modern DevOps practices
• Understanding of observability tools such as Prometheus, Grafana, or ELK
• Strong fundamentals in system design, networking, and security

What You Need To Bring

Education and Experience Required:
• Bachelor's or Master's degree in Computer Science, Information Systems, or equivalent.
• Typically 6-8 years experience in Full stack web application development.

Knowledge And Skills
• Tech Stack: ReactJS, NodeJS, Python, HTML5/CSS, jQuery, and Nginx.
• Data & API: Strong SQL/MongoDB design and REST API architecture.
• Infrastructure: Strong Linux skills. Hands-on experience with High Availability and Application Performance Optimization.
• DevOps: Proficient in GitHub, Copilot and automated API testing.
• Plus Skills: Cloud-native design (Microservices/Docker), Cybersecurity and AI knowledge.`,

  "Product Manager": `What We're Looking For
• 4-7 years of experience in product management, preferably in B2B SaaS or tech
• Track record of taking products from 0 to 1 and scaling them successfully
• Strong analytical and quantitative skills; ability to use hard data and metrics to back up assumptions and evaluate outcomes
• Demonstrated ability to understand and discuss technical concepts, manage tradeoffs, and evaluate opportunistic new ideas with internal and external partners
• Experience driving cross-functional teams (engineering, design, marketing) to deliver products
• Strong problem-solving skills and willingness to roll up your sleeves to get the job done
• Excellent written and verbal communication skills with the ability to present complex information clearly

What You Need To Bring

Education and Experience Required:
• Bachelor's degree in Business, Computer Science, Engineering, or equivalent. MBA is a plus.
• 5+ years of product management experience.

Knowledge And Skills
• Product Strategy: Ability to define product vision, strategy, and roadmap.
• Execution: Agile/Scrum methodologies, Jira/Confluence proficiency.
• Analytics: Amplitude, Mixpanel, SQL, or similar tools for user insights.
• UX/Design: Strong intuition for user experience and working closely with design teams.`,

  "Data Scientist": `What We're Looking For
• 3-5 years of industry experience applying machine learning and statistical techniques
• Strong programming skills in Python or R
• Hands-on experience with classical ML, deep learning frameworks (TensorFlow, PyTorch), and NLP/CV
• Ability to formulate business problems as data science problems and translate models into actionable insights
• Experience working with large datasets, ETL processes, and big data technologies (Spark, Hadoop)
• Solid understanding of experimental design, A/B testing, and causal inference
• Excellent communication skills to explain complex models to non-technical stakeholders

What You Need To Bring

Education and Experience Required:
• Master's or PhD in Computer Science, Statistics, Mathematics, Physics, or related quantitative field.
• 3+ years of applied data science experience in a business environment.

Knowledge And Skills
• Languages: Python (Pandas, NumPy, Scikit-learn), SQL.
• ML/AI: Regression, Classification, Clustering, NLP, Neural Networks.
• Big Data: Spark, Hadoop, Airflow.
• Cloud/MLOps: AWS/GCP, MLflow, Docker, Model Deployment.
• Visualization: Tableau, Looker, or Python libraries (Matplotlib, Seaborn).`,

  "UX Designer": `What We're Looking For
• 3-6 years of experience in UX/UI design for web and mobile applications
• A strong portfolio showcasing end-to-end design processes, problem-solving, and beautiful interfaces
• Deep empathy for users and a passion for creating intuitive, accessible, and delightful experiences
• Proficiency in modern design tools like Figma, Sketch, or Adobe Creative Suite
• Experience conducting user research, interviews, and usability testing
• Ability to create wireframes, storyboards, user flows, and interactive prototypes
• Strong understanding of responsive design principles and design systems

What You Need To Bring

Education and Experience Required:
• Bachelor's degree in Design, HCI, Interaction Design, or related field.
• 4+ years of professional UX/Product Design experience.

Knowledge And Skills
• Design Tools: Figma (advanced component libraries, auto-layout), FigJam, Miro.
• UX Methodologies: User research, persona creation, journey mapping, usability testing.
• UI/Visual: Strong typography, color theory, and layout skills.
• Collaboration: Ability to work closely with PMs and engineers, handing off precise specs.`,

  "Marketing Manager": `What We're Looking For
• 4-8 years of experience in digital marketing, growth marketing, or demand generation
• Proven track record of planning, executing, and scaling multi-channel marketing campaigns (SEO, SEM, Social, Email)
• Strong analytical skills to measure campaign ROI, CAC, and LTV using tools like Google Analytics and CRM systems
• Experience managing marketing budgets and optimizing spend across platforms
• Excellent copywriting and content creation skills tailored to different audiences
• Ability to collaborate cross-functionally with sales, product, and design teams
• Creative mindset combined with a highly data-driven approach

What You Need To Bring

Education and Experience Required:
• Bachelor's degree in Marketing, Business, Communications, or related field.
• 5+ years of experience in B2B or B2C marketing.

Knowledge And Skills
• Digital Marketing: Paid Search (Google Ads), Paid Social (LinkedIn, Meta), SEO/SEM.
• Tools: Google Analytics, HubSpot, Salesforce, Marketo, Mailchimp.
• Content/Brand: Copywriting, messaging strategy, campaign conceptualization.
• Analytics: A/B testing, conversion rate optimization (CRO), data analysis.
• Leadership: Experience managing agencies, freelancers, or internal team members.`
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

      navigate("/assessments/loading", { state: { analysis: response, targetRole: role, jobDescription: jd } });
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
                <label className="flex items-center text-[13px] font-bold text-gray-700 mb-3" style={{ fontFamily: 'var(--font-mono)' }} htmlFor="role-select">Target role <span className="text-red-500 ml-1 whitespace-nowrap">*</span></label>
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
                <label className="flex items-center text-[13px] font-bold text-gray-700 mb-3" style={{ fontFamily: 'var(--font-mono)' }} htmlFor="job-description">Job description / requirements <span className="text-red-500 ml-1 whitespace-nowrap">*</span></label>
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
