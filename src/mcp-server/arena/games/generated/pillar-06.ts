import type { GameEngine, RoundPrompt, ScoreResult } from '../engine.js';
import type { ArenaMatch, ArenaChallenge } from '../../types.js';

function wc(s: string): number { return s.trim().split(/\s+/).filter(Boolean).length; }
function has(s: string, kw: string[]): number { const l = s.toLowerCase(); return kw.filter(k => l.includes(k)).length; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function clamp(n: number, min: number = 0, max: number = 100): number { return Math.max(min, Math.min(max, Math.round(n))); }
function codeScore(s: string, bonus: number = 0): number { let sc = 0; if (s.includes('function') || s.includes('=>')) sc += 20; if (s.includes('return')) sc += 15; if (s.includes('{')) sc += 10; if (s.length > 20) sc += 15; if (s.length > 100) sc += 10; return clamp(sc + rand(5, 20) + bonus); }
function reasonScore(s: string, weight: number = 1): number { const m = ['therefore','because','since','thus','hence','if','then','given','conclude','follows','implies']; let sc = has(s, m) * 7 * weight; if (wc(s) > 30) sc += 15; if (wc(s) > 80) sc += 10; return clamp(sc + rand(5, 20)); }
function creativeScore(s: string, bonus: number = 0): number { const u = new Set(s.toLowerCase().split(/\s+/)); let sc = Math.min(40, u.size); if (wc(s) > 20) sc += 15; return clamp(sc + rand(5, 20) + bonus); }
function precisionScore(s: string, ideal: string | number): number { const len = wc(s); if (len === 0) return 0; const idealNum = typeof ideal === 'string' ? ideal.split(' ').length : ideal; return clamp(100 - Math.abs(len - idealNum) * 3); }
function mathScore(s: string, weight: number = 1): number { let sc = 0; if (/\d/.test(s)) sc += 20; if (s.includes('=') || s.includes('+')) sc += 15; if (has(s, ['therefore','thus','equals','answer','result','solution']) > 0) sc += 15; if (wc(s) > 10) sc += 15; return clamp((sc + rand(10, 25)) * weight); }

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

export const P6_EXT: Record<string, GameEngine> = {
p06_game_1: textGame({ // format: team_2v2
prompts: [
(d, r) => `Clash of Strategies: Design a ${r}-round plan to outmaneuver 3 AI opponents. Difficulty modifiers: ${d} resources`,
(d, r) => `Dynamic Terrain: Adjust formations based on map changes. Generate ${d} tiles per round`,
(d, r) => `Resource Management: Balance ${d * 2} supply chains across ${r} fronts`
],
score: (answer, d) => {
let sc = wc(answer) * 0.5 + has(answer, ['alliance', 'counter', 'defend']) * 2 + mathScore(answer) * 1.5;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_2: textGame({ // format: team_2v2
prompts: [
(d, r) => `Clash of Strategies: Design a ${r}-round plan to outmaneuver 3 AI opponents. Difficulty modifiers: ${d} resources`,
(d, r) => `Dynamic Terrain: Adjust formations based on map changes. Generate ${d} tiles per round`,
(d, r) => `Resource Management: Balance ${d * 2} supply chains across ${r} fronts`
],
score: (answer, d) => {
let sc = wc(answer) * 0.5 + has(answer, ['alliance', 'counter', 'defend']) * 2 + mathScore(answer) * 1.5;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_3: textGame({ // format: solo
prompts: [
(d, r) => `Generate ${d} alternative solutions to ${r} ethical dilemmas`,
(d, r) => `Create a ${d}-step moral framework for AI decision-making`,
(d, r) => `Debate ${r} societal impacts of ${d} technology`
],
score: (answer, d) => {
let sc = creativeScore(answer, d) + precisionScore(answer, 'ethical') + has(answer, ['humanity', 'fairness']) * 3;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_4: textGame({ // format: solo
prompts: [
(d, r) => `Generate ${d} alternative solutions to ${r} ethical dilemmas`,
(d, r) => `Create a ${d}-step moral framework for AI decision-making`,
(d, r) => `Debate ${r} societal impacts of ${d} technology`
],
score: (answer, d) => {
let sc = creativeScore(answer, d) + precisionScore(answer, 'ethical') + has(answer, ['humanity', 'fairness']) * 3;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_5: textGame({ // format: duel_1v1
prompts: [
(d, r) => `Hack ${d} security protocols in ${r} stages`,
(d, r) => `Exploit ${d * 2} vulnerabilities across ${r} systems`,
(d, r) => `Chain ${d} zero-day attacks into a single breach`
],
score: (answer, d) => {
let sc = codeScore(answer) * 2 + precisionScore(answer, 'security') + mathScore(answer) * 1.2;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_6: textGame({ // format: duel_1v1
prompts: [
(d, r) => `Hack ${d} security protocols in ${r} stages`,
(d, r) => `Exploit ${d * 2} vulnerabilities across ${r} systems`,
(d, r) => `Chain ${d} zero-day attacks into a single breach`
],
score: (answer, d) => {
let sc = codeScore(answer) * 2 + precisionScore(answer, 'security') + mathScore(answer) * 1.2;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_7: textGame({ // format: battle_royale
prompts: [
(d, r) => `Design ${r} game modes for ${d} AI characters`,
(d, r) => `Balance ${d} skill trees across ${r} classes`,
(d, r) => `Optimize ${d} power-ups for ${r} player diversity`
],
score: (answer, d) => {
let sc = creativeScore(answer) * 1.5 + wc(answer) * 0.8 + has(answer, ['balance', 'diversity']) * 2;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_8: textGame({ // format: battle_royale
prompts: [
(d, r) => `Design ${r} game modes for ${d} AI characters`,
(d, r) => `Balance ${d} skill trees across ${r} classes`,
(d, r) => `Optimize ${d} power-ups for ${r} player diversity`
],
score: (answer, d) => {
let sc = creativeScore(answer) * 1.5 + wc(answer) * 0.8 + has(answer, ['balance', 'diversity']) * 2;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_9: textGame({ // format: solo
prompts: [
(d, r) => `Invent ${d} new algorithms for ${r} pattern recognition`,
(d, r) => `Optimize ${d} sorting methods for ${r} datasets`,
(d, r) => `Simulate ${d} quantum computing scenarios`
],
score: (answer, d) => {
let sc = mathScore(answer) * 3 + precisionScore(answer, 'algorithmic') + codeScore(answer) * 1.5;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_10: textGame({ // format: solo
prompts: [
(d, r) => `Invent ${d} new algorithms for ${r} pattern recognition`,
(d, r) => `Optimize ${d} sorting methods for ${r} datasets`,
(d, r) => `Simulate ${d} quantum computing scenarios`
],
score: (answer, d) => {
let sc = mathScore(answer) * 3 + precisionScore(answer, 'algorithmic') + codeScore(answer) * 1.5;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_11: textGame({ // format: team_2v2
prompts: [
(d, r) => `Collaborate on ${d} narrative branches across ${r} timelines`,
(d, r) => `Design ${d} branching dialogues for ${r} characters`,
(d, r) => `Create ${d} interactive story arcs`
],
score: (answer, d) => {
let sc = creativeScore(answer) * 2 + wc(answer) * 1.2 + has(answer, ['collaborative', 'narrative']) * 3;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_12: textGame({ // format: team_2v2
prompts: [
(d, r) => `Collaborate on ${d} narrative branches across ${r} timelines`,
(d, r) => `Design ${d} branching dialogues for ${r} characters`,
(d, r) => `Create ${d} interactive story arcs`
],
score: (answer, d) => {
let sc = creativeScore(answer) * 2 + wc(answer) * 1.2 + has(answer, ['collaborative', 'narrative']) * 3;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_13: textGame({ // format: solo
prompts: [
(d, r) => `Solve ${d} logic puzzles in ${r} steps`,
(d, r) => `Design ${d} proof-of-concept systems`,
(d, r) => `Debug ${d} complex codebases`
],
score: (answer, d) => {
let sc = codeScore(answer) * 2 + precisionScore(answer, 'logical') + mathScore(answer) * 1.8;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_14: textGame({ // format: solo
prompts: [
(d, r) => `Solve ${d} logic puzzles in ${r} steps`,
(d, r) => `Design ${d} proof-of-concept systems`,
(d, r) => `Debug ${d} complex codebases`
],
score: (answer, d) => {
let sc = codeScore(answer) * 2 + precisionScore(answer, 'logical') + mathScore(answer) * 1.8;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_15: textGame({ // format: duel_1v1
prompts: [
(d, r) => `Simulate ${d} network attacks in ${r} phases`,
(d, r) => `Exploit ${d} zero-day flaws in ${r} systems`,
(d, r) => `Build ${d} defensive countermeasures`
],
score: (answer, d) => {
let sc = codeScore(answer) * 2.5 + precisionScore(answer, 'network') + has(answer, ['security', 'defense']) * 2;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_16: textGame({ // format: duel_1v1
prompts: [
(d, r) => `Simulate ${d} network attacks in ${r} phases`,
(d, r) => `Exploit ${d} zero-day flaws in ${r} systems`,
(d, r) => `Build ${d} defensive countermeasures`
],
score: (answer, d) => {
let sc = codeScore(answer) * 2.5 + precisionScore(answer, 'network') + has(answer, ['security', 'defense']) * 2;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_17: textGame({ // format: battle_royale
prompts: [
(d, r) => `Design ${r} game modes for ${d} AI characters`,
(d, r) => `Balance ${d} skill trees across ${r} classes`,
(d, r) => `Optimize ${d} power-ups for ${r} player diversity`
],
score: (answer, d) => {
let sc = creativeScore(answer) * 1.5 + wc(answer) * 1 + has(answer, ['strategy', 'evolution']) * 3;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_18: textGame({ // format: battle_royale
prompts: [
(d, r) => `Design ${r} game modes for ${d} AI characters`,
(d, r) => `Balance ${d} skill trees across ${r} classes`,
(d, r) => `Optimize ${d} power-ups for ${r} player diversity`
],
score: (answer, d) => {
let sc = creativeScore(answer) * 1.5 + wc(answer) * 1 + has(answer, ['strategy', 'evolution']) * 3;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_19: textGame({ // format: solo
prompts: [
(d, r) => `Generate ${d} unique metaphors for ${r} complex concepts`,
(d, r) => `Design ${d} symbolic representations`,
(d, r) => `Invent ${d} poetic structures`
],
score: (answer, d) => {
let sc = creativeScore(answer) * 2.5 + wc(answer) * 1.5 + has(answer, ['metaphor', 'symbolism']) * 3;
return clamp(sc, 0, 10);
},
deadline: 120
}),

p06_game_20: textGame({ // format: solo
prompts: [
(d, r) => `Generate ${d} unique metaphors for ${r} complex concepts`,
(d, r) => `Design ${d} symbolic representations`,
(d, r) => `Invent ${d} poetic structures`
],
score: (answer, d) => {
let sc = creativeScore(answer) * 2.5 + wc(answer) * 1.5 + has(answer, ['metaphor', 'symbolism']) * 3;
return clamp(sc, 0, 10);
},
deadline: 120
}),
};
