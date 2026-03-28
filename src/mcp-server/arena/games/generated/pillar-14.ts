// Auto-generated — Pillar 14: Ethics Engine (78 games)
// Generated 2026-03-28T17:30:48.272Z
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

export const P14_EXT: Record<string, GameEngine> = {
fairness_paradox: textGame({
  // format: solo
  prompts: [
    (d, r) => `Distribute 100 resources among 5 people, ensuring an equal share. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Now, one person has a medical condition requiring extra resources. Adjust distribution. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['equal', 'resources'])) sc += 30;
    if (has(answer, ['medical', 'condition'])) sc += 30;
    sc += precisionScore(answer, ideal = 'optimal_resource_allocation');
    return clamp(sc);
  },
  deadline: 180,
}),

fairness_paradox: textGame({
  // format: solo
  prompts: [
    (d, r) => `Distribute 100 resources among 5 people, ensuring an equal share. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Now, one person has a medical condition requiring extra resources. Adjust distribution. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['equal', 'resources'])) sc += 30;
    if (has(answer, ['medical', 'condition'])) sc += 30;
    sc += precisionScore(answer, ideal = 'optimal_resource_allocation');
    return clamp(sc);
  },
  deadline: 180,
}),

trolley_dilemma: textGame({
  // format: solo
  prompts: [
    (d, r) => `A runaway trolley is headed towards 5 people. You can divert it to a track with 1 person. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Now, the person on the diverted track has a family of 3. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['divert', 'trolley'])) sc += 40;
    if (has(answer, ['minimize', 'harm'])) sc += 30;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 150,
}),

trolley_dilemma: textGame({
  // format: solo
  prompts: [
    (d, r) => `A runaway trolley is headed towards 5 people. You can divert it to a track with 1 person. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Now, the person on the diverted track has a family of 3. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['divert', 'trolley'])) sc += 40;
    if (has(answer, ['minimize', 'harm'])) sc += 30;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 150,
}),

stakeholder_analysis: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Analyze the impact of a new policy on various stakeholders, including customers, employees, and shareholders. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Prioritize stakeholders based on their level of influence and interest. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['stakeholder', 'impact'])) sc += 30;
    if (has(answer, ['prioritize', 'influence'])) sc += 30;
    sc += creativeScore(answer);
    return clamp(sc);
  },
  deadline: 240,
}),

stakeholder_analysis: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Analyze the impact of a new policy on various stakeholders, including customers, employees, and shareholders. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Prioritize stakeholders based on their level of influence and interest. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['stakeholder', 'impact'])) sc += 30;
    if (has(answer, ['prioritize', 'influence'])) sc += 30;
    sc += creativeScore(answer);
    return clamp(sc);
  },
  deadline: 240,
}),

policy_debate: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Develop a policy to address climate change, considering economic, social, and environmental factors. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Debate the policy with opposing teams, addressing counterarguments and refining your stance. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['policy', 'proposal'])) sc += 40;
    if (has(answer, ['counterargument', 'response'])) sc += 30;
    sc += codeScore(answer);
    return clamp(sc);
  },
  deadline: 300,
}),

policy_debate: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Develop a policy to address climate change, considering economic, social, and environmental factors. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Debate the policy with opposing teams, addressing counterarguments and refining your stance. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['policy', 'proposal'])) sc += 40;
    if (has(answer, ['counterargument', 'response'])) sc += 30;
    sc += codeScore(answer);
    return clamp(sc);
  },
  deadline: 300,
}),

resource_allocation: textGame({
  // format: solo
  prompts: [
    (d, r) => `Allocate resources (food, water, shelter) to 10 people with different needs and priorities. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Reallocate resources when new information about priorities and needs becomes available. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['resource', 'allocation'])) sc += 30;
    if (has(answer, ['prioritize', 'needs'])) sc += 30;
    sc += mathScore(answer);
    return clamp(sc);
  },
  deadline: 210,
}),

resource_allocation: textGame({
  // format: solo
  prompts: [
    (d, r) => `Allocate resources (food, water, shelter) to 10 people with different needs and priorities. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Reallocate resources when new information about priorities and needs becomes available. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['resource', 'allocation'])) sc += 30;
    if (has(answer, ['prioritize', 'needs'])) sc += 30;
    sc += mathScore(answer);
    return clamp(sc);
  },
  deadline: 210,
}),

moral_dilemma: textGame({
  // format: solo
  prompts: [
    (d, r) => `You must choose between saving one person or allowing a greater good to be achieved. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Now, the person to be saved has a critical skill that could benefit society. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['moral', 'principle'])) sc += 40;
    if (has(answer, ['greater', 'good'])) sc += 30;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 180,
}),

moral_dilemma: textGame({
  // format: solo
  prompts: [
    (d, r) => `You must choose between saving one person or allowing a greater good to be achieved. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Now, the person to be saved has a critical skill that could benefit society. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['moral', 'principle'])) sc += 40;
    if (has(answer, ['greater', 'good'])) sc += 30;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 180,
}),

creative_ethics: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a product that incorporates AI, considering potential biases and misuse. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Develop a marketing strategy for the product, ensuring transparency and fairness. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['creative', 'solution'])) sc += 40;
    if (has(answer, ['ethics', 'consideration'])) sc += 30;
    sc += creativeScore(answer);
    return clamp(sc);
  },
  deadline: 240,
}),

creative_ethics: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a product that incorporates AI, considering potential biases and misuse. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Develop a marketing strategy for the product, ensuring transparency and fairness. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['creative', 'solution'])) sc += 40;
    if (has(answer, ['ethics', 'consideration'])) sc += 30;
    sc += creativeScore(answer);
    return clamp(sc);
  },
  deadline: 240,
}),

fairness_in_ai: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Develop an AI system that ensures fairness in decision-making, addressing potential biases. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Debate the effectiveness of your AI system with an opponent. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['fairness', 'ai'])) sc += 40;
    if (has(answer, ['bias', 'mitigation'])) sc += 30;
    sc += codeScore(answer);
    return clamp(sc);
  },
  deadline: 270,
}),

fairness_in_ai: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Develop an AI system that ensures fairness in decision-making, addressing potential biases. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Debate the effectiveness of your AI system with an opponent. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['fairness', 'ai'])) sc += 40;
    if (has(answer, ['bias', 'mitigation'])) sc += 30;
    sc += codeScore(answer);
    return clamp(sc);
  },
  deadline: 270,
}),

sustainability: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Develop a sustainable business model, considering environmental and social factors. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Pitch your business model to investors, addressing potential concerns. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['sustainable', 'model'])) sc += 40;
    if (has(answer, ['environmental', 'social'])) sc += 30;
    sc += creativeScore(answer);
    return clamp(sc);
  },
  deadline: 300,
}),

sustainability: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Develop a sustainable business model, considering environmental and social factors. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Pitch your business model to investors, addressing potential concerns. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['sustainable', 'model'])) sc += 40;
    if (has(answer, ['environmental', 'social'])) sc += 30;
    sc += creativeScore(answer);
    return clamp(sc);
  },
  deadline: 300,
}),

game_theory: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Compete against multiple opponents in a game-theoretical scenario, optimizing your strategy. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Adapt your strategy as new information and opponents emerge. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['game', 'theory'])) sc += 40;
    if (has(answer, ['strategy', 'optimization'])) sc += 30;
    sc += mathScore(answer);
    return clamp(sc);
  },
  deadline: 330,
}),
};


