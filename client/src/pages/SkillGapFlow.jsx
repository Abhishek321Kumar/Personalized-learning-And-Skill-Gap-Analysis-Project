import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api/client";
import { SKILL_RESOURCES, ROLE_INTERVIEW_GUIDES } from "../config/skillResources";
import { generateRoadmapPhases } from "../utils/roadmapSequencer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

function ReportDetails({ report, user, onBack }) {
  const { phases } = generateRoadmapPhases(report.missingSkills || []);
  const topSkill = phases.flatMap(p => p.skills)[0] || { name: "General Skill Review" }; 
  
  const [expandedSkill, setExpandedSkill] = useState(topSkill.name);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const roleGuides = ROLE_INTERVIEW_GUIDES.find(r => r.role.toLowerCase() === (report?.role || "").toLowerCase())?.interviewGuides || ROLE_INTERVIEW_GUIDES[0].interviewGuides;

  const handleScrollToSkill = (skillName) => {
    setExpandedSkill(skillName);
    setTimeout(() => {
      const el = document.getElementById(`skill-section-${skillName}`);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      <motion.main 
        key="details"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-10 py-10"
      >
        <header className="mb-10 flex justify-start items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-semibold text-sm group bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Overview
          </button>
        </header>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full flex flex-col gap-12"
        >
          {/* 1. HERO / START HERE */}
          <motion.div variants={fadeUp} className="relative bg-[#0a0a0a] text-white p-10 md:p-16 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-800">
            {/* Subtle gradient glowing background */}
            <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[150%] bg-gradient-to-b from-blue-600/30 via-purple-600/10 to-transparent rounded-[100%] blur-3xl transform rotate-12 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase mb-8 border border-white/10 text-blue-300">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                  Top Priority Action
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  {topSkill.name}
                </h1>
                <p className="text-gray-400 text-lg md:text-xl mb-10 font-medium leading-relaxed max-w-xl">
                  This is your highest-impact quick win. Focusing here will yield the most immediate improvement for the <strong className="text-white">{report.role}</strong> role.
                </p>
                <button 
                  onClick={() => handleScrollToSkill(topSkill.name)}
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black bg-white rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                >
                  <span className="relative flex items-center gap-3">
                    Start Learning Now
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </span>
                </button>
              </div>
              
              <div className="hidden md:flex items-center justify-center w-56 h-56 bg-gradient-to-tr from-blue-900/40 to-purple-900/40 backdrop-blur-3xl rounded-full border border-white/5 shadow-2xl relative">
                 <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_10s_linear_infinite]"></div>
                 <svg className="w-24 h-24 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
            </div>
          </motion.div>

          {/* 1.5 PERFORMANCE BREAKDOWN (NEW) */}
          <motion.div variants={fadeUp} className="flex flex-col gap-6 mt-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Performance Breakdown</h2>
              <p className="text-gray-500 font-medium">Your current proficiency vs target requirements.</p>
            </div>
            
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
              {report.skills && report.skills.map((skill, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                   <div className="flex justify-between items-end">
                     <span className="font-bold text-gray-900 text-lg">{skill.name}</span>
                     <span className="text-sm font-bold text-gray-400">Current: {skill.current}% / Target: {skill.target}%</span>
                   </div>
                   <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       whileInView={{ width: `${skill.current}%` }}
                       viewport={{ once: true }}
                       transition={{ duration: 1, ease: "easeOut" }}
                       className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" 
                     ></motion.div>
                     <div 
                       className="absolute top-0 w-1 h-full bg-red-500 z-10" style={{ left: `${skill.target}%` }} title="Target Level"
                     ></div>
                   </div>
                </div>
              ))}
              {(!report.skills || report.skills.length === 0) && (
                <div className="col-span-full text-center text-gray-400 py-4">No specific skill performance data available.</div>
              )}
            </div>
          </motion.div>

          {/* 1.75 RESUME PRESENTATION (NEW) */}
          {(report.resumeCategories?.length > 0) && (
            <motion.div variants={fadeUp} className="flex flex-col gap-6 mt-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Resume ATS Feedback</h2>
                  {report.resumeScore !== null && report.resumeScore !== undefined && (
                    <div className="bg-blue-50 px-4 py-2 rounded-xl flex items-baseline gap-1 border border-blue-100 shadow-sm">
                      <span className="text-2xl font-black text-blue-700">{report.resumeScore}</span>
                      <span className="text-sm font-bold text-blue-400">/ 100</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-500 font-medium">Strengths and areas for improvement based on ATS parsing.</p>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-4">
                {report.resumeCategories.map((cat, idx) => {
                  const isExpanded = expandedCategory === cat.name;
                  const ratio = cat.maxScore > 0 ? cat.score / cat.maxScore : 0;
                  const colorClass = ratio >= 0.8 ? 'text-green-600 bg-green-50 border-green-100' : ratio >= 0.5 ? 'text-orange-600 bg-orange-50 border-orange-100' : 'text-red-600 bg-red-50 border-red-100';
                  const barClass = ratio >= 0.8 ? 'bg-green-500' : ratio >= 0.5 ? 'bg-orange-400' : 'bg-red-500';

                  return (
                    <div key={idx} className={`border rounded-2xl transition-all duration-300 overflow-hidden ${isExpanded ? 'border-blue-200 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
                      <button 
                        onClick={() => setExpandedCategory(isExpanded ? null : cat.name)}
                        className="w-full px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left group bg-white hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${colorClass}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={ratio >= 0.8 ? "M5 13l4 4L19 7" : ratio >= 0.5 ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"}></path></svg>
                          </div>
                          <div className="flex flex-col flex-1">
                            <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-700 transition-colors">{cat.name}</h3>
                            <div className="flex items-center gap-3 mt-2 md:max-w-[200px] w-full">
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${ratio * 100}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className={`h-full rounded-full ${barClass}`} 
                                ></motion.div>
                              </div>
                              <span className="text-xs font-bold text-gray-500 whitespace-nowrap">{Math.round(ratio * 100)}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 self-end md:self-auto">
                          <span className="text-sm font-bold text-gray-400">{cat.score} / {cat.maxScore} pts</span>
                          <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                            <svg className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-gray-50/50"
                          >
                            <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                              {cat.feedback && cat.feedback.length > 0 ? (
                                <ul className="flex flex-col gap-3">
                                  {cat.feedback.map((fb, fidx) => (
                                    <li key={fidx} className={`flex items-start gap-3 p-4 rounded-xl border text-sm font-medium ${
                                      fb.type === 'pro' 
                                        ? 'bg-green-50/50 border-green-100 text-green-800' 
                                        : fb.type === 'info'
                                          ? 'bg-blue-50/50 border-blue-100 text-blue-800 flex-col'
                                          : 'bg-red-50/50 border-red-100 text-red-800'
                                    }`}>
                                      {fb.type === 'info' ? (
                                        <div className="w-full">
                                          <div className="flex items-center gap-2 mb-3">
                                            <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <span className="font-bold">{fb.text}</span>
                                          </div>
                                          
                                          {fb.matched && fb.matched.length > 0 && (
                                            <div className="mb-3">
                                              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Matched Skills</div>
                                              <div className="flex flex-wrap gap-2">
                                                {fb.matched.map((skill, i) => (
                                                  <span key={`matched-${i}`} className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs border border-green-200 shadow-sm">
                                                    ✓ {skill}
                                                  </span>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                          
                                          {fb.missing && fb.missing.length > 0 && (
                                            <div>
                                              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Missing Skills</div>
                                              <div className="flex flex-wrap gap-2">
                                                {fb.missing.map((skill, i) => (
                                                  <span key={`missing-${i}`} className="bg-white text-red-600 px-2 py-1 rounded-md text-xs border border-red-200 shadow-sm">
                                                    × {skill}
                                                  </span>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <>
                                          {fb.type === 'pro' ? (
                                            <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                          ) : (
                                            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                          )}
                                          <span className="pt-0.5">{fb.text}</span>
                                        </>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="text-gray-400 italic text-sm">No specific feedback provided for this category.</div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 2. ROADMAP TIMELINE */}
          <motion.div variants={fadeUp} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Learning Roadmap</h2>
              <p className="text-gray-500 font-medium">A sequenced progression based on effort to mastery.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative mt-4">
              {/* Desktop connecting line */}
              <div className="hidden md:block absolute top-12 left-6 right-6 h-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 -z-10 rounded-full"></div>
              
              {phases.map((phase, idx) => (
                <div key={idx} className="flex-1 relative">
                  <div className="bg-white p-8 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col h-full transform transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] duration-300 group">
                     
                     <div className="flex items-center justify-between mb-6">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                          idx === 0 ? 'bg-green-100 text-green-700' : 
                          idx === 1 ? 'bg-orange-100 text-orange-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {phase.estimatedDuration}
                        </span>
                        <span className="text-gray-300 font-black text-2xl group-hover:text-gray-900 transition-colors">0{idx+1}</span>
                     </div>
                     
                     <h3 className="text-2xl font-black text-gray-900 mb-6">{phase.label}</h3>
                     
                     <div className="flex flex-col gap-3">
                       {phase.skills.length > 0 ? (
                         phase.skills.map((s, i) => (
                           <button 
                             key={i} 
                             onClick={() => handleScrollToSkill(s.name)}
                             className="text-left w-full bg-gray-50 p-4 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center justify-between group/btn border border-transparent hover:border-blue-100"
                           >
                             <span className="font-bold text-sm text-gray-700 group-hover/btn:text-blue-700">{s.name}</span>
                             <svg className="w-4 h-4 text-gray-400 group-hover/btn:text-blue-600 group-hover/btn:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                           </button>
                         ))
                       ) : (
                         <div className="text-sm font-medium text-gray-400 italic text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                           No skills mapped to this phase.
                         </div>
                       )}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 3. PER-SKILL DETAIL SECTIONS */}
          <motion.div variants={fadeUp} className="flex flex-col gap-6 mt-8">
            <div className="flex flex-col gap-1 mb-2">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Skill Breakdowns</h2>
              <p className="text-gray-500 font-medium">Detailed resources and concepts for each identified gap.</p>
            </div>
            
            {report.missingSkills && report.missingSkills.length > 0 ? (
              <div className="flex flex-col gap-4">
                {report.missingSkills.map((skill, idx) => {
                  // Find static resource, or mock a default if not found (so it never looks empty)
                  let staticResource = SKILL_RESOURCES.find(r => r.skill === skill.name);
                  if (!staticResource) {
                    staticResource = {
                      coreConcepts: ["Foundational principles", "Industry best practices", "Advanced application"],
                      courses: [
                        { platform: "Coursera", title: `${skill.name} Masterclass`, url: `https://www.coursera.org/search?query=${encodeURIComponent(skill.name)}` },
                        { platform: "Udemy", title: `Complete ${skill.name} Bootcamp`, url: `https://www.udemy.com/courses/search/?src=ukw&q=${encodeURIComponent(skill.name)}` }
                      ]
                    };
                  }
                  
                  const isExpanded = expandedSkill === skill.name;
                  const effortBadgeColor = 
                    skill.effortTag === 'Quick win' ? 'bg-green-100 text-green-700' : 
                    skill.effortTag === 'Moderate' ? 'bg-orange-100 text-orange-700' : 
                    'bg-red-100 text-red-700';
  
                  return (
                    <div key={idx} id={`skill-section-${skill.name}`} className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 ${isExpanded ? 'border-blue-300 shadow-[0_8px_30px_rgb(0,0,0,0.06)]' : 'border-gray-200 hover:border-gray-300'}`}>
                      <button 
                        onClick={() => setExpandedSkill(isExpanded ? null : skill.name)}
                        className="w-full px-6 py-6 md:px-8 flex items-center justify-between group"
                      >
                        <div className="flex flex-wrap items-center gap-4">
                          <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">{skill.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${effortBadgeColor}`}>
                            {skill.effortTag || "Moderate"}
                          </span>
                          {skill.current !== undefined && (
                             <span className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Current: {skill.current}%</span>
                          )}
                        </div>
                        <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-blue-50' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                          <svg className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-blue-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 md:px-8 pb-8 pt-2">
                              <div className="w-full h-px bg-gray-100 mb-8"></div>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                
                                <div className="flex flex-col gap-8">
                                  {/* b. Core Concepts */}
                                  {staticResource.coreConcepts && staticResource.coreConcepts.length > 0 && (
                                    <div>
                                      <h4 className="flex items-center gap-2 font-black text-gray-900 mb-4 uppercase text-xs tracking-widest text-blue-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Core Concepts to Focus On
                                      </h4>
                                      <ul className="flex flex-col gap-3">
                                        {staticResource.coreConcepts.map((concept, cidx) => (
                                          <li key={cidx} className="flex items-start gap-3 text-gray-600 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                            {concept}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
  
                                <div className="flex flex-col gap-8">
                                  {/* c. Practice */}
                                  {staticResource.practiceLinks && staticResource.practiceLinks.length > 0 && (
                                    <div>
                                      <h4 className="flex items-center gap-2 font-black text-gray-900 mb-4 uppercase text-xs tracking-widest text-purple-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                                        Hands-on Practice
                                      </h4>
                                      <div className="flex flex-col gap-3">
                                        {staticResource.practiceLinks.map((link, lidx) => (
                                          <a key={lidx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white border-2 border-gray-100 p-4 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group">
                                            <div>
                                              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{link.platform}</span>
                                              <span className="font-bold text-gray-800 group-hover:text-purple-700">{link.label}</span>
                                            </div>
                                            <div className="bg-purple-50 p-2 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                            </div>
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
  
                                  {/* d. Recommended Courses */}
                                  {staticResource.courses && staticResource.courses.length > 0 && (
                                    <div>
                                      <h4 className="flex items-center gap-2 font-black text-gray-900 mb-4 uppercase text-xs tracking-widest text-orange-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                        Curated Courses
                                      </h4>
                                      <div className="flex flex-col gap-3">
                                        {staticResource.courses.map((course, cidx) => (
                                          <a key={cidx} href={course.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white border-2 border-gray-100 p-4 rounded-xl hover:border-orange-300 hover:shadow-md transition-all group">
                                            <div>
                                              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{course.platform}</span>
                                              <span className="font-bold text-gray-800 group-hover:text-orange-700">{course.title}</span>
                                            </div>
                                            <div className="bg-orange-50 p-2 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                            </div>
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* e. Certifications */}
                                  {staticResource.certifications && staticResource.certifications.length > 0 && (
                                    <div>
                                      <h4 className="flex items-center gap-2 font-black text-gray-900 mb-4 uppercase text-xs tracking-widest text-emerald-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Certifications
                                      </h4>
                                      <div className="flex flex-col gap-3">
                                        {staticResource.certifications.map((cert, cidx) => (
                                          <a key={cidx} href={cert.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white border-2 border-emerald-100 p-4 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group">
                                            <div>
                                              <span className="block text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">{cert.issuer}</span>
                                              <span className="font-bold text-gray-800 group-hover:text-emerald-700">{cert.name}</span>
                                            </div>
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-3xl bg-white shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">No skill gaps identified!</h3>
                <p className="text-gray-500 font-medium">You're fully ready for the {report.role} role.</p>
              </div>
            )}
          </motion.div>
  
          {/* 4. INTERVIEW PREPARATION */}
          {roleGuides && roleGuides.length > 0 && (
            <motion.div variants={fadeUp} className="bg-gradient-to-br from-indigo-950 to-blue-900 text-white p-10 md:p-12 rounded-[2rem] shadow-[0_15px_40px_-10px_rgba(30,58,138,0.5)] mt-8 flex flex-col lg:flex-row gap-12 items-center justify-between border border-blue-800">
              <div className="flex flex-col gap-4 flex-1">
                <div className="inline-block px-3 py-1 bg-blue-900 rounded-full text-xs font-bold tracking-widest uppercase border border-blue-700 text-blue-300 self-start">
                  Final Step
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight">Ready for the Interview?</h2>
                <p className="text-blue-200 text-lg font-medium leading-relaxed max-w-md mt-2">
                  Review these curated guides specifically for the <strong className="text-white">{report.role}</strong> role before you apply.
                </p>
              </div>
              
              <div className="flex flex-col gap-4 w-full lg:w-[50%]">
                {roleGuides.map((guide, idx) => (
                  <a key={idx} href={guide.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/10 hover:border-white/30 transition-all group backdrop-blur-sm">
                    <div className="bg-blue-500/20 p-3 rounded-full text-blue-300 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <span className="font-bold text-white group-hover:text-blue-200 transition-colors text-lg">{guide.title}</span>
                      <span className="text-sm text-blue-200/70 font-medium leading-snug">{guide.description}</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.main>
    </>
  );
}

export function SkillGapFlow() {
  const location = useLocation();
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const dashboardData = await api.getDashboard();
        if (dashboardData.user) {
          setUser(dashboardData.user);
        }
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
            verifiedSkills: ["Data Visualization", "Python (Data Science Stack)"],
            description: "Requires advanced analytical capabilities, cross-functional communication, strategic planning, and the ability to turn complex datasets into actionable business insights.",
          },
          {
            role: "Front-end Developer",
            category: "Technology / Development",
            status: "verified",
            skills: [
              { name: "React & Next.js", current: 85, target: 90 },
              { name: "CSS/Tailwind Architecture", current: 90, target: 80 },
              { name: "React & Next.js Performance", current: 60, target: 85 },
              { name: "Advanced State Management", current: 70, target: 85 }
            ],
            missingSkills: [
              { name: "React & Next.js Performance", effortTag: "Quick win", current: 60 },
              { name: "Advanced State Management", effortTag: "Moderate", current: 70 }
            ],
            verifiedSkills: ["React & Next.js", "CSS/Tailwind Architecture"],
            description: "Focuses on building robust user interfaces, complex state management, and delivering high-performance web experiences.",
          },
          {
            role: "Full-stack Engineer",
            category: "Technology / Development",
            status: "pending_actions",
            skills: [
              { name: "React & Next.js Performance", current: 65, target: 85 },
              { name: "System Design & Architecture", current: 40, target: 80 },
              { name: "SQL & Database Optimization", current: 70, target: 90 },
              { name: "Advanced State Management", current: 75, target: 85 }
            ],
            missingSkills: [
              { name: "SQL & Database Optimization", effortTag: "Quick win", current: 70 },
              { name: "Advanced State Management", effortTag: "Quick win", current: 75 },
              { name: "React & Next.js Performance", effortTag: "Moderate", current: 65 },
              { name: "System Design & Architecture", effortTag: "Deep skill", current: 40 }
            ],
            verifiedSkills: ["REST API Development", "Node.js Fundamentals"],
            description: "Requires mastering both client-side and server-side architecture, managing state, optimizing databases, and scaling systems.",
          },
          {
            role: "Product Manager",
            category: "Product Management",
            status: "pending_actions",
            skills: [
              { name: "Data-Driven Prioritization", current: 50, target: 85 },
              { name: "Go-To-Market Strategy", current: 40, target: 80 },
              { name: "Business Communication", current: 75, target: 90 }
            ],
            missingSkills: [
              { name: "Go-To-Market Strategy", effortTag: "Deep skill", current: 40 },
              { name: "Data-Driven Prioritization", effortTag: "Moderate", current: 50 },
              { name: "Business Communication", effortTag: "Quick win", current: 75 }
            ],
            verifiedSkills: ["Agile Fundamentals", "User Story Mapping"],
            description: "Focuses on strategic prioritization, product positioning, market analysis, and cross-functional leadership.",
          },
          {
            role: "UI/UX Designer",
            category: "Design",
            status: "pending_actions",
            skills: [
              { name: "Interaction Design", current: 45, target: 85 },
              { name: "User Research Methods", current: 70, target: 90 },
              { name: "Prototyping & Wireframing", current: 80, target: 85 }
            ],
            missingSkills: [
              { name: "Interaction Design", effortTag: "Deep skill", current: 45 },
              { name: "User Research Methods", effortTag: "Moderate", current: 70 }
            ],
            verifiedSkills: ["Prototyping & Wireframing", "Figma Fundamentals"],
            description: "Focuses on user-centered design, interaction modeling, and translating requirements into intuitive interfaces.",
          },
          {
            role: "Marketing Manager",
            category: "Marketing",
            status: "pending_actions",
            skills: [
              { name: "Digital Marketing (SEO/SEM)", current: 55, target: 90 },
              { name: "Marketing Analytics (ROI/CAC)", current: 40, target: 85 },
              { name: "Content & Copywriting", current: 75, target: 85 },
              { name: "Budget Optimization", current: 50, target: 80 }
            ],
            missingSkills: [
              { name: "Marketing Analytics (ROI/CAC)", effortTag: "Deep skill", current: 40 },
              { name: "Budget Optimization", effortTag: "Moderate", current: 50 },
              { name: "Digital Marketing (SEO/SEM)", effortTag: "Quick win", current: 55 }
            ],
            verifiedSkills: ["Content & Copywriting", "Cross-functional Collaboration"],
            description: "Focuses on strategic campaign planning, multi-channel growth, and data-driven customer acquisition.",
          },
          {
            role: "Data Scientist",
            category: "Data Science",
            status: "pending_actions",
            skills: [
              { name: "Python (Data Science Stack)", current: 60, target: 90 },
              { name: "Strategic Execution", current: 36, target: 80 },
              { name: "Advanced Domain Concepts", current: 46, target: 90 },
              { name: "Cross-functional Collaboration", current: 41, target: 85 }
            ],
            missingSkills: [
              { name: "Advanced Domain Concepts", effortTag: "Deep skill", current: 46 },
              { name: "Strategic Execution", effortTag: "Moderate", current: 36 },
              { name: "Cross-functional Collaboration", effortTag: "Quick win", current: 41 }
            ],
            verifiedSkills: ["Python (Data Science Stack)", "Core Fundamentals"],
            description: "Focuses on building predictive models, strategic execution of data initiatives, and cross-functional collaboration.",
          }
        ];

        let userReports = [];
        uniqueRoles.forEach(role => {
          let template = allMockReports.find(r => 
            r.role.toLowerCase() === role.toLowerCase() || 
            role.toLowerCase().includes(r.role.toLowerCase()) || 
            r.role.toLowerCase().includes(role.toLowerCase().replace("management", "manager"))
          );
          
          const roleAttempts = attempts.filter(a => a.quizId?.title?.includes(role));
          const latestAttempt = roleAttempts[0]; // assumes ordered by date
          const bestScore = roleAttempts.length > 0 ? Math.max(...roleAttempts.map(a => a.score)) : 0;
          const dateStr = latestAttempt ? new Date(latestAttempt.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

          const roleAnalyses = (dashboardData.analyses || []).filter(a => a.targetRole?.toLowerCase() === role.toLowerCase());
          const latestAnalysis = roleAnalyses[0] || {};

          if (template) {
            let dynamicMissingSkills = template.missingSkills ? [...template.missingSkills] : [];
            if (latestAnalysis && latestAnalysis.improvementPriorities && latestAnalysis.improvementPriorities.length > 0) {
                const mlSkills = latestAnalysis.improvementPriorities.map((skillName, i) => {
                    let currentScore = Math.max(0, bestScore - (10 + i*5));
                    const matchedTemplateSkill = template.missingSkills?.find(s => s.name === skillName) || template.skills?.find(s => s.name === skillName);
                    if (matchedTemplateSkill && matchedTemplateSkill.current) {
                        currentScore = matchedTemplateSkill.current;
                    }
                    return { name: skillName, current: currentScore };
                });
                
                let merged = [...mlSkills];
                if (template.missingSkills) {
                    template.missingSkills.forEach(ts => {
                        if (!merged.find(ms => ms.name === ts.name)) {
                            merged.push(ts);
                        }
                    });
                }
                
                dynamicMissingSkills = merged.map((skill, i) => {
                    let tag = "Moderate";
                    if (i === 0) tag = "Quick win";
                    else if (i === merged.length - 1 && merged.length >= 3) tag = "Deep skill";
                    return { ...skill, effortTag: tag };
                });
            } else if (latestAnalysis && latestAnalysis.missingSkills && latestAnalysis.missingSkills.length > 0) {
                const mlSkills = latestAnalysis.missingSkills.slice(0, 4).map((skillName, i) => {
                    return { name: skillName, current: Math.max(0, bestScore - (10 + i*5)) };
                });
                
                let merged = [...mlSkills];
                if (template.missingSkills) {
                    template.missingSkills.forEach(ts => {
                        if (!merged.find(ms => ms.name === ts.name)) {
                            merged.push(ts);
                        }
                    });
                }
                
                dynamicMissingSkills = merged.map((skill, i) => {
                    let tag = "Moderate";
                    if (i === 0) tag = "Quick win";
                    else if (i === merged.length - 1 && merged.length >= 3) tag = "Deep skill";
                    return { ...skill, effortTag: tag };
                });
            } else if (latestAnalysis && latestAnalysis.matchPercentage >= 0) {
                // If it ran but has no missing skills, they did perfectly
                dynamicMissingSkills = [];
            }

            let dynamicVerifiedSkills = template.verifiedSkills;
            if (latestAnalysis && latestAnalysis.strengths && latestAnalysis.strengths.length > 0) {
                dynamicVerifiedSkills = latestAnalysis.strengths;
            }

            userReports.push({ 
              ...template, 
              score: bestScore, 
              date: dateStr, 
              id: "rep_" + role.replace(/\s+/g, '_'),
              missingSkills: dynamicMissingSkills,
              verifiedSkills: dynamicVerifiedSkills,
              resumeScore: latestAnalysis.resumeScore,
              resumeCategories: latestAnalysis.resumeCategories || [],
            });
          } else {
            let defaultMissing = [
              { name: "Advanced Domain Concepts", effortTag: "Quick win", current: Math.max(0, bestScore - 10) },
              { name: "Cross-functional Collaboration", effortTag: "Moderate", current: Math.max(0, bestScore - 15) },
              { name: "Strategic Execution", effortTag: "Deep skill", current: Math.max(0, bestScore - 20) }
            ];

            if (latestAnalysis && latestAnalysis.improvementPriorities && latestAnalysis.improvementPriorities.length > 0) {
                const mlSkills = latestAnalysis.improvementPriorities.map((skillName, i) => ({
                    name: skillName,
                    current: Math.max(0, bestScore - (10 + i*5))
                }));
                
                let merged = [...mlSkills];
                defaultMissing.forEach(ts => {
                    if (!merged.find(ms => ms.name === ts.name)) {
                        merged.push(ts);
                    }
                });
                
                defaultMissing = merged.map((skill, i) => {
                    let tag = "Moderate";
                    if (i === 0) tag = "Quick win";
                    else if (i === merged.length - 1 && merged.length >= 3) tag = "Deep skill";
                    return { ...skill, effortTag: tag };
                });
            }

            let defaultVerified = ["Core Fundamentals"];
            if (latestAnalysis && latestAnalysis.strengths && latestAnalysis.strengths.length > 0) {
                defaultVerified = latestAnalysis.strengths;
            }

            userReports.push({
              id: "rep_" + role.replace(/\s+/g, '_'),
              role: role,
              category: "Specialized Role",
              date: dateStr,
              score: bestScore,
              status: "pending_actions",
              skills: [
                { name: "Strategic Execution", current: Math.max(0, bestScore - 20), target: 80 },
                { name: "Advanced Domain Concepts", current: Math.max(0, bestScore - 10), target: 90 },
                { name: "Cross-functional Collaboration", current: Math.max(0, bestScore - 15), target: 85 }
              ],
              missingSkills: defaultMissing,
              verifiedSkills: defaultVerified,
              description: `Personalized skill gap report and readiness analysis for ${role}.`,
              resumeScore: latestAnalysis.resumeScore,
              resumeCategories: latestAnalysis.resumeCategories || [],
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
    <div className="bg-[#f9fafb] text-gray-900 font-sans flex flex-col selection:bg-blue-600 selection:text-white min-h-screen">
      <AnimatePresence mode="wait">
        {selectedReport ? (
          <ReportDetails report={selectedReport} user={user} onBack={() => setSelectedReport(null)} />
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
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Skill Gap Analysis Report</h1>
                <p className="text-base md:text-lg text-gray-500 max-w-2xl font-medium leading-relaxed">
                  Review your personalized readiness reports for all completed assessments. Identify critical gaps and initiate your targeted learning pathways below.
                </p>
              </div>
            </header>

            {loading ? (
              <div className="flex justify-center items-center py-20 text-gray-400 font-medium">Loading reports...</div>
            ) : reports.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white"
              >
                <div className="bg-blue-50 text-blue-600 p-5 rounded-full mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">No Reports Available Yet</h3>
                <p className="text-gray-500 mb-8 max-w-md text-base font-medium leading-relaxed">You haven't completed any Technical Readiness Assessments. Take a quiz to generate your personalized skill gap analysis.</p>
                <a href="/assessments/setup" className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
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
                    className="bg-white border border-gray-200 p-8 flex flex-col justify-between group hover:border-blue-400 hover:shadow-xl transition-all duration-300 min-h-[320px] rounded-3xl"
                  >
                    <div>
                      <div className="font-bold text-[11px] text-blue-600 uppercase mb-6 flex justify-between items-center tracking-widest">
                        <span className={report.status === 'verified' ? 'text-blue-600' : 'text-gray-400'}>{report.category}</span>
                        {report.status === 'verified' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        )}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">{report.role}</h2>
                      <div className="flex items-center gap-3 text-gray-500 text-sm font-medium mb-8">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span>Completed {report.date}</span>
                      </div>
                    </div>
                    <div className="mt-auto pt-6 border-t border-gray-100">
                      <button 
                        onClick={() => setSelectedReport(report)}
                        className="w-full bg-blue-50 text-blue-700 font-bold text-sm px-6 py-4 flex items-center justify-between hover:bg-blue-600 hover:text-white transition-all rounded-2xl group/btn"
                      >
                        <span>Get Skill Report</span>
                        <span className="text-lg transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
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
