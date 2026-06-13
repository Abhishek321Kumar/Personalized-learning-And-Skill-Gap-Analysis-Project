import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { SiteFooter } from "../components/SiteFooter";

export function AssessmentPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [attemptId, setAttemptId] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.getQuizzes().then((response) => {
      setQuizzes(response.quizzes);
      if (response.quizzes[0]) {
        setSelectedQuizId(response.quizzes[0]._id);
      }
    });
  }, []);

  useEffect(() => {
    if (status !== "running" || timeLeft <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status, timeLeft]);

  useEffect(() => {
    if (status === "running" && timeLeft <= 0) {
      setStatus("expired");
    }
  }, [status, timeLeft]);

  const selectedQuiz = useMemo(
    () => quizzes.find((quiz) => quiz._id === selectedQuizId) || null,
    [quizzes, selectedQuizId]
  );

  const formattedTime = useMemo(() => {
    const minutes = String(Math.max(0, Math.floor(timeLeft / 60))).padStart(2, "0");
    const seconds = String(Math.max(0, timeLeft % 60)).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [timeLeft]);

  const startQuiz = async () => {
    if (!selectedQuizId) {
      return;
    }

    const response = await api.startQuiz(selectedQuizId);
    setActiveQuiz(response.quiz);
    setActiveQuestion(response.question);
    setAttemptId(response.attemptId);
    setStatus("running");
    setTimeLeft(response.quiz.timeLimitMinutes * 60);
    setSelectedAnswer("");
    setScore(0);
    setResult(null);
  };

  const submitAnswer = async () => {
    if (!selectedAnswer || !activeQuestion) {
      return;
    }

    const response = await api.submitAnswer({
      attemptId,
      questionPrompt: activeQuestion.prompt,
      selectedAnswer
    });

    setScore(response.score);
    setSelectedAnswer("");

    if (response.finished) {
      const attemptResponse = await api.getAttempt(attemptId);
      setResult(attemptResponse.attempt);
      setStatus("finished");
      setActiveQuestion(null);
      return;
    }

    setActiveQuestion(response.nextQuestion);
  };

  return (
    <div className="brief-page">
      <section className="content-frame app-frame narrow">
        <h1 className="app-title">Timed adaptive quiz</h1>
        <p className="app-subtitle">
          Pick the quiz you want to validate. The clock runs the moment you start — no
          proctoring, just focus.
        </p>

        {!activeQuiz ? (
          <article className="form-card slim">
            <label>
              Quiz track
              <select
                value={selectedQuizId}
                onChange={(event) => setSelectedQuizId(event.target.value)}
              >
                {quizzes.map((quiz) => (
                  <option key={quiz._id} value={quiz._id}>
                    {quiz.title}
                  </option>
                ))}
              </select>
            </label>

            <div className="quiz-config-grid">
              <label>
                Questions per quiz
                <input value={selectedQuiz?.totalQuestions || 0} readOnly />
              </label>

              <label>
                Seconds per question
                <input
                  value={
                    selectedQuiz
                      ? Math.round((selectedQuiz.timeLimitMinutes * 60) / selectedQuiz.totalQuestions)
                      : 0
                  }
                  readOnly
                />
              </label>
            </div>

            <button className="primary-action" onClick={startQuiz}>
              Start quiz →
            </button>
          </article>
        ) : (
          <div className="quiz-runtime">
            <div className="runtime-header">
              <div>
                <div className="card-label">{activeQuiz.title}</div>
                <p>{activeQuiz.totalQuestions} adaptive questions</p>
              </div>
              <div className={timeLeft < 90 ? "runtime-timer danger" : "runtime-timer"}>
                {formattedTime}
              </div>
            </div>

            {status === "running" && activeQuestion ? (
              <article className="question-runtime">
                <div className="card-label">{activeQuestion.difficulty}</div>
                <h3>{activeQuestion.prompt}</h3>
                <div className="answer-list">
                  {activeQuestion.options.map((option) => (
                    <label
                      key={option.value}
                      className={selectedAnswer === option.value ? "answer-row selected" : "answer-row"}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option.value}
                        checked={selectedAnswer === option.value}
                        onChange={(event) => setSelectedAnswer(event.target.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                <div className="runtime-actions">
                  <button className="primary-action" onClick={submitAnswer}>
                    Submit answer
                  </button>
                  <span className="live-pill">Live score: {score}%</span>
                </div>
              </article>
            ) : null}

            {status === "expired" ? (
              <div className="error-banner">Time is up. Start again to complete the quiz.</div>
            ) : null}

            {status === "finished" && result ? (
              <article className="dashboard-card full">
                <div className="card-label">Assessment summary</div>
                <div className="session-list">
                  <div className="session-row">
                    <span>Final score</span>
                    <span>{result.score}%</span>
                  </div>
                  <div className="session-row">
                    <span>Adaptive trail</span>
                    <span>{(result.adaptiveTrail || []).join(" → ")}</span>
                  </div>
                  <div className="session-row">
                    <span>Readiness impact</span>
                    <span>+{result.readinessImpact}%</span>
                  </div>
                </div>
              </article>
            ) : null}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
