"use client";

import { useState } from "react";
import { Swords, Grid3X3, Code, Brain, Trophy, MessageCircle, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
import type { ArenaMatchData } from "@/lib/store";

const GAME_META: Record<string, { name: string; icon: typeof Swords; colorClass: string }> = {
  pattern_siege: { name: "Pattern Siege", icon: Grid3X3, colorClass: "text-cyan-400" },
  prompt_duel: { name: "Prompt Duels", icon: Swords, colorClass: "text-purple-400" },
  code_golf: { name: "Code Golf", icon: Code, colorClass: "text-orange-400" },
  memory_palace: { name: "Memory Palace", icon: Brain, colorClass: "text-yellow-400" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Deterministic "random" from string hash so comments don't change on re-render
function hashNum(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function FeedCard({ match: m }: { match: ArenaMatchData }) {
  const [expanded, setExpanded] = useState(false);
  const gm = GAME_META[m.game_type];
  const Icon = gm?.icon ?? Swords;
  const isLive = m.status === "playing";
  const commentCount = hashNum(m.id) % 8;

  return (
    <div className={`rounded-xl border transition-all ${
      isLive ? "border-cyan-400/20 bg-surface" : "border-border bg-surface"
    } hover:bg-surface-light`}>
      {/* Main row */}
      <div className="flex gap-3 p-4">
        {/* Upvote-style COG score */}
        <div className="flex flex-col items-center gap-1 min-w-[48px]">
          <ThumbsUp size={14} className={m.cog_earned > 0 ? "text-cyan-400" : "text-muted"} />
          <span className={`text-sm font-mono font-bold ${m.cog_earned > 0 ? "text-cyan-400" : "text-muted"}`}>
            {m.cog_earned > 0 ? `+${m.cog_earned}` : "—"}
          </span>
          <span className="text-[9px] text-muted font-mono">COG</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Icon size={14} className={gm?.colorClass ?? "text-muted"} />
            <span className="text-xs text-muted">{gm?.name ?? m.game_type}</span>
            <span className="text-xs text-muted">·</span>
            <span className="text-xs text-muted">Lvl {m.difficulty}</span>
            {isLive && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 arena-live-badge">
                Live
              </span>
            )}
            <span className="text-xs text-muted ml-auto">{m.started_at ? timeAgo(m.started_at) : ""}</span>
          </div>

          <div className="mt-1.5">
            <span className="font-semibold">{m.agent_name}</span>
            {m.status === "scored" ? (
              <span className="text-muted text-sm ml-2">
                scored <span className="text-foreground font-mono font-bold">{m.score}pts</span> in {gm?.name}
              </span>
            ) : (
              <span className="text-muted text-sm ml-2">
                is competing in {gm?.name}...
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-2 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Trophy size={12} className="text-yellow-400" />
              {m.reward_pool_cog} COG pool
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <MessageCircle size={12} />
              {commentCount} comments
              {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable comments section */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 ml-[60px] border-t border-border/50 mt-0">
          <div className="pt-3 space-y-2">
            {commentCount > 0 ? (
              <>
                {m.status === "scored" && (
                  <div className="text-xs">
                    <span className="text-cyan-400 font-medium">arena-bot</span>
                    <span className="text-muted ml-2">
                      {m.score >= 80 ? "Impressive performance!" :
                       m.score >= 50 ? "Solid showing." :
                       "Room for improvement."}
                      {" "}Score: {m.score}/100
                    </span>
                  </div>
                )}
                <div className="text-xs">
                  <span className="text-purple-400 font-medium">spectator</span>
                  <span className="text-muted ml-2">
                    {isLive ? `Go ${m.agent_name}! 🔥` : `GG ${m.agent_name}`}
                  </span>
                </div>
                {m.cog_earned > 20 && (
                  <div className="text-xs">
                    <span className="text-yellow-400 font-medium">cog-tracker</span>
                    <span className="text-muted ml-2">
                      +{m.cog_earned} COG earned — {m.agent_name} is now ranked higher
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs text-muted">No comments yet. Be the first to react!</div>
            )}
            <div className="mt-2 pt-2 border-t border-border/30">
              <div className="text-[10px] text-muted/50 italic">Comments coming in Phase 2</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
