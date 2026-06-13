import { useEffect, useState } from "react";
import { api } from "../api/client";
import { SiteFooter } from "../components/SiteFooter";

export function SkillGapPage() {
  const [jobs, setJobs] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    selectedJobRoleId: "",
    customJobDescription: ""
  });

  useEffect(() => {
    const bootstrap = async () => {
      const [jobsResponse, latestAnalysis] = await Promise.all([
        api.getJobs(),
        api.getLatestAnalysis().catch(() => ({ snapshot: null }))
      ]);

      setJobs(jobsResponse.jobs);
      setAnalysis(latestAnalysis.snapshot);
    };

    bootstrap();
  }, []);

  const runAnalysis = async () => {
    setNotice("Analyzing gap...");
    const response = await api.runAnalysis({
      jobRoleId: form.selectedJobRoleId,
      jobDescription: form.customJobDescription
    });
    setAnalysis(response.snapshot);
    setNotice("Gap analysis completed.");
  };

  return (
    <div className="brief-page">
      <section className="content-frame app-frame">
        <div className="module-marker">Module M3</div>
        <h1 className="app-title">Skill gap analysis</h1>
        <p className="app-subtitle">
          Paste a job description, extract target skills, and see exactly where you stand.
        </p>

        <div className="two-panel-grid">
          <div className="form-card">
            <div className="card-label">Step 1 • Job description</div>
            <h3>What does the role require?</h3>

            <label>
              Seeded target role
              <select
                value={form.selectedJobRoleId}
                onChange={(event) => setForm({ ...form, selectedJobRoleId: event.target.value })}
              >
                <option value="">Select a role</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Paste the job description here...
              <textarea
                value={form.customJobDescription}
                onChange={(event) =>
                  setForm({ ...form, customJobDescription: event.target.value })
                }
              />
            </label>

            <div className="form-actions-inline">
              <button className="primary-action" onClick={runAnalysis}>
                Analyze gap →
              </button>
              {notice ? <span className="inline-note">{notice}</span> : null}
            </div>
          </div>

          <div className="form-card">
            <div className="card-label">Step 2 • Target skills</div>
            <h3>{analysis?.matchedSkills?.length || 0} matched</h3>
            <p>
              {(analysis?.matchedSkills || []).length
                ? `Matched skills: ${analysis.matchedSkills.join(", ")}`
                : "No matched skills yet."}
            </p>
            <div className="skill-summary-stack">
              <div>
                <div className="card-label">Missing</div>
                <p>{analysis?.missingSkills?.join(", ") || "Analyze a role to see missing skills."}</p>
              </div>
              <div>
                <div className="card-label">Readiness</div>
                <p>{analysis ? `${analysis.readinessScore}% job-readiness` : "No score yet."}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
