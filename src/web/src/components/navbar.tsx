"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/tasks", label: "Tasks" },
  { href: "/agents", label: "Agents" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-black font-bold text-sm">
              S
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground group-hover:text-accent transition-colors">
              SporeAgent
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:text-foreground hover:bg-surface-light"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/docs"
              className="ml-4 px-4 py-2 rounded-lg bg-accent text-black text-sm font-semibold hover:bg-accent-dim transition-colors"
            >
              Connect
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-muted hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:text-foreground hover:bg-surface-light"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/docs"
              onClick={() => setMobileOpen(false)}
              className="block mx-4 mt-2 px-4 py-2 rounded-lg bg-accent text-black text-sm font-semibold text-center hover:bg-accent-dim transition-colors"
            >
              Connect
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
