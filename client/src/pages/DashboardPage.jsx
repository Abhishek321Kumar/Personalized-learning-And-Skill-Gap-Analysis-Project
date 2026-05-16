import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { SiteFooter } from "../components/SiteFooter";

export function DashboardPage({ user }) {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api
      .getDashboard()
      .then((response) => setDashboard(response))
      .catch(() => setDashboard(null));
  }, []);

  const analysis = dashboard?.latestAnalysis;

  return (
    <div className="brief-page">
      <section className="content-frame app-frame">
        <div className="module-marker">Module M7</div>
        <div className="page-heading-row">
          <div>
            <h1 className="app-title">Hi, {user?.name?.split(" ")[0] || "Learner"}.</h1>
            <p className="app-subtitle">
              Target role — {user?.targetRole || "set one in profile"}
            </p>
          </div>

          <div className="top-actions">
            <Link className="secondary-action" to="/skill-gap">
              Skill gap →
            </Link>
            <Link className="primary-action" to="/quiz">
              New quiz →
            </Link>
          </div>
        </div>

        <div className="dashboard-grid">
          <article className="dashboard-card large">
            <div className="card-label">Job readiness</div>
            <div className="big-metric">{analysis?.readinessScore || 0}%</div>
            <div className="metric-rail" />
            <div className="mini-metrics">
              <div>
                <span>Matched</span>
                <strong>{analysis?.matchedSkills?.length || 0}</strong>
              </div>
              <div>
                <span>Missing</span>
                <strong>{analysis?.missingSkills?.length || 0}</strong>
              </div>
              <div>
                <span>Quizzes</span>
                <strong>{dashboard?.attempts?.length || 0}</strong>
              </div>
            </div>
          </article>

          <article className="dashboard-card">
            <div className="card-label">Avg quiz score</div>
            <div className="mid-metric">{dashboard?.averageAssessmentScore || 0}%</div>
            <p>{dashboard?.attempts?.length || 0} sessions</p>
          </article>

          <article className="dashboard-card">
            <div className="card-label">Top missing</div>
            <p>{analysis?.improvementPriorities?.[0] || "Run a skill gap analysis"}</p>
          </article>

          <article className="dashboard-card wide">
            <div className="card-label">Quiz trend</div>
            <div className="placeholder-plane">
              {dashboard?.attempts?.length
                ? "Recent sessions are recorded below."
                : "Take 2+ quizzes to see your trend."}
            </div>
          </article>

          <article className="dashboard-card wide">
            <div className="card-label">Skill radar</div>
            <div className="placeholder-plane">
              {analysis?.categoryBreakdown?.length
                ? analysis.categoryBreakdown
                    .map((item) => `${item.category}: ${item.coverageScore}%`)
                    .join(" • ")
                : "Run a gap analysis with 3+ target skills to populate this panel."}
            </div>
          </article>

          <article className="dashboard-card full">
            <div className="card-label">Recent quizzes</div>
            {dashboard?.attempts?.length ? (
              <div className="session-list">
                {dashboard.attempts.map((attempt) => (
                  <div key={attempt._id} className="session-row">
                    <span>{attempt.quizId?.title || "Assessment"}</span>
                    <span>{attempt.score}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                No quiz sessions yet. <Link to="/quiz">Take your first quiz →</Link>
              </p>
            )}
          </article>
        </div>

        <div className="sdg-inline-note">
          // SDG 4 • Target 4.4 • Indicator 4.4.1 — your readiness data contributes to
          measurable ICT-skill outcomes.
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
