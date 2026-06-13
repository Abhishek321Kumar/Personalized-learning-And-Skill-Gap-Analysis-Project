import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function QuizSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-[#f9f9f8] text-[#1a1c1c] font-sans min-h-screen flex items-center justify-center selection:bg-blue-100 selection:text-blue-900">
      <main className="w-full px-4 md:px-10 py-16 flex flex-col items-center justify-center text-center max-w-[1280px]">
        
        {/* Success Icon / Graphic Area */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative flex items-center justify-center mb-8"
        >
          <div className="absolute inset-0 rounded-full border-4 border-blue-600/20 animate-[pulse-ring_2s_cubic-bezier(0.215,0.61,0.355,1)_infinite]"></div>
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-blue-600/30 border border-[#c3c5d9]/30">
            <motion.svg 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-12 h-12 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </motion.svg>
          </div>
        </motion.div>

        {/* Typography Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col gap-4 mb-10 max-w-lg"
        >
          <h1 className="text-3xl md:text-4xl font-medium text-[#1a1c1c] tracking-tight">
            Assessment Submitted Successfully
          </h1>
          <p className="text-base text-[#434656] leading-relaxed">
            Great job! Your responses have been recorded. You are being redirected to your dashboard now.
          </p>
        </motion.div>

        {/* Action / Redirection Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button 
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center justify-center px-6 py-3 border border-[#737688] text-[#1a1c1c] hover:bg-[#f3f4f3] transition-colors duration-200 font-medium text-sm rounded-sm group shadow-sm"
          >
            Go to Dashboard
            <span className="ml-2 text-lg group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </button>
        </motion.div>

        {/* Minimalist Progress Indication */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <div className="w-48 h-1 bg-[#e2e2e2] overflow-hidden rounded-full">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="h-full bg-blue-600"
            ></motion.div>
          </div>
          <span className="font-mono text-[12px] text-[#737688] uppercase tracking-widest">Redirecting</span>
        </motion.div>
      </main>
      
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          80%, 100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
