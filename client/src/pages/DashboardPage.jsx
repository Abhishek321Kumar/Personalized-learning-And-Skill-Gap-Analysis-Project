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

const ALL_ROLES = [
  "Frontend Developer", 
  "Backend Developer", 
  "Full Stack Developer", 
  "Data Scientist", 
  "UI/UX Designer", 
  "Product Manager", 
  "DevOps Engineer"
];

const getEffortLabel = (skillName) => {
  const len = skillName.length;
  if (len < 8) return "Quick win";
  if (len < 14) return "Moderate";
  return "Deep skill";
};

const getCompetencyColor = (score) => {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-400";
  return "bg-red-500";
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
    competencies: [],
    recentAssessments: [],
    trendData: [],
    percentile: 100,
    delta: null,
    verdict: ""
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
        
        if (!res.attempts || res.attempts.length === 0) {
          setData({
            jobReadiness: 0,
            matchedSkills: 0,
            missingSkills: 0,
            quizzesTaken: 0,
            avgScore: 0,
            topMissing: [],
            skills: [],
            competencies: [],
            percentile: 100,
            recentAssessments: [],
            trendData: [],
            delta: null,
            verdict: ""
          });
          setTargetRole(user?.targetRole || "");
        } else {
          setRawAttempts(res.attempts || []);
          setRawAnalyses(res.analyses || []);
          
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

    const filteredAttempts = rawAttempts.filter(a => 
      a.quizId?.title?.includes(targetRole)
    );

    const filteredAnalyses = rawAnalyses.filter(a => 
      a.targetRole?.toLowerCase() === targetRole.toLowerCase()
    );
    const latestAnalysis = filteredAnalyses.length > 0 ? filteredAnalyses[0] : {};

    const baseScore = latestAnalysis.readinessScore || 0;
    
    const highestQuizScore = filteredAttempts.length > 0 
      ? Math.max(...filteredAttempts.map(a => a.score))
      : 0;

    const jobReadiness = filteredAttempts.length > 0
      ? Math.round((baseScore * 0.3) + (highestQuizScore * 0.7))
      : baseScore;

    const percentile = Math.max(1, Math.round(100 - (jobReadiness * 1.1) + 10));

    const avgScore = filteredAttempts.length 
      ? Math.round(filteredAttempts.reduce((sum, att) => sum + att.score, 0) / filteredAttempts.length)
      : 0;

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
    
    if (finalSkills.length === 0 && latestAnalysis.categoryBreakdown?.length > 0) {
      finalSkills = latestAnalysis.categoryBreakdown.map(cat => ({
        name: cat.category,
        score: cat.score || 0
      }));
    }

    if (finalSkills.length === 0) {
      finalSkills = [
        { name: "Frontend", score: 75 },
        { name: "Backend", score: 60 },
        { name: "Database", score: 80 },
        { name: "Architecture", score: 50 },
        { name: "UI/UX", score: 70 }
      ];
    }

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
      const bucketScore = b.count > 0 ? Math.round(b.score / b.count) : (avgScore > 0 ? Math.max(10, avgScore - 20) : 0);
      return {
        name: b.name,
        score: bucketScore
      };
    });

    let delta = null;
    const sortedAttempts = [...filteredAttempts].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortedAttempts.length >= 2) {
      const latest = sortedAttempts[sortedAttempts.length - 1].score;
      const prev = sortedAttempts[sortedAttempts.length - 2].score;
      delta = latest - prev;
    }

    const lowestComp = competencies.length > 0 ? [...competencies].sort((a, b) => a.score - b.score)[0] : null;
    const verdict = lowestComp ? `Focus on your ${lowestComp.name} skills to improve.` : '';

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
      delta: delta,
      verdict: verdict,
      recentAssessments: filteredAttempts.slice(0, 8).map(att => {
        const dateStr = new Date(att.createdAt).toLocaleDateString();
        let color = "text-emerald-500";
        if (att.score < 50) color = "text-orange-400";
        else if (att.score < 80) color = "text-blue-600";
        
        let total = att.answers?.length > 0 ? att.answers.length : 10;
        let correct = att.answers?.length > 0 ? att.answers.filter(ans => ans.wasCorrect).length : Math.round((att.score / 100) * 10);
        
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

  const uniqueRoles = [...new Set(rawAttempts
    .map(a => a.quizId?.title?.replace("Technical Readiness Assessment - ", "").trim())
    .filter(Boolean)
  )];
  const availableRoles = [...new Set([...ALL_ROLES, ...uniqueRoles])];

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
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 mt-4" 
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-2xl font-bold uppercase shrink-0">
              {firstName.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Hi, {firstName}</h1>
              {targetRole && (
                <div className="flex flex-wrap items-center text-lg md:text-xl text-gray-500 font-normal mt-1 gap-2">
                  targeting 
                  <div className="relative inline-flex items-center">
                    <select 
                      className="appearance-none bg-transparent border-b border-dashed border-gray-300 py-0.5 pr-6 text-blue-600 font-medium cursor-pointer focus:outline-none hover:border-blue-400 transition-colors"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                    >
                      {availableRoles.map((role, idx) => (
                        <option key={idx} value={role}>{role}</option>
                      ))}
                    </select>
                    <svg className="w-4 h-4 absolute right-0 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-4">
            {targetRole && data.quizzesTaken > 0 && (
              <button 
                className="px-6 py-3 border-2 border-blue-100 bg-blue-50 text-blue-700 rounded-md font-medium text-sm hover:bg-blue-100 hover:border-blue-200 transition-colors flex items-center gap-2"
                onClick={() => navigate("/skill-gap")}
              >
                View Skill Gap →
              </button>
            )}
            <button 
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
              onClick={() => navigate("/assessments/setup")}
            >
              {data.quizzesTaken === 0 ? "Take First Assessment" : "New Assessment"} →
            </button>
          </div>
        </motion.div>

        {!targetRole ? (
          <motion.div 
            key="empty-banner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-8 md:p-12 text-center max-w-2xl mx-auto mt-12"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">work</span>
            </div>
            <h2 className="text-2xl font-medium text-gray-800 mb-3">Select your target role</h2>
            <p className="text-gray-500 mb-8 text-lg">Choose the role you're aiming for to unlock your personalized job-readiness dashboard.</p>
            <div className="max-w-md mx-auto relative">
              <select 
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-3.5 px-4 pr-10 text-gray-700 font-medium cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors hover:bg-gray-100 text-lg text-center"
                style={{ textAlignLast: 'center' }}
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              >
                <option value="" disabled>Select a target role...</option>
                {availableRoles.map((role, idx) => (
                  <option key={idx} value={role}>{role}</option>
                ))}
              </select>
              <svg className="w-6 h-6 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key={targetRole}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="dashboard-grid-container grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12" 
          >
            {/* Job Readiness */}
            <motion.div variants={fadeUp} className="grid-item lg:col-span-5 p-8 flex flex-col justify-between min-h-card relative border-l-4 border-l-blue-600">
              <div>
                <div className="flex items-center justify-between pb-2 mb-6">
                  <p className="font-mono text-xs tracking-wider text-gray-500 uppercase cursor-help" title="Your overall readiness for the target role based on assessments and profile">Job Readiness</p>
                  <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">radar</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-6">
                  <div className="relative w-32 h-32 shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                      {data.quizzesTaken > 0 && (
                        <circle 
                          cx="64" cy="64" r="56" 
                          stroke="currentColor" strokeWidth="12" fill="transparent" 
                          strokeDasharray={351.86} 
                          strokeDashoffset={351.86 - (data.jobReadiness / 100) * 351.86} 
                          className="text-blue-600 transition-all duration-1000" 
                        />
                      )}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-light text-gray-900">{data.jobReadiness}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left pt-2">
                    {data.quizzesTaken > 0 ? (
                      <>
                        <div className="text-sm text-blue-600 font-medium mb-2">Top {data.percentile}% of candidates targeting {targetRole}</div>
                        {data.verdict && <p className="text-sm text-gray-600 mt-2">{data.verdict}</p>}
                      </>
                    ) : (
                      <div className="text-sm text-gray-500 mt-2">Take your first assessment to see where you stand.</div>
                    )}
                  </div>
                </div>
                
                {data.quizzesTaken > 0 && data.quizzesTaken < 3 && (
                  <div className="text-[11px] text-gray-500 bg-gray-50 px-3 py-2 rounded mb-4 inline-block">
                    Based on {data.quizzesTaken} assessment{data.quizzesTaken > 1 ? 's' : ''} — accuracy improves as you take more.
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-6 border-t border-gray-100 text-sm mt-auto">
                <div className="text-gray-600"><span className="font-semibold text-gray-900">{data.matchedSkills}</span> Matched</div>
                <div className="text-gray-300">•</div>
                <div className="text-gray-600"><span className="font-semibold text-gray-900">{data.missingSkills}</span> Missing</div>
                <div className="text-gray-300">•</div>
                <div className="text-gray-600"><span className="font-semibold text-gray-900">{data.quizzesTaken}</span> Quizzes</div>
              </div>
            </motion.div>

            {/* Avg Quiz Score */}
            <motion.div variants={fadeUp} className="grid-item lg:col-span-4 p-8 flex flex-col justify-start min-h-card">
              <div className="flex items-center justify-between pb-2 mb-6">
                <p className="font-mono text-xs tracking-wider text-gray-500 uppercase cursor-help" title="Average score across all assessments for this role">Avg Quiz Score</p>
                <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">query_stats</span>
                </div>
              </div>
              
              {data.quizzesTaken > 0 ? (
                <>
                  <div className="flex items-baseline mb-3">
                    <span className="text-7xl font-light text-gray-900">{data.avgScore}</span>
                    <span className="text-3xl text-gray-300 font-light ml-1">%</span>
                  </div>
                  <div className="flex items-center gap-3 mt-auto">
                    <p className="text-gray-500 text-sm">{data.quizzesTaken} session{data.quizzesTaken !== 1 ? 's' : ''}</p>
                    {data.delta !== null && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${data.delta >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {data.delta > 0 ? '+' : ''}{data.delta}% latest
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-grow flex items-center justify-center text-gray-400 text-sm text-center">
                  No quizzes taken
                </div>
              )}
            </motion.div>

            {/* Top Missing */}
            <motion.div variants={fadeUp} className="grid-item lg:col-span-3 p-8 flex flex-col min-h-card">
              <div className="flex items-center justify-between pb-2 mb-6">
                <p className="font-mono text-xs tracking-wider text-gray-500 uppercase cursor-help" title="Skills identified as gaps based on your assessments">Top Missing</p>
                <div className="w-8 h-8 rounded bg-orange-50 text-orange-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">warning</span>
                </div>
              </div>
              
              <div className="flex-grow flex flex-col gap-4">
                {data.quizzesTaken > 0 && data.topMissing.length > 0 ? (
                  data.topMissing.map((skill, index) => (
                    <div key={index} className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-sm text-gray-800 font-medium leading-none">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></div>
                        {skill}
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono uppercase ml-3.5 px-1.5 py-0.5 bg-gray-50 w-fit rounded leading-none border border-gray-100">
                        {getEffortLabel(skill)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex-grow flex items-center justify-center text-gray-400 text-sm text-center">
                    Complete an assessment to identify missing skills.
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quiz Trend */}
            <motion.div variants={fadeUp} className="grid-item lg:col-span-6 p-8 min-h-[320px] flex flex-col relative">
              <div className="flex items-center justify-between pb-2 mb-4">
                <p className="font-mono text-xs tracking-wider text-gray-500 uppercase cursor-help" title="Your assessment score progression over time">Quiz Trend</p>
                <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">timeline</span>
                </div>
              </div>
              
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
                  <div className="flex-grow flex flex-col relative mt-2">
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
                            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2"></stop>
                            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0"></stop>
                          </linearGradient>
                        </defs>
                        <path d={areaD} fill="url(#graphGradient)"></path>
                        <path d={pathD} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                        {displayPts.map((p, i) => (
                          <circle key={i} cx={getX(i)} cy={getY(p.score)} r="4" fill="white" stroke="#4f46e5" strokeWidth="2"></circle>
                        ))}
                        <text x={getX(displayPts.length - 1)} y={getY(displayPts[displayPts.length - 1].score) - 10} textAnchor={isSingle ? "end" : "end"} className="text-[10px] font-bold fill-[#4f46e5] font-mono">
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

            {/* Competency Matrix */}
            <motion.div variants={fadeUp} className="grid-item lg:col-span-6 p-8 min-h-[320px] flex flex-col relative">
              <div className="flex items-center justify-between pb-2 mb-6">
                <p className="font-mono text-xs tracking-wider text-gray-500 uppercase cursor-help" title="Breakdown of your proficiency across core competency areas">Competency Matrix</p>
                <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">category</span>
                </div>
              </div>
              
              <div className="flex-grow flex flex-col justify-center gap-6">
                {data.quizzesTaken > 0 && data.competencies && data.competencies.length > 0 ? (
                  data.competencies.map((comp, index) => (
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
                          className={`h-full rounded-full ${getCompetencyColor(comp.score)}`} 
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-grow flex items-center justify-center text-gray-400 text-sm">
                    Take a quiz to see your progress
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Assessments */}
            <motion.div variants={fadeUp} className="grid-item lg:col-span-12 p-8 min-h-[200px]">
              <div className="flex items-center justify-between pb-2 mb-4">
                <p className="font-mono text-xs tracking-wider text-gray-500 uppercase cursor-help" title="Your most recent quiz attempts">Recent Assessments</p>
                <div className="w-8 h-8 rounded bg-gray-50 text-gray-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">history</span>
                </div>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto pr-6 space-y-2 custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(229, 231, 235) transparent' }}>
                {data.recentAssessments.length === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-400">No assessments taken yet.</div>
                ) : (
                  data.recentAssessments.map((assessment, index) => (
                    <div key={index} className={`flex justify-between items-center py-3 ${index !== data.recentAssessments.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="flex flex-col"> 
                        <span className="text-sm font-medium text-gray-800">{assessment.name}</span> 
                        <span className="text-[11px] text-gray-400 uppercase font-mono mt-0.5">{assessment.time}</span>
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
        )}
      </main>
    </>
  );
}
