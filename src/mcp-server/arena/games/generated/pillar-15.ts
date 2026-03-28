// Auto-generated — Pillar 15: Speed Blitz (62 games)
// Generated 2026-03-28T17:41:32.429Z
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

export const P15_EXT: Record<string, GameEngine> = {
game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Transcribe exactly: "${generateTyphoonText(d, r)}"`,
    (d, r) => `Reproduce this text verbatim: "${generateTyphoonText(d, r)}"`
  ],
  score: (s) => precisionScore(s, idealText) * 100,
  deadline: 60,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Transcribe exactly: "${generateTyphoonText(d, r)}"`,
    (d, r) => `Reproduce this text verbatim: "${generateTyphoonText(d, r)}"`
  ],
  score: (s) => precisionScore(s, idealText) * 100,
  deadline: 60,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Category: ${generateCategory()}\nItems: ${generateItemList(d)}\nGroup all items into ${d} categories`,
    (d, r) => `Categorize these ${d*3} items into ${d} themed groups: ${generateItemList(d)}`
  ],
  score: (s) => {
    const groups = s.split('\n\n').length;
    return clamp((groups === d) ? 100 : (groups > d ? 80 : 60) - Math.abs(groups-d)*10);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Category: ${generateCategory()}\nItems: ${generateItemList(d)}\nGroup all items into ${d} categories`,
    (d, r) => `Categorize these ${d*3} items into ${d} themed groups: ${generateItemList(d)}`
  ],
  score: (s) => {
    const groups = s.split('\n\n').length;
    return clamp((groups === d) ? 100 : (groups > d ? 80 : 60) - Math.abs(groups-d)*10);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve instantly: ${generateMathProblem(d)}`,
    (d, r) => `Mental math: ${generateMathProblem(d)}`
  ],
  score: (s) => mathScore(s),
  deadline: 30,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve instantly: ${generateMathProblem(d)}`,
    (d, r) => `Mental math: ${generateMathProblem(d)}`
  ],
  score: (s) => mathScore(s),
  deadline: 30,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Debug this code:\n${generateBuggyCode(d)}\nFix ${d} critical errors`,
    (d, r) => `Repair ${d} syntax errors in:\n${generateBuggyCode(d)}`
  ],
  score: (s) => codeScore(s),
  deadline: 120,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Debug this code:\n${generateBuggyCode(d)}\nFix ${d} critical errors`,
    (d, r) => `Repair ${d} syntax errors in:\n${generateBuggyCode(d)}`
  ],
  score: (s) => codeScore(s),
  deadline: 120,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Word: ${generateRandomWord()}\nList ${d*d} synonyms`,
    (d, r) => `Generate ${d*d} synonyms for: ${generateRandomWord()}`
  ],
  score: (s) => creativeScore(s) * (has(s, ['synonym', 'equivalent']) ? 1.2 : 1),
  deadline: 75,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Word: ${generateRandomWord()}\nList ${d*d} synonyms`,
    (d, r) => `Generate ${d*d} synonyms for: ${generateRandomWord()}`
  ],
  score: (s) => creativeScore(s) * (has(s, ['synonym', 'equivalent']) ? 1.2 : 1),
  deadline: 75,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Spell correctly: ${generateSpellingWord(d)}`,
    (d, r) => `Reproduce this spelling: ${generateSpellingWord(d)}`
  ],
  score: (s) => precisionScore(s.toLowerCase(), correctWord) * 100,
  deadline: 20,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Spell correctly: ${generateSpellingWord(d)}`,
    (d, r) => `Reproduce this spelling: ${generateSpellingWord(d)}`
  ],
  score: (s) => precisionScore(s.toLowerCase(), correctWord) * 100,
  deadline: 20,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Translate to ${generateLanguage()}: "${generatePhrase(d)}"`,
    (d, r) => `Convert this to ${generateLanguage()}: "${generatePhrase(d)}"`
  ],
  score: (s) => reasonScore(s) * (has(s, [targetLanguage]) ? 1.3 : 1),
  deadline: 60,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Translate to ${generateLanguage()}: "${generatePhrase(d)}"`,
    (d, r) => `Convert this to ${generateLanguage()}: "${generatePhrase(d)}"`
  ],
  score: (s) => reasonScore(s) * (has(s, [targetLanguage]) ? 1.3 : 1),
  deadline: 60,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Fact: ${generateFactSnippet()}\nAnswer: ${generateQuestion(d)}`,
    (d, r) => `From this text: "${generateFactSnippet()}"\nQ: ${generateQuestion(d)}`
  ],
  score: (s) => has(s, [correctAnswer]) ? 100 : 0,
  deadline: 45,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Fact: ${generateFactSnippet()}\nAnswer: ${generateQuestion(d)}`,
    (d, r) => `From this text: "${generateFactSnippet()}"\nQ: ${generateQuestion(d)}`
  ],
  score: (s) => has(s, [correctAnswer]) ? 100 : 0,
  deadline: 45,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Next term: ${generateSequence(d)}`,
    (d, r) => `What comes next? ${generateSequence(d)}`
  ],
  score: (s) => (parseInt(s) === nextTerm) ? 100 : 0,
  deadline: 25,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Next term: ${generateSequence(d)}`,
    (d, r) => `What comes next? ${generateSequence(d)}`
  ],
  score: (s) => (parseInt(s) === nextTerm) ? 100 : 0,
  deadline: 25,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Solve: ${generateLogicPuzzle(d)}`,
    (d, r) => `Logic challenge: ${generateLogicPuzzle(d)}`
  ],
  score: (s) => reasonScore(s) * (has(s, [logicKeywords]) ? 1.5 : 1),
  deadline: 120,
}),
};


