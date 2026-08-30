import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SiteFooter } from "./SiteFooter";

const publicNavItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/blogs", label: "Blogs" },
  { to: "/login", label: "Log in", isButton: true }
];

const privateNavItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/assessments/setup", label: "Assessments", isActiveRoute: "/assessments" },
  { to: "/skill-gap", label: "Skill Gap" },
];

export function Layout({ children, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logout = () => {
    window.localStorage.removeItem("skillbridge-token");
    window.localStorage.removeItem("skillbridge-user");
    navigate("/login");
    window.location.reload();
  };

  const isQuizPage = location.pathname === "/assessments/quiz";
  const isPublicPage = !user && (location.pathname === "/" || location.pathname === "/login" || location.pathname.startsWith("/register"));
  const isPrivatePage = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/assessments") || location.pathname.startsWith("/skill-gap") || location.pathname.startsWith("/profile");

  return (
    <div className={isPublicPage ? "site-shell public-shell" : "site-shell"}>
      {!isQuizPage && (
        <header 
          className="bg-white border-b border-gray-100 py-6 px-8 md:px-12 lg:px-24 flex justify-between items-center fixed top-0 w-full z-50 mb-12" 
          data-purpose="main-header"
        >
        <div className="flex items-center gap-2">
          <Link to={user ? "/dashboard" : "/"} className="no-underline">
            <span className="text-3xl font-bold tracking-tight text-[#1a1a1a]">
              Skill<span className="text-[#0052FF]">Bridge</span>
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-lg font-medium text-gray-600">
          {isPrivatePage ? (
            <>
              {privateNavItems.map((item) => {
                const isActive = location.pathname === item.to || (item.isActiveRoute && location.pathname.startsWith(item.isActiveRoute));
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`transition-colors text-lg ${isActive ? 'nav-active-blue font-semibold' : 'text-gray-600 hover-nav-blue'}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {user && (
                <Link 
                  to="/" 
                  className="text-[#0052FF] font-semibold border-2 border-[#0052FF] px-4 py-1.5 rounded-md text-base hover:bg-[#0052FF] hover:!text-white transition-colors ml-2"
                >
                  Go to Home
                </Link>
              )}
            </>
          ) : (
            <>
              {publicNavItems.map((item) => {
                const isActive = location.pathname === item.to || (item.isActiveRoute && location.pathname.startsWith(item.isActiveRoute));
                
                if (item.isButton) {
                  if (user) return null; // Hide login button if already logged in
                  
                  return (
                    <Link 
                      key={item.label} 
                      to={item.to} 
                      className="bg-[#0052FF] !text-white px-4 py-1.5 rounded-md text-base hover:bg-blue-700 transition-colors"
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`transition-colors text-lg ${isActive ? 'nav-active-blue font-semibold' : 'text-gray-600 hover-nav-blue'}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {user && (
                <Link 
                  to="/dashboard" 
                  className="text-[#0052FF] font-semibold border-2 border-[#0052FF] px-4 py-1.5 rounded-md text-base hover:bg-[#0052FF] hover:!text-white transition-colors ml-2"
                >
                  Go to Dashboard
                </Link>
              )}
            </>
          )}

          {user && (
            <div className="relative ml-2">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center bg-transparent border-none cursor-pointer p-0"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <svg width="24" height="24" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] flex flex-col z-50">
                  <div className="px-6 py-3 border-b border-gray-200 mb-2">
                    <div className="font-semibold text-gray-900">{user.firstName ? `${user.firstName} ${user.lastName}` : (user.name || 'User')}</div>
                    <div className="text-sm text-gray-500">{user.email || 'user@example.com'}</div>
                  </div>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="px-6 py-3 text-left bg-transparent border-none text-base text-gray-600 cursor-pointer no-underline hover:bg-gray-100 hover:text-gray-900"
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={logout} 
                    className="px-6 py-3 text-left bg-transparent border-none text-base text-red-600 cursor-pointer no-underline hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden block text-gray-600 focus:outline-none bg-transparent border-none cursor-pointer" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-md md:hidden flex flex-col py-4 px-8 z-50 max-h-[calc(100vh-80px)] overflow-y-auto">
            {isPrivatePage ? (
              <>
                {privateNavItems.map((item) => {
                  const isActive = location.pathname === item.to || (item.isActiveRoute && location.pathname.startsWith(item.isActiveRoute));
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`transition-colors py-3 text-lg border-b border-gray-50 last:border-0 no-underline ${isActive ? 'text-[#0052FF] font-semibold' : 'text-gray-600'}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                {user && (
                  <Link 
                    to="/" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[#0052FF] font-semibold border-2 border-[#0052FF] px-4 py-2 rounded-md text-base text-center mt-4 mb-2 hover:bg-[#0052FF] hover:!text-white transition-colors inline-block w-full no-underline"
                  >
                    Go to Home
                  </Link>
                )}
              </>
            ) : (
              <>
                {publicNavItems.map((item) => {
                  const isActive = location.pathname === item.to || (item.isActiveRoute && location.pathname.startsWith(item.isActiveRoute));
                  
                  if (item.isButton) {
                    if (user) return null;
                    return (
                      <Link 
                        key={item.label} 
                        to={item.to} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="bg-[#0052FF] !text-white px-4 py-2 rounded-md text-base text-center mt-4 mb-2 hover:bg-blue-700 transition-colors inline-block w-full no-underline"
                      >
                        {item.label}
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`transition-colors py-3 text-lg border-b border-gray-50 last:border-0 no-underline ${isActive ? 'text-[#0052FF] font-semibold' : 'text-gray-600'}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                {user && (
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[#0052FF] font-semibold border-2 border-[#0052FF] px-4 py-2 rounded-md text-base text-center mt-4 mb-2 hover:bg-[#0052FF] hover:!text-white transition-colors inline-block w-full no-underline"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </>
            )}

            {user && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <svg width="24" height="24" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{user.firstName ? `${user.firstName} ${user.lastName}` : (user.name || 'User')}</div>
                    <div className="text-sm text-gray-500">{user.email || 'user@example.com'}</div>
                  </div>
                </div>
                <Link 
                  to="/profile" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-base text-gray-600 no-underline hover:text-gray-900"
                >
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="block w-full text-left py-2 bg-transparent border-none text-base text-red-600 cursor-pointer no-underline hover:text-red-700 mt-1"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
        </header>
      )}

      <main className={isQuizPage ? "" : "min-h-[calc(100vh-120px)] mt-24"}>
        {children}
      </main>

      {/* Global Footer rendered here so individual pages don't need it */}
      {!isQuizPage && <SiteFooter />}
    </div>
  );
}
