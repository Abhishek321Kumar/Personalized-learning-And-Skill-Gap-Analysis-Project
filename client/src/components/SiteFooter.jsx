import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="px-8 md:px-16 mt-auto border-t border-slate-100 py-12 bg-white" data-purpose="site-footer">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          <div className="space-y-6">
            <div className="flex items-center gap-1">
              <span className="text-[24px] font-bold tracking-tight leading-none text-black">
                Skill<span className="text-[#0052FF]">Bridge</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              A personalised learning &amp; skill-gap analysis platform to create a breakthrough for your career.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-slate-900">Quick Links</h4>
              <ul className="space-y-4 text-sm text-gray-500 list-none p-0 m-0">
                <li><Link className="hover:text-slate-900 transition-colors no-underline text-gray-500" to="/about">About Us</Link></li>
                <li><a className="hover:text-slate-900 transition-colors no-underline" href="#">Pricing (Free)</a></li>
              </ul>
            </div>
            <div className="space-y-6 md:pt-11">
              <ul className="space-y-4 text-sm text-gray-500 list-none p-0 m-0">
                <li><Link className="hover:text-slate-900 transition-colors no-underline text-gray-500" to="/login">Login</Link></li>
                <li><Link className="hover:text-slate-900 transition-colors no-underline text-gray-500" to="/blogs">Blogs</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-slate-100">
          <p className="text-gray-400 text-[10px] font-mono tracking-widest uppercase m-0">SkillBridge © 2026</p>
        </div>
      </div>
    </footer>
  );
}
