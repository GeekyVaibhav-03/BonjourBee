import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

const navItemClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-amber-400/20 text-amber-300"
      : "text-slate-300 hover:bg-white/5 hover:text-white"
  }`;

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const links = useMemo(() => {
    if (!isAuthenticated) {
      return [{ to: "/", label: "Home" }];
    }

    const baseLinks = [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/lessons", label: "Lessons" },
      { to: "/achievements", label: "Achievements" },
      { to: "/profile", label: "Profile" },
    ];

    if (user?.role === "parent") {
      baseLinks.push({ to: "/parent-dashboard", label: "Parent Dashboard" });
    }

    return baseLinks;
  }, [isAuthenticated, user?.role]);

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate("/");
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#101018]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" onClick={closeMobile}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-300 to-amber-500 text-xl text-black shadow-[0_0_24px_rgba(251,191,36,0.45)]">
            🐝
          </span>
          <span className="text-lg font-semibold tracking-wide text-white">BonjourBee</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navItemClass} end={link.to === "/"}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
                ⚡ {user?.xp || 0} XP
              </span>
              <span className="rounded-full border border-orange-300/30 bg-orange-300/10 px-3 py-1 text-xs font-semibold text-orange-200">
                🔥 {user?.streak || 0}
              </span>
              <span className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold text-cyan-200">
                {user?.level || "A1"}
              </span>
              <button onClick={handleLogout} className="bb-btn bb-btn-ghost">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="bb-btn bb-btn-ghost" to="/login">
                Login
              </Link>
              <Link className="bb-btn bb-btn-primary" to="/signup">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-white/10 p-2 text-slate-200 hover:bg-white/10 lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-white/10 bg-[#111118]/95 px-4 pb-4 pt-3 lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={navItemClass}
                  end={link.to === "/"}
                  onClick={closeMobile}
                >
                  {link.label}
                </NavLink>
              ))}

              {isAuthenticated ? (
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
                  <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
                    ⚡ {user?.xp || 0} XP
                  </span>
                  <span className="rounded-full border border-orange-300/30 bg-orange-300/10 px-3 py-1 text-xs font-semibold text-orange-200">
                    🔥 {user?.streak || 0}
                  </span>
                  <span className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold text-cyan-200">
                    {user?.level || "A1"}
                  </span>
                  <button onClick={handleLogout} className="bb-btn bb-btn-ghost ml-auto">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
                  <Link className="bb-btn bb-btn-ghost" to="/login" onClick={closeMobile}>
                    Login
                  </Link>
                  <Link className="bb-btn bb-btn-primary" to="/signup" onClick={closeMobile}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isAuthenticated && location.pathname === "/" && (
        <div className="border-t border-amber-300/20 bg-amber-400/10 px-4 py-2 text-center text-xs text-amber-100">
          You are logged in. Continue to your dashboard.
          <Link className="ml-2 font-semibold text-amber-200 underline" to="/dashboard">
            Go now
          </Link>
        </div>
      )}
    </header>
  );
}
