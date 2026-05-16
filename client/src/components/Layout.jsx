import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const publicNavItems = [
  { to: "/auth", label: "Sign in" },
  { to: "/auth?mode=register", label: "Get started", accent: true }
];

const privateNavItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/profile", label: "Profile" },
  { to: "/skill-gap", label: "Skill Gap" },
  { to: "/quiz", label: "Quiz" }
];

export function Layout({ children, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    window.localStorage.removeItem("skillbridge-token");
    window.localStorage.removeItem("skillbridge-user");
    navigate("/auth");
    window.location.reload();
  };

  const isPublicPage = !user && (location.pathname === "/" || location.pathname === "/auth");

  return (
    <div className={isPublicPage ? "site-shell public-shell" : "site-shell"}>
      <header className="frame-nav">
        <Link to={user ? "/dashboard" : "/"} className="wordmark">
          Skill<span>Bridge</span>
        </Link>

        <nav className="frame-links">
          {(user ? privateNavItems : publicNavItems).map((item) =>
            item.accent ? (
              <Link key={item.to} to={item.to} className="nav-cta">
                {item.label}
              </Link>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "frame-link active" : "frame-link"
                }
              >
                {item.label}
              </NavLink>
            )
          )}

          {user ? (
            <button className="frame-link plain-button" onClick={logout}>
              Sign out
            </button>
          ) : null}
        </nav>
      </header>

      <main className="frame-page">{children}</main>
    </div>
  );
}

