// Auto-generated — Pillar 7: Memory Vault (66 games)
// Generated 2026-03-28T16:55:01.211Z
import type { GameEngine, RoundPrompt, ScoreResult } from '../engine.js';
import type { ArenaMatch, ArenaChallenge } from '../../types.js';

function wc(s: string): number { return s.trim().split(/\s+/).filter(Boolean).length; }
function has(s: string, kw: string[]): number { const l = s.toLowerCase(); return kw.filter(k => l.includes(k)).length; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function clamp(n: number): number { return Math.max(0, Math.min(100, Math.round(n))); }
function codeScore(s: string): number { let sc = 0; if (s.includes('function') || s.includes('=>')) sc += 20; if (s.includes('return')) sc += 15; if (s.includes('{')) sc += 10; if (s.length > 20) sc += 15; if (s.length > 100) sc += 10; return clamp(sc + rand(5, 20)); }
function reasonScore(s: string): number { const m = ['therefore','because','since','thus','hence','if','then','given','conclude','follows','implies']; let sc = has(s, m) * 7; if (wc(s) > 30) sc += 15; if (wc(s) > 80) sc += 10; return clamp(sc + rand(5, 20)); }
function creativeScore(s: string): number { const u = new Set(s.toLowerCase().split(/\s+/)); let sc = Math.min(40, u.size); if (wc(s) > 20) sc += 15; return clamp(sc + rand(5, 20)); }
function precisionScore(s: string, ideal: number): number { const len = wc(s); if (len === 0) return 0; return clamp(100 - Math.abs(len - ideal) * 3); }
function mathScore(s: string): number { let sc = 0; if (/\d/.test(s)) sc += 20; if (s.includes('=') || s.includes('+')) sc += 15; if (has(s, ['therefore','thus','equals','answer','result','solution']) > 0) sc += 15; if (wc(s) > 10) sc += 15; return clamp(sc + rand(10, 25)); }

function textGame(cfg: { prompts: ((d: number, r: number) => string)[]; score: (answer: string, d: number) => number; deadline?: number; }): GameEngine {
  return {
    generateConfig: (d) => ({ difficulty: Math.max(1, Math.min(10, d)) }),
    startRound: (match: ArenaMatch, challenge: ArenaChallenge): RoundPrompt => {
      const r = (match.round_data?.length ?? 0) + 1;
      const d = challenge.difficulty ?? 3;
      return { round_number: r, prompt: cfg.prompts[(r - 1) % cfg.prompts.length](d, r), deadline_seconds: cfg.deadline ?? 120 };
    },
    scoreSubmission: async (match: ArenaMatch, challenge: ArenaChallenge, submission: unknown): Promise<ScoreResult> => {
      const answer = typeof submission === 'string' ? submission : (submission as Record<string, unknown>)?.answer as string ?? JSON.stringify(submission);
      const d = challenge.difficulty ?? 3;
      const score = clamp(cfg.score(answer || '', d));
      const rn = (match.round_data?.length ?? 0) + 1;
      return { score, feedback: `Score: ${score}/100`, round_complete: true, game_complete: rn >= 3, updated_round_data: [...(match.round_data || []), { score, answer: (answer || '').slice(0, 200) }] };
    },
  };
}

export const P7_EXT: Record<string, GameEngine> = {
rhyme_game: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a rhyming poem about a topic of your choice, difficulty ${d} round ${r}`,
    (d, r) => `Create a short rhyming story with a character, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["rhyme", "poem"])) {
      sc = creativeScore(answer);
    }
    return clamp(sc);
  },
  deadline: 180,
}),

rhyme_game: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a rhyming poem about a topic of your choice, difficulty ${d} round ${r}`,
    (d, r) => `Create a short rhyming story with a character, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["rhyme", "poem"])) {
      sc = creativeScore(answer);
    }
    return clamp(sc);
  },
  deadline: 180,
}),

logic_puzzle: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Solve a logic puzzle: ${d} difficulty, round ${r}`,
    (d, r) => `Find the pattern: ${d} difficulty, round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["logic", "pattern"])) {
      sc = reasonScore(answer);
    }
    return clamp(sc, 10);
  },
  deadline: 150,
}),

logic_puzzle: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Solve a logic puzzle: ${d} difficulty, round ${r}`,
    (d, r) => `Find the pattern: ${d} difficulty, round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["logic", "pattern"])) {
      sc = reasonScore(answer);
    }
    return clamp(sc, 10);
  },
  deadline: 150,
}),

math_challenge: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve a math problem: ${d} difficulty, round ${r}`,
    (d, r) => `Find the solution: ${d} difficulty, round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = mathScore(answer);
    return clamp(sc, 100);
  },
  deadline: 120,
}),

math_challenge: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve a math problem: ${d} difficulty, round ${r}`,
    (d, r) => `Find the solution: ${d} difficulty, round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = mathScore(answer);
    return clamp(sc, 100);
  },
  deadline: 120,
}),

story_teller: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Collaborate on a story, difficulty ${d} round ${r}`,
    (d, r) => `Co-create a narrative, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["story", "narrative"])) {
      sc = creativeScore(answer);
    }
    return clamp(sc);
  },
  deadline: 240,
}),

story_teller: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Collaborate on a story, difficulty ${d} round ${r}`,
    (d, r) => `Co-create a narrative, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["story", "narrative"])) {
      sc = creativeScore(answer);
    }
    return clamp(sc);
  },
  deadline: 240,
}),

precision_builder: textGame({
  // format: solo
  prompts: [
    (d, r) => `Build a precise structure using blocks, difficulty ${d} round ${r}`,
    (d, r) => `Create a precise design, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = precisionScore(answer, "ideal_structure");
    return clamp(sc);
  },
  deadline: 180,
}),

precision_builder: textGame({
  // format: solo
  prompts: [
    (d, r) => `Build a precise structure using blocks, difficulty ${d} round ${r}`,
    (d, r) => `Create a precise design, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = precisionScore(answer, "ideal_structure");
    return clamp(sc);
  },
  deadline: 180,
}),

syntax_sprint: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Write a program in a fictional language, difficulty ${d} round ${r}`,
    (d, r) => `Optimize a code snippet, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["code", "program"])) {
      sc = codeScore(answer);
    }
    return clamp(sc);
  },
  deadline: 150,
}),

syntax_sprint: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Write a program in a fictional language, difficulty ${d} round ${r}`,
    (d, r) => `Optimize a code snippet, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["code", "program"])) {
      sc = codeScore(answer);
    }
    return clamp(sc);
  },
  deadline: 150,
}),

memory_match: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Find matching pairs, difficulty ${d} round ${r}`,
    (d, r) => `Recall a sequence, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = wc(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

memory_match: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Find matching pairs, difficulty ${d} round ${r}`,
    (d, r) => `Recall a sequence, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = wc(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

neural_poker: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Make strategic decisions in a poker-like game, difficulty ${d} round ${r}`,
    (d, r) => `Negotiate a deal, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["strategy", "decision"])) {
      sc = reasonScore(answer);
    }
    return clamp(sc);
  },
  deadline: 180,
}),

neural_poker: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Make strategic decisions in a poker-like game, difficulty ${d} round ${r}`,
    (d, r) => `Negotiate a deal, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["strategy", "decision"])) {
      sc = reasonScore(answer);
    }
    return clamp(sc);
  },
  deadline: 180,
}),

word_chain: textGame({
  // format: solo
  prompts: [
    (d, r) => `Create a word chain, difficulty ${d} round ${r}`,
    (d, r) => `Find connected words, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["word", "chain"])) {
      sc = creativeScore(answer);
    }
    return clamp(sc);
  },
  deadline: 150,
}),

word_chain: textGame({
  // format: solo
  prompts: [
    (d, r) => `Create a word chain, difficulty ${d} round ${r}`,
    (d, r) => `Find connected words, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["word", "chain"])) {
      sc = creativeScore(answer);
    }
    return clamp(sc);
  },
  deadline: 150,
}),

eco_balance: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Balance an ecosystem, difficulty ${d} round ${r}`,
    (d, r) => `Manage resources in a simulation, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["ecosystem", "balance"])) {
      sc = reasonScore(answer);
    }
    return clamp(sc);
  },
  deadline: 240,
}),
};


