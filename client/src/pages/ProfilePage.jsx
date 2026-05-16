import { useEffect, useEffectEvent, useState } from "react";
import { api } from "../api/client";
import { SiteFooter } from "../components/SiteFooter";

export function ProfilePage({ user, onUserUpdate }) {
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [resumeFileName, setResumeFileName] = useState(user?.resumeFileName || "");
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [form, setForm] = useState({
    headline: user?.headline || "",
    targetRole: user?.targetRole || "",
    learningGoal: user?.learningGoal || "",
    experienceLevel: user?.experienceLevel || "Student",
    accessibilityNeeds: user?.accessibilityNeeds || [],
    declaredSkills: user?.declaredSkills?.map((skill) => skill.name).join(", ") || "",
    pastedResumeText: ""
  });

  const hydrateProfile = useEffectEvent((profileUser) => {
    onUserUpdate(profileUser);
    setResumeFileName(profileUser.resumeFileName || "");
    setForm((current) => ({
      ...current,
      headline: profileUser.headline || "",
      targetRole: profileUser.targetRole || "",
      learningGoal: profileUser.learningGoal || "",
      experienceLevel: profileUser.experienceLevel || "Student",
      accessibilityNeeds: profileUser.accessibilityNeeds || [],
      declaredSkills:
        profileUser.declaredSkills?.map((skill) => skill.name).join(", ") || "",
      pastedResumeText: profileUser.resumeText || ""
    }));
  });

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const profileResponse = await api.getProfile();
        hydrateProfile(profileResponse.user);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    setNotice("");

    const declaredSkills = form.declaredSkills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((skill) => ({ name: skill, category: "General", source: "self" }));

    const response = await api.updateProfile({
      headline: form.headline,
      targetRole: form.targetRole,
      learningGoal: form.learningGoal,
      experienceLevel: form.experienceLevel,
      accessibilityNeeds: form.accessibilityNeeds,
      declaredSkills
    });

    onUserUpdate(response.user);
    setNotice("Profile saved.");
  };

  const uploadResume = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploadingResume(true);
    setNotice(`Uploading ${file.name}...`);

    try {
      const response = await api.uploadResume(file);
      onUserUpdate(response.user);
      setResumeFileName(response.user.resumeFileName || file.name);
      setForm((current) => ({
        ...current,
        pastedResumeText: response.user.resumeText || current.pastedResumeText
      }));
      setNotice(`Resume processed successfully: ${response.user.resumeFileName || file.name}`);
    } finally {
      setIsUploadingResume(false);
      event.target.value = "";
    }
  };

  if (loading) {
    return <div className="empty-state">Loading your profile...</div>;
  }

  return (
    <div className="brief-page">
      <section className="content-frame app-frame">
        <div className="module-marker">Module M1 • M2</div>
        <h1 className="app-title">Your profile</h1>
        <p className="app-subtitle">
          Configure your target role and parse your resume to extract skills using NLP.
        </p>

        <div className="two-panel-grid">
          <form className="form-card" onSubmit={saveProfile}>
            <div className="card-label">Career profile</div>
            <h3>Where are you headed?</h3>

            <label>
              Headline
              <input
                value={form.headline}
                onChange={(event) => setForm({ ...form, headline: event.target.value })}
                placeholder="Aspiring MERN developer"
              />
            </label>

            <label>
              Target role
              <input
                value={form.targetRole}
                onChange={(event) => setForm({ ...form, targetRole: event.target.value })}
                placeholder="e.g. Full-stack Engineer"
              />
            </label>

            <label>
              Career goal
              <textarea
                value={form.learningGoal}
                onChange={(event) => setForm({ ...form, learningGoal: event.target.value })}
                placeholder="Land a full-stack engineer role at a product company within 6 months."
              />
            </label>

            <div className="form-split">
              <label>
                Experience level
                <select
                  value={form.experienceLevel}
                  onChange={(event) => setForm({ ...form, experienceLevel: event.target.value })}
                >
                  <option>Student</option>
                  <option>Fresher</option>
                  <option>Early Career</option>
                  <option>Mid Career</option>
                </select>
              </label>

              <label>
                Accessibility needs
                <input
                  value={form.accessibilityNeeds.join(", ")}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      accessibilityNeeds: event.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean)
                    })
                  }
                  placeholder="High contrast, keyboard-first"
                />
              </label>
            </div>

            <label>
              Declared skills
              <input
                value={form.declaredSkills}
                onChange={(event) => setForm({ ...form, declaredSkills: event.target.value })}
                placeholder="React, JavaScript, HTML, CSS, Git"
              />
            </label>

            <div className="form-actions-inline">
              <button className="primary-action" type="submit">
                Save profile
              </button>
              {notice ? <span className="inline-note">{notice}</span> : null}
            </div>
          </form>

          <div className="form-card">
            <div className="card-label">Resume parsing</div>
            <h3>Drop your resume.</h3>

            <label className="resume-drop">
              <span>{isUploadingResume ? "Uploading..." : ".txt or .md or .pdf or .docx"}</span>
              <input type="file" accept=".pdf,.docx,.txt,.md" onChange={uploadResume} hidden />
            </label>

            <label>
              Paste resume text here...
              <textarea
                value={form.pastedResumeText}
                onChange={(event) => setForm({ ...form, pastedResumeText: event.target.value })}
                placeholder="Resume text preview will appear here after upload."
              />
            </label>

            <div className="form-actions-inline">
              <span className={resumeFileName ? "upload-status uploaded" : "upload-status"}>
                {resumeFileName ? `Uploaded: ${resumeFileName}` : "No resume uploaded yet"}
              </span>
            </div>
          </div>
        </div>

        <section className="form-card full-span">
          <div className="card-label">Extracted skills</div>
          <h3>{form.declaredSkills ? `${form.declaredSkills.split(",").filter(Boolean).length} skills on file` : "0 skills on file"}</h3>
          <p>
            {form.declaredSkills
              ? form.declaredSkills
              : "No skills yet. Parse a resume or add declared skills to populate this list."}
          </p>
        </section>
      </section>

      <SiteFooter />
    </div>
  );
}

