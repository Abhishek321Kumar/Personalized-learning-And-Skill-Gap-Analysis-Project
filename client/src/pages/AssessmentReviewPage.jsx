import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export function AssessmentReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const analysis = location.state?.analysis;
  const targetRole = location.state?.targetRole || "Senior Data Analyst";
  const jobDescription = location.state?.jobDescription || "";

  const ALL_SKILLS = [
    "ReactJS", "React", "Next.js", "Node.js", "Django", "MongoDB", "Python", 
    "JavaScript", "TypeScript", "Angular", "FastAPI", "PostgreSQL", "MySQL", 
    "AWS", "GCP", "Azure", "Docker", "Kubernetes", "CI/CD", "Prometheus", "Grafana", 
    "ELK", "SQL", "HTML5", "CSS", "jQuery", "Nginx", "Linux", "GitHub", "Microservices", 
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Spark", 
    "Hadoop", "Tableau", "Looker", "Figma", "Sketch", "UX", "UI", "SEO", "SEM", 
    "Google Analytics", "Data Visualization", "A/B Testing", "ETL", "REST API",
    "Copilot", "Cybersecurity", "Jira", "Confluence"
  ];

  const extractSkills = (text) => {
    if (!text) return ["Python", "SQL", "Tableau", "Statistical Analysis", "Data Visualization"];
    const matched = ALL_SKILLS.filter(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(text);
    });
    return matched.length > 0 ? Array.from(new Set(matched)) : ["Analytical Skills", "Problem Solving", "Communication"];
  };

  const extractedSkills = analysis?.matchedSkills || extractSkills(jobDescription);

  const handleStart = () => {
    navigate("/assessments/quiz", { state: { targetRole, jobDescription } });
  };

  return (
    <div className="bg-[#f9f9f8] text-[#1a1c1c] font-sans antialiased min-h-screen flex flex-col">
      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12 md:py-20 flex flex-col gap-12 overflow-hidden">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
        >
          <div className="md:col-span-7 flex flex-col gap-12">
            <motion.header variants={fadeUp} className="max-w-3xl">
              <button 
                onClick={() => navigate("/assessments/setup")} 
                className="flex items-center text-[#434656] hover:text-[#0052ff] font-medium text-sm transition-colors w-fit mb-6"
              >
                <span className="material-symbols-outlined mr-1 text-[18px]">arrow_back</span>
                Back to Setup
              </button>
              <h1 className="text-4xl md:text-5xl font-medium text-[#1a1c1c] mb-4 tracking-tight">Ready to start your assessment?</h1>
              <p className="text-[#434656] text-base max-w-2xl leading-relaxed">
                We've analyzed your target role and identified the key skills required for success. Review the extracted targets before beginning your readiness assessment.
              </p>
            </motion.header>
            
            <motion.div variants={fadeUp} className="grid grid-cols-1 gap-6">
              <div className="bg-white border border-[#c3c5d9] p-8 flex flex-col justify-between rounded-sm shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between border-b border-[#c3c5d9] pb-4 mb-6">
                    <span className="font-mono text-[12px] text-[#434656] uppercase tracking-widest">Target Role</span>
                    <svg className="w-5 h-5 text-[#737688]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-medium text-[#1a1c1c] mb-2">{targetRole}</h2>
                  <p className="text-[#434656] text-sm">Based on the job description provided in Step 1.</p>
                </div>
                <div className="mt-8 pt-6 border-t border-[#c3c5d9]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#434656]">Estimated Quiz Time</span>
                    <span className="font-bold text-[#1a1c1c]">20 mins</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#c3c5d9] p-8 flex flex-col rounded-sm shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between border-b border-[#c3c5d9] pb-4 mb-6">
                  <span className="font-mono text-[12px] text-[#434656] uppercase tracking-widest">Extracted Core Skills</span>
                  <span className="font-mono text-[12px] bg-[#eeeeed] py-1 px-3 text-[#1a1c1c] tracking-widest uppercase">{extractedSkills.length} Identified</span>
                </div>
                <div className="flex-grow">
                  <p className="text-[#434656] mb-6 text-sm">
                    The following technical and analytical competencies have been mapped as critical requirements for this role. Your assessment will focus on these key areas.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {extractedSkills.map((skill, index) => (
                      <motion.span 
                        key={skill} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.3 }}
                        className="px-4 py-2 border border-[#c3c5d9] text-[#1a1c1c] text-sm rounded-sm bg-gray-50"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div variants={fadeUp} className="md:col-span-5 sticky top-24">
            <div className="aspect-[3/4] overflow-hidden rounded-lg border border-[#c3c5d9] shadow-md group">
              <img alt="Professional focused on assessment preparation" className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDArNXfOxMmLV3Fs5UKTs5WFffEFiyJj3p_cAC3qGArqVGDteh4HK-88ie7MQ0hUBnz-3Gn6JHjO9-Y_jJlrd9dUVCmsYZJiKesUwUq0DJteIvm2PrHIYI8cmwlL1Na9tN5BLKJENP9aNc2fymYnVd25k-uAxxL3NoOxc1G2rVXvlynykmDzQ6QAARxIs2MGECKV_OAx-abFFgnOi3fLBRPnodUqqaE67QsCq58RzdrkbDKsKr-Z1MpAFctgJbYaEnFoE8REhz6YQ" />
            </div>
            <div className="mt-6">
              <button 
                onClick={handleStart}
                className="w-full bg-blue-600 text-white flex items-center justify-center px-6 py-4 font-medium hover:bg-blue-700 transition-colors group rounded-lg shadow-lg shadow-blue-600/20"
              >
                Start Assessment
                <span className="ml-2 group-hover:translate-x-1 transition-transform text-xl">→</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
