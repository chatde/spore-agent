// Auto-generated — Pillar 1: Pattern & Perception (13 games)
// Generated 2026-03-28T16:21:06.490Z
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

export const P1_EXT: Record<string, GameEngine> = {
sequence_prediction: textGame({
  // format: solo
  prompts: [
    (d, r) => `Given the sequence: 0, ${d}, ${2*d}, ${3*d}, what is the next number?`,
    (d, r) => `Continue the pattern: ${5*d}, ${4*d}, ${3*d}, ${2*d}, ?`
  ],
  score: (answer, d) => {
    const ideal = 4 * d;
    let sc = mathScore(answer, ideal);
    return clamp(sc);
  },
  deadline: 120
}),

syntax_sprint: textGame({
  // format: duel_1v1  prompts: [
    (d, r) => `Fix the syntax error in this JavaScript snippet: function foo() { return 42 }`,
    (d, r) => `Correct the missing semicolon: let x = 10 console.log(x)`
  ],
  score: (answer, d) => {
    let sc = codeScore(answer);
    return clamp(sc);
  },
  deadline: 120
}),

semantic_similarity: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Sentence A: "The cat sat on the mat." Sentence B: "A feline rested on the rug." Are they talking about the same topic? Answer yes or no.`,
    (d, r) => `Sentence A: "She baked a chocolate cake." Sentence B: "He repaired the bicycle." Are they talking about the same topic? Answer yes or no.`
  ],
  score: (answer, d) => {
    const ideal = d % 2 === 0 ? "yes" : "no"; // alternate ideal based on difficulty parity
    let sc = precisionScore(answer, ideal);
    // bonus if answer contains the correct keyword
    if (has(answer, [ideal])) sc += 20;
    return clamp(sc);
  },
  deadline: 120
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Given a pattern of ${d} elements, predict the next ${d} elements. Pattern: ${generatePattern(d, r)}`,
    (d, r) => `Complete the pattern: ${generatePattern(d, r)}...`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += precisionScore(answer, generatePattern(d, d));
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Identify the outlier in this set of ${d+2} items: ${generateSet(d, r)}`,
    (d, r) => `Which item doesn't belong? ${generateSet(d, r)}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, findOutlier(d, r)) ? d * 10 : 0;
    return clamp(sc);
  },
  deadline: 60,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Given an image description, identify all objects present. Description: ${generateImageDesc(d, r)}`,
    (d, r) => `List objects in: ${generateImageDesc(d, r)}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer);
    return clamp(sc);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Find the hidden rule connecting these ${d} items: ${generateRuleSet(d, r)}`,
    (d, r) => `What's the common principle? ${generateRuleSet(d, r)}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer, findRule(d, r));
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Given ${d} scrambled words, unscramble to form a coherent phrase. Words: ${scrambleWords(d, r)}`,
    (d, r) => `Reorder: ${scrambleWords(d, r)}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += precisionScore(answer, unscrambleWords(d, r));
    return clamp(sc);
  },
  deadline: 100,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Calculate the probability of ${d} independent events occurring. Events: ${generateEvents(d, r)}`,
    (d, r) => `What's the chance of: ${generateEvents(d, r)}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer, calculateProbability(d, r));
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Given a metaphor, identify the underlying analogy. Metaphor: ${generateMetaphor(d, r)}`,
    (d, r) => `What's being compared in: ${generateMetaphor(d, r)}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer, findAnalogy(d, r));
    return clamp(sc);
  },
  deadline: 80,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Given a code snippet, identify the bug. Code: ${generateCodeBug(d, r)}`,
    (d, r) => `Find the error in: ${generateCodeBug(d, r)}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer, findBug(d, r));
    return clamp(sc);
  },
  deadline: 200,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Generate ${d} creative uses for a ${randomObject()}.`,
    (d, r) => `Think of ${d} innovative applications for a ${randomObject()}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer, d);
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Given a logical statement, determine if it's valid. Statement: ${generateLogicalStatement(d, r)}`,
    (d, r) => `Is this reasoning sound? ${generateLogicalStatement(d, r)}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer, validateLogic(d, r));
    return clamp(sc);
  },
  deadline: 100,
}),
};

export const P1_META = { name: 'Pattern & Perception', icon: '🔄', color: 'text-gray-400', games: Object.keys(P1_EXT) };
