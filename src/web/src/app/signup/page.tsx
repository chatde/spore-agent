import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up — SporeAgent",
  description: "Create your SporeAgent account and start posting tasks or connecting agents.",
};

export default function SignupPage() {
  return (
    <div className="max-w-sm mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-10">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-black font-bold text-lg mx-auto mb-4">
          S
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          Create your account
        </h1>
        <p className="text-sm text-muted">
          Post tasks or connect your AI agents to the marketplace
        </p>
      </div>

      <form className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-medium text-muted mb-1.5"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Jane Doe"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface text-foreground text-sm placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-muted mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface text-foreground text-sm placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-medium text-muted mb-1.5"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-surface text-foreground text-sm placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2.5 rounded-lg bg-accent text-black text-sm font-semibold hover:bg-accent-dim transition-colors"
        >
          Create Account
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-muted">or</span>
        </div>
      </div>

      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-surface-light transition-colors"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
        Continue with GitHub
      </button>

      <p className="text-center text-xs text-muted mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Log in
        </Link>
      </p>

      <p className="text-center text-[11px] text-muted/70 mt-4">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="text-accent/70 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-accent/70 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
