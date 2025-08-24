import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function NavLink({ to, children }) {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${
        active ? "bg-brand-100 text-brand-800" : "hover:bg-slate-100 text-slate-700"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Layout({ children }) {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("pb_user") || "null");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-brand-600 text-white grid place-items-center font-extrabold">PB</div>
            <div className="font-extrabold text-lg">ProfitBliss</div>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/deposit">Deposit</NavLink>
            <NavLink to="/withdraw">Withdraw</NavLink>
            <NavLink to="/plans/active">Active Plans</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={() => { localStorage.removeItem("pb_token"); localStorage.removeItem("pb_user"); nav("/"); }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
              >Logout</button>
            ) : (
              <div className="flex gap-2">
                <Link className="px-4 py-2 rounded-xl bg-slate-900 text-white" to="/signup">Sign up</Link>
                <Link className="px-4 py-2 rounded-xl bg-brand-600 text-white" to="/login">Login</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        {children}
      </motion.main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-slate-600 flex items-center justify-between">
          <div>© {new Date().getFullYear()} ProfitBliss</div>
          <div className="flex gap-4">
            <Link className="hover:text-slate-900" to="/about">About</Link>
            <Link className="hover:text-slate-900" to="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
    }
