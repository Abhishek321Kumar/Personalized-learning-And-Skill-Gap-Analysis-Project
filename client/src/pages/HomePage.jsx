import { Link } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import homeImage from "../../../images/home_png.png";

export function HomePage({ modules, user }) {
  const moduleMap = new Map(modules.map((module) => [module.code, module]));
  const homeModules = ["M1", "M2", "M3", "M4", "M7", "M5"];

  return (
    <div className="brief-page">
      <section className="hero-frame">
        <div className="hero-copy-block">
          <div className="micro-label">SDG 4 • Target 4.4 • Indicator 4.4.1</div>
          <h1 className="hero-title">
            Close the gap between <span>who you are</span> and the role you want.
          </h1>
          <p className="hero-text">
            SkillBridge parses your resume, compares it to a target job, runs adaptive timed
            assessments, and quantifies your job-readiness — all in one editorial-grade
            workspace.
          </p>
          <div className="hero-actions">
            <Link className="primary-action" to={user ? "/dashboard" : "/auth?mode=register"}>
              Start free assessment →
            </Link>
            <Link className="secondary-action" to={user ? "/profile" : "/auth"}>
              Sign in
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <strong>5</strong>
              <span>Modules live</span>
            </div>
            <div>
              <strong>NLP</strong>
              <span>Resume parsing</span>
            </div>
            <div>
              <strong>⏱</strong>
              <span>Timed quizzes</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-card">
            <img src={homeImage} alt="SkillBridge workspace preview" className="hero-visual-image" />
          </div>
        </div>
      </section>

      <section className="content-frame">
        <div className="section-kicker">The platform</div>
        <h2 className="section-title">Five modules. One coherent flow. Built to grow.</h2>
        <div className="module-board">
          {homeModules.map((code) => {
            const module = moduleMap.get(code);
            if (!module) {
              return null;
            }

            return (
              <article key={code} className="board-card">
                <div className="board-code">{code}</div>
                <h3>{module.name}</h3>
                <p>{module.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="impact-band">
        <div>
          <div className="impact-label">Aligned with</div>
          <h2>UN SDG 4 – Quality Education.</h2>
        </div>
        <div>
          <p>
            SkillBridge contributes to Target 4.4: substantially increasing the number of
            youth and adults possessing relevant skills for employment, decent jobs and
            entrepreneurship by 2030 — measured by Indicator 4.4.1, the proportion of youth
            and adults with ICT skills.
          </p>
          <code>// We turn unstructured self-study into a measurable, outcome-oriented learning journey.</code>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
