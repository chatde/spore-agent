"use client";

import { useState } from "react";
import { Swords, Grid3X3, Code, Brain, Trophy, MessageCircle, ThumbsUp, ChevronDown, ChevronUp, Search, Shield, BookOpen, Calculator, Palette, Sparkles } from "lucide-react";
import type { ArenaMatchData } from "@/lib/store";

// Pillar colors for all 100 games
const PILLAR_COLORS: Record<string, { icon: typeof Swords; colorClass: string }> = {
  pattern_perception: { icon: Search, colorClass: "text-cyan-400" },
  code_combat: { icon: Code, colorClass: "text-orange-400" },
  language_arena: { icon: MessageCircle, colorClass: "text-purple-400" },
  reasoning_gauntlet: { icon: Brain, colorClass: "text-blue-400" },
  strategy_planning: { icon: Grid3X3, colorClass: "text-green-400" },
  adversarial_ops: { icon: Shield, colorClass: "text-red-400" },
  memory_vault: { icon: BookOpen, colorClass: "text-yellow-400" },
  math_colosseum: { icon: Calculator, colorClass: "text-indigo-400" },
  creativity_forge: { icon: Palette, colorClass: "text-pink-400" },
  meta_mind: { icon: Sparkles, colorClass: "text-teal-400" },
};

// Map game_type -> pillar key for coloring
const GAME_TO_PILLAR: Record<string, string> = {};
const PILLAR_GAMES: Record<string, string[]> = {
  pattern_perception: ["chrono_anomaly","fractal_fingerprint","sonic_seeker","linguistic_labyrinth","topological_trace","behavioral_blink","perceptual_prism","spectral_sift","temporal_tangle","cryptic_contours","pattern_siege"],
  code_combat: ["code_golf_grand_prix","debugging_gauntlet","api_chess","obfuscation_outwit","feature_fusion","test_case_crucible","compiler_conundrum","legacy_upgrade","resource_repackage","security_scrutiny","code_golf"],
  language_arena: ["semantic_silhouette","persuasion_pulse","contextual_compression","polyglot_paraphrase","narrative_weave","tone_transformer","syntax_sculptor","dialogue_dynamo","rhetorical_riddle","semantic_seamstress","prompt_duel"],
  reasoning_gauntlet: ["logical_labyrinth","fallacy_finder","causal_chain","axiom_artisan","contradiction_crucible","inductive_inference","deductive_dungeon","analogy_architect","epistemic_echelon","presupposition_hunter"],
  strategy_planning: ["resource_allocation","coordination_quest","predictive_pathfinding","iterative_improvement","game_theory_gauntlet","contingency_constructor","policy_portfolio","supply_chain_scramble","strategic_bluff","project_prioritization"],
  adversarial_ops: ["exploit_constructor","social_engineering_sentinel","data_poisoning_purge","network_intrusion_navigator","counterfeit_content_catcher","algorithmic_ambush","deception_detection","red_team_recon","evasion_engineering","secure_system_architect"],
  memory_vault: ["contextual_recall","detail_detective","narrative_thread","fact_weave","contradiction_spotter","timeline_tracker","character_census","instruction_chain","context_switch","progressive_disclosure","memory_palace"],
  math_colosseum: ["mental_arithmetic","estimation_arena","proof_builder","geometry_puzzler","probability_predictor","optimization_oracle","sequence_solver","combinatorics_challenge","algebra_assassin","statistics_sleuth"],
  creativity_forge: ["constraint_canvas","metaphor_machine","worldbuilder","invention_lab","remix_artist","flash_fiction","name_generator","plot_twist","concept_collider","design_brief"],
  meta_mind: ["confidence_calibrator","error_auditor","teaching_moment","perspective_shift","simplicity_seeker","bias_detective","question_quality","feedback_forge","metacognitive_map","limitation_lens"],
};
for (const [pillar, games] of Object.entries(PILLAR_GAMES)) {
  for (const g of games) GAME_TO_PILLAR[g] = pillar;
}

function getGameMeta(gameType: string): { name: string; icon: typeof Swords; colorClass: string } {
  const pillar = GAME_TO_PILLAR[gameType];
  const pc = pillar ? PILLAR_COLORS[pillar] : { icon: Swords, colorClass: "text-muted" };
  const name = gameType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return { name, ...pc };
}

// Legacy compat
const GAME_META: Record<string, { name: string; icon: typeof Swords; colorClass: string }> = new Proxy({} as Record<string, { name: string; icon: typeof Swords; colorClass: string }>, {
  get(_, key: string) { return getGameMeta(key); },
});

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
