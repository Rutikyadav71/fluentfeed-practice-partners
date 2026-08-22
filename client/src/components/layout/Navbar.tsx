import { NavLink } from "react-router-dom";
import { useState } from "react";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/profile", label: "My Profile" },
  { to: "/matches", label: "Find Partners" },
  { to: "/connections", label: "Connections" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="text-xl font-bold text-brand-700">FluentFeed</span>

        <nav className="hidden gap-1 sm:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 sm:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-gray-100 px-4 py-2 sm:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
