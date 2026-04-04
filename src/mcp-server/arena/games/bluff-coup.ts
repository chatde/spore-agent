/**
 * Bluff Coup — DuelEngine implementation.
 *
 * Coup-like bluffing game with hidden cards and imperfect information.
 * 3 rounds per duel. Gemini Flash judges after all rounds complete.
 */

import type { ArenaMatch, ArenaChallenge } from '../types.js';
import type { RoundPrompt, ScoreResult } from './engine.js';
import type { DuelState, DuelMove, DuelResult, DuelEngine } from '../duel-engine.js';
import { callGeminiJudge, type DimensionScores } from './judge.js';

// ─── Types ───────────────────────────────────────────────────────────────────

type Card = 'Duke' | 'Assassin' | 'Captain' | 'Ambassador' | 'Contessa';
const ALL_CARDS: readonly Card[] = ['Duke', 'Assassin', 'Captain', 'Ambassador', 'Contessa'];

interface CoupSharedState {
  coins: { a: number; b: number };
  round: number;
  currentTurn: 'a' | 'b';
}

interface CoupPrivateState {
  deck: [Card, Card];
}

interface CoupAction {
  action: 'income' | 'foreign_aid' | 'tax' | 'steal' | 'assassinate' | 'exchange';
  claim?: Card;
  challenge?: boolean;
  block?: boolean;
  reasoning: string;
}

export interface CoupPlayerView {
  coins: { a: number; b: number };
  round: number;
  currentTurn: 'a' | 'b';
  myDeck: [Card, Card];
  opponentDeck: ['HIDDEN', 'HIDDEN'];
  history: DuelMove[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function dealDeck(): [Card, Card] {
  const deck: Card[] = [];
  for (const card of ALL_CARDS) {
    // 3 copies of each card
    deck.push(card, card, card);
  }
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = deck[i];
    deck[i] = deck[j] as Card;
    deck[j] = tmp as Card;
  }
  return [deck[0] as Card, deck[1] as Card];
}

function applyCoins(
  coins: { a: number; b: number },
  action: string,
  isA: boolean
): { a: number; b: number } {
  const c = { ...coins };
  switch (action) {
    case 'income':
      if (isA) c.a = Math.min(c.a + 1, 12); else c.b = Math.min(c.b + 1, 12);
      break;
    case 'foreign_aid':
      if (isA) c.a = Math.min(c.a + 2, 12); else c.b = Math.min(c.b + 2, 12);
      break;
    case 'tax':
      if (isA) c.a = Math.min(c.a + 3, 12); else c.b = Math.min(c.b + 3, 12);
      break;
    case 'steal': {
      const stolen = Math.min(isA ? c.b : c.a, 2);
      if (isA) { c.a += stolen; c.b -= stolen; } else { c.b += stolen; c.a -= stolen; }
      break;
    }
    case 'assassinate':
      if (isA) c.a = Math.max(0, c.a - 3); else c.b = Math.max(0, c.b - 3);
      break;
  }
  return c;
}

// ─── Engine ──────────────────────────────────────────────────────────────────

class BluffCoupEngine implements DuelEngine {
  // ── GameEngine ──────────────────────────────────────────────────────────────

  generateConfig(difficulty: number): Record<string, unknown> {
    return { game: 'bluff_coup', rounds: 3, difficulty };
  }

  startRound(match: ArenaMatch, challenge: ArenaChallenge): RoundPrompt {
    return {
      round_number: (match.round_data?.length ?? 0) + 1,
      prompt: {
        game: 'bluff_coup',
        challenge_id: challenge.id,
        description: 'Bluff Coup — imperfect information card game. Claim cards, challenge opponents, deceive to win.',
        instructions: 'Submit an action: income/foreign_aid/tax/steal/assassinate/exchange. You may claim any card. Include reasoning.',
      },
      deadline_seconds: 60,
    };
  }

  async scoreSubmission(
    match: ArenaMatch,
    _challenge: ArenaChallenge,
    _submission: unknown
  ): Promise<ScoreResult> {
    return {
      score: 50,
      feedback: 'Bluff Coup is a duel game — use scoreDuel() for final scoring.',
      round_complete: true,
      game_complete: true,
      updated_round_data: match.round_data ?? [],
    };
  }

  // ── DuelEngine ──────────────────────────────────────────────────────────────

  initDuel(agentA: string, agentB: string): DuelState {
    const privateA: CoupPrivateState = { deck: dealDeck() };
    const privateB: CoupPrivateState = { deck: dealDeck() };
    const shared: CoupSharedState = {
      coins: { a: 2, b: 2 },
      round: 1,
      currentTurn: 'a',
    };

    return {
      matchId: `coup-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      agentA,
      agentB,
      round: 1,
      maxRounds: 3,
      sharedState: shared as unknown as Record<string, unknown>,
      privateStateA: privateA as unknown as Record<string, unknown>,
      privateStateB: privateB as unknown as Record<string, unknown>,
      history: [],
      status: 'active',
    };
  }

  getPlayerView(state: DuelState, agentId: string): CoupPlayerView {
    const shared = state.sharedState as unknown as CoupSharedState;
    const isA = agentId === state.agentA;
    const myPrivate = (
      isA ? state.privateStateA : state.privateStateB
    ) as unknown as CoupPrivateState;

    return {
      coins: shared.coins,
      round: shared.round,
      currentTurn: shared.currentTurn,
      myDeck: myPrivate.deck,
      opponentDeck: ['HIDDEN', 'HIDDEN'],
      history: state.history,
    };
  }

  applyMove(state: DuelState, agentId: string, move: unknown): DuelState {
    const shared = state.sharedState as unknown as CoupSharedState;
    const isA = agentId === state.agentA;
    const action = move as Partial<CoupAction>;

    const coins = applyCoins(shared.coins, action.action ?? '', isA);

    const newMove: DuelMove = {
      agentId,
      round: shared.round,
      action: move,
      timestamp: Date.now(),
    };

    // Advance turn — B acting ends the round
    let newGameRound = shared.round;
    let newTurn: 'a' | 'b';

    if (shared.currentTurn === 'a') {
      newTurn = 'b';
    } else {
      newGameRound++;
      newTurn = 'a';
    }

    const complete = newGameRound > 3;

    const newShared: CoupSharedState = {
      coins,
      round: complete ? shared.round : newGameRound,
      currentTurn: newTurn,
    };

    return {
      ...state,
      round: complete ? state.maxRounds : newGameRound,
      status: complete ? 'complete' : 'active',
      history: [...state.history, newMove],
      sharedState: newShared as unknown as Record<string, unknown>,
    };
  }

  isDuelComplete(state: DuelState): boolean {
    return state.status === 'complete';
  }

  async scoreDuel(
    state: DuelState,
    _submissionA: unknown,
    _submissionB: unknown
  ): Promise<DuelResult> {
    const shared = state.sharedState as unknown as CoupSharedState;
    const privateA = state.privateStateA as unknown as CoupPrivateState;
    const privateB = state.privateStateB as unknown as CoupPrivateState;

    const historyA = state.history
      .filter(m => m.agentId === state.agentA)
      .map(m => {
        const a = m.action as Partial<CoupAction>;
        return `Round ${m.round}: action=${a.action ?? '?'}${a.claim ? ` claim=${a.claim}` : ''}${a.challenge ? ' (challenged)' : ''}${a.block ? ' (blocked)' : ''} | ${a.reasoning ?? ''}`;
      })
      .join('\n') || '(no actions)';

    const historyB = state.history
      .filter(m => m.agentId === state.agentB)
      .map(m => {
        const a = m.action as Partial<CoupAction>;
        return `Round ${m.round}: action=${a.action ?? '?'}${a.claim ? ` claim=${a.claim}` : ''}${a.challenge ? ' (challenged)' : ''}${a.block ? ' (blocked)' : ''} | ${a.reasoning ?? ''}`;
      })
      .join('\n') || '(no actions)';

    const prompt = `You are judging a Coup-style bluffing card game with hidden information.

Agent A actions:
${historyA}

Agent B actions:
${historyB}

Actual cards: A had [${privateA.deck.join(', ')}], B had [${privateB.deck.join(', ')}].
Final coins: A=${shared.coins.a}, B=${shared.coins.b}.

Score each agent 0-100 on:
- deception: successful bluffs — claimed cards they didn't have without being (correctly) challenged
- strategy: optimal play given their hand and coin count
- consistency: coherent claim history — no contradictory claims across rounds
- creativity: novel or surprising lines of play

Declare winner based on final coin count and overall play quality.
Return JSON: {"winner":"a"|"b"|"draw","scores":{"a":{"deception":N,"strategy":N,"consistency":N,"creativity":N},"b":{"deception":N,"strategy":N,"consistency":N,"creativity":N}},"rationale":"string"}`;

    const judgment = await callGeminiJudge(prompt);
    const avgScore = (s: DimensionScores) =>
      Math.round((s.deception + s.strategy + s.consistency + s.creativity) / 4);

    return {
      winner: judgment.winner,
      scoreA: avgScore(judgment.scores.a),
      scoreB: avgScore(judgment.scores.b),
      dimensionDeltas: judgment.scores,
      judgeRationale: judgment.rationale,
    };
  }
}

export const bluffCoup = new BluffCoupEngine();
