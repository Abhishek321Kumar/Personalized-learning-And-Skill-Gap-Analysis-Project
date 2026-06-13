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
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div data-purpose="hero-content" initial="hidden" animate="visible" variants={staggerContainer}>
          {/* Hero Title */}
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8 tracking-tight text-[#1a1a1a]">
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

      {/* BEGIN: PlatformSection */}
      <section className="bg-gray-50/50 py-24 border-y border-gray-100">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }} 
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6"
        >
          {/* Section Header */}
          <motion.div variants={fadeUp} className="mb-16">
            <div className="font-mono text-[10px] tracking-[0.2em] text-gray-400 uppercase mb-4">
              The Platform
            </div>
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 max-w-xl">
              Five modules. One coherent flow. Built to grow.
            </h2>
          </motion.div>
          {/* Bento Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 bg-white border border-gray-200 shadow-sm overflow-hidden">
            {/* Card M1 */}
            <motion.div variants={fadeUp} className="p-8 module-card flex flex-col h-full hover:border-skillblue border border-transparent transition-all duration-200">
              <span className="font-mono text-[10px] text-skillblue font-bold mb-4">M1</span>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Authentication &amp; Profile</h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-auto m-0">
                JWT sessions, target role configuration, resume linking.
              </p>
            </motion.div>
            {/* Card M2 */}
            <motion.div variants={fadeUp} className="p-8 module-card flex flex-col h-full border-l border-gray-200 hover:border-skillblue transition-all duration-200">
              <span className="font-mono text-[10px] text-skillblue font-bold mb-4">M2</span>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Resume &amp; JD Parsing</h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-auto m-0">
                NLP-powered skill, qualification &amp; experience extraction.
              </p>
            </motion.div>
            {/* Card M3 */}
            <motion.div variants={fadeUp} className="p-8 module-card flex flex-col h-full border-l border-gray-200 hover:border-skillblue transition-all duration-200">
              <span className="font-mono text-[10px] text-skillblue font-bold mb-4">M3</span>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Skill Gap Analysis</h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-auto m-0">
                Severity scoring + an objective Job-Readiness percentage.
              </p>
            </motion.div>
            {/* Card M4 */}
            <motion.div variants={fadeUp} className="p-8 module-card flex flex-col h-full border-t border-gray-200 hover:border-skillblue transition-all duration-200">
              <span className="font-mono text-[10px] text-skillblue font-bold mb-4">M4</span>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Timed Adaptive Quiz</h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-auto m-0">
                Domain-specific MCQs validate real proficiency. No proctoring.
              </p>
            </motion.div>
            {/* Card M7 */}
            <motion.div variants={fadeUp} className="p-8 module-card flex flex-col h-full border-t border-l border-gray-200 hover:border-skillblue transition-all duration-200">
              <span className="font-mono text-[10px] text-skillblue font-bold mb-4">M7</span>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Progress Analytics</h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-auto m-0">
                Radar charts, trends, session history on a bento dashboard.
              </p>
            </motion.div>
            {/* Card M5+ */}
            <motion.div variants={fadeUp} className="p-8 module-card flex flex-col h-full border-t border-l border-gray-200 hover:border-skillblue transition-all duration-200">
              <span className="font-mono text-[10px] text-skillblue font-bold mb-4">M5+</span>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Roadmap &amp; Re-Assessment</h3>
              <p className="text-sm text-gray-500 leading-relaxed mt-auto m-0">
                Coming soon — modular hooks already wired in.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>
      {/* END: PlatformSection */}

      {/* BEGIN: SDGAlignment */}
      <section className="bg-skillblack text-white pt-24 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start"
        >
          <div>
            <div className="font-mono text-[10px] tracking-widest text-gray-400 uppercase mb-4">Aligned With</div>
            <h2 className="text-4xl font-medium leading-tight text-white m-0">
              UN SDG 4 – Quality Education.
            </h2>
          </div>
          <div className="space-y-8">
            <p className="text-lg leading-relaxed text-gray-300 m-0">
              SkillBridge contributes to <span className="text-white font-semibold">Target 4.4:</span> substantially increasing the number of youth and adults possessing relevant skills for employment, decent jobs and entrepreneurship by 2030 — measured by <span className="text-white font-semibold">Indicator 4.4.1</span>, the proportion of youth and adults with ICT skills.
            </p>
          </div>
        </motion.div>
      </section>
      {/* END: SDGAlignment */}
    </>
  );
}
