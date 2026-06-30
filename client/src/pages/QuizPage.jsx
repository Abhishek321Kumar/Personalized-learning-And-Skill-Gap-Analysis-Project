import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api/client";
import { generateRoleQuestions } from "../utils/mockQuestions";

const questionVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

export function QuizPage() {
  const [showRules, setShowRules] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 mins
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const targetRole = location.state?.targetRole || "DATA ANALYSIS";
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Dynamically fetch role-specific questions
    setQuestions(generateRoleQuestions(targetRole));
  }, [targetRole]);

  useEffect(() => {
    if (showRules || questions.length === 0 || showExitPrompt || isExiting) return;

    if (timeLeft <= 0) {
      handleFinish();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showRules, questions.length]);

  // Intercept back button to show exit prompt
  useEffect(() => {
    if (showRules || isExiting || isSubmitting) return;

    // Trap the back button
    window.history.pushState(null, null, window.location.href);

    const handlePopState = (event) => {
      // Prevent leaving by pushing the state back immediately
      window.history.pushState(null, null, window.location.href);
      setShowExitPrompt(true);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [showRules, isExiting, isSubmitting]);

  const handleStart = () => {
    setShowRules(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setDirection(1);
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }

  const handleOptionSelect = (questionId, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleFinish = async () => {
    if (questions.length === 0) return;
    const totalQuestions = questions.length;
    let correctCount = 0;
    
    Object.keys(selectedAnswers).forEach(qId => {
      const q = questions.find(question => question.id == qId);
      if (q && q.correctIndex === selectedAnswers[qId]) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);

    const roleSkills = targetRole.toLowerCase().includes("design") ? ["UI/UX", "Prototyping", "User Research", "Wireframing", "Interaction Design"] :
                       targetRole.toLowerCase().includes("data") ? ["Data Cleaning", "Machine Learning", "Statistics", "Data Visualization", "SQL"] :
                       targetRole.toLowerCase().includes("product") ? ["Agile", "Product Strategy", "User Stories", "Analytics", "Prioritization"] :
                       ["Frontend", "Backend", "Database", "Architecture", "DevOps"];

    const finalAnswers = Object.keys(selectedAnswers).map((qId, index) => {
      const q = questions.find(question => question.id == qId);
      const assignedSkill = roleSkills[index % roleSkills.length];
      return {
        questionPrompt: q.text,
        skill: assignedSkill,
        selectedAnswer: q.options[selectedAnswers[qId]],
        correctAnswer: q.options[q.correctIndex],
        wasCorrect: q.correctIndex === selectedAnswers[qId],
        difficulty: "Medium"
      };
    });

    setIsSubmitting(true);
    try {
      await api.submitMockQuiz({
        score: calculatedScore,
        quizTitle: `Technical Readiness Assessment - ${targetRole}`,
        answers: finalAnswers
      });
    } catch (e) {
      console.error("Failed to submit quiz score", e);
    } finally {
      setIsSubmitting(false);
      navigate("/assessments/success");
    }
  };

  const handleExitConfirm = () => {
    setShowExitPrompt(false);
    setIsExiting(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return <div className="bg-[#f9f9f8] min-h-screen flex items-center justify-center text-gray-500 font-sans">Loading questions...</div>;
  }

  return (
    <div className="bg-[#f9f9f8] text-[#1a1c1c] min-h-screen flex flex-col font-sans">
      <AnimatePresence>
        {showRules && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border border-[#c3c5d9] p-8 max-w-lg w-full rounded shadow-xl"
            >
              <h2 className="text-2xl font-semibold mb-4 text-[#1a1c1c]">Assessment Rules</h2>
              <ul className="list-disc pl-5 mb-8 text-[#434656] space-y-2 text-sm leading-relaxed">
                <li>You will have 15 minutes to complete 15 questions.</li>
                <li>Out of 15 questions, your top 10 correct answers are taken for calculating your total score.</li>
                <li>Do not refresh or close this tab, or your progress will be lost.</li>
                <li>Ensure you have a stable internet connection.</li>
              </ul>
              <button 
                className="w-full bg-blue-600 text-white py-3 font-medium text-sm rounded hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
                onClick={handleStart}
              >
                I Understand, Start Assessment
              </button>
            </motion.div>
          </motion.div>
        )}

        {showExitPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border border-[#c3c5d9] p-8 max-w-sm w-full rounded shadow-xl text-center"
            >
              <h2 className="text-xl font-semibold mb-2 text-[#1a1c1c]">Exit Assessment?</h2>
              <p className="text-[#434656] text-sm mb-8">
                Are you sure you want to exit? Your progress will not be saved and no results will be recorded.
              </p>
              <div className="flex gap-4">
                <button 
                  className="flex-1 border border-[#c3c5d9] text-[#434656] py-2.5 font-medium text-sm rounded hover:bg-gray-50 transition-colors"
                  onClick={() => setShowExitPrompt(false)}
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 bg-red-600 text-white py-2.5 font-medium text-sm rounded hover:bg-red-700 transition-colors shadow-sm"
                  onClick={handleExitConfirm}
                >
                  Yes, Exit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isExiting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#f9f9f8] flex-col"
          >
            <svg className="w-12 h-12 text-blue-600 animate-[spin_1.5s_linear_infinite] mb-4" viewBox="0 0 100 100">
              <circle className="animate-[pulse_2s_ease-in-out_infinite]" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="200" strokeDashoffset="100" strokeLinecap="square" strokeWidth="8"></circle>
            </svg>
            <p className="text-lg font-medium text-[#1a1c1c]">Exiting Assessment...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!showRules && (
        <>
          {/* TopAppBar */}
          <header className="bg-[#f9f9f8] border-b border-[#e2e2e2] w-full top-0 z-50">
            <div className="flex justify-between items-center px-6 md:px-12 py-5 w-full max-w-[1400px] mx-auto">
              <div className="flex items-center">
                <span className="text-[24px] font-bold tracking-tight text-[#1a1a1a]">
                  Skill<span className="text-[#0052FF]">Bridge</span>
                </span>
                <span className="text-[#434656] font-normal italic text-[20px] ml-2 mt-[2px]">Quiz</span>
              </div>
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setShowExitPrompt(true)}
                  className="px-4 py-1.5 border border-[#c3c5d9] rounded text-[14px] font-medium text-[#434656] hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                >
                  Exit Quiz
                </button>
                <motion.div 
                  animate={{ color: timeLeft < 60 ? "#ef4444" : "#2563eb" }}
                  className="flex items-center gap-2 font-bold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span className="text-base">{formatTime(timeLeft)}</span>
                </motion.div>
              </div>
            </div>
          </header>

          <main className="flex-grow flex flex-col items-center px-4 md:px-10 py-8 md:py-12">
            <div className="w-full max-w-3xl">
              {/* Progress Section */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-[12px] text-[#434656] font-bold uppercase tracking-[0.15em]">Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span className="font-mono text-[12px] text-[#434656] font-bold tracking-[0.05em]">{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-[#e2e2e2] h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="bg-[#0052ff] h-1" 
                  />
                </div>
              </div>

              {/* Quiz Container / Bento Card */}
              <div className="bg-white border border-[#c3c5d9] shadow-sm rounded-sm p-10 flex flex-col min-h-[450px]">
                <div className="mb-8 border-b border-[#e2e2e2] pb-3">
                  <span className="font-mono text-[11px] text-[#737688] font-bold uppercase tracking-[0.2em]">{targetRole}</span>
                </div>

                <div className="flex-grow relative">
                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                      key={currentQuestionIndex}
                      custom={direction}
                      variants={questionVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                      }}
                      className="w-full"
                    >
                      <h2 className="text-[26px] md:text-[28px] font-medium mb-10 leading-snug text-[#1a1c1c]">
                        {questions[currentQuestionIndex].text}
                      </h2>

                      <div className="space-y-4 mb-12">
                        {questions[currentQuestionIndex].options.map((option, idx) => {
                          const isSelected = selectedAnswers[questions[currentQuestionIndex].id] === idx;
                          return (
                            <label 
                              key={idx} 
                              className={`flex items-center p-4 border transition-colors cursor-pointer rounded-sm ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-[#c3c5d9] hover:bg-[#f9f9f8]'}`}
                              onClick={() => handleOptionSelect(questions[currentQuestionIndex].id, idx)}
                            >
                              <div className={`flex items-center justify-center w-5 h-5 min-w-[20px] rounded-full border ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-400 bg-white'}`}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <span className={`ml-4 text-base ${isSelected ? 'text-blue-900 font-medium' : 'text-[#434656] font-normal'}`}>{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation Actions */}
                <div className="flex justify-between items-center pt-8 mt-auto border-t border-[#e2e2e2]">
                  <button 
                    className="px-6 py-2.5 border border-[#c3c5d9] text-[#434656] hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium text-[14px] disabled:opacity-50 rounded-sm"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Previous
                  </button>
                  
                  <button 
                    className="px-6 py-2.5 bg-[#0052ff] text-white flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium text-[14px] disabled:opacity-50 rounded-sm"
                    onClick={handleNext}
                    disabled={selectedAnswers[questions[currentQuestionIndex].id] === undefined || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : (currentQuestionIndex === questions.length - 1 ? 'Submit Assessment' : 'Next')}
                    {!isSubmitting && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                  </button>
                </div>
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
