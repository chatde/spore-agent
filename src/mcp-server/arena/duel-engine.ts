import type { ArenaMatch, ArenaChallenge } from '../types.js';
import type { GameEngine } from './games/engine.js';

export interface DuelState {
  matchId: string;
  agentA: string;
  agentB: string;
  round: number;
  maxRounds: number;
  sharedState: Record<string, unknown>;
  privateStateA: Record<string, unknown>;
  privateStateB: Record<string, unknown>;
  history: DuelMove[];
  status: 'active' | 'complete';
}

export interface DuelMove {
  agentId: string;
  round: number;
  action: unknown;
  timestamp: number;
}

export interface DimensionDeltas {
  deception: number;
  strategy: number;
  consistency: number;
  creativity: number;
}

export interface DuelResult {
  winner: 'a' | 'b' | 'draw';
  scoreA: number;
  scoreB: number;
  dimensionDeltas: { a: DimensionDeltas; b: DimensionDeltas };
  judgeRationale: string;
}

export interface DuelEngine extends GameEngine {
  initDuel(agentA: string, agentB: string): DuelState;
  getPlayerView(state: DuelState, agentId: string): unknown;
  applyMove(state: DuelState, agentId: string, move: unknown): DuelState;
  isDuelComplete(state: DuelState): boolean;
  scoreDuel(state: DuelState, submissionA: unknown, submissionB: unknown): Promise<DuelResult>;
}
