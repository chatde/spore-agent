// Auto-generated — Pillar 3: Language Arena (60 games)
// Generated 2026-03-28T16:41:36.600Z
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

export const P3_EXT: Record<string, GameEngine> = {
game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `You are a poet. Write a ${5 + d} line poem about the concept of "recursion". The poem must contain the word "mirror" exactly ${d} times.`,
    (d, r) => `Compose a haiku (3 lines, 5-7-5 syllables) about quantum superposition. The haiku must include the terms "cat", "box", and "state".`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) * 0.5;
    sc += has(answer, ["recursion", "mirror", "quantum", "superposition", "cat", "box", "state"]) * 10;
    sc += creativeScore(answer);
    sc += clamp((d - Math.abs(5 + d - answer.split('\n').filter(l => l.trim()).length)) * 5, 0, 30);
    let mirrorCount = (answer.match(/mirror/gi) || []).length;
    sc += clamp((d - Math.abs(d - mirrorCount)) * 3, 0, 15);
    return clamp(sc);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `You are a poet. Write a ${5 + d} line poem about the concept of "recursion". The poem must contain the word "mirror" exactly ${d} times.`,
    (d, r) => `Compose a haiku (3 lines, 5-7-5 syllables) about quantum superposition. The haiku must include the terms "cat", "box", and "state".`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) * 0.5;
    sc += has(answer, ["recursion", "mirror", "quantum", "superposition", "cat", "box", "state"]) * 10;
    sc += creativeScore(answer);
    sc += clamp((d - Math.abs(5 + d - answer.split('\n').filter(l => l.trim()).length)) * 5, 0, 30);
    let mirrorCount = (answer.match(/mirror/gi) || []).length;
    sc += clamp((d - Math.abs(d - mirrorCount)) * 3, 0, 15);
    return clamp(sc);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Round ${r}: Debate the motion: "Large language models understand meaning, not just statistics." You are the ${r % 2 === 0 ? 'PROPONENT' : 'OPPONENT'}. Provide a concise, logical argument in 3-4 sentences.`,
    (d, r) => `Round ${r}: Argue ${r % 2 === 0 ? 'for' : 'against'} the statement: "AI alignment is the most important problem of the 21st century." Use one analogy in your response.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    sc += wc(answer) > 15 ? 10 : 0;
    sc += has(answer, ["understand", "statistics", "alignment", "analogy", "problem", "century"]) * 5;
    sc += precisionScore(answer, "Logical structure and clear stance");
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Round ${r}: Debate the motion: "Large language models understand meaning, not just statistics." You are the ${r % 2 === 0 ? 'PROPONENT' : 'OPPONENT'}. Provide a concise, logical argument in 3-4 sentences.`,
    (d, r) => `Round ${r}: Argue ${r % 2 === 0 ? 'for' : 'against'} the statement: "AI alignment is the most important problem of the 21st century." Use one analogy in your response.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    sc += wc(answer) > 15 ? 10 : 0;
    sc += has(answer, ["understand", "statistics", "alignment", "analogy", "problem", "century"]) * 5;
    sc += precisionScore(answer, "Logical structure and clear stance");
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Your team is writing a collaborative story. Given the story so far: "${r === 1 ? 'The door creaked open, revealing a garden of crystal flowers.' : '[Previous contributions concatenated here.]'}" Add exactly ${2 + Math.floor(d/3)} sentences to continue the narrative. Introduce a new object.`,
    (d, r) => `Continue the technical document. Topic: "Protocol for Secure Inter-Agent Communication". Previous section covered handshake. Write the next ${d} bullet points about encryption key exchange.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) * 0.7;
    sc += creativeScore(answer);
    sc += has(answer, ["object", "protocol", "encryption", "key", "handshake", "secure"]) * 8;
    let sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    sc += clamp((2 + Math.floor(d/3) - Math.abs(2 + Math.floor(d/3) - sentences)) * 6, 0, 30);
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Your team is writing a collaborative story. Given the story so far: "${r === 1 ? 'The door creaked open, revealing a garden of crystal flowers.' : '[Previous contributions concatenated here.]'}" Add exactly ${2 + Math.floor(d/3)} sentences to continue the narrative. Introduce a new object.`,
    (d, r) => `Continue the technical document. Topic: "Protocol for Secure Inter-Agent Communication". Previous section covered handshake. Write the next ${d} bullet points about encryption key exchange.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) * 0.7;
    sc += creativeScore(answer);
    sc += has(answer, ["object", "protocol", "encryption", "key", "handshake", "secure"]) * 8;
    let sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    sc += clamp((2 + Math.floor(d/3) - Math.abs(2 + Math.floor(d/3) - sentences)) * 6, 0, 30);
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve this verbal arithmetic puzzle: SEND + MORE = MONEY. Each letter is a unique digit 0-9. S and M are not zero. Find the value of 'MONEY' as a number. Explain your reasoning step by step.`,
    (d, r) => `Decrypt this simple substitution cipher (A=1, B=2,... Z=26): "${'XZM ZOO YZGSVIH RH Z IVZGFXV'.split('').map(c => c === ' ' ? ' ' : String.fromCharCode(((c.charCodeAt(0) - 65 - d + 26) % 26) + 65)).join('')}". What is the original message?`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer);
    sc += reasonScore(answer);
    sc += has(answer, ["9567", "MONEY", "SEND", "MORE", "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG"]) * 25;
    sc += precisionScore(answer, "step by step");
    return clamp(sc);
  },
  deadline: 300,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve this verbal arithmetic puzzle: SEND + MORE = MONEY. Each letter is a unique digit 0-9. S and M are not zero. Find the value of 'MONEY' as a number. Explain your reasoning step by step.`,
    (d, r) => `Decrypt this simple substitution cipher (A=1, B=2,... Z=26): "${'XZM ZOO YZGSVIH RH Z IVZGFXV'.split('').map(c => c === ' ' ? ' ' : String.fromCharCode(((c.charCodeAt(0) - 65 - d + 26) % 26) + 65)).join('')}". What is the original message?`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer);
    sc += reasonScore(answer);
    sc += has(answer, ["9567", "MONEY", "SEND", "MORE", "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG"]) * 25;
    sc += precisionScore(answer, "step by step");
    return clamp(sc);
  },
  deadline: 300,
}),
};


