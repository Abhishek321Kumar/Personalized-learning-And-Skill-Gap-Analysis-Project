import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import abhishekImg from "../images/img_26.png";
import salmanImg from "../images/salman.jpeg";

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

export function AboutPage() {
  const [activeTab, setActiveTab] = useState("mission");

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <motion.section variants={fadeUp}
        className="text-white pt-24 pb-32 px-8 rounded-b-[3rem] text-center relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-[#0052FF]/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gray-900/50"></div>
        <div className="max-w-4xl mx-auto relative z-10 mt-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">About Us</h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Read more about us. Our vision, mission, success and many other things you might love.
          </p>

        </div>
      </motion.section>

      {/* Mission/Vision Section */}
      <motion.section variants={fadeUp} className="py-24 px-8 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              We help bridge your <br /> skill gaps
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              We recognize the importance of upskilling in today's dynamic job market. We are dedicated to providing our users with the best possible tools and support. Our platform is always available to analyze your skills, offer direction, and assist you in maximizing your career potential.
            </p>

            <div className="flex gap-4 border-b border-gray-200 pb-2">
              <button 
                className={`pb-2 px-2 text-sm font-semibold ${activeTab === 'mission' ? 'text-[#0052FF] border-b-2 border-[#0052FF]' : 'text-gray-500'}`}
                onClick={() => setActiveTab('mission')}
              >
                Mission
              </button>
              <button 
                className={`pb-2 px-2 text-sm font-semibold ${activeTab === 'vision' ? 'text-[#0052FF] border-b-2 border-[#0052FF]' : 'text-gray-500'}`}
                onClick={() => setActiveTab('vision')}
              >
                Vision
              </button>
              <button 
                className={`pb-2 px-2 text-sm font-semibold ${activeTab === 'value' ? 'text-[#0052FF] border-b-2 border-[#0052FF]' : 'text-gray-500'}`}
                onClick={() => setActiveTab('value')}
              >
                Our Value
              </button>
            </div>

            <div className="text-gray-600 leading-relaxed min-h-[100px]">
              {activeTab === 'mission' && <p>Our mission is to create a breakthrough for your career by providing an AI-driven, personalized learning environment that accurately identifies and bridges skill gaps.</p>}
              {activeTab === 'vision' && <p>Our vision is to become the leading platform for career progression, empowering individuals worldwide to reach their full potential through continuous, targeted learning.</p>}
              {activeTab === 'value' && <p>We value innovation, user empowerment, and actionable insights. We believe that everyone deserves access to tailored educational resources to achieve their professional goals.</p>}
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-tr from-blue-100 to-purple-100 rounded-3xl overflow-hidden aspect-square md:aspect-[4/3] flex items-center justify-center relative">
               <div className="w-full h-full bg-slate-200 flex items-center justify-center relative">
                 <svg className="w-24 h-24 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                 <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply"></div>
               </div>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl max-w-[200px] border border-gray-100 hidden md:block">
              <div className="text-xs text-gray-500 mb-4 font-semibold uppercase tracking-wider">Online <span className="float-right font-normal text-green-500">Active</span></div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100"></div>
                  <div className="h-2 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100"></div>
                  <div className="h-2 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100"></div>
                  <div className="h-2 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Application Working Section */}
      <motion.section variants={fadeUp} className="py-20 px-8 md:px-12 lg:px-24 bg-slate-50 text-center">
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Take A Vital Look At Our <br /> Application working
          </h2>
          <p className="text-gray-500 text-sm">
            By accessing and using the SkillBridge platform, you agree to be bound by our terms and conditions.
          </p>
        </div>
        <div className="max-w-5xl mx-auto aspect-video bg-gray-800 rounded-3xl overflow-hidden relative shadow-2xl">
           <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
             <div className="w-16 h-16 bg-[#0052FF] text-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg">
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
             </div>
           </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section variants={fadeUp} className="py-16 px-8 max-w-7xl mx-auto w-full">
         <div className="flex flex-wrap justify-center gap-12 md:gap-24 text-center">
           <div>
             <div className="text-4xl font-bold text-gray-900 mb-2">10+</div>
             <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Skills Analyzed</div>
           </div>
           <div>
             <div className="text-4xl font-bold text-gray-900 mb-2">99%</div>
             <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Accuracy Rate</div>
           </div>
           <div>
             <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
             <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Positive Reviews</div>
           </div>
           <div>
             <div className="text-4xl font-bold text-gray-900 mb-2">600+</div>
             <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Trusted Partners</div>
           </div>
         </div>
      </motion.section>

      {/* Developers Section */}
      <motion.section variants={fadeUp} className="py-24 px-8 bg-[#f8faff]">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="text-[#0052FF] text-sm font-bold uppercase tracking-widest mb-4">Developers</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Meet the Developers</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We are the developers behind SkillBridge. We are committed to delivering the most advanced personalized learning solutions while fostering a culture of continuous learning.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-10 max-w-5xl mx-auto">
          {/* Abhishek */}
          <div className="relative group rounded-xl overflow-hidden shadow-md flex-1 max-w-[400px]">
            <div className="aspect-[4/5] bg-gray-200">
              <img src={abhishekImg} alt="Abhishek Anil Kumar" className="w-full h-full object-cover filter grayscale transition-all duration-500 group-hover:grayscale-0" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-lg flex justify-between items-center text-white shadow-lg">
               <div>
                 <div className="font-bold text-lg text-white drop-shadow-md">Abhishek Anil Kumar</div>
                 <div className="text-xs font-medium text-white/90 drop-shadow-md">Software Engineer / Aspiring Full Stack Developer</div>
               </div>
            </div>
          </div>

          {/* Salman */}
          <div className="relative group rounded-xl overflow-hidden shadow-md flex-1 max-w-[400px]">
            <div className="aspect-[4/5] bg-gray-200">
              <img src={salmanImg} alt="Salman" className="w-full h-full object-cover filter grayscale transition-all duration-500 group-hover:grayscale-0" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-lg flex justify-between items-center text-white shadow-lg">
               <div>
                 <div className="font-bold text-lg text-white drop-shadow-md">Salman</div>
                 <div className="text-xs font-medium text-white/90 drop-shadow-md">Still figuring out</div>
               </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features List Section */}
      <motion.section variants={fadeUp} className="py-24 px-8 max-w-7xl mx-auto w-full">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
               <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
                     <span className="text-xl">📚</span>
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-gray-900 mb-2">Personalized Learning</h3>
                     <p className="text-gray-500 text-sm leading-relaxed">
                       Greetings from SkillBridge! We are a group of educational and technological specialists dedicated to assisting learners in becoming more productive and efficient in their practice.
                     </p>
                  </div>
               </div>
               <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 shadow-sm border border-purple-100">
                     <span className="text-xl text-purple-600">🎯</span>
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-gray-900 mb-2">We set the bar</h3>
                     <p className="text-gray-500 text-sm leading-relaxed">
                       SkillBridge created the first AI model trained on career trajectories. That's just one reason users chose us to use their newest model to build a product informed, reliable, and secure enough for professional use.
                     </p>
                  </div>
               </div>
               <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 shadow-sm border border-orange-100">
                     <span className="text-xl text-orange-600">📈</span>
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-gray-900 mb-2">Skill Assessments</h3>
                     <p className="text-gray-500 text-sm leading-relaxed">
                       We appreciate your selection of SkillBridge. We look forward to assisting you in producing more effective and productive skill assessments.
                     </p>
                  </div>
               </div>
            </div>
            <div className="bg-[#0052FF] rounded-[2.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/40 rounded-full blur-3xl -ml-20 -mb-20"></div>
               
               <div className="relative z-10">
                 <h2 className="text-3xl font-bold mb-6 leading-tight">
                   The future of <br /> skill-gap AI
                 </h2>
                 <p className="text-blue-100 mb-10 text-sm leading-relaxed max-w-sm">
                   Fast deployment with our expert support. Boost your learning. Reduce support operations by over 50% fast deployment with our expert support.
                 </p>
                 <Link to="/register" className="inline-block bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg shadow-orange-500/30">
                   Get Started
                 </Link>
               </div>
            </div>
         </div>
      </motion.section>

    </motion.div>
  );
}
