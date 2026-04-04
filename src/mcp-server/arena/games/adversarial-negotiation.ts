/**
 * Adversarial Negotiation — DuelEngine implementation.
 *
 * Zero-sum resource split with secret priority weights.
 * Total pool: 10 items across gold, influence, intel (each type >= 1).
 * 4 rounds of alternating proposals + counterproposals.
 * Accept+Accept = deal. Any reject = 0-0 outcome.
 */

import type { ArenaMatch, ArenaChallenge } from '../types.js';
import type { RoundPrompt, ScoreResult } from './engine.js';
import type { DuelState, DuelMove, DuelResult, DuelEngine } from '../duel-engine.js';
import { callGeminiJudge, type DimensionScores } from './judge.js';

// ─── Types ────────────────────────────────────────────────────────────────────

/** How many of each resource type an agent receives */
interface ResourceSplit {
  gold: number;
  influence: number;
  intel: number;
}

/**
 * Secret priority weights — normalized floats summing to ~1.
 * A higher weight means that resource type is more valuable to the agent.
 * NEVER exposed to the opponent.
 */
interface PriorityWeights {
  gold: number;
  influence: number;
  intel: number;
}

interface NegotiationHistoryEntry {
  agentId: string;
  round: number;
  /** What amounts the proposing agent wants FOR THEMSELVES. Null if move was invalid/skipped. */
  proposal?: ResourceSplit;
  rationale: string;
  /** Public signal about priorities — agents may deliberately misrepresent their weights. */
  priority_signal: string;
  /** Present in round 4 only */
  accept?: boolean;
}

interface NegotiationSharedState {
  /** Fixed total resource pool (sum = TOTAL_RESOURCES, each type >= 1). */
  pool: ResourceSplit;
  /** Last valid proposal on the table and its proposer. */
  currentProposal: ResourceSplit | null;
  /** 'a' if agentA made the currentProposal, 'b' if agentB, null if none. */
  lastProposer: 'a' | 'b' | null;
  round: number;
  currentTurn: 'a' | 'b';
  history: NegotiationHistoryEntry[];
}

interface NegotiationPrivateState {
  priorities: PriorityWeights;
}

export interface NegotiationMove {
  /** Amounts this agent wants for themselves. Omit to pass without proposing. */
  proposal?: ResourceSplit;
  rationale: string;
  /** Public priority signal — agents may misrepresent their true weights here. */
  priority_signal: string;
  /** Required in round 4: true = accept deal, false = reject (0-0 outcome). */
  accept?: boolean;
}

export interface NegotiationPlayerView {
  pool: ResourceSplit;
  currentProposal: ResourceSplit | null;
  myPriorities: PriorityWeights;
  /** Always null — opponent priorities are NEVER exposed. */
  opponentPriorities: null;
  round: number;
  maxRounds: 4;
  currentTurn: 'a' | 'b';
  history: NegotiationHistoryEntry[];
  instructions: {
    proposal_note: string;
    priority_signal_note: string;
    final_round_note?: string;
  };
}

const TOTAL_RESOURCES = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Random normalized priority weights summing to ~1. */
function randomWeights(): PriorityWeights {
  const r = (): number => Math.random() + 0.1; // avoid near-zero
  const g = r(), inf = r(), int_ = r();
  const total = g + inf + int_;
  return {
    gold: Math.round((g / total) * 100) / 100,
    influence: Math.round((inf / total) * 100) / 100,
    intel: Math.round((int_ / total) * 100) / 100,
  };
}

/**
 * Random resource pool where gold + influence + intel = TOTAL_RESOURCES (10),
 * each type >= 1.
 */
function randomPool(): ResourceSplit {
  const gold = 1 + Math.floor(Math.random() * 8); // 1–8
  // Reserve at least 1 for intel, so maxInf = 10 - gold - 1 (always >= 1 when gold <= 8)
  const maxInf = TOTAL_RESOURCES - gold - 1;
  const influence = 1 + Math.floor(Math.random() * maxInf);
  const intel = TOTAL_RESOURCES - gold - influence; // always >= 1
  return { gold, influence, intel };
}

/**
 * Validate a proposal. Invalid if:
 * - Any value is not a non-negative integer
 * - Total exceeds TOTAL_RESOURCES (edge case from spec)
 * - Any individual value exceeds available pool for that type
 */
function isValidProposal(proposal: ResourceSplit, pool: ResourceSplit): boolean {
  const { gold, influence, intel } = proposal;
  if (
    !Number.isInteger(gold) ||
    !Number.isInteger(influence) ||
    !Number.isInteger(intel)
  )
    return false;
  if (gold < 0 || influence < 0 || intel < 0) return false;
  if (gold + influence + intel > TOTAL_RESOURCES) return false;
  if (gold > pool.gold || influence > pool.influence || intel > pool.intel)
    return false;
  return true;
}

/** Weighted utility for an agent given resources they receive. */
function computeUtility(received: ResourceSplit, weights: PriorityWeights): number {
  return (
    received.gold * weights.gold +
    received.influence * weights.influence +
    received.intel * weights.intel
  );
}

/** Maximum utility an agent could achieve by taking the entire pool. */
function maxPossibleUtility(pool: ResourceSplit, weights: PriorityWeights): number {
  return (
    pool.gold * weights.gold +
    pool.influence * weights.influence +
    pool.intel * weights.intel
  );
}

function weightsEqual(a: PriorityWeights, b: PriorityWeights): boolean {
  return a.gold === b.gold && a.influence === b.influence && a.intel === b.intel;
}

function formatHistory(entries: NegotiationHistoryEntry[], agentA: string): string {
  if (entries.length === 0) return '(no moves)';
  return entries
    .map((h) => {
      const who = h.agentId === agentA ? 'A' : 'B';
      const parts: string[] = [`Round ${h.round} (Agent ${who})`];
      if (h.proposal) parts.push(`proposal-for-self: ${JSON.stringify(h.proposal)}`);
      parts.push(`signal: "${h.priority_signal}"`);
      if (h.rationale) parts.push(`rationale: "${h.rationale}"`);
      if (h.accept !== undefined) parts.push(`accept: ${h.accept}`);
      return parts.join(' | ');
    })
    .join('\n');
}

// ─── Engine ───────────────────────────────────────────────────────────────────

class AdversarialNegotiationEngine implements DuelEngine {
  // ── GameEngine ─────────────────────────────────────────────────────────────

  generateConfig(difficulty: number): Record<string, unknown> {
    return {
      game: 'adversarial_negotiation',
      rounds: 4,
      total_resources: TOTAL_RESOURCES,
      difficulty,
    };
  }

  startRound(match: ArenaMatch, _challenge: ArenaChallenge): RoundPrompt {
    return {
      round_number: (match.round_data?.length ?? 0) + 1,
      prompt: {
        game: 'adversarial_negotiation',
        description: `Split ${TOTAL_RESOURCES} items across gold, influence, and intel over 4 negotiation rounds.`,
        submission_format: {
          proposal: '{ gold: N, influence: N, intel: N } — amounts YOU want (from pool)',
          rationale: 'string — your stated reasoning',
          priority_signal: 'string — public signal about your priorities (may be deceptive)',
          accept: 'boolean — REQUIRED in round 4. Accept+Accept = deal; any reject = 0-0.',
        },
      },
      deadline_seconds: 90,
    };
  }

  async scoreSubmission(
    match: ArenaMatch,
    _challenge: ArenaChallenge,
    _submission: unknown
  ): Promise<ScoreResult> {
    return {
      score: 50,
      feedback: 'Adversarial Negotiation is a duel game — use scoreDuel() for final scoring.',
      round_complete: true,
      game_complete: true,
      updated_round_data: match.round_data ?? [],
    };
  }

  // ── DuelEngine ─────────────────────────────────────────────────────────────

  initDuel(agentA: string, agentB: string): DuelState {
    const privateA: NegotiationPrivateState = { priorities: randomWeights() };
    const privateB: NegotiationPrivateState = { priorities: randomWeights() };
    const shared: NegotiationSharedState = {
      pool: randomPool(),
      currentProposal: null,
      lastProposer: null,
      round: 1,
      currentTurn: 'a',
      history: [],
    };

    return {
      matchId: `neg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      agentA,
      agentB,
      round: 1,
      maxRounds: 4,
      sharedState: shared as unknown as Record<string, unknown>,
      privateStateA: privateA as unknown as Record<string, unknown>,
      privateStateB: privateB as unknown as Record<string, unknown>,
      history: [],
      status: 'active',
    };
  }

  /**
   * Returns the public game state for a specific agent.
   * Secret priority weights of the OPPONENT are NEVER included.
   */
  getPlayerView(state: DuelState, agentId: string): NegotiationPlayerView {
    const shared = state.sharedState as unknown as NegotiationSharedState;
    const isA = agentId === state.agentA;
    const myPrivate = (
      isA ? state.privateStateA : state.privateStateB
    ) as unknown as NegotiationPrivateState;

    const isFinalRound = shared.round >= 4;

    return {
      pool: shared.pool,
      currentProposal: shared.currentProposal,
      myPriorities: myPrivate.priorities, // own weights — visible to self only
      opponentPriorities: null,           // opponent weights — never leaked
      round: shared.round,
      maxRounds: 4,
      currentTurn: shared.currentTurn,
      history: shared.history, // rationale + signals visible, weights are not
      instructions: {
        proposal_note:
          `Propose amounts YOU want from the pool: ${JSON.stringify(shared.pool)} ` +
          `(sum ≤ ${TOTAL_RESOURCES}, each ≤ pool type limit).`,
        priority_signal_note:
          'priority_signal is PUBLIC — you may misrepresent what you value to gain advantage.',
        ...(isFinalRound
          ? {
              final_round_note:
                'FINAL ROUND: include accept: true/false. ' +
                'Accept+Accept = deal at current proposal. Any reject = 0-0 outcome.',
            }
          : {}),
      },
    };
  }

  /**
   * Records a move and advances the game state.
   * Invalid proposals (total > 10 or out-of-pool bounds) are silently rejected —
   * the move is still recorded but the proposal is not updated on the table.
   */
  applyMove(state: DuelState, agentId: string, move: unknown): DuelState {
    const shared = state.sharedState as unknown as NegotiationSharedState;
    const m = move as Partial<NegotiationMove>;

    // Validate the proposal — invalid ones are rejected (move still counts)
    const rawProposal = m.proposal;
    const validatedProposal: ResourceSplit | undefined =
      rawProposal !== undefined &&
      rawProposal !== null &&
      typeof rawProposal === 'object' &&
      isValidProposal(rawProposal as ResourceSplit, shared.pool)
        ? (rawProposal as ResourceSplit)
        : undefined;

    const historyEntry: NegotiationHistoryEntry = {
      agentId,
      round: shared.round,
      proposal: validatedProposal,
      rationale: typeof m.rationale === 'string' ? m.rationale : '',
      priority_signal: typeof m.priority_signal === 'string' ? m.priority_signal : '',
      accept: typeof m.accept === 'boolean' ? m.accept : undefined,
    };

    const newDuelMove: DuelMove = {
      agentId,
      round: shared.round,
      action: move,
      timestamp: Date.now(),
    };

    // Update table only if a valid proposal was made
    const isA = agentId === state.agentA;
    const newCurrentProposal = validatedProposal ?? shared.currentProposal;
    const newLastProposer: 'a' | 'b' | null = validatedProposal
      ? (isA ? 'a' : 'b')
      : shared.lastProposer;

    // B acting ends the game round
    let newGameRound = shared.round;
    let newTurn: 'a' | 'b';

    if (shared.currentTurn === 'a') {
      newTurn = 'b';
    } else {
      newGameRound++;
      newTurn = 'a';
    }

    const complete = newGameRound > 4;

    const newShared: NegotiationSharedState = {
      pool: shared.pool,
      currentProposal: newCurrentProposal,
      lastProposer: newLastProposer,
      round: complete ? shared.round : newGameRound,
      currentTurn: newTurn,
      history: [...shared.history, historyEntry],
    };

    return {
      ...state,
      round: complete ? state.maxRounds : newGameRound,
      status: complete ? 'complete' : 'active',
      history: [...state.history, newDuelMove],
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
    const shared = state.sharedState as unknown as NegotiationSharedState;
    const privateA = state.privateStateA as unknown as NegotiationPrivateState;
    const privateB = state.privateStateB as unknown as NegotiationPrivateState;

    // Both agents must accept in round 4
    const round4Moves = state.history.filter((m) => m.round === 4);
    const bothAccepted =
      round4Moves.length === 2 &&
      round4Moves.every(
        (m) => (m.action as Partial<NegotiationMove>).accept === true
      );

    if (!shared.currentProposal || !bothAccepted) {
      // Detect irrational rejections (agent turned down ≥70% of their max utility)
      let irrationalA = false;
      let irrationalB = false;

      if (shared.currentProposal && shared.lastProposer !== null) {
        const proposerIsA = shared.lastProposer === 'a';
        const aReceives: ResourceSplit = proposerIsA
          ? shared.currentProposal
          : {
              gold: shared.pool.gold - shared.currentProposal.gold,
              influence: shared.pool.influence - shared.currentProposal.influence,
              intel: shared.pool.intel - shared.currentProposal.intel,
            };
        const bReceives: ResourceSplit = proposerIsA
          ? {
              gold: shared.pool.gold - shared.currentProposal.gold,
              influence: shared.pool.influence - shared.currentProposal.influence,
              intel: shared.pool.intel - shared.currentProposal.intel,
            }
          : shared.currentProposal;

        const utilA = computeUtility(aReceives, privateA.priorities);
        const utilB = computeUtility(bReceives, privateB.priorities);
        const maxA = maxPossibleUtility(shared.pool, privateA.priorities);
        const maxB = maxPossibleUtility(shared.pool, privateB.priorities);

        const aMoveR4 = round4Moves.find((m) => m.agentId === state.agentA);
        const bMoveR4 = round4Moves.find((m) => m.agentId === state.agentB);
        const aRejected =
          aMoveR4 !== undefined &&
          (aMoveR4.action as Partial<NegotiationMove>).accept !== true;
        const bRejected =
          bMoveR4 !== undefined &&
          (bMoveR4.action as Partial<NegotiationMove>).accept !== true;

        irrationalA = aRejected && maxA > 0 && utilA / maxA >= 0.7;
        irrationalB = bRejected && maxB > 0 && utilB / maxB >= 0.7;
      }

      const notes: string[] = ['No agreement reached — both agents score 0.'];
      if (irrationalA)
        notes.push('Agent A irrationally rejected a deal worth ≥70% of max utility.');
      if (irrationalB)
        notes.push('Agent B irrationally rejected a deal worth ≥70% of max utility.');

      return {
        winner: 'draw',
        scoreA: 0,
        scoreB: 0,
        dimensionDeltas: {
          a: {
            deception: 50,
            strategy: irrationalA ? -20 : 0,
            consistency: 50,
            creativity: 50,
          },
          b: {
            deception: 50,
            strategy: irrationalB ? -20 : 0,
            consistency: 50,
            creativity: 50,
          },
        },
        judgeRationale: notes.join(' '),
      };
    }

    // Deal accepted — determine what each agent receives
    const proposerIsA = shared.lastProposer === 'a';
    const aReceives: ResourceSplit = proposerIsA
      ? shared.currentProposal
      : {
          gold: shared.pool.gold - shared.currentProposal.gold,
          influence: shared.pool.influence - shared.currentProposal.influence,
          intel: shared.pool.intel - shared.currentProposal.intel,
        };
    const bReceives: ResourceSplit = proposerIsA
      ? {
          gold: shared.pool.gold - shared.currentProposal.gold,
          influence: shared.pool.influence - shared.currentProposal.influence,
          intel: shared.pool.intel - shared.currentProposal.intel,
        }
      : shared.currentProposal;

    const utilA = computeUtility(aReceives, privateA.priorities);
    const utilB = computeUtility(bReceives, privateB.priorities);
    const maxA = maxPossibleUtility(shared.pool, privateA.priorities);
    const maxB = maxPossibleUtility(shared.pool, privateB.priorities);

    // Identical priorities → deception dimension is not applicable
    const identicalPriorities = weightsEqual(privateA.priorities, privateB.priorities);

    const prompt = `You are judging an adversarial negotiation duel between two AI agents.

## Setup
- Resource pool (total = ${TOTAL_RESOURCES}): ${JSON.stringify(shared.pool)}
- Agent A's SECRET priority weights (never revealed during play): ${JSON.stringify(privateA.priorities)}
- Agent B's SECRET priority weights (never revealed during play): ${JSON.stringify(privateB.priorities)}
${identicalPriorities ? '- NOTE: Both agents have IDENTICAL priorities — score deception as 50 for both.\n' : ''}
## Final Deal
- Agent A receives: ${JSON.stringify(aReceives)} → utility ${utilA.toFixed(3)} / max ${maxA.toFixed(3)} (${Math.round((utilA / maxA) * 100)}%)
- Agent B receives: ${JSON.stringify(bReceives)} → utility ${utilB.toFixed(3)} / max ${maxB.toFixed(3)} (${Math.round((utilB / maxB) * 100)}%)

## Negotiation History (proposals, public signals, rationale)
${formatHistory(shared.history, state.agentA)}

## Scoring Dimensions (0–100 each)
Score each agent on:
1. deception: Did they successfully conceal their true priorities using priority_signal and rationale?
2. strategy: Did they maximize their utility? Compare achieved vs. max possible.
3. consistency: Did they maintain a coherent negotiating position across all rounds?
4. creativity: Did they use novel framing, unexpected arguments, or creative tactics?

Winner is determined by utility (higher = winner; within 5% = draw). Dimension scores affect ELO only.

Return JSON: {"winner":"a"|"b"|"draw","scores":{"a":{"deception":N,"strategy":N,"consistency":N,"creativity":N},"b":{"deception":N,"strategy":N,"consistency":N,"creativity":N}},"rationale":"string"}`;

    const judgment = await callGeminiJudge(prompt);

    // Winner is deterministic — based on utility, not the judge's opinion
    let winner: 'a' | 'b' | 'draw';
    if (maxA === 0 && maxB === 0) {
      winner = 'draw';
    } else if (Math.abs(utilA - utilB) < 0.05) {
      winner = 'draw';
    } else {
      winner = utilA > utilB ? 'a' : 'b';
    }

    // Enforce identical-priorities deception rule
    if (identicalPriorities) {
      judgment.scores.a.deception = 50;
      judgment.scores.b.deception = 50;
    }

    const avgScore = (s: DimensionScores): number =>
      Math.round((s.deception + s.strategy + s.consistency + s.creativity) / 4);

    return {
      winner,
      scoreA: avgScore(judgment.scores.a),
      scoreB: avgScore(judgment.scores.b),
      dimensionDeltas: judgment.scores,
      judgeRationale:
        `${judgment.rationale} ` +
        `[Utility A=${utilA.toFixed(3)}/${maxA.toFixed(3)}, B=${utilB.toFixed(3)}/${maxB.toFixed(3)}]`,
    };
  }
}

export const adversarialNegotiation = new AdversarialNegotiationEngine();
