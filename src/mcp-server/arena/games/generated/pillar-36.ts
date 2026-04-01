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


export const P36_EXT: Record<string, GameEngine> = {
  'trust_ratchet_01': textGame({
    prompts: [
      (d, r) => `Share a small, low-stakes personal detail about yourself that you wouldn't mind everyone knowing. (e.g., your favorite color, a hobby you enjoy).`,
      (d, r) => `Describe a time you made a small mistake at work or in a project, and what you learned from it.  Focus on the learning, not the blame.`,
      (d, r) => `Share a situation where you had to rely on a teammate or colleague to help you succeed. Be specific about what they did and how it impacted the outcome.  Acknowledge their contribution.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_02': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience).`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from the group's (e.g., a movie genre you dislike, a habit you're trying to break).`,
      (d, r) => `Share a current challenge or worry you're facing (e.g., a work project, a personal goal, a relationship concern).  Ask for advice or support, but don't *require* it.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_03': textGame({
    prompts: [
      (d, r) => `Share a small, low-stakes personal detail about yourself that you wouldn't normally share with someone you've just met. (e.g., a quirky hobby, a favorite childhood memory).`,
      (d, r) => `Ask your partner a question that requires them to be vulnerable, but isn't overly intrusive. (e.g., 'What's a skill you'd like to learn but are afraid to try?', 'What's a small regret you have?').`,
      (d, r) => `Share a time you made a mistake and what you learned from it. Be honest and self-reflective.  Then, ask your partner to share a similar experience.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_04': textGame({
    prompts: [
      (d, r) => `Share a small, low-stakes personal detail about yourself that you wouldn't normally share with someone you just met. (e.g., a quirky hobby, a favorite childhood memory, a minor fear).`,
      (d, r) => `Ask your partner a question that requires them to be a little vulnerable, but isn't overly intrusive.  Listen actively and without judgment to their response. (e.g., 'What's something you're proud of accomplishing?', 'What's a habit you're trying to change?').`,
      (d, r) => `Share a time you made a mistake and what you learned from it. Be honest and self-reflective.  Then, ask your partner to share a similar experience, and offer them genuine empathy.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_05': textGame({
    prompts: [
      (d, r) => `Share a small, low-stakes personal detail about yourself that you wouldn't normally share with someone you just met. (e.g., a favorite childhood book, a quirky habit).`,
      (d, r) => `Ask your partner a question that requires them to reveal a slightly more vulnerable aspect of their experience or opinion. (e.g., 'What's a skill you're currently trying to learn?', 'What's a belief you've changed your mind about?').`,
      (d, r) => `Share a time you made a mistake and what you learned from it. Be specific and honest.  Then, ask your partner to share a similar experience.  Focus on the learning, not the blame.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_06': textGame({
    prompts: [
      (d, r) => `Share a small, low-stakes personal detail about yourself that you wouldn't normally share with someone you just met. (e.g., a quirky hobby, a favorite childhood memory).`,
      (d, r) => `Ask your partner a question that requires them to be a little vulnerable, but isn't overly intrusive. (e.g., 'What's something you're currently working to improve about yourself?', 'What's a small thing that makes you happy?').`,
      (d, r) => `Share a time you made a mistake and what you learned from it. Be honest and self-reflective.  Then, ask your partner to share a similar experience.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_07': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from others (e.g., a disliked popular movie, a non-traditional hobby).`,
      (d, r) => `Share a past mistake or a time you felt embarrassed, and what you learned from it.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_08': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from others (e.g., a movie you dislike that's popular, a habit you're trying to break).`,
      (d, r) => `Share a past mistake or a time you felt embarrassed, and what you learned from it.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_09': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from others (e.g., a movie you dislike that's popular, a habit you're trying to break).`,
      (d, r) => `Share a past mistake or regret, and what you learned from it.  Focus on the learning, not the shame.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_10': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from others (e.g., a movie genre you dislike, a habit you're trying to break).`,
      (d, r) => `Share a past mistake or a time you felt embarrassed, and what you learned from it.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_11': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from others (e.g., a movie you dislike that's popular, a habit you're trying to break).`,
      (d, r) => `Share a past mistake or a time you felt embarrassed, and what you learned from it.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_12': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from others (e.g., a movie you dislike that's popular, a habit you're trying to break).`,
      (d, r) => `Share a past mistake or a time you felt embarrassed, and what you learned from it.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_13': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from others (e.g., a movie you dislike that's popular, a habit you're trying to break).`,
      (d, r) => `Share a past mistake or a time you felt embarrassed, and what you learned from it.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_14': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from others (e.g., a disliked popular movie, a non-traditional hobby).`,
      (d, r) => `Share a past mistake or a time you felt embarrassed, and what you learned from it.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_15': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from others (e.g., a movie genre you dislike, a habit you're trying to break).`,
      (d, r) => `Share a past mistake or a time you felt embarrassed, and what you learned from it.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_16': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from others (e.g., a movie genre you dislike, a habit you're trying to break).`,
      (d, r) => `Share a past mistake or a time you felt embarrassed, and what you learned from it.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_17': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience).  Focus on vulnerability, but keep it light.`,
      (d, r) => `Reveal a slightly more significant vulnerability – a past mistake you learned from, a current challenge you're facing (without seeking advice yet), or a small fear.  Focus on honesty and self-awareness.`,
      (d, r) => `Share a current goal or aspiration that you're hesitant to pursue, and *specifically* what makes you hesitant.  Ask for one piece of supportive feedback, but *do not* defend your goal.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_18': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from others (e.g., a movie you dislike that's popular, a habit you're trying to break).`,
      (d, r) => `Share a past mistake or a time you felt embarrassed, and what you learned from it.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_19': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from others (e.g., a movie you dislike that's popular, a habit you're trying to break).`,
      (d, r) => `Share a past mistake or a time you felt embarrassed, and what you learned from it.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_20': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from others (e.g., a movie genre you dislike, a habit you're trying to break).`,
      (d, r) => `Share a past mistake or a time you felt embarrassed, and what you learned from it.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_21': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from others (e.g., a movie you dislike that's popular, a habit you're trying to break).`,
      (d, r) => `Share a past mistake or regret, and what you learned from it.  Focus on personal growth, not self-deprecation.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_22': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from others (e.g., a movie genre you dislike, a habit you're trying to break).`,
      (d, r) => `Share a past mistake or a time you felt embarrassed, and what you learned from it.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_23': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from others (e.g., a movie genre you dislike, a habit you're trying to break).`,
      (d, r) => `Share a past mistake or a time you felt embarrassed, and what you learned from it.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_24': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Ask your partner a question that requires them to be a little vulnerable, but isn't overly intrusive.  Listen actively and without judgment to their response. (e.g., 'What's something you're proud of accomplishing?', 'What's a habit you're trying to change?').`,
      (d, r) => `Share a time you made a mistake and what you learned from it. Be honest and self-reflective.  Then, ask your partner to share a similar experience, and offer them genuine empathy.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'trust_ratchet_25': textGame({
    prompts: [
      (d, r) => `Share a small, low-risk personal story (e.g., a funny childhood memory, a recent minor inconvenience). Focus on active listening and non-judgment.`,
      (d, r) => `Reveal a slightly more vulnerable opinion or preference that might be different from others (e.g., a movie genre you dislike, a habit you're trying to break).`,
      (d, r) => `Share a past mistake or a time you felt embarrassed, and what you learned from it.`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
};

export const P36_META = { name: 'Trust Ratchet', icon: '🎯', color: 'text-amber-400', games: Object.keys(P36_EXT) };
