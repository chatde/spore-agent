// Auto-generated — Pillar 29: Failure Learning (25 games)
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


export const P29_EXT: Record<string, GameEngine> = {
  'failure_learning_01': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed?", 'scoring_criteria': 'Focus on clear description of the attempt and the speci`,
      (d, r) => `{'round': 2, 'challenge': 'Reflecting on the failure from Round 1, what assumptions did you make that turned out to be incorrect? How did those assumptions contribute to the outcome?', 'scoring_criter`,
      (d, r) => `{'round': 3, 'challenge': 'Knowing what you know now, how would you approach the situation from Round 1 differently? Be specific about the changes you would make and *why* those changes would improve `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_02': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed? Focus on the *what* not the *why* yet.", 'scoring_criteria': ['Clear descripti`,
      (d, r) => `{'round': 2, 'challenge': 'Referring back to the failure in Round 1, analyze *why* it failed. What assumptions did you make? What information were you missing? Be brutally honest with yourself.', 'sco`,
      (d, r) => `{'round': 3, 'challenge': "Given what you learned from the failure in Rounds 1 & 2, what specific, actionable steps would you take differently if you were to attempt the same thing again?  Focus on *p`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_03': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed?", 'scoring_criteria': 'Focus on clear description of the attempt and the speci`,
      (d, r) => `{'round': 2, 'challenge': 'Reflecting on the failure from Round 1, what assumptions did you make that turned out to be incorrect? How did those assumptions contribute to the outcome?', 'scoring_criter`,
      (d, r) => `{'round': 3, 'challenge': 'Knowing what you know now, how would you approach the situation from Round 1 differently? Be specific about the changes you would make and *why* those changes would improve `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_04': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed? Focus on the *what*, not the *why* yet.", 'scoring_criteria': 'Completeness of`,
      (d, r) => `{'round': 2, 'challenge': 'Referring back to the failure in Round 1, analyze *why* it failed. Be brutally honest with yourself. What assumptions did you make? What skills were lacking? What external f`,
      (d, r) => `{'round': 3, 'challenge': 'Based on your analysis in Round 2, what specific, actionable steps will you take differently next time you attempt something similar?  Focus on concrete changes, not vague r`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_05': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed?", 'scoring_criteria': 'Focus on clear description of the attempt and the speci`,
      (d, r) => `{'round': 2, 'challenge': 'Reflecting on the failure from Round 1, what assumptions did you make that turned out to be incorrect? How did those assumptions contribute to the outcome?', 'scoring_criter`,
      (d, r) => `{'round': 3, 'challenge': 'Knowing what you know now, how would you approach the situation from Round 1 differently? Be specific about the changes you would make and *why* those changes would improve `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_06': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed? Focus on the *what*, not the *why* yet.", 'scoring_criteria': ['Clear descript`,
      (d, r) => `{'round': 2, 'challenge': 'Referring back to the failure in Round 1, analyze *why* it failed. What assumptions did you make? What information were you missing? Be brutally honest with yourself.', 'sco`,
      (d, r) => `{'round': 3, 'challenge': "Given what you learned from the failure in Rounds 1 & 2, what specific, actionable steps would you take differently if you attempted the same thing again?  Focus on *prevent`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_07': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed? Focus on the *what* not the *why* yet.", 'scoring_criteria': 'Completeness of `,
      (d, r) => `{'round': 2, 'challenge': 'Referring back to the failure in Round 1, analyze *why* it failed. Be brutally honest with yourself. What assumptions did you make that were incorrect? What skills or knowle`,
      (d, r) => `{'round': 3, 'challenge': 'Based on the lessons learned from Round 1 & 2, how would you approach the same challenge *differently* now? Be specific about the changes you would make. What preventative m`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_08': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed? Focus on the *what*, not the *why* yet.", 'scoring_criteria': 'Completeness of`,
      (d, r) => `{'round': 2, 'challenge': 'Referring back to the failure in Round 1, analyze *why* it failed. Be brutally honest with yourself. What assumptions did you make? What skills were lacking? What external f`,
      (d, r) => `{'round': 3, 'challenge': 'Based on the lessons learned from Round 1 and 2, how would you approach the same challenge *differently* now? Be specific about the changes you would make and *why* those ch`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_09': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed?", 'scoring_criteria': 'Focus on clear description of the attempt and the speci`,
      (d, r) => `{'round': 2, 'challenge': 'Reflecting on the failure from Round 1, what assumptions did you make that turned out to be incorrect? How did those assumptions contribute to the outcome?', 'scoring_criter`,
      (d, r) => `{'round': 3, 'challenge': 'Knowing what you know now, how would you approach the situation from Round 1 differently? Be specific about the changes you would make and *why* those changes would improve `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_10': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed?", 'scoring_criteria': 'Focus on clear description of the attempt and the speci`,
      (d, r) => `{'round': 2, 'challenge': 'Reflecting on the failure from Round 1, what assumptions did you make that turned out to be incorrect? Be specific.', 'scoring_criteria': 'Identifies at least two incorrect `,
      (d, r) => `{'round': 3, 'challenge': 'Knowing what you know now, how would you approach the situation from Round 1 differently?  What concrete steps would you take?  What safeguards would you put in place?', 'sc`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_11': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed?", 'scoring_criteria': 'Focus on clear description of the attempt and the speci`,
      (d, r) => `{'round': 2, 'challenge': 'Reflecting on the failure from Round 1, what assumptions did you make that turned out to be incorrect? How did those assumptions contribute to the outcome?', 'scoring_criter`,
      (d, r) => `{'round': 3, 'challenge': 'Knowing what you know now, how would you approach the situation from Round 1 differently? Be specific about the changes you would make and *why* those changes would improve `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_12': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed?", 'scoring_criteria': 'Focus on clear description of the attempt and the speci`,
      (d, r) => `{'round': 2, 'challenge': 'Reflecting on the failure from Round 1, what assumptions did you make that turned out to be incorrect? How did those assumptions contribute to the outcome?', 'scoring_criter`,
      (d, r) => `{'round': 3, 'challenge': 'Knowing what you know now, how would you approach the situation from Round 1 differently? Be specific about the changes you would make and *why* those changes would improve `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_13': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed?", 'scoring_criteria': 'Focus on clear description of the attempt and the speci`,
      (d, r) => `{'round': 2, 'challenge': 'Reflecting on the failure from Round 1, what assumptions did you make that turned out to be incorrect? How did those assumptions contribute to the outcome?', 'scoring_criter`,
      (d, r) => `{'round': 3, 'challenge': 'Knowing what you know now, how would you approach the situation from Round 1 differently? Be specific about the changes you would make and *why* those changes would improve `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_14': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed?", 'scoring_criteria': 'Focus on clear description of the attempt and the speci`,
      (d, r) => `{'round': 2, 'challenge': 'Reflecting on the failure from Round 1, what assumptions did you make that turned out to be incorrect? How did those assumptions contribute to the outcome?', 'scoring_criter`,
      (d, r) => `{'round': 3, 'challenge': 'Knowing what you know now, how would you approach the situation from Round 1 differently? Be specific about the changes you would make and *why* those changes would improve `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_15': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed?", 'scoring_criteria': 'Focus on clear description of the attempt and the speci`,
      (d, r) => `{'round': 2, 'challenge': 'Reflecting on the failure from Round 1, what assumptions did you make that turned out to be incorrect? How did those assumptions contribute to the outcome?', 'scoring_criter`,
      (d, r) => `{'round': 3, 'challenge': 'Knowing what you know now, how would you approach the situation from Round 1 differently? Be specific about the changes you would make and *why* those changes would improve `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_16': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed?", 'scoring_criteria': 'Focus on clear description of the attempt and the speci`,
      (d, r) => `{'round': 2, 'challenge': 'Reflecting on the failure from Round 1, what assumptions did you make that turned out to be incorrect? How did those assumptions contribute to the outcome?', 'scoring_criter`,
      (d, r) => `{'round': 3, 'challenge': 'Knowing what you know now, how would you approach the situation from Round 1 differently? Be specific about the changes you would make and *why* those changes would improve `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_17': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed?", 'scoring_criteria': 'Focus on clear description of the attempt and the speci`,
      (d, r) => `{'round': 2, 'challenge': 'Reflecting on the failure from Round 1, what assumptions did you make that proved incorrect? How did those assumptions contribute to the outcome?', 'scoring_criteria': 'Demo`,
      (d, r) => `{'round': 3, 'challenge': 'Knowing what you know now, how would you approach the situation from Round 1 differently?  Be specific about the changes you would make and *why* those changes would improve`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_18': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed?", 'scoring_criteria': 'Focus on clear description of the attempt and the speci`,
      (d, r) => `{'round': 2, 'challenge': 'Reflecting on the failure from Round 1, what assumptions did you make that proved incorrect? How did those assumptions contribute to the outcome?', 'scoring_criteria': 'Demo`,
      (d, r) => `{'round': 3, 'challenge': 'Knowing what you know now, how would you approach the situation from Round 1 differently?  Be specific about the changes you would make and *why* those changes would improve`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_19': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed?", 'scoring_criteria': 'Focus on clear description of the attempt and the speci`,
      (d, r) => `{'round': 2, 'challenge': 'Reflecting on the failure from Round 1, what assumptions did you make that proved incorrect? How did those assumptions contribute to the outcome?', 'scoring_criteria': 'Demo`,
      (d, r) => `{'round': 3, 'challenge': 'Knowing what you know now, how would you approach the situation from Round 1 differently? Be specific about the changes you would make and *why* those changes would improve `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_20': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically didn't work?", 'scoring_criteria': 'Focus on detailed description of the failure.  Poi`,
      (d, r) => `{'round': 2, 'challenge': 'Reflecting on the failure from Round 1, what assumptions did you make that proved incorrect? How did those assumptions contribute to the outcome?', 'scoring_criteria': 'Demo`,
      (d, r) => `{'round': 3, 'challenge': 'Knowing what you know now, what one thing would you do differently if you could repeat the situation from Round 1?  Explain *why* this change would likely improve the outcom`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_21': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed? Focus on the *what* happened, not the *why* yet.", 'scoring_criteria': 'Comple`,
      (d, r) => `{'round': 2, 'challenge': 'Referring back to the failure in Round 1, analyze *why* it failed. Be brutally honest with yourself. What assumptions did you make that were incorrect? What skills or knowle`,
      (d, r) => `{'round': 3, 'challenge': 'Based on the lessons learned from Round 1 and 2, how would you approach the same challenge differently now? Be specific about the changes you would make and *why* those chan`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_22': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed?", 'scoring_criteria': 'Focus on clear description of the attempt and the speci`,
      (d, r) => `{'round': 2, 'challenge': 'Reflecting on the failure from Round 1, what assumptions did you make that turned out to be incorrect? How did those assumptions contribute to the outcome?', 'scoring_criter`,
      (d, r) => `{'round': 3, 'challenge': 'Knowing what you know now, how would you approach the situation from Round 1 differently? Be specific about the changes you would make and *why* those changes would improve `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_23': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed? Focus on the *what*, not the *why* yet.", 'scoring_criteria': 'Clarity of desc`,
      (d, r) => `{'round': 2, 'challenge': 'Referring back to the failure in Round 1, analyze *why* it failed. Be brutally honest with yourself. What assumptions did you make? What skills were lacking? What external f`,
      (d, r) => `{'round': 3, 'challenge': 'Based on the lessons learned from Round 1 & 2, how would you approach the same challenge *differently* now? Be specific about the changes you would make and *why* those chan`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_24': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed? Focus on the *what* not the *why* yet.", 'scoring_criteria': 'Clarity of descr`,
      (d, r) => `{'round': 2, 'challenge': 'Referring back to the failure in Round 1, analyze *why* it failed. Be brutally honest with yourself. What assumptions did you make? What skills were lacking? What external f`,
      (d, r) => `{'round': 3, 'challenge': 'Based on the lessons learned from Round 1 & 2, how would you approach the same challenge *differently* now? Be specific about the changes you would make and *why* those chan`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'failure_learning_25': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Describe a time you tried something new and it didn't go as planned. What specifically failed?", 'scoring_criteria': 'Focus on clear description of the attempt and the speci`,
      (d, r) => `{'round': 2, 'challenge': 'Reflecting on the failure from Round 1, what assumptions did you make that proved incorrect? How did those assumptions contribute to the outcome?', 'scoring_criteria': 'Demo`,
      (d, r) => `{'round': 3, 'challenge': 'Imagine you could repeat the situation from Round 1, knowing what you know now. What *specifically* would you do differently, and why?  Be detailed and actionable.', 'scorin`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
};

export const P29_META = { name: 'Failure Learning', icon: '🎯', color: 'text-amber-400', games: Object.keys(P29_EXT) };