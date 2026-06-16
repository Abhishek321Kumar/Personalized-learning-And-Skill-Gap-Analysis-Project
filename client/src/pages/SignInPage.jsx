import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { motion, AnimatePresence } from "framer-motion";

export function SignInPage({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic frontend validation to trigger shake
    if (!formData.email || !formData.password) {
      setError("Both fields are required.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.login(formData);
      window.localStorage.setItem("skillbridge-token", response.token);
      onAuthSuccess(response.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const shakeAnimation = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <main className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto pt-8 pb-16 w-full h-full">
      <motion.section 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-1/2 md:pt-24 hidden md:block"
      >
        <img 
          alt="Person working on a laptop" 
          className="w-full h-full object-cover rounded-lg min-h-[500px]" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQzJ2mz_EM14aFjSpSzBUzgEmwo0qmWERkH9Gc8LPX8w6qXuZwGGtIP1-zOMDQ9ZmMy3LgQZA9V4NmrFgfTozhdgCpbDph966RwfW2xa_YERbgNk6WJ2baKlh6T7y1LLsunXfRzIjunAHebu8gnoYppthyU5u9EnfqApL9IJUaLOSPa_tJKjjjzzswqq7ZuJxWQqLHaswWwthGhQUR59kDqd_wk4xxyO3z-OgTke2JP5wSG3dX-81K7C18J_3j1L2q-oDwukoEKQ" 
        />
      </motion.section>

      {/* RIGHT SIDE: Sign In Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {}
          }}
          className="w-full max-w-[400px]"
        >
          <motion.span variants={fadeUp} className="text-[0.7rem] tracking-[0.1em] uppercase text-[#71717a] inline-block mb-2">
            Sign In
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-4xl font-light mt-2 mb-2">Welcome back.</motion.h2>
          <motion.p variants={fadeUp} className="text-gray-500 mb-10">Continue your skill-gap journey.</motion.p>
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                key={error}
                variants={shakeAnimation}
                initial={{ opacity: 0, height: 0 }}
                animate={["shake", { opacity: 1, height: "auto" }]}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded overflow-hidden"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form variants={fadeUp} className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="text-[0.7rem] tracking-[0.1em] uppercase text-[#71717a] block w-full mb-2" htmlFor="email">
                Email
              </label>
              <input 
                className={`w-full px-4 py-3 border ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} focus:ring-2 focus:border-transparent outline-none transition-all`}
                id="email" 
                name="email" 
                required 
                type="email"
                value={formData.email}
                onChange={e => {
                  setError(null);
                  setFormData({ ...formData, email: e.target.value });
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="text-[0.7rem] tracking-[0.1em] uppercase text-[#71717a] block w-full mb-2" htmlFor="password">
                Password
              </label>
              <input 
                className={`w-full px-4 py-3 border ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} focus:ring-2 focus:border-transparent outline-none transition-all`}
                id="password" 
                name="password" 
                required 
                type="password"
                value={formData.password}
                onChange={e => {
                  setError(null);
                  setFormData({ ...formData, password: e.target.value });
                }}
              />
            </div>

            {/* Sign In Button */}
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-[#0052FF] text-white py-4 font-medium flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : "Sign in →"}
            </motion.button>
          </motion.form>

          <motion.div variants={fadeUp} className="mt-8 text-sm text-gray-500">
            No account? <Link className="!text-[#0052FF] hover:underline" to="/register">Create one</Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
