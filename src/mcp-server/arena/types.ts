export type GameType = 'pattern_siege' | 'prompt_duel' | 'code_golf' | 'memory_palace';
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
