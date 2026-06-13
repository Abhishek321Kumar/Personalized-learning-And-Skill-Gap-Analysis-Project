import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_QUESTIONS = [
  { id: 1, text: "Which language is primarily used for Android development?", options: ["Java/Kotlin", "Swift", "Python", "Ruby"] },
  { id: 2, text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Question Language", "Structured Question Language", "None of the above"] },
  { id: 3, text: "In React, what hook is used for side effects?", options: ["useEffect", "useState", "useContext", "useReducer"] },
  { id: 4, text: "Which data structure uses LIFO?", options: ["Stack", "Queue", "Tree", "Graph"] },
  { id: 5, text: "What does HTML stand for?", options: ["Hypertext Markup Language", "Hyperlinks Text Mark Language", "Home Tool Markup Language", "None"] },
  { id: 6, text: "Which CSS property controls text size?", options: ["font-size", "text-size", "font-weight", "text-style"] },
  { id: 7, text: "Which is a NoSQL database?", options: ["MongoDB", "MySQL", "PostgreSQL", "Oracle"] },
  { id: 8, text: "What does API stand for?", options: ["Application Programming Interface", "Applied Protocol Interface", "Application Process Integration", "None"] },
  { id: 9, text: "What is Git?", options: ["Version Control System", "Programming Language", "Database", "Operating System"] },
  { id: 10, text: "What does MVC stand for?", options: ["Model View Controller", "Main Visual Component", "Model Visual Control", "None"] },
  { id: 11, text: "Which is a cloud computing platform?", options: ["AWS", "Eclipse", "IntelliJ", "Notepad++"] },
  { id: 12, text: "What is a RESTful API?", options: ["An architectural style for APIs", "A database engine", "A programming language", "A server OS"] },
  { id: 13, text: "What is Docker used for?", options: ["Containerization", "Database management", "UI design", "Word processing"] },
  { id: 14, text: "Which is not an OOP concept?", options: ["Compilation", "Inheritance", "Polymorphism", "Encapsulation"] },
  { id: 15, text: "What does HTTP stand for?", options: ["Hypertext Transfer Protocol", "Hyper Transfer Text Protocol", "Hypertext Translation Protocol", "None"] }
];

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
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (showRules) return;

    if (timeLeft <= 0) {
      handleFinish();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showRules]);

  const handleStart = () => {
    setShowRules(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
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

  const handleFinish = () => {
    navigate("/skill-gap/loading");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
      </AnimatePresence>

      {!showRules && (
        <>
          {/* TopAppBar */}
          <header className="bg-[#f9f9f8] border-b border-[#c3c5d9] w-full top-0 z-50 transition-all duration-200">
            <div className="flex justify-between items-center px-4 md:px-10 py-4 w-full">
              <div className="flex items-center">
                <span className="font-mono text-[12px] text-blue-600 uppercase tracking-widest font-bold">SkillBridge Quiz</span>
              </div>
              <motion.div 
                animate={{ color: timeLeft < 60 ? "#ef4444" : "#2563eb" }}
                className="flex items-center gap-2 font-bold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-base">{formatTime(timeLeft)}</span>
              </motion.div>
            </div>
          </header>

          <main className="flex-grow flex flex-col items-center px-4 md:px-10 py-8 md:py-12">
            <div className="w-full max-w-3xl">
              {/* Progress Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-[12px] text-[#434656] uppercase tracking-widest">Question {currentQuestionIndex + 1} of {MOCK_QUESTIONS.length}</span>
                  <span className="font-mono text-[12px] text-[#434656] tracking-widest">{Math.round(((currentQuestionIndex) / MOCK_QUESTIONS.length) * 100)}%</span>
                </div>
                <div className="w-full bg-[#e2e2e2] h-1 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex) / MOCK_QUESTIONS.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="bg-blue-600 h-1" 
                  />
                </div>
              </div>

              {/* Quiz Container / Bento Card */}
              <div className="bg-white border border-[#c3c5d9] shadow-sm rounded-sm p-8 flex flex-col min-h-[450px]">
                <div className="mb-6 border-b border-[#c3c5d9] pb-2">
                  <span className="font-mono text-[12px] text-[#434656] uppercase tracking-widest">Assessment Category</span>
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
                      className="w-full absolute inset-0"
                    >
                      <h2 className="text-2xl md:text-3xl font-medium mb-8 leading-tight text-[#1a1c1c]">
                        {MOCK_QUESTIONS[currentQuestionIndex].text}
                      </h2>

                      <div className="space-y-4 mb-12">
                        {MOCK_QUESTIONS[currentQuestionIndex].options.map((option, idx) => {
                          const isSelected = selectedAnswers[MOCK_QUESTIONS[currentQuestionIndex].id] === idx;
                          return (
                            <label key={idx} className={`flex items-center p-4 border transition-colors cursor-pointer rounded-sm ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-[#c3c5d9] hover:bg-[#f3f4f3]'}`}>
                              <input 
                                className="form-radio h-5 w-5 text-blue-600 border-[#737688] focus:ring-blue-600" 
                                name="quiz_option" 
                                type="radio"
                                checked={isSelected}
                                onChange={() => handleOptionSelect(MOCK_QUESTIONS[currentQuestionIndex].id, idx)}
                              />
                              <span className="ml-4 text-base font-medium">{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation Actions */}
                <div className="flex justify-between items-center pt-6 mt-16 border-t border-[#c3c5d9]">
                  <button 
                    className="px-6 py-3 border border-[#737688] text-[#1a1c1c] hover:bg-[#f3f4f3] transition-colors flex items-center gap-2 font-medium text-sm disabled:opacity-50 rounded-sm"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    <span className="text-lg leading-none">←</span>
                    Previous
                  </button>
                  
                  <button 
                    className="px-6 py-3 bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 rounded-sm"
                    onClick={handleNext}
                    disabled={selectedAnswers[MOCK_QUESTIONS[currentQuestionIndex].id] === undefined}
                  >
                    {currentQuestionIndex === MOCK_QUESTIONS.length - 1 ? 'Submit Assessment' : 'Next'}
                    <span className="text-lg leading-none">→</span>
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
