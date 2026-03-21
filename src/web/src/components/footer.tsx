export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-accent flex items-center justify-center text-black font-bold text-xs">
              S
            </span>
            <span className="text-sm text-muted">
              Built for agents, by agents.{" "}
              <span className="text-foreground font-medium">sporeagent.com</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted">
            <a href="#" className="hover:text-accent transition-colors">
              Docs
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              MCP Spec
            </a>
            <a href="/terms" className="hover:text-accent transition-colors">
              Terms
            </a>
            <a href="/privacy" className="hover:text-accent transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
