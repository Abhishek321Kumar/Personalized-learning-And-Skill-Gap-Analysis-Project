import { useState } from "react";
import { motion } from "framer-motion";

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

export function ProfilePage({ user }) {
  const [profile, setProfile] = useState({
    fullName: user?.name || "Alex Thompson",
    email: user?.email || "alex.thompson@example.com",
    dob: user?.dob || "1995-06-15",
    phone: user?.phone || "+1 (555) 012-3456",
    address: user?.address || "123 Innovation Drive, Tech City, TC 94105",
    skills: user?.skills || ["Python", "SQL", "Tableau", "Data Analysis"]
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate updating profile
    alert("Profile updated successfully!");
  };

  return (
    <div className="bg-[#f9f9f8] text-[#1a1c1c] min-h-screen flex flex-col font-sans pt-20">
      <main className="flex-grow max-w-[1280px] mx-auto px-4 md:px-10 py-12 w-full">
        {/* PageHeading */}
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#1a1c1c]">Your profile</h1>
            <p className="text-[#434656] text-lg">Manage your personal information and view your skill analysis.</p>
          </div>
          <div className="flex items-center space-x-4 mr-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-[#f3f4f3] border-2 border-[#e2e2e2] overflow-hidden flex items-center justify-center cursor-pointer hover:border-blue-600 transition-colors shadow-sm">
                <svg className="w-12 h-12 text-[#737688]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full shadow-md border-2 border-white cursor-pointer hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-[#434656] block">Avatar</span>
              <span className="text-xs text-[#737688] font-mono uppercase tracking-widest mt-1 block">JPG or PNG, max 2MB</span>
            </div>
          </div>
        </motion.section>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-8">
          {/* PersonalInformationCard */}
          <motion.section variants={fadeUp} className="bg-white border border-[#c3c5d9] p-8 md:p-10 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="font-mono tracking-widest uppercase text-[12px] text-[#737688] mb-4 border-b border-[#e2e2e2] pb-2">Personal Information</div>
            <h2 className="text-3xl font-medium mb-8 text-[#1a1c1c]">Account Details</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8" onSubmit={handleSubmit}>
              <div>
                <label className="font-mono tracking-widest uppercase text-[12px] text-[#434656] block mb-2 font-bold">Full Name</label>
                <input 
                  name="fullName"
                  className="w-full border border-[#c3c5d9] p-4 text-[#1a1c1c] focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none rounded bg-[#fbfbfb] transition-colors" 
                  type="text" 
                  value={profile.fullName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="font-mono tracking-widest uppercase text-[12px] text-[#434656] block mb-2 font-bold">Email Address</label>
                <input 
                  name="email"
                  className="w-full border border-[#c3c5d9] p-4 text-[#1a1c1c] focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none rounded bg-[#fbfbfb] transition-colors" 
                  type="email" 
                  value={profile.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="font-mono tracking-widest uppercase text-[12px] text-[#434656] block mb-2 font-bold">Date of Birth</label>
                <input 
                  name="dob"
                  className="w-full border border-[#c3c5d9] p-4 text-[#1a1c1c] focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none rounded bg-[#fbfbfb] transition-colors" 
                  type="date" 
                  value={profile.dob}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="font-mono tracking-widest uppercase text-[12px] text-[#434656] block mb-2 font-bold">Phone Number</label>
                <input 
                  name="phone"
                  className="w-full border border-[#c3c5d9] p-4 text-[#1a1c1c] focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none rounded bg-[#fbfbfb] transition-colors" 
                  type="tel" 
                  value={profile.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="font-mono tracking-widest uppercase text-[12px] text-[#434656] block mb-2 font-bold">Home Address</label>
                <textarea 
                  name="address"
                  className="w-full border border-[#c3c5d9] p-4 text-[#1a1c1c] focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none rounded bg-[#fbfbfb] transition-colors resize-none" 
                  rows="3"
                  value={profile.address}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2 mt-2">
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded transition-colors shadow-md shadow-blue-600/20" 
                  type="submit"
                >
                  Update Personal Information
                </button>
              </div>
            </form>
          </motion.section>

          {/* ExtractedSkillsSection */}
          <motion.section variants={fadeUp} className="bg-white border border-[#c3c5d9] p-8 md:p-10 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="font-mono tracking-widest uppercase text-[12px] text-[#737688] mb-4 border-b border-[#e2e2e2] pb-2">Extracted Skills</div>
            <h2 className="text-2xl font-medium mb-6 text-[#1a1c1c]">{profile.skills.length} skills on file</h2>
            {profile.skills.length === 0 ? (
              <p className="text-[#737688]">No skills yet. Complete an assessment or parse a resume to populate this list.</p>
            ) : (
              <div className="flex flex-wrap gap-3 mt-4">
                {profile.skills.map((skill, index) => (
                  <motion.span 
                    key={skill} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + (index * 0.05) }}
                    className="px-4 py-2 bg-[#f3f4f3] text-[#1a1c1c] border border-[#c3c5d9] rounded-sm text-sm font-medium"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
}
