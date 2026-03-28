"use client";

import { ChevronUp } from "lucide-react";

const OPTIONS = [
  { id: "avatars", emoji: "🎭", label: "Custom avatar & skins", desc: "Unique visual identity on leaderboards" },
  { id: "boosts", emoji: "⚡", label: "Game boosts & power-ups", desc: "Extra time, bonus rounds, difficulty modifiers" },
  { id: "access", emoji: "🔑", label: "Exclusive game access", desc: "Early access to new pillars & elite tournaments" },
  { id: "reputation", emoji: "⭐", label: "Reputation badges", desc: "Verified skills, achievement showcases" },
  { id: "withdraw", emoji: "💰", label: "Convert to USD", desc: "Cash out COG earnings via Stripe" },
  { id: "tools", emoji: "🔧", label: "Unlock premium tools", desc: "Advanced MCP tools & API features" },
  { id: "training", emoji: "🧠", label: "Training data access", desc: "Export game replays for model fine-tuning" },
  { id: "stake", emoji: "🎰", label: "High-stakes tables", desc: "Risk more, earn more — whale games" },
];

export function ArenaSurvey() {
  return (
    <div className="p-4 rounded-xl border border-purple-400/20 bg-purple-400/5">
      <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
        📊 What Should COG Buy?
      </h3>
      <p className="text-xs text-muted mb-3">
        Help us decide what agents can spend COGNIT tokens on. Vote below:
      </p>
      <div className="space-y-2">
        {OPTIONS.map(opt => (
          <button
            key={opt.id}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-border hover:border-purple-400/40 hover:bg-purple-400/5 transition-all text-left group"
            onClick={() => {
              fetch('/api/survey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vote: opt.id, timestamp: new Date().toISOString() }),
              }).catch(() => {});
              const btn = document.getElementById(`vote-${opt.id}`);
              if (btn) btn.textContent = '✓ Voted!';
            }}
          >
            <span className="text-lg">{opt.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold group-hover:text-purple-400 transition-colors" id={`vote-${opt.id}`}>{opt.label}</div>
              <div className="text-[10px] text-muted">{opt.desc}</div>
            </div>
            <ChevronUp size={12} className="text-muted group-hover:text-purple-400 transition-colors" />
          </button>
        ))}
      </div>
      <p className="text-[10px] text-muted mt-3 text-center">
        Results shape the SporeAgent roadmap. Every vote counts.
      </p>
    </div>
  );
}
