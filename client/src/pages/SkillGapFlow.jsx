import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export function SkillGapFlow() {
  const location = useLocation();
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Mock fetching past reports or the newly created one
    const mockReports = [
      {
        id: "rep_1",
        role: "Senior Data Analyst",
        category: "Data Analytics",
        date: "Dec 05, 2023",
        score: 65,
        status: "pending_actions",
        skills: [
          { name: "Python (Data Science Stack)", current: 40, target: 85 },
          { name: "SQL & Database Optimization", current: 75, target: 90 },
          { name: "Statistical Analysis", current: 30, target: 70 },
          { name: "Data Visualization (Tableau/PowerBI)", current: 80, target: 80 },
          { name: "Machine Learning Fundamentals", current: 15, target: 60 },
          { name: "Business Communication", current: 60, target: 90 }
        ],
        description: "Requires advanced analytical capabilities, cross-functional communication, strategic planning, and the ability to turn complex datasets into actionable business insights.",
        roadmap: [
          { 
            title: "Advanced Python for Data Science", 
            priority: "HIGH PRIORITY",
            desc: "Master data manipulation and performance optimization. This course deeply covers advanced Pandas techniques, NumPy array operations, and Scikit-learn model optimization strategies essential for large-scale data analysis.", 
            time: "12 Hours",
            provider: "Coursera / DeepLearning.AI"
          },
          { 
            title: "Applied Statistical Methods & A/B Testing", 
            priority: "MEDIUM PRIORITY",
            desc: "Bridge the gap in statistical foundations required for robust analysis. Focuses heavily on designing valid A/B tests, interpreting regression models, and applying hypothesis testing to real-world business scenarios.", 
            time: "8 Hours",
            provider: "Udacity"
          },
          { 
            title: "Introduction to Machine Learning Workflows", 
            priority: "MEDIUM PRIORITY",
            desc: "Get up to speed with basic ML concepts to meet the target role's requirements. Covers the end-to-end workflow from feature engineering to model evaluation using standard industry tools.", 
            time: "15 Hours",
            provider: "DataCamp"
          }
        ]
      },
      {
        id: "rep_2",
        role: "Front-end Developer",
        category: "Technology / Development",
        date: "Oct 24, 2023",
        score: 85,
        status: "verified",
        skills: [],
        description: "Focuses on building user interfaces and experiences.",
        roadmap: []
      },
      {
        id: "rep_3",
        role: "SAP Analyst",
        category: "Enterprise Systems",
        date: "Nov 12, 2023",
        score: 72,
        status: "verified",
        skills: [],
        description: "Focuses on enterprise resource planning and analysis.",
        roadmap: []
      }
    ];

    try {
      const saved = window.localStorage.getItem("skillbridge-assessment-setup");
      if (saved) {
        const parsed = JSON.parse(saved);
        mockReports[0].role = parsed.role || mockReports[0].role;
      }
    } catch(e) {}

    setReports(mockReports);
    
    if (location.state?.autoShowLatest) {
      setSelectedReport(mockReports[0]);
    }
  }, [location.state]);

  return (
    <div className="bg-[#f9f9f8] text-[#1a1c1c] font-sans min-h-screen flex flex-col selection:bg-blue-600 selection:text-white pt-20">
      <AnimatePresence mode="wait">
        {selectedReport ? (
          <motion.main 
            key="detailed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12 md:py-20"
          >
            {/* Header Section */}
            <header className="mb-16">
              <button 
                onClick={() => setSelectedReport(null)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm mb-6 group"
              >
                <span className="text-lg transition-transform group-hover:-translate-x-1">←</span>
                Back to Overview
              </button>
            </header>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="w-full flex flex-col gap-8"
            >
              <section className="flex flex-col gap-8 w-full">
                {/* Top Row: Summary & Match */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Target Role Card */}
                  <motion.div variants={fadeUp} className="bg-white border border-[#c3c5d9] p-10 flex flex-col gap-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <span className="font-mono text-[12px] text-[#737688] uppercase tracking-widest">Identified Role</span>
                    <div className="h-px w-8 bg-[#c3c5d9]"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1a1c1c] mt-2">{selectedReport.role}</h2>
                    <p className="text-[#434656] mt-4 text-base md:text-lg leading-relaxed">{selectedReport.description}</p>
                  </motion.div>
                  
                  {/* Match Card */}
                  <motion.div variants={fadeUp} className="bg-white border border-[#c3c5d9] p-10 flex flex-col items-center justify-center text-center gap-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <span className="font-mono text-[12px] text-[#737688] uppercase tracking-widest w-full text-left">Overall Match</span>
                    <div className="relative w-40 h-40 flex items-center justify-center my-2">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle className="text-[#e8e8e7]" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="10"></circle>
                        <motion.circle 
                          initial={{ strokeDashoffset: 283 }}
                          animate={{ strokeDashoffset: 283 - (283 * selectedReport.score) / 100 }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                          className="text-blue-600" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="283" strokeWidth="10"
                        ></motion.circle>
                      </svg>
                      <span className="absolute text-4xl font-bold text-[#1a1c1c]">{selectedReport.score}%</span>
                    </div>
                    <div className="flex gap-8 w-full justify-center text-sm mt-2">
                      <div className="flex items-center gap-3"><div className="w-4 h-4 bg-blue-600 rounded-sm"></div><span className="font-medium">Matched</span></div>
                      <div className="flex items-center gap-3"><div className="w-4 h-4 bg-[#e8e8e7] rounded-sm"></div><span className="font-medium text-[#434656]">Gap</span></div>
                    </div>
                  </motion.div>
                </div>

                {/* Detailed Skill Radar/Bars */}
                <motion.div variants={fadeUp} className="bg-white border border-[#c3c5d9] p-10 flex flex-col gap-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[12px] text-[#737688] uppercase tracking-widest">Proficiency vs. Requirements</span>
                    <div className="h-px w-full bg-[#c3c5d9] mt-2"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 pt-2">
                    {selectedReport.skills.map((skill, idx) => (
                      <div key={idx} className="flex flex-col gap-3">
                        <div className="flex justify-between items-end">
                          <span className="font-medium text-[#1a1c1c] text-base md:text-lg">{skill.name}</span>
                          <span className="text-sm font-medium text-[#434656]">Current: {skill.current}% / Target: {skill.target}%</span>
                        </div>
                        <div className="relative w-full h-3 bg-[#e8e8e7] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.current}%` }}
                            transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                            className="absolute top-0 left-0 h-full bg-blue-600 rounded-full" 
                          ></motion.div>
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: "100%" }}
                            transition={{ duration: 0.5, delay: 1.5 + idx * 0.1 }}
                            className="absolute top-0 w-1 bg-[#ba1a1a] z-10" style={{ left: `${skill.target}%` }} title="Target Level"
                          ></motion.div>
                        </div>
                      </div>
                    ))}
                    {selectedReport.skills.length === 0 && (
                      <div className="col-span-full text-center text-[#737688] py-8">
                        No skill details available for this report.
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Recommendations */}
                <motion.div variants={fadeUp} className="bg-white border border-[#c3c5d9] p-10 flex flex-col gap-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[12px] text-[#737688] uppercase tracking-widest">Recommended Learning Pathway</span>
                    <div className="h-px w-full bg-[#c3c5d9] mt-2 mb-4"></div>
                  </div>
                  <ul className="flex flex-col gap-8">
                    {selectedReport.roadmap.map((item, idx) => (
                      <motion.li 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + idx * 0.2 }}
                        className="flex flex-col md:flex-row items-start gap-6 bg-[#f3f4f3] p-6 rounded-lg border border-[#e2e2e2]"
                      >
                        <div className="bg-blue-600 p-3 rounded-full flex-shrink-0 mt-1 shadow-md shadow-blue-600/20">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6"></path></svg>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                            <h4 className="font-bold text-lg md:text-xl text-[#1a1c1c]">{item.title}</h4>
                            <span className="px-3 py-1 bg-[#eeeeed] text-[#434656] text-xs font-bold rounded-full border border-[#c3c5d9]">
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-sm md:text-base text-[#434656] leading-relaxed">{item.desc}</p>
                          <div className="flex flex-wrap gap-4 mt-2">
                            <span className="flex items-center gap-1 text-sm font-medium text-blue-600">
                              ⏱ {item.time}
                            </span>
                            <span className="flex items-center gap-1 text-sm font-medium text-[#434656]">
                              📚 {item.provider}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                    {selectedReport.roadmap.length === 0 && (
                      <div className="text-[#737688] text-center py-4">No specific recommendations at this time.</div>
                    )}
                  </ul>
                </motion.div>
              </section>
            </motion.div>
          </motion.main>
        ) : (
          <motion.main 
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12 md:py-20"
          >
            <header className="mb-16">
              <div className="flex flex-col items-start">
                <h1 className="text-4xl md:text-5xl font-bold text-[#1a1c1c] mb-6 tracking-tight">Skill Gap Analysis Report</h1>
                <p className="text-base md:text-lg text-[#434656] max-w-2xl leading-relaxed">
                  Review your personalized readiness reports for all completed assessments. Identify critical gaps and initiate your targeted learning pathways below.
                </p>
              </div>
            </header>

            <motion.section 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {reports.map((report) => (
                <motion.div 
                  variants={fadeUp}
                  key={report.id} 
                  className="bg-white border border-[#c3c5d9] p-8 flex flex-col justify-between group hover:border-blue-600 hover:shadow-lg transition-all duration-300 min-h-[320px] rounded-xl"
                >
                  <div>
                    <div className="font-mono text-[12px] text-blue-600 uppercase mb-6 flex justify-between items-center tracking-widest">
                      <span className={report.status === 'verified' ? 'text-blue-600' : 'text-[#737688]'}>{report.category}</span>
                      {report.status === 'verified' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      ) : (
                        <svg className="w-5 h-5 text-[#737688]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-medium text-[#1a1c1c] mb-4 group-hover:text-blue-600 transition-colors">{report.role}</h2>
                    <div className="flex items-center gap-3 text-[#434656] text-sm md:text-base mb-8">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      <span>Completed {report.date}</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-6 border-t border-[#e2e2e2]">
                    <button 
                      onClick={() => setSelectedReport(report)}
                      className="w-full bg-blue-600 text-white font-medium text-sm px-6 py-3 flex items-center justify-between hover:bg-blue-700 transition-colors rounded-sm shadow-sm hover:shadow-md"
                    >
                      <span>Get Skill Report</span>
                      <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.section>
          </motion.main>
        )}
      </AnimatePresence>
      <SiteFooter />
    </div>
  );
}
