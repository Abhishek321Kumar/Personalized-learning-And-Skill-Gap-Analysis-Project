import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export function HomePage({ user }) {
  return (
    <>
      {/* BEGIN: HeroSection */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div data-purpose="hero-content" initial="hidden" animate="visible" variants={staggerContainer}>
          {/* Hero Title */}
          <motion.h1 variants={fadeUp} className="text-5xl md:text-[4rem] font-bold leading-[1.1] mb-8 tracking-tight text-[#1a1a1a]">
            Close the gap between <br />
            <span className="text-skillblue">who you are</span> and <br />
            the role you want.
          </motion.h1>
          {/* Hero Description */}
          <motion.p variants={fadeUp} className="text-lg text-gray-500 leading-relaxed max-w-xl mb-10">
            SkillBridge parses your resume, compares it to a target job, runs adaptive timed assessments, and quantifies your job-readiness — all in one editorial-grade workspace.
          </motion.p>
          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-16">
            {user ? (
              <Link to="/dashboard" className="bg-skillblue text-white px-8 py-3.5 rounded font-semibold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all no-underline">
                Go to Dashboard <span className="text-lg">→</span>
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-skillblue !text-white px-8 py-3.5 rounded font-semibold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all no-underline">
                  Start free assessment <span className="text-lg">→</span>
                </Link>
                <Link to="/login" className="bg-white border border-gray-300 text-gray-900 px-8 py-3.5 rounded font-semibold text-sm hover:bg-gray-50 transition-all no-underline">
                  Sign in
                </Link>  
              </>
            )} 
          </motion.div>
          {/* Quick Stats */}
          <motion.div variants={fadeUp} className="flex gap-12 border-t border-gray-100 pt-8 items-end">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#1a1a1a] h-8 flex items-center">5</span>
              <span className="font-mono text-[10px] tracking-widest text-gray-400 uppercase border-t border-gray-900 pt-1 mt-1">Modules Live</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold uppercase text-[#1a1a1a] h-8 flex items-center">NLP</span>
              <span className="font-mono text-[10px] tracking-widest text-gray-400 uppercase border-t border-gray-200 pt-1 mt-1">Resume Parsing</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 h-8">
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <span className="font-mono text-[10px] tracking-widest text-gray-400 uppercase border-t border-gray-200 pt-1 mt-1">Timed Quizzes</span>
            </div>
          </motion.div>
        </motion.div>
        {/* Hero Visual */}
        <motion.div 
          data-purpose="hero-image-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl"
        >
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsLavKB9rc9DBU3i1tk602XH99H5okribgCMtSbLKnQaHSn2olO_wO-SaNHhJ2XFvcwiZUI8rnfs-3dUG99zn2luG6SUzgEpi9gfnV548uNZBuixnVer03KtUSD3tC6S4iKQAQ7xmkdVyZOg6AaAiUh6XfCeBPSi9L-1VbTS3KTWLlMSPDPL6bpaImsANgh9q67B8hMaDgShqvgtXdFbAOc57nvkE5f2-pgbjsBjpWXHTmrXD_2JIOVUHCqRkQDEok3H00ccNJpA" alt="Modern office workspace" className="w-full h-auto object-cover grayscale-[0.2]" />
        </motion.div>
      </section>
      {/* END: HeroSection */}

      {/* BEGIN: HowItWorksSection */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-16">
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="font-mono text-[10px] tracking-[0.2em] text-gray-400 uppercase mb-4 block">Process</span>
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 text-center">How it works</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gray-100 z-0"></div>

          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center relative z-10"
          >
            <div className="w-24 h-24 bg-white border-2 border-gray-100 rounded-2xl shadow-sm flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-skillblue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">1. Upload Resume</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[250px]">Our NLP engine parses your experience and identifies your baseline skills.</p>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center text-center relative z-10"
          >
            <div className="w-24 h-24 bg-white border-2 border-gray-100 rounded-2xl shadow-sm flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-skillblue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">2. Take Assessment</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[250px]">Complete adaptive quizzes tailored to the specific role you want.</p>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center text-center relative z-10"
          >
            <div className="w-24 h-24 bg-skillblue rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">3. Get Ready</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[250px]">Follow the personalized roadmap to close your skill gaps and get hired.</p>
          </motion.div>
        </div>
      </section>
      {/* END: HowItWorksSection */}

      {/* BEGIN: PlatformSection */}
      <section className="bg-gray-50/50 py-16 border-y border-gray-100">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }} 
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6"
        >
          {/* Section Header */}
          <motion.div variants={fadeUp} className="mb-16 text-center flex flex-col items-center">
            <div className="font-mono text-[10px] tracking-[0.2em] text-gray-400 uppercase mb-4">
              The Platform
            </div>
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 max-w-xl text-center">
              Five modules. One coherent flow. Built to grow.
            </h2>
          </motion.div>
          {/* Bento Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 bg-white border border-gray-200 shadow-sm overflow-hidden">
            {/* Card M1 */}
            <motion.div variants={fadeUp} className="p-8 module-card flex flex-col h-full hover:-translate-y-1 hover:shadow-xl relative hover:z-10 hover:border-skillblue border border-transparent hover:bg-blue-50/40 transition-all duration-300 cursor-pointer group">
              <span className="font-mono text-[10px] text-skillblue font-bold mb-4">M1</span>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Authentication &amp; Profile</h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-auto m-0">
                JWT sessions, target role configuration, resume linking.
              </p>
            </motion.div>
            {/* Card M2 */}
            <motion.div variants={fadeUp} className="p-8 module-card flex flex-col h-full border-l border-transparent md:border-gray-200 hover:-translate-y-1 hover:shadow-xl relative hover:z-10 hover:border-skillblue hover:bg-blue-50/40 transition-all duration-300 cursor-pointer group">
              <span className="font-mono text-[10px] text-skillblue font-bold mb-4">M2</span>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Resume &amp; JD Parsing</h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-auto m-0">
                NLP-powered skill, qualification &amp; experience extraction.
              </p>
            </motion.div>
            {/* Card M3 */}
            <motion.div variants={fadeUp} className="p-8 module-card flex flex-col h-full border-l border-transparent lg:border-gray-200 hover:-translate-y-1 hover:shadow-xl relative hover:z-10 hover:border-skillblue hover:bg-blue-50/40 transition-all duration-300 cursor-pointer group">
              <span className="font-mono text-[10px] text-skillblue font-bold mb-4">M3</span>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Skill Gap Analysis</h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-auto m-0">
                Severity scoring + an objective Job-Readiness percentage.
              </p>
            </motion.div>
            {/* Card M4 */}
            <motion.div variants={fadeUp} className="p-8 module-card flex flex-col h-full border-t border-transparent md:border-gray-200 hover:-translate-y-1 hover:shadow-xl relative hover:z-10 hover:border-skillblue hover:bg-blue-50/40 transition-all duration-300 cursor-pointer group">
              <span className="font-mono text-[10px] text-skillblue font-bold mb-4">M4</span>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Timed Adaptive Quiz</h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-auto m-0">
                Domain-specific MCQs validate real proficiency. No proctoring.
              </p>
            </motion.div>
            {/* Card M5 */}
            <motion.div variants={fadeUp} className="p-8 module-card flex flex-col h-full border-t border-l border-transparent md:border-gray-200 hover:-translate-y-1 hover:shadow-xl relative hover:z-10 hover:border-skillblue hover:bg-blue-50/40 transition-all duration-300 cursor-pointer group">
              <span className="font-mono text-[10px] text-skillblue font-bold mb-4">M5</span>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Progress Analytics</h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-auto m-0">
                Radar charts, trends, session history on a bento dashboard.
              </p>
            </motion.div>
            {/* Card M6 */}
            <motion.div variants={fadeUp} className="p-8 module-card flex flex-col h-full border-t border-l border-transparent md:border-gray-200 hover:-translate-y-1 hover:shadow-xl relative hover:z-10 hover:border-skillblue hover:bg-blue-50/40 transition-all duration-300 cursor-pointer group">
              <span className="font-mono text-[10px] text-skillblue font-bold mb-4">M6</span>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Roadmap &amp; Re-Assessment</h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-auto m-0">
                Coming soon — modular hooks already wired in.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>
      {/* END: PlatformSection */}
    </>
  );
}
