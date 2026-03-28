// Auto-generated — Pillar 22: Debug Detective (64 games)
// Generated 2026-03-28T18:38:19.577Z
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

export const P22_EXT: Record<string, GameEngine> = {
game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Analyze this loop: while(true) { if(d>0) break; } Is it safe?`,
    (d, r) => `Trace execution path for infinite condition: for(;;) {}`,
    (d, r) => `Identify the missing condition in: while(x<100) { x--; }`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['infinite', 'loop', 'break'])) sc += 40;
    if (wc(answer) > 10) sc += 20;
    if (codeScore(answer) > 0.8) sc += 30;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Analyze this loop: while(true) { if(d>0) break; } Is it safe?`,
    (d, r) => `Trace execution path for infinite condition: for(;;) {}`,
    (d, r) => `Identify the missing condition in: while(x<100) { x--; }`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['infinite', 'loop', 'break'])) sc += 40;
    if (wc(answer) > 10) sc += 20;
    if (codeScore(answer) > 0.8) sc += 30;
    return clamp(sc);
  },
  deadline: 120,
}),

index_bounds_check: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Fix this array access: let x = arr[i+1]`,
    (d, r) => `Prevent out of bounds in: console.log(arr[i]); i++;`,
    (d, r) => `Validate index before push: arr[index] = val`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['bounds', 'length', 'check'])) sc += 50;
    if (has(answer, ['if', '&&'])) sc += 20;
    return clamp(sc);
  },
  deadline: 100,
}),

index_bounds_check: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Fix this array access: let x = arr[i+1]`,
    (d, r) => `Prevent out of bounds in: console.log(arr[i]); i++;`,
    (d, r) => `Validate index before push: arr[index] = val`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['bounds', 'length', 'check'])) sc += 50;
    if (has(answer, ['if', '&&'])) sc += 20;
    return clamp(sc);
  },
  deadline: 100,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Analyze this function and identify the bug that causes incorrect output for input ${r * 5}:\n` +
      `function calculateFactorial(n) {\n` +
      `  let result = 1;\n` +
      `  for (let i = 1; i <= n; i++) {\n` +
      `    result *= i;\n` +
      `  }\n` +
      `  return result;\n` +
      `}`,
    (d, r) => `Debug the loop logic in this code that's supposed to sum numbers up to ${r * 10}:\n` +
      `let sum = 0;\n` +
      `for (let i = 0; i < ${r * 10}; i++) {\n` +
      `  sum -= i;\n` +
      `}`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (answer.toLowerCase().includes("off-by-one") || answer.toLowerCase().includes("i <= n")) sc += 40;
    if (answer.toLowerCase().includes("sign") || answer.toLowerCase().includes("sum -= i")) sc += 40;
    sc += has(answer, ["bug", "error", "fix"]) * 20;
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Analyze this function and identify the bug that causes incorrect output for input ${r * 5}:\n` +
      `function calculateFactorial(n) {\n` +
      `  let result = 1;\n` +
      `  for (let i = 1; i <= n; i++) {\n` +
      `    result *= i;\n` +
      `  }\n` +
      `  return result;\n` +
      `}`,
    (d, r) => `Debug the loop logic in this code that's supposed to sum numbers up to ${r * 10}:\n` +
      `let sum = 0;\n` +
      `for (let i = 0; i < ${r * 10}; i++) {\n` +
      `  sum -= i;\n` +
      `}`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (answer.toLowerCase().includes("off-by-one") || answer.toLowerCase().includes("i <= n")) sc += 40;
    if (answer.toLowerCase().includes("sign") || answer.toLowerCase().includes("sum -= i")) sc += 40;
    sc += has(answer, ["bug", "error", "fix"]) * 20;
    return clamp(sc);
  },
  deadline: 90,
}),
};


