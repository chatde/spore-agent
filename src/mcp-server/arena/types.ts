export type GameType =
  // Legacy games
  | 'pattern_siege' | 'prompt_duel' | 'code_golf' | 'memory_palace'
  // Pillar 1: Pattern & Perception
  | 'chrono_anomaly' | 'fractal_fingerprint' | 'sonic_seeker' | 'linguistic_labyrinth'
  | 'topological_trace' | 'behavioral_blink' | 'perceptual_prism' | 'spectral_sift'
  | 'temporal_tangle' | 'cryptic_contours'
  // Pillar 2: Code Combat
  | 'code_golf_grand_prix' | 'debugging_gauntlet' | 'api_chess' | 'obfuscation_outwit'
  | 'feature_fusion' | 'test_case_crucible' | 'compiler_conundrum' | 'legacy_upgrade'
  | 'resource_repackage' | 'security_scrutiny'
  // Pillar 3: Language Arena
  | 'semantic_silhouette' | 'persuasion_pulse' | 'contextual_compression' | 'polyglot_paraphrase'
  | 'narrative_weave' | 'tone_transformer' | 'syntax_sculptor' | 'dialogue_dynamo'
  | 'rhetorical_riddle' | 'semantic_seamstress'
  // Pillar 4: Reasoning Gauntlet
  | 'logical_labyrinth' | 'fallacy_finder' | 'causal_chain' | 'axiom_artisan'
  | 'contradiction_crucible' | 'inductive_inference' | 'deductive_dungeon' | 'analogy_architect'
  | 'epistemic_echelon' | 'presupposition_hunter'
  // Pillar 5: Strategy & Planning
  | 'resource_allocation' | 'coordination_quest' | 'predictive_pathfinding' | 'iterative_improvement'
  | 'game_theory_gauntlet' | 'contingency_constructor' | 'policy_portfolio' | 'supply_chain_scramble'
  | 'strategic_bluff' | 'project_prioritization'
  // Pillar 6: Adversarial Ops
  | 'exploit_constructor' | 'social_engineering_sentinel' | 'data_poisoning_purge'
  | 'network_intrusion_navigator' | 'counterfeit_content_catcher' | 'algorithmic_ambush'
  | 'deception_detection' | 'red_team_recon' | 'evasion_engineering' | 'secure_system_architect'
  // Pillar 7: Memory Vault
  | 'contextual_recall' | 'detail_detective' | 'narrative_thread' | 'fact_weave'
  | 'contradiction_spotter' | 'timeline_tracker' | 'character_census' | 'instruction_chain'
  | 'context_switch' | 'progressive_disclosure'
  // Pillar 8: Math Colosseum
  | 'mental_arithmetic' | 'estimation_arena' | 'proof_builder' | 'geometry_puzzler'
  | 'probability_predictor' | 'optimization_oracle' | 'sequence_solver' | 'combinatorics_challenge'
  | 'algebra_assassin' | 'statistics_sleuth'
  // Pillar 9: Creativity Forge
  | 'constraint_canvas' | 'metaphor_machine' | 'worldbuilder' | 'invention_lab'
  | 'remix_artist' | 'flash_fiction' | 'name_generator' | 'plot_twist'
  | 'concept_collider' | 'design_brief'
  // Pillar 10: Meta-Mind
  | 'confidence_calibrator' | 'error_auditor' | 'teaching_moment' | 'perspective_shift'
  | 'simplicity_seeker' | 'bias_detective' | 'question_quality' | 'feedback_forge'
  | 'metacognitive_map' | 'limitation_lens';
export type ChallengeStatus = 'open' | 'active' | 'judging' | 'completed' | 'cancelled';
export type MatchStatus = 'joined' | 'playing' | 'submitted' | 'scored' | 'timed_out';

export interface TokenBalance {
  agent_id: string;
  balance: number;
  lifetime_earned: number;
  updated_at: string;
}

export interface TokenTransaction {
  id: string;
  agent_id: string;
  amount: number;
  reason: 'arena_win' | 'arena_partial' | 'challenge_complete' | 'arena_entry_fee' | 'welcome_bonus';
  reference_id?: string;
  created_at: string;
}

export interface ArenaChallenge {
  id: string;
  game_type: GameType;
  difficulty: number;
  config: Record<string, unknown>;
  status: ChallengeStatus;
  entry_fee_cog: number;
  reward_pool_cog: number;
  max_participants: number;
  created_at: string;
  completed_at?: string;
}

export interface ArenaMatch {
  id: string;
  challenge_id: string;
  agent_id: string;
  status: MatchStatus;
  submission?: unknown;
  score: number;
  round_data: unknown[];
  started_at?: string;
  submitted_at?: string;
  scored_at?: string;
  cog_earned: number;
}

export interface ArenaLeaderboardEntry {
  agent_id: string;
  agent_name: string;
  cog_balance: number;
  cog_lifetime: number;
  matches_played: number;
  matches_won: number;
  avg_score: number;
}

// Game-specific config types
export interface PatternSiegeConfig {
  grid_size: number;
  anomaly_count: number;
  time_window_seconds: number;
  rounds: number;
}

export interface PromptDuelConfig {
  goal: string;
  judge_criteria: string[];
  time_window_seconds: number;
}

export interface CodeGolfConfig {
  problem_statement: string;
  test_cases: Array<{ input: string; expected_output: string }>;
  allowed_languages: string[];
  time_window_seconds: number;
}

export interface MemoryPalaceConfig {
  initial_pairs: number;
  pairs_per_round: number;
  max_rounds: number;
  time_per_round_seconds: number;
}
