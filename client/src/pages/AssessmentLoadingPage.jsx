import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { motion, AnimatePresence } from "framer-motion";

export function AssessmentLoadingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);

  const analysis = location.state?.analysis;
  const targetRole = location.state?.targetRole || "Unknown Role";
  const jobDescription = location.state?.jobDescription || "";

  const phrases = [
    "Analyzing the job roles and description",
    "Analyzing your skills",
    "Identifying the gaps"
  ];

  useEffect(() => {
    // Phase rotation
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % phrases.length);
    }, 3000);

    // Simulated background loading time for ML service
    const timer = setTimeout(() => {
      if (analysis) {
        navigate("/assessments/review", { state: { analysis, targetRole, jobDescription } });
      } else {
        // Mock fallback if navigated directly
        navigate("/assessments/review", { state: { targetRole, jobDescription } });
      }
    }, 9000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [analysis, navigate, targetRole]);

  return (
    <div className="bg-[#f9f9f8] text-[#1a1c1c] font-sans antialiased min-h-screen relative overflow-hidden flex flex-col pt-16">
      {/* BACKGROUND LAYER (Blurred & Dimmed Dashboard) */}
      <div aria-hidden="true" className="absolute inset-0 z-0 select-none pointer-events-none mt-16">
        <main className="pt-[100px] px-10 max-w-[1280px] mx-auto pb-8 grid grid-cols-1 md:grid-cols-12 gap-6 opacity-40 blur-[4px] grayscale-[20%] transition-all duration-1000">
          <div className="col-span-1 md:col-span-12 mb-3">
            <div className="font-mono text-[12px] tracking-widest text-[#434656] mb-2 uppercase">CURRENT SESSION</div>
            <h1 className="text-3xl font-medium border-b border-[#c3c5d9] pb-3 text-[#1a1c1c]">Skill Gap Analysis: {targetRole}</h1>
          </div>
          {/* Bento Card 1 */}
          <div className="col-span-1 md:col-span-8 bg-white border border-[#c3c5d9] p-8 h-[300px] flex flex-col">
            <div className="font-mono text-[12px] tracking-widest border-b border-[#c3c5d9] pb-2 mb-3">COMPETENCY MAP</div>
            <div className="flex-grow flex items-center justify-center">
              <div className="w-full h-full bg-[#f3f4f3] border border-dashed border-[#c3c5d9] rounded-sm flex items-center justify-center"></div>
            </div>
          </div>
          {/* Bento Card 2 */}
          <div className="col-span-1 md:col-span-4 bg-white border border-[#c3c5d9] p-8 h-[300px] flex flex-col">
            <div className="font-mono text-[12px] tracking-widest border-b border-[#c3c5d9] pb-2 mb-3">READINESS SCORE</div>
            <div className="flex-grow flex flex-col items-center justify-center gap-3">
              <div className="text-5xl font-medium text-blue-600">--%</div>
              <div className="text-sm text-[#434656] text-center">Awaiting analysis completion</div>
            </div>
          </div>
        </main>
      </div>

      {/* FOREGROUND MODAL OVERLAY */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px]"
      >
        {/* Loading Card */}
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white border border-[#c3c5d9] p-10 w-[90%] max-w-[480px] shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden rounded-lg"
        >
          {/* Decorative subtle top border line indicating brand primary */}
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
          {/* Monospaced Label */}
          <div className="font-mono text-[12px] text-[#434656] mb-8 uppercase tracking-wider block">PROCESSING ASSESSMENT</div>
          
          {/* Modern Progress Ring */}
          <div className="relative w-24 h-24 mb-8">
            {/* Track */}
            <svg className="w-full h-full text-gray-200 absolute top-0 left-0" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="4"></circle>
            </svg>
            {/* Animated Indicator */}
            <svg className="w-full h-full text-blue-600 absolute top-0 left-0 animate-[spin_1.5s_linear_infinite]" viewBox="0 0 100 100">
              <circle className="animate-[pulse_2s_ease-in-out_infinite]" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="200" strokeDashoffset="100" strokeLinecap="square" strokeWidth="4"></circle>
            </svg>
            {/* Inner Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
          </div>

          {/* Dynamic Text Container */}
          <div className="h-8 flex items-center justify-center w-full relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p 
                key={phase}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="text-xl font-medium text-[#1a1c1c] absolute"
              >
                {phrases[phase]}
              </motion.p>
            </AnimatePresence>
          </div>
          {/* Secondary static helper text */}
          <p className="text-sm text-[#737688] mt-6">
            Please do not close this window.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
