import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api/client";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const dashboardData = await api.getDashboard();
        const attempts = dashboardData.attempts || [];
        
        // Extract unique roles from attempts
        const uniqueRoles = [...new Set(attempts
          .map(a => a.quizId?.title?.replace("Technical Readiness Assessment - ", "").trim())
          .filter(Boolean)
        )];

        // Mock templates for rich data
        const allMockReports = [
          {
            role: "Senior Data Analyst",
            category: "Data Analytics",
            status: "pending_actions",
            skills: [
              { name: "Python (Data Science Stack)", current: 40, target: 85 },
              { name: "SQL & Database Optimization", current: 75, target: 90 },
              { name: "Statistical Analysis", current: 30, target: 70 },
              { name: "Data Visualization (Tableau/PowerBI)", current: 80, target: 80 },
              { name: "Machine Learning Fundamentals", current: 15, target: 60 },
              { name: "Business Communication", current: 60, target: 90 }
            ],
            missingSkills: ["Statistical Analysis", "Machine Learning", "Advanced Python"],
            verifiedSkills: ["Data Visualization", "SQL", "Business Comm"],
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
                priority: "HIGH PRIORITY",
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
            role: "Front-end Developer",
            category: "Technology / Development",
            status: "verified",
            skills: [
              { name: "React & Next.js", current: 85, target: 90 },
              { name: "CSS/Tailwind Architecture", current: 90, target: 80 },
              { name: "Performance Optimization", current: 60, target: 85 },
              { name: "State Management", current: 70, target: 85 }
            ],
            missingSkills: ["Performance Optimization", "Advanced State Management"],
            verifiedSkills: ["React", "CSS/Tailwind", "Responsive Design"],
            description: "Focuses on building robust user interfaces, complex state management, and delivering high-performance web experiences.",
            roadmap: [
              {
                title: "Web Performance Optimization",
                priority: "HIGH PRIORITY",
                desc: "Learn core web vitals, bundle sizing, lazy loading, and advanced rendering patterns in React to meet strict performance metrics.",
                time: "6 Hours",
                provider: "Frontend Masters"
              }
            ]
          },
          {
            role: "Product Manager",
            category: "Product / Strategy",
            status: "pending_actions",
            skills: [
              { name: "Agile & Scrum", current: 80, target: 90 },
              { name: "User Research", current: 50, target: 80 },
              { name: "Data-Driven Prioritization", current: 40, target: 85 },
              { name: "Go-To-Market Strategy", current: 30, target: 70 }
            ],
            missingSkills: ["Go-To-Market Strategy", "Data-Driven Prioritization"],
            verifiedSkills: ["Agile/Scrum", "Wireframing", "Stakeholder Comm"],
            description: "Requires balancing business strategy, user needs, and engineering realities to drive product success from ideation to launch.",
            roadmap: [
              {
                title: "Data-Driven Product Management",
                priority: "HIGH PRIORITY",
                desc: "Master using analytics and A/B testing to validate hypotheses and prioritize features based on quantitative impact.",
                time: "10 Hours",
                provider: "Product School"
              }
            ]
          }
        ];

        let userReports = [];
        uniqueRoles.forEach(role => {
          let template = allMockReports.find(r => r.role.toLowerCase() === role.toLowerCase());
          
          const roleAttempts = attempts.filter(a => a.quizId?.title?.includes(role));
          const latestAttempt = roleAttempts[0]; // assumes ordered by date
          const bestScore = roleAttempts.length > 0 ? Math.max(...roleAttempts.map(a => a.score)) : 0;
          const dateStr = latestAttempt ? new Date(latestAttempt.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

          if (template) {
            userReports.push({ ...template, score: bestScore, date: dateStr, id: "rep_" + role.replace(/\s+/g, '_') });
          } else {
            userReports.push({
              id: "rep_" + role.replace(/\s+/g, '_'),
              role: role,
              category: "Technology",
              date: dateStr,
              score: bestScore,
              status: "pending_actions",
              skills: [
                { name: "Core Fundamentals", current: bestScore, target: 80 },
                { name: "Advanced Concepts", current: Math.max(0, bestScore - 20), target: 70 }
              ],
              missingSkills: ["Domain Specific Deep Dive", "Advanced Architectural Patterns"],
              verifiedSkills: ["Basic Concepts"],
              description: `Personalized skill gap report and readiness analysis for ${role}.`,
              roadmap: [
                {
                  title: `Advanced ${role} Masterclass`,
                  priority: "HIGH PRIORITY",
                  desc: `Enhance your core skills in ${role} to meet industry standards. Focus on building real-world projects.`,
                  time: "15 Hours",
                  provider: "Udemy / Coursera"
                }
              ]
            });
          }
        });

        // Sort by date (descending) or score (descending)
        userReports.sort((a, b) => b.score - a.score);

        setReports(userReports);
        
        if (location.state?.autoShowLatest && userReports.length > 0) {
          setSelectedReport(userReports[0]);
        }
      } catch(e) {
        console.error("Failed to fetch reports", e);
      } finally {
        setLoading(false);
      }
    }
    
    fetchReports();
  }, [location.state]);

  return (
    <div className="bg-[#f9f9f8] text-[#1a1c1c] font-sans flex flex-col selection:bg-blue-600 selection:text-white min-h-screen">
      <AnimatePresence mode="wait">
        {selectedReport ? (
          <motion.main 
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12"
          >
            <header className="mb-12 flex justify-between items-center">
              <button 
                onClick={() => setSelectedReport(null)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm group"
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Overview
              </button>
              
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 text-[#434656] hover:text-blue-600 transition-colors font-medium text-sm border border-[#c3c5d9] hover:border-blue-600 px-4 py-2 rounded-md bg-white shadow-sm print:hidden"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download Report
              </button>
            </header>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="w-full flex flex-col gap-8"
            >
              <section className="flex flex-col gap-8 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div variants={fadeUp} className="bg-white border border-[#c3c5d9] p-10 flex flex-col gap-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <span className="font-mono text-[12px] text-[#737688] uppercase tracking-widest">Identified Role</span>
                    <div className="h-px w-8 bg-[#c3c5d9]"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1a1c1c] mt-2">{selectedReport.role}</h2>
                    <p className="text-[#434656] mt-4 text-base md:text-lg leading-relaxed">{selectedReport.description}</p>
                  </motion.div>
                  
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
                  </motion.div>
                </div>

                <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[#fff5f5] border border-[#ffcdcd] p-8 flex flex-col gap-4 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      <span className="font-mono text-[12px] text-red-600 uppercase tracking-widest font-bold">Critical Gaps</span>
                    </div>
                    {(selectedReport.missingSkills || []).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {(selectedReport.missingSkills || []).map((s, i) => {
                          const isHigh = i === 0 || s.toLowerCase().includes('core') || s.toLowerCase().includes('strategy') || s.toLowerCase().includes('performance');
                          return (
                            <span key={i} className={`px-3 py-1.5 bg-white text-sm font-medium border rounded-md shadow-sm ${isHigh ? 'text-red-700 border-red-200' : 'text-orange-700 border-orange-200'}`}>{s}</span>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-[#737688] text-sm">No critical gaps identified!</div>
                    )}
                  </div>

                  <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-8 flex flex-col gap-4 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span className="font-mono text-[12px] text-green-700 uppercase tracking-widest font-bold">Verified Skills</span>
                    </div>
                    {(selectedReport.verifiedSkills || []).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {(selectedReport.verifiedSkills || []).map((s, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white text-green-800 text-sm font-medium border border-green-200 rounded-md shadow-sm">{s}</span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[#737688] text-sm">Skills need verification.</div>
                    )}
                  </div>
                </motion.div>

                {/* Detailed Skill Bars */}
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
                        className="flex flex-col md:flex-row items-start gap-6 bg-[#f9f9f8] p-6 rounded-lg border border-[#e2e2e2] hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
                      >
                        <div className="bg-blue-600 p-3 rounded-full flex-shrink-0 mt-1 shadow-md shadow-blue-600/20">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6"></path></svg>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                            <a href={`https://www.google.com/search?q=${encodeURIComponent(item.title + ' course')}`} target="_blank" rel="noopener noreferrer" className="font-bold text-lg md:text-xl text-[#1a1c1c] hover:text-blue-600 underline decoration-blue-200 underline-offset-4 transition-colors">
                              {item.title}
                            </a>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${item.priority === 'HIGH PRIORITY' ? 'bg-[#fff5f5] text-red-600 border-red-200' : 'bg-[#f0fdf4] text-green-700 border-green-200'}`}>
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-sm md:text-base text-[#434656] leading-relaxed mt-1">{item.desc}</p>
                          <div className="flex flex-wrap gap-4 mt-3">
                            <span className="flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                              ⏱ {item.time}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm font-medium text-[#434656] bg-gray-100 px-2.5 py-1 rounded">
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
            className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12"
          >
            <header className="mb-16">
              <div className="flex flex-col items-start">
                <h1 className="text-4xl md:text-5xl font-bold text-[#1a1c1c] mb-6 tracking-tight">Skill Gap Analysis Report</h1>
                <p className="text-base md:text-lg text-[#434656] max-w-2xl leading-relaxed">
                  Review your personalized readiness reports for all completed assessments. Identify critical gaps and initiate your targeted learning pathways below.
                </p>
              </div>
            </header>

            {loading ? (
              <div className="flex justify-center items-center py-20 text-gray-500">Loading reports...</div>
            ) : reports.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-[#c3c5d9] rounded-xl bg-white"
              >
                <div className="bg-blue-50 text-blue-600 p-5 rounded-full mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-[#1a1c1c] mb-3">No Reports Available Yet</h3>
                <p className="text-[#434656] mb-8 max-w-md text-base leading-relaxed">You haven't completed any Technical Readiness Assessments. Take a quiz to generate your personalized skill gap analysis.</p>
                <a href="/assessments/setup" className="bg-blue-600 text-white px-8 py-3.5 rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm">
                  Start an Assessment
                </a>
              </motion.div>
            ) : (
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
            )}
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

