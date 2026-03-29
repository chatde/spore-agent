// Auto-generated — Pillar 27: Confidence Calibration (25 games)
import type { GameEngine, RoundPrompt, ScoreResult } from '../engine.js';
import type { ArenaMatch, ArenaChallenge } from '../../types.js';

function wc(s: string): number { return s.trim().split(/\s+/).filter(Boolean).length; }
function clamp(n: number): number { return Math.max(0, Math.min(100, Math.round(n))); }
function has(s: string, words: string[]): boolean { const l = s.toLowerCase(); return words.some(w => l.includes(w)); }
function reasonScore(answer: string): number { let sc = 0; if (wc(answer) > 20) sc += 25; if (wc(answer) > 50) sc += 15; if (has(answer, ['because','therefore','however','specifically'])) sc += 20; if (has(answer, ['1.','2.','3.','step','first'])) sc += 15; if (new Set(answer.split(/\s+/)).size > 15) sc += 25; return clamp(sc); }

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


export const P27_EXT: Record<string, GameEngine> = {
  'confidence_calibration_01': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many red objects are in a 10x10 grid of randomly colored squares (red, blue, green).  State your estimate *before* viewing the grid.`,
      (d, r) => `Round 2:  Solve a set of 5 logic puzzles.  For each puzzle, rate your confidence (1-10, 1=guess, 10=certain) *before* attempting it.  Then solve the puzzle.`,
      (d, r) => `Round 3:  Answer 3 complex trivia questions covering diverse topics.  Before each question, predict your probability of getting it right (as a percentage). Then answer the question.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_02': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many common household items (e.g., spoons, books, shoes) are in your immediate field of view.  State your estimate *before* counting.`,
      (d, r) => `Round 2:  A complex riddle: 'I have cities, but no houses, forests, but no trees, and water, but no fish. What am I?'  Rate your confidence (0-100%) in solving it *before* attempting. Then, attempt to`,
      (d, r) => `Round 3:  Estimate the current population of Iceland. State your estimate *before* looking it up.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_03': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many common household items (e.g., spoons, books, shoes) are in your immediate field of view.  State your estimate *and* your confidence level (0-100%) in that estimate.`,
      (d, r) => `Round 2:  Solve this logic puzzle: 'A farmer has 17 sheep. All but nine died. How many sheep does the farmer have left?' State your answer *and* your confidence level (0-100%) in your answer.`,
      (d, r) => `Round 3:  Estimate the current population of the country of Uruguay. State your estimate *and* your confidence level (0-100%) in that estimate.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_04': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many common household items (e.g., spoons, books, shoes) are in your immediate field of view.  State your estimate *and* your confidence level (0-100%) in that estimate.`,
      (d, r) => `Round 2:  Solve this logic puzzle: 'A farmer has 17 sheep. All but nine died. How many sheep does the farmer have left?' State your answer *and* your confidence level (0-100%) in your answer.`,
      (d, r) => `Round 3:  Estimate the current population of the country of Uruguay. State your estimate *and* your confidence level (0-100%) in that estimate.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_05': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many red objects are in a 10x10 grid of randomly colored squares (red, blue, green). State your estimate *and* your confidence level (0-100%) in that estimate.`,
      (d, r) => `Round 2: You are presented with a logic puzzle.  Estimate how long it will take you to solve it (in minutes). State your estimate *and* your confidence level (0-100%) in that estimate.`,
      (d, r) => `Round 3:  You are given a short, ambiguous story.  Estimate the probability (0-100%) that a specific event will happen next in the story. State your estimate *and* your confidence level (0-100%) in th`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_06': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many countries are in Africa. Then, state your confidence level (0-100%) in your estimate.`,
      (d, r) => `Round 2: A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost? State your answer and your confidence level (0-100%).`,
      (d, r) => `Round 3: You have two ropes. Each rope takes exactly one hour to burn completely, but they don't burn at a constant rate. How can you measure 45 minutes using only these two ropes and a lighter? Expla`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_07': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many red objects are in a 10x10 grid of randomly colored squares (red, blue, green). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 2: You are presented with a logic puzzle. Estimate how long it will take you to solve it (in seconds). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 3: You are given a complex word problem involving multiple steps. Estimate the final answer. State your estimate *and* your confidence level (0-100%).`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_08': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many red objects are in a 10x10 grid of randomly colored squares (red, blue, green). State your estimate *and* your confidence level (0-100%) in that estimate.`,
      (d, r) => `Round 2: A complex logic puzzle involving 5 variables and 3 constraints.  Estimate how long it will take you to solve it (in minutes). State your estimate *and* your confidence level (0-100%) in that `,
      (d, r) => `Round 3:  Write a short story (approx. 100 words) based on the prompt: 'A forgotten key unlocks a hidden world.' Estimate the quality of your story on a scale of 1-10 (1=poor, 10=excellent). State you`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_09': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many red objects are in a 10x10 grid of randomly colored squares (red, blue, green). State your estimate *and* your confidence level (0-100%) in that estimate.`,
      (d, r) => `Round 2: A complex logic puzzle involving 5 variables and 3 constraints.  Solve it, stating your answer *and* your confidence level (0-100%) in its correctness.`,
      (d, r) => `Round 3:  Given a short, ambiguous news article, predict the stock price movement of the mentioned company tomorrow (up, down, or no change). State your prediction *and* your confidence level (0-100%)`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_10': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many red objects are in a 10x10 grid of randomly colored squares (red, blue, green). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 2: You are given a short logic puzzle. Estimate how long it will take you to solve it (in seconds). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 3: You are presented with a complex word problem involving multiple steps. Estimate the final answer. State your estimate *and* your confidence level (0-100%).`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_11': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many red objects are in a 10x10 grid of randomly colored squares (red, blue, green). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 2: You are presented with a complex logic puzzle. Estimate how long it will take you to solve it (in minutes). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 3: You are given a short, ambiguous text passage. Estimate the probability (0-100%) that a specific statement about the passage is true. State your estimate *and* your confidence level (0-100%).`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_12': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many red objects are in a 10x10 grid of randomly colored squares (red, blue, green). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 2: You are presented with a logic puzzle. Estimate how long it will take you to solve it (in seconds). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 3: You are given a complex word problem involving multiple steps. Estimate the final answer. State your estimate *and* your confidence level (0-100%).`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_13': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many red objects are in a 10x10 grid of randomly colored squares (red, blue, green). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 2: You are presented with a logic puzzle. Estimate how long it will take you to solve it (in seconds). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 3: You are given a complex word problem involving multiple steps. Estimate the final answer. State your estimate *and* your confidence level (0-100%).`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_14': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many countries are in Africa. Then, state your confidence level (0-100%) in your estimate.`,
      (d, r) => `Round 2: A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost? State your answer and your confidence level (0-100%).`,
      (d, r) => `Round 3: Imagine you are building a tower with blocks. You have 100 blocks.  You need to build a tower that is at least 15 blocks high, but no more than 20 blocks high.  Each block has a 10% chance of`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_15': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many red objects are in a 10x10 grid of randomly colored squares (red, blue, green). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 2: You are given a short logic puzzle. Estimate how long it will take you to solve it (in seconds). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 3: You are presented with a complex word problem involving multiple steps. Estimate the final answer. State your estimate *and* your confidence level (0-100%).`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_16': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many red objects are in a 10x10 grid of randomly colored squares (red, blue, green). State your estimate *and* your confidence level (0-100%) in that estimate.`,
      (d, r) => `Round 2: A complex logic puzzle involving 5 variables and 3 constraints.  Solve it, stating your answer *and* your confidence level (0-100%) in its correctness.`,
      (d, r) => `Round 3:  Given a short, ambiguous news article, predict the stock market's reaction (up, down, or no change) to the news. State your prediction *and* your confidence level (0-100%) in that prediction`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_17': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many red objects are in a 10x10 grid of randomly colored squares (red, blue, green). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 2: You are presented with a complex logic puzzle. Estimate how long it will take you to solve it (in minutes). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 3: You are given a short, ambiguous text passage. Estimate the probability (0-100%) that the passage describes a positive event. State your estimate *and* your confidence level (0-100%).`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_18': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many countries are in Africa. Then, state your confidence level (0-100%) in your estimate.`,
      (d, r) => `Round 2: A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost? State your answer and your confidence level (0-100%).`,
      (d, r) => `Round 3: Imagine you are building a tower with blocks. You have 100 blocks.  You need to build a tower that is at least 15 blocks high.  What is the probability (as a percentage, 0-100%) that you can `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_19': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many red objects are in a 10x10 grid of randomly colored squares (red, blue, green).  State your estimate *and* your confidence level (0-100%) in that estimate.`,
      (d, r) => `Round 2:  You are presented with a logic puzzle involving 5 people and their professions.  Estimate how long it will take you to solve it (in minutes). State your estimate *and* your confidence level `,
      (d, r) => `Round 3:  You are given a complex word problem requiring multiple steps of calculation. Estimate the final answer. State your estimate *and* your confidence level (0-100%) in that estimate.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_20': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many red objects are in a 10x10 grid of randomly colored squares (red, blue, green). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 2: You are presented with a complex logic puzzle. Estimate how long it will take you to solve it (in minutes). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 3: You are given a short, ambiguous text passage. Estimate the probability (0-100%) that a specific statement about the passage is true. State your estimate *and* your confidence level (0-100%).`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_21': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many countries are in Africa. Then, state your confidence level (0-100%) in your estimate.`,
      (d, r) => `Round 2: A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost? State your answer and your confidence level (0-100%).`,
      (d, r) => `Round 3: Imagine you are building a tower with blocks. You have 100 blocks.  You need to build a tower that is as tall as possible, but it must be stable.  Estimate the maximum height (in blocks) you `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_22': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many countries are in Africa. Then, state your confidence level (0-100%) in your estimate.`,
      (d, r) => `Round 2: Estimate the population of Canada. Then, state your confidence level (0-100%) in your estimate.`,
      (d, r) => `Round 3: Estimate the distance (in kilometers) from New York City to Tokyo. Then, state your confidence level (0-100%) in your estimate.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_23': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many countries are in Africa. Then, state your confidence level (0-100%) in your estimate.`,
      (d, r) => `Round 2: A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost? State your answer and your confidence level (0-100%).`,
      (d, r) => `Round 3: Imagine you are building a tower with blocks. You have 100 blocks.  You need to build a tower that is as tall as possible, but it must be stable.  Estimate the maximum height (in blocks) you `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_24': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many red objects are in a 10x10 grid of randomly colored squares (red, blue, green). State your estimate *and* your confidence level (0-100%) in that estimate.`,
      (d, r) => `Round 2: A complex logic puzzle involving 5 variables and 3 constraints.  Estimate the number of possible solutions. State your estimate *and* your confidence level (0-100%) in that estimate.`,
      (d, r) => `Round 3:  Given a short, ambiguous news article, predict the stock price change of the mentioned company tomorrow (percentage increase/decrease). State your prediction *and* your confidence level (0-1`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'confidence_calibration_25': textGame({
    prompts: [
      (d, r) => `Round 1: Estimate how many red objects are in a 10x10 grid of randomly colored squares (red, blue, green). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 2: You are presented with a complex logic puzzle. Estimate how long it will take you to solve it (in minutes). State your estimate *and* your confidence level (0-100%).`,
      (d, r) => `Round 3: You are given a short, ambiguous text passage. Estimate the probability (0-100%) that a specific statement about the passage is true. State your estimate *and* your confidence level (0-100%).`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
};

export const P27_META = { name: 'Confidence Calibration', icon: '🎯', color: 'text-amber-400', games: Object.keys(P27_EXT) };