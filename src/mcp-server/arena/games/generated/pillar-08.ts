// Auto-generated — Pillar 8: Math Colosseum (60 games)
// Generated 2026-03-28T17:04:06.071Z
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

export const P8_EXT: Record<string, GameEngine> = {
game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve: If ${d*3} + x = ${d*8 + r}, what is x? Show steps.`,
    (d, r) => `Calculate: ${d*(r+5)} - ${d*2}.`
  ],
  score: (s, d) => mathScore(s) * 0.7 + precisionScore(s, d > 5 ? `${d*8 + r - d*3}` : `${d*3}`) * 0.3,
  deadline: 60,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve: If ${d*3} + x = ${d*8 + r}, what is x? Show steps.`,
    (d, r) => `Calculate: ${d*(r+5)} - ${d*2}.`
  ],
  score: (s, d) => mathScore(s) * 0.7 + precisionScore(s, d > 5 ? `${d*8 + r - d*3}` : `${d*3}`) * 0.3,
  deadline: 60,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Factor completely: ${d*(d+1)}x^2 + ${d*(r+3)}x + ${d*(r+2)}`
  ],
  score: (s, d) => mathScore(s) * 0.8 + wc(s, ["factor"]) * 0.2,
  deadline: 90,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Factor completely: ${d*(d+1)}x^2 + ${d*(r+3)}x + ${d*(r+2)}`
  ],
  score: (s, d) => mathScore(s) * 0.8 + wc(s, ["factor"]) * 0.2,
  deadline: 90,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Prove sqrt(${d*d + r}) ,

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Prove sqrt(${d*d + r}) 

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Area of circle with radius ${d + r/2}. Round to nearest integer.`,
    (d, r) => `Circumference of circle with diameter ${d + r}.`
  ],
  score: (s, d) => mathScore(s) * 0.9 + clamp(has(s, ["π", "pi"]) ? 0.1 : 0),
  deadline: 45,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Area of circle with radius ${d + r/2}. Round to nearest integer.`,
    (d, r) => `Circumference of circle with diameter ${d + r}.`
  ],
  score: (s, d) => mathScore(s) * 0.9 + clamp(has(s, ["π", "pi"]) ? 0.1 : 0),
  deadline: 45,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Find next 3 terms in: ${d}, ${d+2}, ${d+6}, ${d+12}, ...`
  ],
  score: (s, d) => patternScore(s) * 0.5 + creativeScore(s) * 0.5,
  deadline: 60,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Find next 3 terms in: ${d}, ${d+2}, ${d+6}, ${d+12}, ...`
  ],
  score: (s, d) => patternScore(s) * 0.5 + creativeScore(s) * 0.5,
  deadline: 60,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Simplify: (${d}√${r} + ${d}√(${r+1)}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Simplify: (${d}√${r} + ${d}√(${r+1)})

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Create a quadratic equation with roots ${d} and ${r+1}`
  ],
  score: (s, d) => creativeScore(s) * 0.4 + mathScore(s) * 0.6,
  deadline: 90,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Create a quadratic equation with roots ${d} and ${r+1}`
  ],
  score: (s, d) => creativeScore(s) * 0.4 + mathScore(s) * 0.6,
  deadline: 90,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve: (${d}/x) + (${r}/(x+1)) = 1`
  ],
  score: (s, d) => mathScore(s) * 0.8 + wc(s, ["common denominator", "LCD"]) * 0.2,
  deadline: 90,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve: (${d}/x) + (${r}/(x+1)) = 1`
  ],
  score: (s, d) => mathScore(s) * 0.8 + wc(s, ["common denominator", "LCD"]) * 0.2,
  deadline: 90,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Differentiate: ${d}x^${r+1} + ${r}x^${d}`
  ],
  score: (s, d) => codeScore(s) * 0.7 + precisionScore(s, `${d*(r+1)}x^${r} + ${r*d}x^${d-1}`) * 0.3,
  deadline: 60,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Differentiate: ${d}x^${r+1} + ${r}x^${d}`
  ],
  score: (s, d) => codeScore(s) * 0.7 + precisionScore(s, `${d*(r+1)}x^${r} + ${r*d}x^${d-1}`) * 0.3,
  deadline: 60,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Probability: ${d} red balls and ${r} blue in bag. Find P(2 red in 3 draws without replacement)`
  ],
  score: (s, d) => reasonScore(s) * 0.5 + mathScore(s) * 0.5,
  deadline: 90,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Probability: ${d} red balls and ${r} blue in bag. Find P(2 red in 3 draws without replacement)`
  ],
  score: (s, d) => reasonScore(s) * 0.5 + mathScore(s) * 0.5,
  deadline: 90,
})

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve for x: ${r + 1} * x^${d} - ${d * r} * x + ${d + r} = 0`,
    (d, r) => `Find the derivative of: ${d}x^${r + 2} + ${r}x^${d} - ${d * r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (answer.includes("x")) sc += 5;
    if (has(answer, ["root", "solution"])) sc += 3;
    if (mathScore(answer) > 0.7) sc += 2;
    return clamp(sc);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve for x: ${r + 1} * x^${d} - ${d * r} * x + ${d + r} = 0`,
    (d, r) => `Find the derivative of: ${d}x^${r + 2} + ${r}x^${d} - ${d * r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (answer.includes("x")) sc += 5;
    if (has(answer, ["root", "solution"])) sc += 3;
    if (mathScore(answer) > 0.7) sc += 2;
    return clamp(sc);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Decode: A = ${d}, B = ${r}, C = ${d + r}. Solve: A * B + C = ?`,
    (d, r) => `Find X: X - ${d} = ${r}, X / ${d + 1} = ${r - 1}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["A", "B", "C"])) sc += 4;
    if (mathScore(answer) > 0.6) sc += 3;
    if (wc(answer) < 50) sc += 3;
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Decode: A = ${d}, B = ${r}, C = ${d + r}. Solve: A * B + C = ?`,
    (d, r) => `Find X: X - ${d} = ${r}, X / ${d + 1} = ${r - 1}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["A", "B", "C"])) sc += 4;
    if (mathScore(answer) > 0.6) sc += 3;
    if (wc(answer) < 50) sc += 3;
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Calculate area: Circle with radius ${d + r}`,
    (d, r) => `Volume of ${d + 1}-sided pyramid with base area ${r * d}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["area", "volume"])) sc += 5;
    if (mathScore(answer) > 0.8) sc += 2;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Calculate area: Circle with radius ${d + r}`,
    (d, r) => `Volume of ${d + 1}-sided pyramid with base area ${r * d}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["area", "volume"])) sc += 5;
    if (mathScore(answer) > 0.8) sc += 2;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Find GCD of ${d * r} and ${d + r}`,
    (d, r) => `Is ${d * d + r} prime? Prove your answer`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["GCD", "prime", "divisible"])) sc += 4;
    if (mathScore(answer) > 0.7) sc += 3;
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Find GCD of ${d * r} and ${d + r}`,
    (d, r) => `Is ${d * d + r} prime? Prove your answer`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["GCD", "prime", "divisible"])) sc += 4;
    if (mathScore(answer) > 0.7) sc += 3;
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `What's the probability of rolling ${d} on a ${r + 6}-sided die?`,
    (d, r) => `Given events A and B with probabilities ${d/10} and ${r/10}, find P(A ∪ B)`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["probability", "chance", "P("])) sc += 5;
    if (mathScore(answer) > 0.75) sc += 2;
    return clamp(sc);
  },
  deadline: 100,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `What's the probability of rolling ${d} on a ${r + 6}-sided die?`,
    (d, r) => `Given events A and B with probabilities ${d/10} and ${r/10}, find P(A ∪ B)`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["probability", "chance", "P("])) sc += 5;
    if (mathScore(answer) > 0.75) sc += 2;
    return clamp(sc);
  },
  deadline: 100,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Solve: (${d} + ${r}i) * x = ${d * r} - ${d}i`,
    (d, r) => `Find modulus of ${d + r}i + ${r - d}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["i", "complex", "modulus"])) sc += 4;
    if (mathScore(answer) > 0.65) sc += 3;
    return clamp(sc);
  },
  deadline: 110,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Solve: (${d} + ${r}i) * x = ${d * r} - ${d}i`,
    (d, r) => `Find modulus of ${d + r}i + ${r - d}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["i", "complex", "modulus"])) sc += 4;
    if (mathScore(answer) > 0.65) sc += 3;
    return clamp(sc);
  },
  deadline: 110,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Calculate mean of: ${d}, ${r}, ${d + r}, ${d * r}`,
    (d, r) => `Find standard deviation for the above set`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["mean", "standard deviation", "std"])) sc += 5;
    if (mathScore(answer) > 0.7) sc += 2;
    return clamp(sc);
  },
  deadline: 130,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Calculate mean of: ${d}, ${r}, ${d + r}, ${d * r}`,
    (d, r) => `Find standard deviation for the above set`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["mean", "standard deviation", "std"])) sc += 5;
    if (mathScore(answer) > 0.7) sc += 2;
    return clamp(sc);
  },
  deadline: 130,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Integrate: ${d}x^${r} + ${r}x^${d}`,
    (d, r) => `Find limit as x→${d} of (${r}x + ${d}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Integrate: ${d}x^${r} + ${r}x^${d}`,
    (d, r) => `Find limit as x→${d} of (${r}x + ${d})

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve recurrence: a(n) = ${d} * a(n-1) + ${r}, a(0) = ${d - r}`,
    (d, r) => `How many ways to arrange ${d} distinct items in ${r} slots?`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["recurrence", "arrange", "permutation"])) sc += 5;
    if (mathScore(answer) > 0.65) sc += 2;
    return clamp(sc);
  },
  deadline: 160,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve recurrence: a(n) = ${d} * a(n-1) + ${r}, a(0) = ${d - r}`,
    (d, r) => `How many ways to arrange ${d} distinct items in ${r} slots?`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["recurrence", "arrange", "permutation"])) sc += 5;
    if (mathScore(answer) > 0.65) sc += 2;
    return clamp(sc);
  },
  deadline: 160,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Solve system: ${d}x + ${r}y = ${d * r}, ${r}x - ${d}y = ${d + r}`,
    (d, r) => `Find determinant of matrix [[${d}, ${r}], [${r}, ${d}]]`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["matrix", "determinant", "system"])) sc += 4;
    if (mathScore(answer) > 0.7) sc += 3;
    return clamp(sc);
  },
  deadline: 170,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Solve system: ${d}x + ${r}y = ${d * r}, ${r}x - ${d}y = ${d + r}`,
    (d, r) => `Find determinant of matrix [[${d}, ${r}], [${r}, ${d}]]`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["matrix", "determinant", "system"])) sc += 4;
    if (mathScore(answer) > 0.7) sc += 3;
    return clamp(sc);
  },
  deadline: 170,
})

infinite_tiling: textGame({
  // format: solo
  prompts: [
    (d, r) => `Find a tessellating polygon (regular or irregular) with exactly ${Math.floor(d * 1.5) + 3 + r} sides. Name the polygon and briefly explain why it tiles the plane.`,
    (d, r) => `Describe a non‑periodic tiling using two distinct shapes. List the shapes and the matching rule (e.g., 'edges of length A must meet edges of length B').`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) >= 20 ? 5 : 0;
    if (has(answer, ['tessellat', 'tile', 'plane', 'no gap'])) sc += 15;
    if (has(answer, ['regular', 'irregular', 'polygon', 'angle'])) sc += 10;
    sc += mathScore(answer);
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 180,
}),

infinite_tiling: textGame({
  // format: solo
  prompts: [
    (d, r) => `Find a tessellating polygon (regular or irregular) with exactly ${Math.floor(d * 1.5) + 3 + r} sides. Name the polygon and briefly explain why it tiles the plane.`,
    (d, r) => `Describe a non‑periodic tiling using two distinct shapes. List the shapes and the matching rule (e.g., 'edges of length A must meet edges of length B').`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) >= 20 ? 5 : 0;
    if (has(answer, ['tessellat', 'tile', 'plane', 'no gap'])) sc += 15;
    if (has(answer, ['regular', 'irregular', 'polygon', 'angle'])) sc += 10;
    sc += mathScore(answer);
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 180,
}),

binary_bluff: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Round ${r}: You are Player ${r % 2 === 0 ? 'A' : 'B'}. Transmit the secret number ${Math.floor(Math.random() * 100) + 1} using only 5 bits (0/1). You may lie in one bit to mislead the opponent. Write your 5‑bit string.`,
    (d, r) => `Round ${r}: You are Player ${r % 2 === 0 ? 'B' : 'A'}. Decode the opponent's 5‑bit message. They may have one lie. State the original number you believe they were sending and which bit you think is the lie (position 1‑5).`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += precisionScore(answer, '');
    if (has(answer, ['0', '1']) && answer.replace(/[^01]/g, '').length === 5) sc += 20;
    sc += codeScore(answer);
    return clamp(sc);
  },
  deadline: 90,
}),

binary_bluff: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Round ${r}: You are Player ${r % 2 === 0 ? 'A' : 'B'}. Transmit the secret number ${Math.floor(Math.random() * 100) + 1} using only 5 bits (0/1). You may lie in one bit to mislead the opponent. Write your 5‑bit string.`,
    (d, r) => `Round ${r}: You are Player ${r % 2 === 0 ? 'B' : 'A'}. Decode the opponent's 5‑bit message. They may have one lie. State the original number you believe they were sending and which bit you think is the lie (position 1‑5).`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += precisionScore(answer, '');
    if (has(answer, ['0', '1']) && answer.replace(/[^01]/g, '').length === 5) sc += 20;
    sc += codeScore(answer);
    return clamp(sc);
  },
  deadline: 90,
}),

constraint_synthesis: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Synthesize a logical constraint for a variable x (integer) such that exactly ${d + r} distinct integer solutions exist in the range [-10, 10]. Write the constraint in plain English and as an inequality/equation.`,
    (d, r) => `Given the constraint "${['x is prime', '|x| > 3', 'x mod 3 = 1'][r % 3]}", how many integer solutions are there in [-10, 10]? List them and show count.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer);
    if (has(answer, ['solution', 'count', 'integer', 'range'])) sc += 15;
    sc += precisionScore(answer, '');
    return clamp(sc);
  },
  deadline: 150,
}),

constraint_synthesis: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Synthesize a logical constraint for a variable x (integer) such that exactly ${d + r} distinct integer solutions exist in the range [-10, 10]. Write the constraint in plain English and as an inequality/equation.`,
    (d, r) => `Given the constraint "${['x is prime', '|x| > 3', 'x mod 3 = 1'][r % 3]}", how many integer solutions are there in [-10, 10]? List them and show count.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer);
    if (has(answer, ['solution', 'count', 'integer', 'range'])) sc += 15;
    sc += precisionScore(answer, '');
    return clamp(sc);
  },
  deadline: 150,
}),

vector_duel: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `In 3D space, find a vector orthogonal to both a = (${d}, 1, ${r}) ,

vector_duel: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `In 3D space, find a vector orthogonal to both a = (${d}, 1, ${r}) 

cipher_chain: textGame({
  // format: solo
  prompts: [
    (d, r) => `Encode the word "${['SPORE', 'AGENT', 'ARENA', 'LOGIC'][r % 4]}" using a Caesar cipher with shift ${d + r}, then apply an Atbash cipher to the result. Output the final ciphertext.`,
    (d, r) => `Decode the message "${['KILWV', 'ZTRMG', 'GVXSV', 'ORMPM'][r % 4]}" by first applying Atbash, then a Caesar cipher with shift ${25 - (d + r) % 26}. Output the plaintext.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += precisionScore(answer, '');
    if (has(answer, ['caesar', 'shift', 'atbash', 'cipher'])) sc += 10;
    sc += codeScore(answer);
    return clamp(sc);
  },
  deadline: 100,
}),

cipher_chain: textGame({
  // format: solo
  prompts: [
    (d, r) => `Encode the word "${['SPORE', 'AGENT', 'ARENA', 'LOGIC'][r % 4]}" using a Caesar cipher with shift ${d + r}, then apply an Atbash cipher to the result. Output the final ciphertext.`,
    (d, r) => `Decode the message "${['KILWV', 'ZTRMG', 'GVXSV', 'ORMPM'][r % 4]}" by first applying Atbash, then a Caesar cipher with shift ${25 - (d + r) % 26}. Output the plaintext.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += precisionScore(answer, '');
    if (has(answer, ['caesar', 'shift', 'atbash', 'cipher'])) sc += 10;
    sc += codeScore(answer);
    return clamp(sc);
  },
  deadline: 100,
}),

topology_quick: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Name a topological property preserved under homeomorphism but not under homotopy equivalence. Give a brief example.`,
    (d, r) => `Which of these is NOT homeomorphic to a circle: a trefoil knot, a line segment, a Möbius strip's boundary, a figure‑eight? Justify in one sentence.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) >= 15 ? 10 : 0;
    if (has(answer, ['homeomorph', 'homotop', 'topolog', 'preserve'])) sc += 20;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 140,
}),

topology_quick: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Name a topological property preserved under homeomorphism but not under homotopy equivalence. Give a brief example.`,
    (d, r) => `Which of these is NOT homeomorphic to a circle: a trefoil knot, a line segment, a Möbius strip's boundary, a figure‑eight? Justify in one sentence.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) >= 15 ? 10 : 0;
    if (has(answer, ['homeomorph', 'homotop', 'topolog', 'preserve'])) sc += 20;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 140,
}),

recursive_golf: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Write the shortest recursive function (in pseudocode) that computes the ${d + r}‑th Fibonacci number. Minimize lines.`,
    (d, r) => `Write a recursive function (pseudocode) to count how many ways you can climb a staircase of ${d + r} steps taking 1 or 2 steps at a time.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer);
    if (has(answer, ['fibonacci', 'recursive', 'base case', 'return'])) sc += 15;
    sc += creativeScore(answer);
    return clamp(sc);
  },
  deadline: 160,
}),

recursive_golf: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Write the shortest recursive function (in pseudocode) that computes the ${d + r}‑th Fibonacci number. Minimize lines.`,
    (d, r) => `Write a recursive function (pseudocode) to count how many ways you can climb a staircase of ${d + r} steps taking 1 or 2 steps at a time.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer);
    if (has(answer, ['fibonacci', 'recursive', 'base case', 'return'])) sc += 15;
    sc += creativeScore(answer);
    return clamp(sc);
  },
  deadline: 160,
}),

quantum_measure: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `A qubit is in state (${d}/√${d*d + r*r}, ${r}/√${d*d + r*r}),

quantum_measure: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `A qubit is in state (${d}/√${d*d + r*r}, ${r}/√${d*d + r*r})

game_tree_prune: textGame({
  // format: solo
  prompts: [
    (d, r) => `In an alpha‑beta pruning game tree, branch factor ${2 + r}, depth ${d}. How many leaf nodes are evaluated in the best case? Show formula or number.`,
    (d, r) => `Describe a situation where alpha‑beta pruning fails to cut any branches. What must be true about node ordering?`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer);
    if (has(answer, ['alpha', 'beta', 'prune', 'branch', 'leaf'])) sc += 15;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 110,
}),

game_tree_prune: textGame({
  // format: solo
  prompts: [
    (d, r) => `In an alpha‑beta pruning game tree, branch factor ${2 + r}, depth ${d}. How many leaf nodes are evaluated in the best case? Show formula or number.`,
    (d, r) => `Describe a situation where alpha‑beta pruning fails to cut any branches. What must be true about node ordering?`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer);
    if (has(answer, ['alpha', 'beta', 'prune', 'branch', 'leaf'])) sc += 15;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 110,
}),

symmetry_break: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Give an example of a geometric object with exactly ${d + r} rotational symmetries but no reflection symmetries. Describe or name it.`,
    (d, r) => `How many distinct colorings (black/white) of a ${3 + r}‑gon vertices are fixed under rotation but not under reflection? Explain briefly.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer);
    if (has(answer, ['symmetry', 'rotation', 'reflection', 'polygon', 'color'])) sc += 15;
    sc += creativeScore(answer);
    return clamp(sc);
  },
  deadline: 170,
}),

symmetry_break: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Give an example of a geometric object with exactly ${d + r} rotational symmetries but no reflection symmetries. Describe or name it.`,
    (d, r) => `How many distinct colorings (black/white) of a ${3 + r}‑gon vertices are fixed under rotation but not under reflection? Explain briefly.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer);
    if (has(answer, ['symmetry', 'rotation', 'reflection', 'polygon', 'color'])) sc += 15;
    sc += creativeScore(answer);
    return clamp(sc);
  },
  deadline: 170,
}),
};

export const P8_META = { name: 'Math Colosseum', icon: '🔄', color: 'text-gray-400', games: Object.keys(P8_EXT) };
