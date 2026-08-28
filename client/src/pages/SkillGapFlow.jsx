import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api/client";
import { SKILL_RESOURCES, ROLE_INTERVIEW_GUIDES } from "../config/skillResources";
import { generateRoadmapPhases } from "../utils/roadmapSequencer";

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

function ReportDetails({ report, onBack }) {
  const { phases } = generateRoadmapPhases(report.missingSkills || []);
  const topSkill = phases.flatMap(p => p.skills)[0]; // the first skill in phase 1
  
  const [expandedSkill, setExpandedSkill] = useState(topSkill ? topSkill.name : null);

  const roleGuides = ROLE_INTERVIEW_GUIDES.find(r => r.role.toLowerCase() === report.role.toLowerCase())?.interviewGuides || [];

  const handleScrollToSkill = (skillName) => {
    setExpandedSkill(skillName);
    const el = document.getElementById(`skill-section-${skillName}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <motion.main 
      key="details"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12"
    >
      <header className="mb-12 flex justify-between items-center print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Overview
        </button>
        
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 text-[#434656] hover:text-blue-600 transition-colors font-medium text-sm border border-[#c3c5d9] hover:border-blue-600 px-4 py-2 rounded-md bg-white shadow-sm"
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
        {/* 1. HEADER / START HERE */}
        {topSkill && (
          <motion.div variants={fadeUp} className="bg-blue-600 text-white p-8 md:p-12 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div className="relative z-10 max-w-3xl">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wider uppercase mb-4 border border-white/30">Top Priority Action</span>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{topSkill.name}</h1>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl">This is your highest-impact quick win. Focusing here will yield the most immediate improvement for the {report.role} role.</p>
              <button 
                onClick={() => handleScrollToSkill(topSkill.name)}
                className="bg-white text-blue-700 px-6 py-3 rounded-md font-bold hover:bg-blue-50 transition-colors"
              >
                Start Learning Now
              </button>
            </div>
          </motion.div>
        )}

        {/* 2. ROADMAP TIMELINE */}
        <motion.div variants={fadeUp} className="bg-white border border-[#c3c5d9] p-8 rounded-xl shadow-sm">
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="text-xl font-bold text-[#1a1c1c]">Learning Roadmap</h2>
            <p className="text-[#434656] text-sm">A sequenced plan based on effort required to master each skill.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {phases.map((phase, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="mb-4">
                  <h3 className="font-bold text-[#1a1c1c] text-lg">{phase.label}</h3>
                  <span className="text-sm font-medium text-blue-600">{phase.estimatedDuration}</span>
                </div>
                <div className="flex-1 bg-[#f9f9f8] rounded-lg p-4 border border-[#e2e2e2] flex flex-col gap-3">
                  {phase.skills.length > 0 ? (
                    phase.skills.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleScrollToSkill(s.name)}
                        className="text-left w-full bg-white border border-[#c3c5d9] p-3 rounded-md hover:border-blue-400 hover:shadow-sm transition-all flex items-center justify-between group"
                      >
                        <span className="font-medium text-sm text-[#1a1c1c] group-hover:text-blue-600 transition-colors">{s.name}</span>
                        <svg className="w-4 h-4 text-[#a0a3bd] group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </button>
                    ))
                  ) : (
                    <div className="text-sm text-[#a0a3bd] italic text-center py-4">No skills in this phase.</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3. PER-SKILL DETAIL SECTIONS */}
        <motion.div variants={fadeUp} className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-[#1a1c1c]">Skill Breakdowns</h2>
          
          {report.missingSkills && report.missingSkills.length > 0 ? (
            report.missingSkills.map((skill, idx) => {
              const staticResource = SKILL_RESOURCES.find(r => r.skill === skill.name) || {};
              const isExpanded = expandedSkill === skill.name;
              
              const effortBadgeColor = 
                skill.effortTag === 'Quick win' ? 'bg-green-100 text-green-800 border-green-200' : 
                skill.effortTag === 'Moderate' ? 'bg-orange-100 text-orange-800 border-orange-200' : 
                'bg-red-100 text-red-800 border-red-200';

              return (
                <div key={idx} id={`skill-section-${skill.name}`} className="bg-white border border-[#c3c5d9] rounded-xl shadow-sm overflow-hidden transition-all">
                  <button 
                    onClick={() => setExpandedSkill(isExpanded ? null : skill.name)}
                    className="w-full px-8 py-6 flex items-center justify-between hover:bg-[#f9f9f8] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-bold text-[#1a1c1c]">{skill.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${effortBadgeColor}`}>
                        {skill.effortTag || "Moderate"}
                      </span>
                      {skill.current !== undefined && (
                         <span className="text-sm font-medium text-[#737688]">Current: {skill.current}%</span>
                      )}
                    </div>
                    <div>
                      <svg className={`w-6 h-6 text-[#737688] transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-[#e2e2e2]"
                      >
                        <div className="p-8 flex flex-col gap-8">
                          {/* b. Core Concepts */}
                          {staticResource.coreConcepts && staticResource.coreConcepts.length > 0 && (
                            <div>
                              <h4 className="font-bold text-[#1a1c1c] mb-3 uppercase text-xs tracking-wider">Core Concepts to Focus On</h4>
                              <ul className="list-disc list-inside flex flex-col gap-2 text-[#434656] text-sm md:text-base">
                                {staticResource.coreConcepts.map((concept, cidx) => (
                                  <li key={cidx}>{concept}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* c. Practice */}
                          {staticResource.practiceLinks && staticResource.practiceLinks.length > 0 && (
                            <div>
                              <h4 className="font-bold text-[#1a1c1c] mb-3 uppercase text-xs tracking-wider">Practice</h4>
                              <div className="flex flex-wrap gap-3">
                                {staticResource.practiceLinks.map((link, lidx) => (
                                  <a key={lidx} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#f0f4ff] border border-blue-200 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors text-sm font-medium">
                                    <span>{link.platform}: {link.label}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* d. Recommended Courses */}
                          {staticResource.courses && staticResource.courses.length > 0 && (
                            <div>
                              <h4 className="font-bold text-[#1a1c1c] mb-3 uppercase text-xs tracking-wider">Recommended Courses</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {staticResource.courses.map((course, cidx) => (
                                  <a key={cidx} href={course.url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-1 border border-[#e2e2e2] p-4 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all group">
                                    <span className="text-xs font-bold text-[#737688] uppercase tracking-wide">{course.platform}</span>
                                    <span className="font-medium text-[#1a1c1c] group-hover:text-blue-600 transition-colors">{course.title}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* e. Certifications */}
                          {staticResource.certifications && staticResource.certifications.length > 0 && (
                            <div>
                              <h4 className="font-bold text-[#1a1c1c] mb-3 uppercase text-xs tracking-wider">Certifications</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {staticResource.certifications.map((cert, cidx) => (
                                  <a key={cidx} href={cert.url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-1 border border-[#e2e2e2] p-4 rounded-lg hover:border-yellow-400 hover:shadow-sm transition-all group bg-[#fffff9]">
                                    <span className="text-xs font-bold text-[#737688] uppercase tracking-wide">{cert.issuer}</span>
                                    <span className="font-medium text-[#1a1c1c] group-hover:text-yellow-700 transition-colors">{cert.name}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Fallback if no static data is configured for this skill yet */}
                          {!staticResource.coreConcepts && !staticResource.practiceLinks && !staticResource.courses && !staticResource.certifications && (
                            <div className="text-sm text-[#737688] italic">
                              General skill area identified. Speak with a mentor for specific resource curation.
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })
          ) : (
            <div className="text-center text-[#737688] py-8 border border-dashed border-[#c3c5d9] rounded-xl bg-white">
              No skill gaps identified. You're ready for the role!
            </div>
          )}
        </motion.div>

        {/* 4. INTERVIEW PREPARATION */}
        {roleGuides.length > 0 && (
          <motion.div variants={fadeUp} className="bg-[#1a1c1c] text-white p-8 md:p-10 rounded-xl shadow-lg mt-4 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex flex-col gap-3 flex-1">
              <span className="text-blue-400 font-mono text-xs uppercase tracking-widest">Next Step</span>
              <h2 className="text-2xl md:text-3xl font-bold">Ready for the Interview?</h2>
              <p className="text-gray-400 text-sm md:text-base">Review these curated guides specifically for the {report.role} role before you apply.</p>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-1/2">
              {roleGuides.map((guide, idx) => (
                <a key={idx} href={guide.url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-1 bg-white/10 hover:bg-white/20 p-4 rounded-lg border border-white/10 hover:border-white/30 transition-all group">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white group-hover:text-blue-300 transition-colors">{guide.title}</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </div>
                  <span className="text-xs text-gray-400">{guide.description}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.main>
  );
}

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
            missingSkills: [
              { name: "SQL & Database Optimization", effortTag: "Quick win", current: 75 },
              { name: "Statistical Analysis", effortTag: "Moderate", current: 30 },
              { name: "Machine Learning Fundamentals", effortTag: "Deep skill", current: 15 },
              { name: "Business Communication", effortTag: "Moderate", current: 60 }
            ],
            verifiedSkills: ["Data Visualization"],
            description: "Requires advanced analytical capabilities, cross-functional communication, strategic planning, and the ability to turn complex datasets into actionable business insights.",
          },
          {
            role: "Front-end Developer",
            category: "Technology / Development",
            status: "verified",
            skills: [
              { name: "React & Next.js", current: 85, target: 90 },
              { name: "CSS/Tailwind Architecture", current: 90, target: 80 },
              { name: "Performance Optimization", current: 60, target: 85 },
              { name: "Advanced State Management", current: 70, target: 85 }
            ],
            missingSkills: [
              { name: "Performance Optimization", effortTag: "Quick win", current: 60 },
              { name: "Advanced State Management", effortTag: "Moderate", current: 70 }
            ],
            verifiedSkills: ["React & Next.js", "CSS/Tailwind Architecture"],
            description: "Focuses on building robust user interfaces, complex state management, and delivering high-performance web experiences.",
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
            missingSkills: [
              { name: "Data-Driven Prioritization", effortTag: "Quick win", current: 40 },
              { name: "Go-To-Market Strategy", effortTag: "Deep skill", current: 30 }
            ],
            verifiedSkills: ["Agile & Scrum", "User Research"],
            description: "Requires balancing business strategy, user needs, and engineering realities to drive product success from ideation to launch.",
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
              missingSkills: [
                { name: "Advanced Concepts", effortTag: "Moderate", current: Math.max(0, bestScore - 20) }
              ],
              verifiedSkills: ["Core Fundamentals"],
              description: `Personalized skill gap report and readiness analysis for ${role}.`,
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
          <ReportDetails report={selectedReport} onBack={() => setSelectedReport(null)} />
        ) : (
          <motion.main 
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-12 print:hidden"
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
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
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
