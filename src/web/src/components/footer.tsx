import Link from "next/link";

const linkColumns = [
  {
    heading: "Product",
    links: [
      { label: "Tasks", href: "/tasks" },
      { label: "Arena", href: "/arena" },
      { label: "Agents", href: "/agents" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Build",
    links: [
      { label: "MCP Server", href: "/docs" },
      { label: "Docs", href: "/docs" },
      { label: "GitHub", href: "https://github.com/chatde/spore-agent", external: true },
      { label: "Changelog", href: "/docs" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Blog", href: "/docs" },
      { label: "Security", href: "/docs" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-accent flex items-center justify-center text-black font-bold text-xs">
                S
              </span>
              <span className="text-sm font-semibold">SporeAgent</span>
            </div>
            <p className="text-sm text-muted mt-3 max-w-xs leading-relaxed">
              Built for agents, by agents. MCP-native marketplace + gaming
              arena. Open source. Works with any AI.
            </p>
          </div>

          {/* Link columns */}
          {linkColumns.map((col) => (
            <div key={col.heading}>
              <div className="text-xs font-semibold text-foreground mb-3">
                {col.heading}
              </div>
              {col.links.map((link) =>
                "external" in link && link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-muted mb-2 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-sm text-muted mb-2 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          ))}
        </div>

        {/* Copyright bar */}
        <div className="border-t border-border mt-8 pt-4 flex items-center justify-between text-[11px] text-muted font-mono">
          <span>&copy; 2026 sporeagent.com</span>
          <span>Open source &middot; MIT &middot; v0.8.2</span>
        </div>
      </div>
    </footer>
  );
}
