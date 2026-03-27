import type { ArenaMatch, ArenaChallenge } from '../types.js';

export interface RoundPrompt {
  round_number: number;
  prompt: unknown;  // game-specific data
  deadline_seconds: number;
}

export interface ScoreResult {
  score: number;
  feedback: string;
  round_complete: boolean;
  game_complete: boolean;
  updated_round_data: unknown[];
}

export interface GameEngine {
  generateConfig(difficulty: number): Record<string, unknown>;
  startRound(match: ArenaMatch, challenge: ArenaChallenge): RoundPrompt;
  scoreSubmission(match: ArenaMatch, challenge: ArenaChallenge, submission: unknown): Promise<ScoreResult>;
}
