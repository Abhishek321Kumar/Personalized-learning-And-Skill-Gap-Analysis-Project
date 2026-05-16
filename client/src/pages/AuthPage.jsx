import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { SiteFooter } from "../components/SiteFooter";
import signInImage from "../../../images/sign_in.jpg";
import registerImage from "../../../images/regitser_png.png";

const initialForm = {
  name: "",
  email: "",
  password: "",
  targetRole: ""
};

export function AuthPage({ onAuthSuccess }) {
  const [searchParams] = useSearchParams();
  const defaultMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState(defaultMode);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const artworkClass = useMemo(
    () => (mode === "register" ? "auth-artwork network" : "auth-artwork keyboard"),
    [mode]
  );
  const artworkImage = mode === "register" ? registerImage : signInImage;

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response =
        mode === "register" ? await api.register(form) : await api.login(form);

      window.localStorage.setItem("skillbridge-token", response.token);
      window.localStorage.setItem("skillbridge-user", JSON.stringify(response.user));
      onAuthSuccess(response.user);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brief-page">
      <section className="auth-frame">
        <div className={artworkClass}>
          <img
            src={artworkImage}
            alt={mode === "register" ? "Create account illustration" : "Sign in workspace illustration"}
            className="auth-photo"
          />
          <div className="art-caption">
            {mode === "register" ? "Create your path with structure." : "Continue your skill-gap journey."}
          </div>
        </div>

        <div className="auth-content">
          <div className="micro-label">{mode === "register" ? "Create account" : "Sign in"}</div>
          <h1 className="auth-title">
            {mode === "register" ? "Start your readiness journey." : "Welcome back."}
          </h1>
          <p className="auth-subtitle">
            {mode === "register"
              ? "Build a measurable path to the role you want."
              : "Continue from profile setup to validated job-readiness."}
          </p>

          <form className="auth-form" onSubmit={submit}>
            {mode === "register" ? (
              <label>
                Full name
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Abhishek Anil Kumar"
                />
              </label>
            ) : null}

            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
            </label>

            {mode === "register" ? (
              <label>
                Target role
                <input
                  value={form.targetRole}
                  onChange={(event) => setForm({ ...form, targetRole: event.target.value })}
                  placeholder="Full-stack Engineer"
                />
              </label>
            ) : null}

            {error ? <div className="error-banner">{error}</div> : null}

            <button className="primary-action wide-action" type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "register"
                  ? "Create account →"
                  : "Sign in →"}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "register" ? "Have an account? " : "No account? "}
            <Link to={mode === "register" ? "/auth" : "/auth?mode=register"}>
              {mode === "register" ? "Sign in" : "Create one"}
            </Link>
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
