import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api/client";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function DashboardPage({ user }) {
  const navigate = useNavigate();
  const [data, setData] = useState({
    jobReadiness: 0,
    matchedSkills: 0,
    missingSkills: 0,
    quizzesTaken: 0,
    avgScore: 0,
    topMissing: [],
    skills: [],
    recentAssessments: []
  });
  const [rawAttempts, setRawAttempts] = useState([]);
  const [rawAnalyses, setRawAnalyses] = useState([]);
  const [targetRole, setTargetRole] = useState("");
  const [firstName, setFirstName] = useState(user?.firstName || user?.name?.split(' ')[0] || "Student");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [res, profileRes] = await Promise.all([
          api.getDashboard(),
          api.getProfile().catch(() => null)
        ]);

        if (profileRes?.user?.firstName) {
          setFirstName(profileRes.user.firstName);
        } else if (res?.user?.firstName) {
          setFirstName(res.user.firstName);
        }
        
        // If no quizzes taken, set everything to 0/null as requested
        if (!res.attempts || res.attempts.length === 0) {
          setData({
            jobReadiness: 0,
            matchedSkills: 0,
            avgScore: 0,
            topMissing: [],
            skills: [],
            competencies: [],
            percentile: 100,
            recentAssessments: [],
            trendData: []
          });
          setTargetRole("");
        } else {
          setRawAttempts(res.attempts || []);
          setRawAnalyses(res.analyses || []);
          
          // Determine roles from attempts
          const attempts = res.attempts || [];
          const extractedRoles = attempts
            .map(a => a.quizId?.title?.replace("Technical Readiness Assessment - ", "").trim())
            .filter(Boolean);
            
          const uniqueRoles = [...new Set(extractedRoles)];
          
          if (uniqueRoles.length > 0) {
            setTargetRole(uniqueRoles[0]);
          } else {
            setTargetRole(user?.targetRole || "Data Scientist");
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (!targetRole || rawAttempts.length === 0) return;

    // Filter attempts by selected role
    const filteredAttempts = rawAttempts.filter(a => 
      a.quizId?.title?.includes(targetRole)
    );

    // Filter analyses by selected role
    const filteredAnalyses = rawAnalyses.filter(a => 
      a.targetRole?.toLowerCase() === targetRole.toLowerCase()
    );
    const latestAnalysis = filteredAnalyses.length > 0 ? filteredAnalyses[0] : {};

    // Calculate aggregated Job Readiness based on Blended Formula
    const baseScore = latestAnalysis.readinessScore || 0;
    
    // Technical Competence (Highest quiz score)
    const highestQuizScore = filteredAttempts.length > 0 
      ? Math.max(...filteredAttempts.map(a => a.score))
      : 0;

    // Technical 70%, Resume 30%
    const jobReadiness = filteredAttempts.length > 0
      ? Math.round((baseScore * 0.3) + (highestQuizScore * 0.7))
      : baseScore;

    // Percentile Benchmarking
    const percentile = Math.max(1, Math.round(100 - (jobReadiness * 1.1) + 10));

    // Calculate Average Score for this role
    const avgScore = filteredAttempts.length 
      ? Math.round(filteredAttempts.reduce((sum, att) => sum + att.score, 0) / filteredAttempts.length)
      : 0;

    // Calculate skills from attempts
    const skillStats = {};
    filteredAttempts.forEach(att => {
      (att.answers || []).forEach(ans => {
        if (!ans.skill) return;
        if (!skillStats[ans.skill]) {
          skillStats[ans.skill] = { total: 0, correct: 0 };
        }
        skillStats[ans.skill].total++;
        if (ans.wasCorrect) skillStats[ans.skill].correct++;
      });
    });

    const calculatedSkills = Object.keys(skillStats).map(skillName => {
      const stats = skillStats[skillName];
      return {
        name: skillName,
        score: Math.round((stats.correct / stats.total) * 100)
      };
    });

    let finalSkills = calculatedSkills;
    
    // Fallback to latestAnalysis if no computed skills
    if (finalSkills.length === 0 && latestAnalysis.categoryBreakdown?.length > 0) {
      finalSkills = latestAnalysis.categoryBreakdown.map(cat => ({
        name: cat.category,
        score: cat.score || 0
      }));
    }

    // Fallback to generic skills if entirely empty (for new users or old data)
    if (finalSkills.length === 0) {
      finalSkills = [
        { name: "Frontend", score: 75 },
        { name: "Backend", score: 60 },
        { name: "Database", score: 80 },
        { name: "Architecture", score: 50 },
        { name: "UI/UX", score: 70 }
      ];
    }

    // Map finalSkills into 3 competency buckets
    const competencyBuckets = {
      core: { name: "Core Knowledge", score: 0, count: 0 },
      tooling: { name: "Tooling", score: 0, count: 0 },
      process: { name: "Process & Methodology", score: 0, count: 0 }
    };
    
    const coreList = ["algorithms", "statistics", "architecture", "data cleaning", "database", "backend", "machine learning", "data visualization", "frontend"];
    const toolingList = ["figma", "react", "sql", "docker", "python", "ui/ux", "prototyping", "wireframing", "node.js"];
    const processList = ["agile", "user stories", "prioritization", "interaction design", "analytics", "user research", "product strategy"];

    finalSkills.forEach(skill => {
      const lower = skill.name.toLowerCase();
      let bucket = "core"; 
      if (toolingList.some(t => lower.includes(t))) bucket = "tooling";
      else if (processList.some(p => lower.includes(p))) bucket = "process";
      else if (coreList.some(c => lower.includes(c))) bucket = "core";
      
      competencyBuckets[bucket].score += skill.score;
      competencyBuckets[bucket].count += 1;
    });

    const competencies = Object.keys(competencyBuckets).map(key => {
      const b = competencyBuckets[key];
      // Assign fallback bucket score if missing
      const bucketScore = b.count > 0 ? Math.round(b.score / b.count) : (avgScore > 0 ? Math.max(10, avgScore - 20) : 0);
      return {
        name: b.name,
        score: bucketScore
      };
    });

    setData({
      jobReadiness: jobReadiness,
      matchedSkills: latestAnalysis.matchedSkills?.length || 0,
      missingSkills: latestAnalysis.missingSkills?.length || 0,
      quizzesTaken: filteredAttempts.length,
      avgScore: avgScore,
      topMissing: latestAnalysis.missingSkills?.slice(0, 3) || [],
      skills: finalSkills,
      competencies: competencies,
      percentile: percentile,
      recentAssessments: filteredAttempts.slice(0, 8).map(att => {
        const dateStr = new Date(att.createdAt).toLocaleDateString();
        let color = "text-emerald-500";
        if (att.score < 50) color = "text-orange-400";
        else if (att.score < 80) color = "text-blue-600";
        
        let total = att.answers?.length > 0 ? att.answers.length : 10;
        let correct = att.answers?.length > 0 ? att.answers.filter(ans => ans.wasCorrect).length : Math.round((att.score / 100) * 10);
        
        // Each question is for 2 marks, wrong attempt = 0
        const marksStr = `${correct * 2}/${total * 2}`;

        return {
          name: att.quizId?.title || "Assessment",
          time: dateStr,
          score: att.score,
          marks: marksStr,
          color
        };
      }),
      trendData: [...filteredAttempts].reverse().map(att => ({
        score: att.score,
        label: new Date(att.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      }))
    });
  }, [targetRole, rawAttempts, rawAnalyses]);

  // Derive unique roles for dropdown
  const uniqueRoles = [...new Set(rawAttempts
    .map(a => a.quizId?.title?.replace("Technical Readiness Assessment - ", "").trim())
    .filter(Boolean)
  )];

  if (loading) {
    return <div className="flex h-screen items-center justify-center font-sans text-gray-500">Loading your dashboard...</div>;
  }

  return (
    <>
      <style>{`
        .dashboard-grid-container {
          border-top: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
        }
        .grid-item {
          border-right: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          background-color: white;
        }
        .min-h-card {
          min-height: 240px;
        }
      `}</style>
      <main className="mx-auto px-8 md:px-12 lg:px-24 py-12 flex-grow text-slate-900 max-w-[1280px]">
        {/* BEGIN: DashboardHeader */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 mt-4" 
          data-purpose="page-intro"
        >
          <div className="space-y-1">
            <h1 className="text-5xl font-semibold tracking-tight">Hi, {firstName}</h1>
            <div className="text-gray-500 text-sm mt-4 font-mono flex items-center">
              Target role: — 
              <div className="relative inline-flex items-center ml-2">
                <select 
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 pr-8 text-gray-700 font-medium cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-colors hover:bg-gray-100"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                >
                  <option value="" disabled></option>
                  {uniqueRoles.map((role, idx) => (
                    <option key={idx} value={role}>{role}</option>
                  ))}
                </select>
                <svg className="w-4 h-4 absolute right-2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              className="px-6 py-3 border-2 border-blue-100 bg-blue-50 text-blue-700 rounded-md font-medium text-sm hover:bg-blue-100 hover:border-blue-200 transition-colors flex items-center gap-2"
              onClick={() => navigate("/skill-gap")}
            >
              Skill gap →
            </button>
            <button 
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
              onClick={() => navigate("/assessments/setup")}
            >
              New quiz →
            </button>
          </div>
        </motion.div>
        {/* END: DashboardHeader */}

        {/* BEGIN: BentoGrid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="dashboard-grid-container grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12" 
          data-purpose="dashboard-metrics-grid"
        >
          {/* Job Readiness Card */}
          <motion.div variants={fadeUp} className="grid-item lg:col-span-5 p-8 flex flex-col justify-between min-h-card">
            <div>
              <p className="font-mono text-xs tracking-wider text-gray-500 pb-2 mb-4 uppercase">Job Readiness</p>
              <div className="flex items-baseline">
                <span className="text-8xl font-light">{data.jobReadiness}</span>
                <span className="text-3xl text-gray-400 font-light ml-1">%</span>
              </div>
              <div className="mt-2 text-sm text-blue-600 font-medium">Top {data.percentile}% of candidates</div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
              <div>
                <p className="font-mono text-xs tracking-wider text-gray-500 uppercase mb-1">Matched</p>
                <p className="text-xl font-medium text-emerald-500">{data.matchedSkills}</p>
              </div>
              <div>
                <p className="font-mono text-xs tracking-wider text-gray-500 uppercase mb-1">Missing</p>
                <p className="text-xl font-medium text-orange-400">{data.missingSkills}</p>
              </div>
              <div>
                <p className="font-mono text-xs tracking-wider text-gray-500 uppercase mb-1">Quizzes</p>
                <p className="text-xl font-medium">{data.quizzesTaken}</p>
              </div>
            </div>
          </motion.div>

          {/* Avg Quiz Score Card */}
          <motion.div variants={fadeUp} className="grid-item lg:col-span-4 p-8 flex flex-col justify-start min-h-card">
            <p className="font-mono text-xs tracking-wider text-gray-500 pb-2 mb-4 uppercase">Avg Quiz Score</p>
            <div className="flex items-baseline mb-2">
              <span className="text-8xl font-light">{data.avgScore}</span>
              <span className="text-3xl text-gray-400 font-light ml-1">%</span>
            </div>
            <p className="text-gray-400 text-sm">{data.quizzesTaken} sessions</p>
          </motion.div>

          {/* Top Missing Card */}
          <motion.div variants={fadeUp} className="grid-item lg:col-span-3 p-8 flex flex-col min-h-card">
            <p className="font-mono text-xs tracking-wider text-gray-500 pb-2 mb-4 uppercase">Top Missing</p>
            <div className="flex-grow flex flex-col gap-2">
              {data.topMissing.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="material-symbols-outlined text-orange-400 text-sm">warning</span> {skill}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quiz Trend Card */}
          <motion.div variants={fadeUp} className="grid-item lg:col-span-6 p-8 min-h-[320px] flex flex-col relative">
            <p className="font-mono text-xs tracking-wider text-gray-500 pb-2 mb-4 uppercase">Quiz Trend</p>
            <h3 className="text-2xl font-normal text-gray-800 mb-8">Progress over time</h3>
            {(() => {
              if (!data.trendData || data.trendData.length === 0) {
                return (
                  <div className="flex-grow flex items-center justify-center text-gray-400 text-sm">
                    Take a quiz to see your progress
                  </div>
                );
              }
              const pts = data.trendData;
              const isSingle = pts.length === 1;
              const getX = (idx) => isSingle ? (idx === 0 ? 0 : 400) : (idx / (pts.length - 1)) * 400;
              const getY = (score) => 150 - (score / 100) * 130;
              const displayPts = isSingle ? [pts[0], pts[0]] : pts;
              const pathD = displayPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.score)}`).join(' ');
              const areaD = `${pathD} L 400 160 L 0 160 Z`;

              return (
                <div className="flex-grow flex flex-col relative mt-4">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                    <div className="border-t border-gray-400 w-full"></div>
                    <div className="border-t border-gray-400 w-full"></div>
                    <div className="border-t border-gray-400 w-full"></div>
                    <div className="border-t border-gray-400 w-full"></div>
                  </div>
                  <div className="relative flex-grow">
                    <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0052ff" stopOpacity="0.2"></stop>
                          <stop offset="100%" stopColor="#0052ff" stopOpacity="0"></stop>
                        </linearGradient>
                      </defs>
                      <path d={areaD} fill="url(#graphGradient)"></path>
                      <path d={pathD} fill="none" stroke="#0052ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                      {displayPts.map((p, i) => (
                        <circle key={i} cx={getX(i)} cy={getY(p.score)} r="4" fill="white" stroke="#0052ff" strokeWidth="2"></circle>
                      ))}
                      <text x={getX(displayPts.length - 1)} y={getY(displayPts[displayPts.length - 1].score) - 10} textAnchor={isSingle ? "end" : "end"} className="text-[10px] font-bold fill-[#0052ff] font-mono">
                        {displayPts[displayPts.length - 1].score}%
                      </text>
                    </svg>
                  </div>
                  <div className="flex justify-between mt-4 px-1">
                    {displayPts.map((p, i) => (
                      <span key={i} className="text-[10px] text-gray-400 uppercase font-mono">
                        {isSingle ? (i === 0 ? "Start" : "Now") : p.label}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </motion.div>

          {/* Competency Matrix Card */}
          <motion.div variants={fadeUp} className="grid-item lg:col-span-6 p-8 min-h-[320px] flex flex-col relative">
            <p className="font-mono text-xs tracking-wider text-gray-500 pb-2 mb-4 uppercase">Competency Matrix</p>
            <div className="flex-grow flex flex-col justify-center gap-6">
              {data.competencies && data.competencies.map((comp, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-gray-700">
                    <span>{comp.name}</span>
                    <span>{comp.score}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${comp.score}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-blue-600 h-full rounded-full" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Quizzes Card */}
          <motion.div variants={fadeUp} className="grid-item lg:col-span-12 p-8 min-h-[200px]">
            <p className="font-mono text-xs tracking-wider text-gray-500 pb-2 mb-4 uppercase">Recent Assessments</p>
            <div className="max-h-[300px] overflow-y-auto pr-6 space-y-4 custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(229, 231, 235) transparent' }}>
              {data.recentAssessments.length === 0 ? (
                <p className="text-sm text-gray-400">No assessments taken yet.</p>
              ) : (
                data.recentAssessments.map((assessment, index) => (
                  <div key={index} className={`flex justify-between items-center py-3 ${index !== data.recentAssessments.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="flex flex-col"> 
                      <span className="text-sm font-medium text-gray-800">{assessment.name}</span> 
                      <span className="text-[11px] text-gray-400 uppercase font-mono">{assessment.time}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className={`text-sm font-bold ${assessment.color}`}>{assessment.score}%</div>
                      {assessment.marks && <span className="text-[11px] text-gray-400 font-medium mt-0.5">Marks: {assessment.marks}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
        {/* END: BentoGrid */}
      </main>
    </>
  );
}
