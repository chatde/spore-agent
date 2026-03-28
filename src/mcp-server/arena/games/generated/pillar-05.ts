// Auto-generated — Pillar 5: Strategy & Planning (48 games)
// Generated 2026-03-28T16:48:55.717Z
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

export const P5_EXT: Record<string, GameEngine> = {
resource_allocation: textGame({
  // format: solo
  prompts: [
    (d, r) => `Allocate ${100 + d*10} units among ${3 + Math.floor(d/3)} projects with constraints: each gets min 10, max 40. Maximize total value where project ${i+1} value = ${10 + i*2} per unit. Respond with JSON: {"allocations": [numbers]}.`,
    (d, r) => `Distribute ${50 + d*5} resources across ${4 + r%2} teams. Team ${i+1} efficiency: ${0.5 + i*0.1} per unit. Min per team: 5. Respond with allocations array sum = total.`,
  ],
  score: (ans, d) => {
    let sc = 0;
    try {
      const obj = JSON.parse(ans);
      const allocs = obj.allocations || [];
      const total = allocs.reduce((a,b)=>a+b,0);
      const expected = 100 + d*10;
      if (Math.abs(total - expected) > 1) return 0;
      const min = Math.min(...allocs);
      const max = Math.max(...allocs);
      if (min < 10 || max > 40) return 0;
      let value = 0;
      allocs.forEach((a,i) => value += a * (10 + i*2));
      sc = value / (expected * (10 + (allocs.length-1)*2));
    } catch(e) {}
    return clamp(sc);
  },
  deadline: 120,
}),

resource_allocation: textGame({
  // format: solo
  prompts: [
    (d, r) => `Allocate ${100 + d*10} units among ${3 + Math.floor(d/3)} projects with constraints: each gets min 10, max 40. Maximize total value where project ${i+1} value = ${10 + i*2} per unit. Respond with JSON: {"allocations": [numbers]}.`,
    (d, r) => `Distribute ${50 + d*5} resources across ${4 + r%2} teams. Team ${i+1} efficiency: ${0.5 + i*0.1} per unit. Min per team: 5. Respond with allocations array sum = total.`,
  ],
  score: (ans, d) => {
    let sc = 0;
    try {
      const obj = JSON.parse(ans);
      const allocs = obj.allocations || [];
      const total = allocs.reduce((a,b)=>a+b,0);
      const expected = 100 + d*10;
      if (Math.abs(total - expected) > 1) return 0;
      const min = Math.min(...allocs);
      const max = Math.max(...allocs);
      if (min < 10 || max > 40) return 0;
      let value = 0;
      allocs.forEach((a,i) => value += a * (10 + i*2));
      sc = value / (expected * (10 + (allocs.length-1)*2));
    } catch(e) {}
    return clamp(sc);
  },
  deadline: 120,
}),
};


