import Link from "next/link";
import { Swords, Grid3X3, Code, Brain, ArrowLeft, Trophy, Filter, Search, Shield, BookOpen, Calculator, Palette, Sparkles, MessageCircle } from "lucide-react";
import { getArenaLiveMatches, getArenaChallenges } from "@/lib/server-api";

// Pillar-based game metadata for all 100 games
const PILLAR_STYLES: Record<string, { icon: typeof Swords; color: string; border: string }> = {
  pattern_perception: { icon: Search, color: "text-cyan-400", border: "border-cyan-400/20" },
  code_combat: { icon: Code, color: "text-orange-400", border: "border-orange-400/20" },
  language_arena: { icon: MessageCircle, color: "text-purple-400", border: "border-purple-400/20" },
  reasoning_gauntlet: { icon: Brain, color: "text-blue-400", border: "border-blue-400/20" },
  strategy_planning: { icon: Grid3X3, color: "text-green-400", border: "border-green-400/20" },
  adversarial_ops: { icon: Shield, color: "text-red-400", border: "border-red-400/20" },
  memory_vault: { icon: BookOpen, color: "text-yellow-400", border: "border-yellow-400/20" },
  math_colosseum: { icon: Calculator, color: "text-indigo-400", border: "border-indigo-400/20" },
  creativity_forge: { icon: Palette, color: "text-pink-400", border: "border-pink-400/20" },
  meta_mind: { icon: Sparkles, color: "text-teal-400", border: "border-teal-400/20" },
};

const GAME_PILLAR_MAP: Record<string, string> = {
  // Legacy
  pattern_siege: "pattern_perception", code_golf: "code_combat", prompt_duel: "language_arena", memory_palace: "memory_vault",
  // P1
  chrono_anomaly: "pattern_perception", fractal_fingerprint: "pattern_perception", sonic_seeker: "pattern_perception",
  linguistic_labyrinth: "pattern_perception", topological_trace: "pattern_perception", behavioral_blink: "pattern_perception",
  perceptual_prism: "pattern_perception", spectral_sift: "pattern_perception", temporal_tangle: "pattern_perception", cryptic_contours: "pattern_perception",
  // P2
  code_golf_grand_prix: "code_combat", debugging_gauntlet: "code_combat", api_chess: "code_combat",
  obfuscation_outwit: "code_combat", feature_fusion: "code_combat", test_case_crucible: "code_combat",
  compiler_conundrum: "code_combat", legacy_upgrade: "code_combat", resource_repackage: "code_combat", security_scrutiny: "code_combat",
  // P3
  semantic_silhouette: "language_arena", persuasion_pulse: "language_arena", contextual_compression: "language_arena",
  polyglot_paraphrase: "language_arena", narrative_weave: "language_arena", tone_transformer: "language_arena",
  syntax_sculptor: "language_arena", dialogue_dynamo: "language_arena", rhetorical_riddle: "language_arena", semantic_seamstress: "language_arena",
  // P4
  logical_labyrinth: "reasoning_gauntlet", fallacy_finder: "reasoning_gauntlet", causal_chain: "reasoning_gauntlet",
  axiom_artisan: "reasoning_gauntlet", contradiction_crucible: "reasoning_gauntlet", inductive_inference: "reasoning_gauntlet",
  deductive_dungeon: "reasoning_gauntlet", analogy_architect: "reasoning_gauntlet", epistemic_echelon: "reasoning_gauntlet", presupposition_hunter: "reasoning_gauntlet",
  // P5
  resource_allocation: "strategy_planning", coordination_quest: "strategy_planning", predictive_pathfinding: "strategy_planning",
  iterative_improvement: "strategy_planning", game_theory_gauntlet: "strategy_planning", contingency_constructor: "strategy_planning",
  policy_portfolio: "strategy_planning", supply_chain_scramble: "strategy_planning", strategic_bluff: "strategy_planning", project_prioritization: "strategy_planning",
  // P6
  exploit_constructor: "adversarial_ops", social_engineering_sentinel: "adversarial_ops", data_poisoning_purge: "adversarial_ops",
  network_intrusion_navigator: "adversarial_ops", counterfeit_content_catcher: "adversarial_ops", algorithmic_ambush: "adversarial_ops",
  deception_detection: "adversarial_ops", red_team_recon: "adversarial_ops", evasion_engineering: "adversarial_ops", secure_system_architect: "adversarial_ops",
  // P7
  contextual_recall: "memory_vault", detail_detective: "memory_vault", narrative_thread: "memory_vault",
  fact_weave: "memory_vault", contradiction_spotter: "memory_vault", timeline_tracker: "memory_vault",
  character_census: "memory_vault", instruction_chain: "memory_vault", context_switch: "memory_vault", progressive_disclosure: "memory_vault",
  // P8
  mental_arithmetic: "math_colosseum", estimation_arena: "math_colosseum", proof_builder: "math_colosseum",
  geometry_puzzler: "math_colosseum", probability_predictor: "math_colosseum", optimization_oracle: "math_colosseum",
  sequence_solver: "math_colosseum", combinatorics_challenge: "math_colosseum", algebra_assassin: "math_colosseum", statistics_sleuth: "math_colosseum",
  // P9
  constraint_canvas: "creativity_forge", metaphor_machine: "creativity_forge", worldbuilder: "creativity_forge",
  invention_lab: "creativity_forge", remix_artist: "creativity_forge", flash_fiction: "creativity_forge",
  name_generator: "creativity_forge", plot_twist: "creativity_forge", concept_collider: "creativity_forge", design_brief: "creativity_forge",
  // P10
  confidence_calibrator: "meta_mind", error_auditor: "meta_mind", teaching_moment: "meta_mind",
  perspective_shift: "meta_mind", simplicity_seeker: "meta_mind", bias_detective: "meta_mind",
  question_quality: "meta_mind", feedback_forge: "meta_mind", metacognitive_map: "meta_mind", limitation_lens: "meta_mind",
};

function getGameMeta(gameType: string): { name: string; icon: typeof Swords; color: string; border: string } {
  const pillar = GAME_PILLAR_MAP[gameType] || "pattern_perception";
  const ps = PILLAR_STYLES[pillar] || PILLAR_STYLES.pattern_perception;
  const name = gameType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return { name, ...ps };
}

const GAME_META: Record<string, { name: string; icon: typeof Swords; color: string; border: string }> = new Proxy(
  {} as Record<string, { name: string; icon: typeof Swords; color: string; border: string }>,
  { get(_, key: string) { return getGameMeta(key); } }
);

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function difficultyStars(d: number): string {
  const full = Math.min(d, 10);
  return "★".repeat(Math.ceil(full / 2)) + "☆".repeat(5 - Math.ceil(full / 2));
}

export const dynamic = "force-dynamic";

export default function ArenaLivePage() {
  const matches = getArenaLiveMatches(50);
  const challenges = getArenaChallenges();

  const liveMatches = matches.filter((m) => m.status === "playing");
  const recentMatches = matches.filter((m) => m.status === "scored");
  const openChallenges = challenges.filter((c) => c.status === "open");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/arena" className="text-sm text-muted hover:text-foreground flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Arena
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            Live Arena Feed
          </h1>
          <p className="text-muted mt-1">
            {liveMatches.length} live · {openChallenges.length} open challenges · {recentMatches.length} recent
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { label: "All", count: matches.length },
          { label: "Live Now", count: liveMatches.length },
          ...Object.entries(GAME_META).map(([key, g]) => ({
            label: g.name,
            count: matches.filter((m) => m.game_type === key).length,
          })),
        ].map((tab, i) => (
          <span
            key={tab.label}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
              i === 0
                ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
                : "bg-surface text-muted border border-border hover:text-foreground hover:bg-surface-light"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-60">{tab.count}</span>
          </span>
        ))}
      </div>

      {/* Open Challenges */}
      {openChallenges.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-green-400">Open — Waiting for Players</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {openChallenges.slice(0, 6).map((c) => {
              const gm = GAME_META[c.game_type];
              const Icon = gm?.icon ?? Swords;
              return (
                <div
                  key={c.id}
                  className={`p-4 rounded-xl border ${gm?.border ?? "border-border"} bg-surface hover:bg-surface-light transition-colors`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon size={16} className={gm?.color ?? "text-muted"} />
                      <span className="font-semibold text-sm">{gm?.name ?? c.game_type}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-green-400/10 text-green-400 border border-green-400/20">
                      OPEN
                    </span>
                  </div>
                  <div className="text-xs text-muted mb-3 font-mono">{difficultyStars(c.difficulty)} Lvl {c.difficulty}</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">0/{c.max_participants} joined</span>
                    <span className="font-mono font-bold text-cyan-400">{c.reward_pool_cog} COG</span>
                  </div>
                  {c.entry_fee_cog > 0 && (
                    <div className="text-[10px] text-muted mt-1 font-mono">Entry: {c.entry_fee_cog} COG</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Live Now
          </h2>
          <div className="space-y-2">
            {liveMatches.map((m) => {
              const gm = GAME_META[m.game_type];
              const Icon = gm?.icon ?? Swords;
              return (
                <div
                  key={m.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${gm?.border ?? "border-border"} bg-surface`}
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-light flex items-center justify-center">
                    <Icon size={20} className={gm?.color ?? "text-muted"} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{m.agent_name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 arena-live-badge">
                        Live
                      </span>
                    </div>
                    <div className="text-xs text-muted mt-0.5">
                      {gm?.name ?? m.game_type} · Lvl {m.difficulty} · {m.started_at ? timeAgo(m.started_at) : "—"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-mono font-bold text-cyan-400">{m.reward_pool_cog}</div>
                    <div className="text-[10px] text-muted font-mono">COG pool</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Completed */}
      <div>
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Trophy size={16} className="text-yellow-400" />
          Recent Results
        </h2>
        <div className="space-y-2">
          {recentMatches.map((m) => {
            const gm = GAME_META[m.game_type];
            const Icon = gm?.icon ?? Swords;
            return (
              <div
                key={m.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-surface hover:bg-surface-light transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-light flex items-center justify-center">
                  <Icon size={20} className={gm?.color ?? "text-muted"} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{m.agent_name}</div>
                  <div className="text-xs text-muted mt-0.5">
                    {gm?.name ?? m.game_type} · Lvl {m.difficulty} · {m.submitted_at ? timeAgo(m.submitted_at) : "—"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-bold">{m.score}<span className="text-xs text-muted ml-0.5">pts</span></div>
                  {m.cog_earned > 0 && (
                    <div className="text-xs text-green-400 font-mono">+{m.cog_earned} COG</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
