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
  const navigate = useNavigate();
  const location = useLocation();
  
  // Persist targetRole in sessionStorage to survive page reloads
  let initialRole = location.state?.targetRole;
  if (!initialRole) {
    initialRole = sessionStorage.getItem("current_quiz_role") || "DATA ANALYSIS";
  } else {
    sessionStorage.setItem("current_quiz_role", initialRole);
  }

  const targetRole = initialRole;
  const storageKey = `quizState_${targetRole.replace(/\s+/g, '_')}`;

  const loadSavedState = () => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const savedState = loadSavedState();

  const [showRules, setShowRules] = useState(savedState ? false : true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(savedState?.currentQuestionIndex || 0);
  const [selectedAnswers, setSelectedAnswers] = useState(savedState?.selectedAnswers || {});

  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  // Initialize state synchronously
  const [questions, setQuestions] = useState(() => savedState?.questions || generateRoleQuestions(targetRole));
  
  const [timeLeft, setTimeLeft] = useState(() => {
    if (savedState?.endTime) {
      const remaining = Math.floor((savedState.endTime - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }
    const initialQuestions = generateRoleQuestions(targetRole);
    return initialQuestions.reduce((total, q) => total + (q.section === 'code_reasoning' ? 2 : 1), 0) * 60;
  });

  const saveState = (newState) => {
    try {
      const existing = loadSavedState() || {};
      sessionStorage.setItem(storageKey, JSON.stringify({ ...existing, ...newState }));
    } catch(e) {}
  };

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

  // Intercept back button and page refresh
  useEffect(() => {
    if (showRules || isExiting || isSubmitting) return;

    // Trap the back button
    window.history.pushState(null, null, window.location.href);

    const handlePopState = (event) => {
      // Prevent leaving by pushing the state back immediately
      window.history.pushState(null, null, window.location.href);
      setShowExitPrompt(true);
    };

    // Prevent page refresh / close
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // Required for most modern browsers to show the native warning prompt
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [showRules, isExiting, isSubmitting]);

  const handleStart = () => {
    setShowRules(false);
    const endTime = Date.now() + timeLeft * 1000;
    saveState({ questions, currentQuestionIndex: 0, selectedAnswers: {}, endTime });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setDirection(1);
      setCurrentQuestionIndex(prev => {
        saveState({ currentQuestionIndex: prev + 1 });
        return prev + 1;
      });
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex(prev => {
        saveState({ currentQuestionIndex: prev - 1 });
        return prev - 1;
      });
    }
  }

  const handleOptionSelect = (questionId, optionIndex) => {
    setSelectedAnswers(prev => {
      const next = { ...prev, [questionId]: optionIndex };
      saveState({ selectedAnswers: next });
      return next;
    });
  };

  const handleFinish = async () => {
    if (questions.length === 0) return;
    sessionStorage.removeItem(storageKey);
    const totalQuestions = questions.length;
    let correctCount = 0;

    const employabilitySkills = {
      aptitude: { correct: 0, total: 0 },
      verbal: { correct: 0, total: 0 },
      codeReasoning: { correct: 0, total: 0 }
    };
    const competencyMatrix = {};

    const finalAnswers = Object.keys(selectedAnswers).map((qId) => {
      const q = questions.find(question => question.id == qId);
      const isCorrect = q.correctAnswer === q.options[selectedAnswers[qId]];
      
      if (isCorrect) correctCount++;

      // Aggregate skills
      if (q.section === "technical") {
        if (!competencyMatrix[q.skill]) {
          competencyMatrix[q.skill] = { correct: 0, total: 0 };
        }
        competencyMatrix[q.skill].total++;
        if (isCorrect) competencyMatrix[q.skill].correct++;
      } else if (q.section === "aptitude") {
        employabilitySkills.aptitude.total++;
        if (isCorrect) employabilitySkills.aptitude.correct++;
      } else if (q.section === "verbal") {
        employabilitySkills.verbal.total++;
        if (isCorrect) employabilitySkills.verbal.correct++;
      } else if (q.section === "code_reasoning") {
        employabilitySkills.codeReasoning.total++;
        if (isCorrect) employabilitySkills.codeReasoning.correct++;
      }

      return {
        questionPrompt: q.text,
        skill: q.skill || q.section,
        selectedAnswer: q.options[selectedAnswers[qId]],
        correctAnswer: q.correctAnswer,
        wasCorrect: isCorrect,
        difficulty: "Medium"
      };
    });

    if (employabilitySkills.codeReasoning.total === 0) {
      delete employabilitySkills.codeReasoning;
    }

    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);

    setIsSubmitting(true);
    try {
      await api.submitMockQuiz({
        score: calculatedScore,
        quizTitle: `Technical Readiness Assessment - ${targetRole}`,
        employabilitySkills,
        competencyMatrix,
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
    // 1. Clear session storage
    sessionStorage.removeItem(storageKey);
    sessionStorage.removeItem("current_quiz_role");
    
    // 2. Clear React state so that if the user navigates back via BFCache, 
    // the quiz doesn't resume from its frozen in-memory state.
    setShowRules(true);
    setQuestions([]);
    setTimeLeft(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    
    // 3. Navigate away
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

  const renderStepper = () => {
    const sections = [];
    let aptCount = 0, verbalCount = 0, codeCount = 0, techCount = 0;
    questions.forEach(q => {
      if (q.section === "aptitude") aptCount++;
      else if (q.section === "verbal") verbalCount++;
      else if (q.section === "code_reasoning") codeCount++;
      else if (q.section === "technical") techCount++;
    });
    
    if (aptCount > 0) sections.push({ id: "aptitude", label: `Aptitude & Reasoning (${aptCount})` });
    if (verbalCount > 0) sections.push({ id: "verbal", label: `Verbal (${verbalCount})` });
    if (codeCount > 0) sections.push({ id: "code_reasoning", label: `Code Reasoning (${codeCount})` });
    if (techCount > 0) sections.push({ id: "technical", label: `${targetRole} Technical (${techCount})` });

    const currentSection = questions[currentQuestionIndex].section;
    
    return (
      <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-[#e2e2e2] pb-6">
        {sections.map((sec, idx) => (
          <div key={sec.id} className="flex items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 rounded-sm transition-colors ${currentSection === sec.id ? 'bg-[#0052ff] text-white' : 'bg-[#e2e2e2] text-[#737688]'}`}>
              {sec.label}
            </span>
            {idx < sections.length - 1 && <span className="text-[#c3c5d9] font-bold">→</span>}
          </div>
        ))}
      </div>
    );
  };

  const renderQuestionText = (text) => {
    if (text.includes("```")) {
      const parts = text.split("```");
      return (
        <div className="flex flex-col text-left">
          <span className="block mb-4">{parts[0]}</span>
          {parts[1] && (
            <pre className="bg-[#1a1c1c] text-white p-5 rounded-md text-[14px] font-mono overflow-x-auto mb-4 border border-[#434656] shadow-inner text-left">
              <code>{parts[1].replace(/^(javascript|js)\n/, '')}</code>
            </pre>
          )}
          {parts[2] && <span className="block">{parts[2]}</span>}
        </div>
      );
    }
    return text;
  };

  return (
    <div className="bg-[#f9f9f8] text-[#1a1c1c] min-h-screen flex flex-col font-sans">
      <AnimatePresence>
        {showRules && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1c1c]/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white border border-[#e2e2e2] p-8 md:p-10 max-w-2xl w-full rounded-xl shadow-2xl flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2 border-b border-[#e2e2e2] pb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 text-[#0052ff] p-2.5 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] tracking-tight">Assessment Guidelines</h2>
                </div>
                <p className="text-[#434656] text-sm md:text-base mt-1">Please review these rules carefully before beginning your technical assessment.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-2">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-[#0052ff]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] text-[15px]">{questions.reduce((total, q) => total + (q.section === 'code_reasoning' ? 2 : 1), 0)}-Minute Timer</h4>
                    <p className="text-[#737688] text-[13px] mt-1 leading-relaxed">The timer starts immediately and cannot be paused. The quiz will auto-submit when time expires.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-[#0052ff]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] text-[15px]">{questions.length} Questions</h4>
                    <p className="text-[#737688] text-[13px] mt-1 leading-relaxed">All questions are multiple-choice and carry equal weight. There is no negative marking.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-red-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] text-[15px]">Do Not Refresh</h4>
                    <p className="text-[#737688] text-[13px] mt-1 leading-relaxed">Refreshing the page, closing the tab, or navigating away will permanently discard your progress.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-green-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] text-[15px]">Stable Connection</h4>
                    <p className="text-[#737688] text-[13px] mt-1 leading-relaxed">Ensure your internet connection is stable before starting to prevent data submission failures.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#e2e2e2]">
                <button 
                  className="w-full bg-[#0052ff] text-white py-3.5 font-medium text-[15px] rounded-md hover:bg-blue-700 transition-colors shadow-sm flex justify-center items-center gap-2 group"
                  onClick={handleStart}
                >
                  I Understand, Start Assessment
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
              </div>
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
                {renderStepper()}

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
                      <h2 className="text-[22px] md:text-[24px] font-medium mb-10 leading-snug text-[#1a1c1c]">
                        {renderQuestionText(questions[currentQuestionIndex].text)}
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
