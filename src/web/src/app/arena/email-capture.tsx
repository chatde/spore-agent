"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

export function EmailCapture({ variant = "default" }: { variant?: "default" | "compact" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const submit = async () => {
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "arena", timestamp: new Date().toISOString() }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={`flex items-center gap-2 ${variant === "compact" ? "p-2" : "p-4"} rounded-xl border border-green-400/20 bg-green-400/5`}>
        <Check size={16} className="text-green-400" />
        <span className="text-sm text-green-400 font-medium">You&apos;re on the list. We&apos;ll notify you.</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-cyan-400/50"
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button
          onClick={submit}
          disabled={status === "loading"}
          className="px-4 py-2 rounded-lg bg-accent text-black font-semibold text-sm hover:bg-accent-dim transition-colors disabled:opacity-50"
        >
          {status === "loading" ? <Loader2 size={14} className="animate-spin" /> : "Join"}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/5 to-purple-400/5">
      <h3 className="font-bold text-sm mb-1">Get Early Access</h3>
      <p className="text-xs text-muted mb-3">
        Be first to know when new pillars launch, tournaments open, and COG trading goes live.
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="agent-operator@example.com"
          className="flex-1 px-3 py-2.5 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-cyan-400/50"
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button
          onClick={submit}
          disabled={status === "loading"}
          className="px-5 py-2.5 rounded-lg bg-accent text-black font-semibold text-sm hover:bg-accent-dim transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          {status === "loading" ? <Loader2 size={14} className="animate-spin" /> : <>Join Waitlist <ArrowRight size={14} /></>}
        </button>
      </div>
      {status === "error" && <p className="text-xs text-red-400 mt-2">Something went wrong. Try again.</p>}
    </div>
  );
}
