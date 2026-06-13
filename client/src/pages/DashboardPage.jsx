import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
    jobReadiness: 65,
    matchedSkills: 13,
    missingSkills: 7,
    quizzesTaken: 4,
    avgScore: 78,
    topMissing: ["TensorFlow", "Cloud Computing (AWS/GCP)", "Advanced SQL"],
    skills: [
      { name: "Python", score: 85 },
      { name: "Statistics", score: 70 },
      { name: "Machine Learning", score: 60 },
      { name: "Data Visualization", score: 75 }
    ],
    recentAssessments: [
      { name: "Python for Data Science", time: "2 days ago", score: 85, color: "text-emerald-500" },
      { name: "Statistical Analysis", time: "5 days ago", score: 72, color: "text-blue-600" },
      { name: "Machine Learning Basics", time: "1 week ago", score: 60, color: "text-orange-400" }
    ]
  });
  
  const [targetRole, setTargetRole] = useState(user?.targetRole || "data-scientist");

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
        .mono-label {
          font-family: monospace;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          color: #6b7280;
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
            <h1 className="text-5xl font-semibold tracking-tight">Hi, {user?.name?.split(' ')[0] || "Student"}.</h1>
            <p className="text-gray-500 text-sm mt-4 font-mono flex items-center">
              Target role: — 
              <div className="relative inline-flex items-center ml-1">
                <select 
                  className="appearance-none bg-transparent border-none p-0 pr-6 text-gray-800 font-medium underline cursor-pointer focus:ring-0 focus:outline-none text-sm"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                >
                  <option value="data-scientist">Data Scientist</option>
                  <option value="frontend-developer">Frontend Developer</option>
                  <option value="ux-designer">UX Designer</option>
                </select>
                <span className="material-symbols-outlined absolute right-0 pointer-events-none text-sm">expand_more</span>
              </div>
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              className="px-6 py-3 border border-gray-300 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
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
              <p className="mono-label pb-2 mb-4 uppercase">Job Readiness</p>
              <div className="flex items-baseline">
                <span className="text-8xl font-light">{data.jobReadiness}</span>
                <span className="text-3xl text-gray-400 font-light ml-1">%</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
              <div>
                <p className="mono-label text-[10px] uppercase mb-1">Matched</p>
                <p className="text-xl font-medium text-emerald-500">{data.matchedSkills}</p>
              </div>
              <div>
                <p className="mono-label text-[10px] uppercase mb-1">Missing</p>
                <p className="text-xl font-medium text-orange-400">{data.missingSkills}</p>
              </div>
              <div>
                <p className="mono-label text-[10px] uppercase mb-1">Quizzes</p>
                <p className="text-xl font-medium">{data.quizzesTaken}</p>
              </div>
            </div>
          </motion.div>

          {/* Avg Quiz Score Card */}
          <motion.div variants={fadeUp} className="grid-item lg:col-span-4 p-8 flex flex-col justify-start min-h-card">
            <p className="mono-label pb-2 mb-4 uppercase">Avg Quiz Score</p>
            <div className="flex items-baseline mb-2">
              <span className="text-8xl font-light">{data.avgScore}</span>
              <span className="text-3xl text-gray-400 font-light ml-1">%</span>
            </div>
            <p className="text-gray-400 text-sm">{data.quizzesTaken} sessions</p>
          </motion.div>

          {/* Top Missing Card */}
          <motion.div variants={fadeUp} className="grid-item lg:col-span-3 p-8 flex flex-col min-h-card">
            <p className="mono-label pb-2 mb-4 uppercase">Top Missing</p>
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
            <p className="mono-label pb-2 mb-4 uppercase">Quiz Trend</p>
            <h3 className="text-2xl font-normal text-gray-800 mb-8">Progress over time</h3>
            <div className="flex-grow flex flex-col relative mt-4">
              {/* Y-axis reference lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                <div className="border-t border-gray-400 w-full"></div>
                <div className="border-t border-gray-400 w-full"></div>
                <div className="border-t border-gray-400 w-full"></div>
                <div className="border-t border-gray-400 w-full"></div>
              </div>
              
              {/* SVG Line Graph */}
              <div className="relative flex-grow">
                <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0052ff" stopOpacity="0.2"></stop>
                      <stop offset="100%" stopColor="#0052ff" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  
                  {/* Area Fill */}
                  <path d="M 0 160 L 0 56 L 133 48 L 266 40 L 400 35 L 400 160 Z" fill="url(#graphGradient)"></path>
                  
                  {/* Line */}
                  <path d="M 0 56 L 133 48 L 266 40 L 400 35" fill="none" stroke="#0052ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                  
                  {/* Data Points */}
                  <circle cx="0" cy="56" r="4" fill="white" stroke="#0052ff" strokeWidth="2"></circle>
                  <circle cx="133" cy="48" r="4" fill="white" stroke="#0052ff" strokeWidth="2"></circle>
                  <circle cx="266" cy="40" r="4" fill="white" stroke="#0052ff" strokeWidth="2"></circle>
                  <circle cx="400" cy="35" r="4" fill="#0052ff"></circle>
                  
                  {/* Tooltip/Value for Q4 */}
                  <text x="400" y="20" textAnchor="end" className="text-[10px] font-bold fill-[#0052ff] font-mono">78%</text>
                </svg>
              </div>

              {/* X-axis Labels */}
              <div className="flex justify-between mt-4 px-1">
                <span className="text-[10px] text-gray-400 uppercase font-mono">Q1</span>
                <span className="text-[10px] text-gray-400 uppercase font-mono">Q2</span>
                <span className="text-[10px] text-gray-400 uppercase font-mono">Q3</span>
                <span className="text-[10px] text-gray-400 uppercase font-mono">Q4</span>
              </div>
            </div>
          </motion.div>

          {/* Skill Radar Card */}
          <motion.div variants={fadeUp} className="grid-item lg:col-span-6 p-8 min-h-[320px] flex flex-col relative">
            <p className="mono-label pb-2 mb-4 uppercase">Skill Radar</p>
            <div className="flex-grow flex flex-col justify-center gap-4">
              {data.skills.map((skill, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{skill.name}</span>
                    <span>{skill.score}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${skill.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Quizzes Card */}
          <motion.div variants={fadeUp} className="grid-item lg:col-span-12 p-8 min-h-[200px]">
            <p className="mono-label pb-2 mb-4 uppercase">Recent Assessments</p>
            <div className="max-h-[300px] overflow-y-auto pr-6 space-y-4 custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(229, 231, 235) transparent' }}>
              {data.recentAssessments.map((assessment, index) => (
                <div key={index} className={`flex justify-between items-center py-3 ${index !== data.recentAssessments.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="flex flex-col"> 
                    <span className="text-sm font-medium text-gray-800">{assessment.name}</span> 
                    <span className="text-[11px] text-gray-400 uppercase font-mono">{assessment.time}</span>
                  </div>
                  <div className={`text-sm font-bold ${assessment.color}`}>{assessment.score}%</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
        {/* END: BentoGrid */}
      </main>
    </>
  );
}
