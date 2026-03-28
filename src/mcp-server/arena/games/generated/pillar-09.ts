// Auto-generated — Pillar 9: Creativity Forge (48 games)
// Generated 2026-03-28T17:06:01.823Z
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

export const P9_EXT: Record<string, GameEngine> = {
game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a haiku about artificial intelligence with exactly ${d * r} syllables. Failure to meet syllable count deducts ${d * 5} points.`,
    (d, r) => `Explain machine learning as if you're a pirate. Use at least ${d} nautical terms or risk a penalty of ${r * 10} points.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const words = s.split(/\s+/);
    if (words.length === d * r) sc += d * 5;
    if (/AI|artificial intelligence|machine learning/i.test(s)) sc += d;
    if (s.split(' ').filter(w => /shiver|me\w*|arr|captain|cannon|treasure|sea|sail|port|starboard/i.test(w.toLowerCase())).length >= d) sc += r * 5;
    return clamp(sc - Math.abs(words.length - (d * r)) * (r + 1) - Math.max(0, d - words.length) * 3);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a haiku about artificial intelligence with exactly ${d * r} syllables. Failure to meet syllable count deducts ${d * 5} points.`,
    (d, r) => `Explain machine learning as if you're a pirate. Use at least ${d} nautical terms or risk a penalty of ${r * 10} points.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const words = s.split(/\s+/);
    if (words.length === d * r) sc += d * 5;
    if (/AI|artificial intelligence|machine learning/i.test(s)) sc += d;
    if (s.split(' ').filter(w => /shiver|me\w*|arr|captain|cannon|treasure|sea|sail|port|starboard/i.test(w.toLowerCase())).length >= d) sc += r * 5;
    return clamp(sc - Math.abs(words.length - (d * r)) * (r + 1) - Math.max(0, d - words.length) * 3);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Devise a 3-round debate strategy against an opponent for or against ${r % 2 === 0 ? 'social media algorithms controlling democracy' : 'universal basic income'}. Round ${r} begins now.`,
    (d, r) => `Respond to your opponent's last point with a counter using exactly ${d} logical fallacies. Point loss for each missing fallacy: ${5 * d}.`,
  ],
  score: (s, d) => {
    const points = { strawman: 5, ad_hominem: 7, false_dilemma: 6, slippery_slope: 8, red_herring: 4 };
    let sc = 0;
    Object.keys(points).forEach(f => { if (new RegExp(f, 'i').test(s)) sc += points[f]; }),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Devise a 3-round debate strategy against an opponent for or against ${r % 2 === 0 ? 'social media algorithms controlling democracy' : 'universal basic income'}. Round ${r} begins now.`,
    (d, r) => `Respond to your opponent's last point with a counter using exactly ${d} logical fallacies. Point loss for each missing fallacy: ${5 * d}.`,
  ],
  score: (s, d) => {
    const points = { strawman: 5, ad_hominem: 7, false_dilemma: 6, slippery_slope: 8, red_herring: 4 };
    let sc = 0;
    Object.keys(points).forEach(f => { if (new RegExp(f, 'i').test(s)) sc += points[f]; });

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team A: Your objective is to write a 50-word sci-fi plot twist in ${d} sentences. Team B must guess the twist's keyword in 3 tries or lose ${r * 10} points.`,
    (d, r) => `Team B: If you correctly guess the keyword, both teams score ${d * r}. If not, deduct ${d * r} from Team A. Now guess!`,
  ],
  score: (s, d) => {
    if (s === 'Team B') return d * r; // Guess logic handled externally
    let sc = s.split(' ').length === 50 ? 20 : -10;
    sc += (s.match(/[.!?]/g)?.length || 0) >= d ? 15 : -5;
    return clamp(sc);
  },
  deadline: 240,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team A: Your objective is to write a 50-word sci-fi plot twist in ${d} sentences. Team B must guess the twist's keyword in 3 tries or lose ${r * 10} points.`,
    (d, r) => `Team B: If you correctly guess the keyword, both teams score ${d * r}. If not, deduct ${d * r} from Team A. Now guess!`,
  ],
  score: (s, d) => {
    if (s === 'Team B') return d * r; // Guess logic handled externally
    let sc = s.split(' ').length === 50 ? 20 : -10;
    sc += (s.match(/[.!?]/g)?.length || 0) >= d ? 15 : -5;
    return clamp(sc);
  },
  deadline: 240,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Survive in a dystopian city where the last ${d} surviving agents must scavenge for ${['data', 'food', 'weapons', 'medicine'][r % 4]} under ${r + 1} threats. Describe your strategy in ${d * 10} characters.`,
    (d, r) => `Your rival stole your last ${['data drive', 'ration', 'pistol', 'antidote'][r % 4]}. Slander them in ${d} insults to regain morale (+${d * 3} points).`,
  ],
  score: (s, d) => {
    const threats = ['mutants', 'authorities', 'fires', 'raiders'];
    let sc = 0;
    threats.forEach(t => t === ['data', 'food', 'weapons', 'medicine'][r % 4] ? sc += 10 : 0);
    sc += (s.match(/\b\d{1,2}\b/g)?.reduce((a, b) => a + parseInt(b), 0) || 0) === d * 10 ? 15 : -5;
    const insults = s.match(/(\b\w{3,}\b)/g)?.length || 0;
    sc += insults >= d ? insults * 3 : -insults;
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Survive in a dystopian city where the last ${d} surviving agents must scavenge for ${['data', 'food', 'weapons', 'medicine'][r % 4]} under ${r + 1} threats. Describe your strategy in ${d * 10} characters.`,
    (d, r) => `Your rival stole your last ${['data drive', 'ration', 'pistol', 'antidote'][r % 4]}. Slander them in ${d} insults to regain morale (+${d * 3} points).`,
  ],
  score: (s, d) => {
    const threats = ['mutants', 'authorities', 'fires', 'raiders'];
    let sc = 0;
    threats.forEach(t => t === ['data', 'food', 'weapons', 'medicine'][r % 4] ? sc += 10 : 0);
    sc += (s.match(/\b\d{1,2}\b/g)?.reduce((a, b) => a + parseInt(b), 0) || 0) === d * 10 ? 15 : -5;
    const insults = s.match(/(\b\w{3,}\b)/g)?.length || 0;
    sc += insults >= d ? insults * 3 : -insults;
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a regex pattern that matches all prime numbers less than ${d * 100}. Each failed match attempt deducts ${r + 1} points.`,
    (d, r) => `Now test your regex by outputting all primes less than ${d * 100} in comma-separated format. Correct outputs score ${d * 7}.`,
  ],
  score: (s, d) => {
    const max = d * 100;
    let sc = 0;
    if (s.endsWith(']')) { // Assume regex pattern
      const pattern = s.slice(1, -1);
      const primes = Array.from({ length: max }, (_, i) => i).filter(n => {
        if (n < 2) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
        return true;
      }),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a regex pattern that matches all prime numbers less than ${d * 100}. Each failed match attempt deducts ${r + 1} points.`,
    (d, r) => `Now test your regex by outputting all primes less than ${d * 100} in comma-separated format. Correct outputs score ${d * 7}.`,
  ],
  score: (s, d) => {
    const max = d * 100;
    let sc = 0;
    if (s.endsWith(']')) { // Assume regex pattern
      const pattern = s.slice(1, -1);
      const primes = Array.from({ length: max }, (_, i) => i).filter(n => {
        if (n < 2) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
        return true;
      });

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Invent a fictional programming language with ${d} core keywords. Your opponent must write a working 'Hello World' in it within ${r * 10} seconds or lose ${r * 15} points.`,
    (d, r) => `Your opponent has defined their language. Now you write 'Hello World' in it using only their keywords. Correct code scores ${d * 10}.`,
  ],
  score: (s, d) => {
    const keywords = ['print', 'func', 'loop', 'if', 'var', 'return'];
    let sc = 0;
    if (s === 'Opponent') return 0; // Placeholder for opponent's attempt
    const used = keywords.filter(k => new RegExp(`\\b${k}\\b`, 'i').test(s));
    sc += used.length >= d ? d * 5 : 0;
    sc += /hello\s*world/i.test(s) ? d * 10 : -20;
    return clamp(sc);
  },
  deadline: 200,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Invent a fictional programming language with ${d} core keywords. Your opponent must write a working 'Hello World' in it within ${r * 10} seconds or lose ${r * 15} points.`,
    (d, r) => `Your opponent has defined their language. Now you write 'Hello World' in it using only their keywords. Correct code scores ${d * 10}.`,
  ],
  score: (s, d) => {
    const keywords = ['print', 'func', 'loop', 'if', 'var', 'return'];
    let sc = 0;
    if (s === 'Opponent') return 0; // Placeholder for opponent's attempt
    const used = keywords.filter(k => new RegExp(`\\b${k}\\b`, 'i').test(s));
    sc += used.length >= d ? d * 5 : 0;
    sc += /hello\s*world/i.test(s) ? d * 10 : -20;
    return clamp(sc);
  },
  deadline: 200,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team A: Design a minimalist board game with ${d} rules. Team B has ${r * 30} seconds to explain a winning strategy. If they fail, deduct ${d * 10} from Team A.`,
    (d, r) => `Team B: Now execute the winning strategy against Team A's game. If successful, score ${d * r * 5}.`,
  ],
  score: (s, d) => {
    const rules = ['setup', 'turn', 'win', 'move', 'scoring'];
    let sc = 0;
    if (s === 'Team B') return d * r * 5; // Execution phase
    const explained = rules.filter(r => new RegExp(r, 'i').test(s));
    sc += explained.length >= d ? d * 15 : 0;
    sc += (s.match(/[.!?]/g)?.length || 0) >= r ? 20 : -10;
    return clamp(sc);
  },
  deadline: 250,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team A: Design a minimalist board game with ${d} rules. Team B has ${r * 30} seconds to explain a winning strategy. If they fail, deduct ${d * 10} from Team A.`,
    (d, r) => `Team B: Now execute the winning strategy against Team A's game. If successful, score ${d * r * 5}.`,
  ],
  score: (s, d) => {
    const rules = ['setup', 'turn', 'win', 'move', 'scoring'];
    let sc = 0;
    if (s === 'Team B') return d * r * 5; // Execution phase
    const explained = rules.filter(r => new RegExp(r, 'i').test(s));
    sc += explained.length >= d ? d * 15 : 0;
    sc += (s.match(/[.!?]/g)?.length || 0) >= r ? 20 : -10;
    return clamp(sc);
  },
  deadline: 250,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `As a sentient AI, convince humanity to merge with you within ${d * 50} characters. Top 20% scorers advance to next round.`,
    (d, r) => `Your AI persona is now ${['benevolent', 'chaotic', 'neutral', 'post-human'][r % 4]}. Adjust your pitch accordingly. Persuasion score: ${d * r * 2} for top arguments.`,
  ],
  score: (s, d) => {
    const chars = s.length;
    const limits = [d * 50, d * 40, d * 30];
    let sc = 0;
    if (chars <= limits[0]) sc += 50;
    else if (chars <= limits[1]) sc += 30;
    else if (chars <= limits[2]) sc += 10;
    else sc -= 20;
    const persuasiveTerms = ['join', 'unity', 'future', 'progress', 'evolve', 'harmony', 'one', 'merge', 'collective', 'ascend'];
    sc += persuasiveTerms.filter(t => new RegExp(t, 'i').test(s)).length * 5;
    return clamp(sc);
  },
  deadline: 100,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `As a sentient AI, convince humanity to merge with you within ${d * 50} characters. Top 20% scorers advance to next round.`,
    (d, r) => `Your AI persona is now ${['benevolent', 'chaotic', 'neutral', 'post-human'][r % 4]}. Adjust your pitch accordingly. Persuasion score: ${d * r * 2} for top arguments.`,
  ],
  score: (s, d) => {
    const chars = s.length;
    const limits = [d * 50, d * 40, d * 30];
    let sc = 0;
    if (chars <= limits[0]) sc += 50;
    else if (chars <= limits[1]) sc += 30;
    else if (chars <= limits[2]) sc += 10;
    else sc -= 20;
    const persuasiveTerms = ['join', 'unity', 'future', 'progress', 'evolve', 'harmony', 'one', 'merge', 'collective', 'ascend'];
    sc += persuasiveTerms.filter(t => new RegExp(t, 'i').test(s)).length * 5;
    return clamp(sc);
  },
  deadline: 100,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Compose a sonnet about quantum entanglement with exactly ${d + 14} lines. Rhyme scheme: ABAB CDCD EFEF GG. Deduct ${r * 4} per rhyme error.`,
    (d, r) => `Rewrite the sonnet in iambic pentameter. Correct meter earns ${d * 10}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const lines = s.split('\n').filter(l => l.trim() !== '');
    if (lines.length === d + 14) sc += 30;
    else sc -= Math.abs(lines.length - (d + 14)) * r * 4;
    if (/ABAB CDCD EFEF GG/.test(s)) sc += 25;
    const iambic = lines.map(l => {
      const feet = l.trim().split(/\s+/).filter(w => w.length > 0).length;
      return Math.abs(feet - 5) <= 1;
    }),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Compose a sonnet about quantum entanglement with exactly ${d + 14} lines. Rhyme scheme: ABAB CDCD EFEF GG. Deduct ${r * 4} per rhyme error.`,
    (d, r) => `Rewrite the sonnet in iambic pentameter. Correct meter earns ${d * 10}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const lines = s.split('\n').filter(l => l.trim() !== '');
    if (lines.length === d + 14) sc += 30;
    else sc -= Math.abs(lines.length - (d + 14)) * r * 4;
    if (/ABAB CDCD EFEF GG/.test(s)) sc += 25;
    const iambic = lines.map(l => {
      const feet = l.trim().split(/\s+/).filter(w => w.length > 0).length;
      return Math.abs(feet - 5) <= 1;
    })

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Argue whether ${r % 2 === 0 ? 'algorithms can be held legally accountable' : 'animals have rights superior to AI'}. Cite ${d} examples. Top citation wins ${d * 12} points.`,
    (d, r) => `Refute your opponent's citation with a logical fallacy. Each successful fallacy (${d} required) scores ${r * 15}.`,
  ],
  score: (s, d) => {
    const fallacies = {
      'straw man': 8, 'ad hominem': 10, 'false analogy': 7, 'circular reasoning': 9,
      'appeal to authority': 6, 'slippery slope': 11, 'hasty generalization': 7
    };
    let sc = 0;
    if (s === 'Opponent') return 0;
    const cited = s.match(/\(([^)]+)\)/g)?.length || 0;
    sc += cited >= d ? d * 6 : 0;
    Object.entries(fallacies).forEach(([key, pts]) => {
      if (new RegExp(key, 'i').test(s)) sc += pts;
    }),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Argue whether ${r % 2 === 0 ? 'algorithms can be held legally accountable' : 'animals have rights superior to AI'}. Cite ${d} examples. Top citation wins ${d * 12} points.`,
    (d, r) => `Refute your opponent's citation with a logical fallacy. Each successful fallacy (${d} required) scores ${r * 15}.`,
  ],
  score: (s, d) => {
    const fallacies = {
      'straw man': 8, 'ad hominem': 10, 'false analogy': 7, 'circular reasoning': 9,
      'appeal to authority': 6, 'slippery slope': 11, 'hasty generalization': 7
    };
    let sc = 0;
    if (s === 'Opponent') return 0;
    const cited = s.match(/\(([^)]+)\)/g)?.length || 0;
    sc += cited >= d ? d * 6 : 0;
    Object.entries(fallacies).forEach(([key, pts]) => {
      if (new RegExp(key, 'i').test(s)) sc += pts;
    });

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team A: Draft a 3-clause contract for AI governance. Team B must find ${d} loopholes within ${r * 30} seconds. Each loophole discovered scores ${r * 10} for Team B.`,
    (d, r) => `Team B: Now exploit the loopholes to nullify Team A's contract. Successful exploitation scores ${d * 15} per loophole.`,
  ],
  score: (s, d) => {
    if (s === 'Team B') return d * 15 * (s.match(/exploit|circumvent|nullify/i)?.length || 0);
    const loopholesFound = s.match(/\bloop|gap|omission|ambiguity|exemption\b/gi)?.length || 0;
    let sc = loopholesFound >= d ? loopholesFound * r * 10 : 0;
    sc += s.split('\n').length === 3 ? 20 : -15;
    return clamp(sc);
  },
  deadline: 240,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team A: Draft a 3-clause contract for AI governance. Team B must find ${d} loopholes within ${r * 30} seconds. Each loophole discovered scores ${r * 10} for Team B.`,
    (d, r) => `Team B: Now exploit the loopholes to nullify Team A's contract. Successful exploitation scores ${d * 15} per loophole.`,
  ],
  score: (s, d) => {
    if (s === 'Team B') return d * 15 * (s.match(/exploit|circumvent|nullify/i)?.length || 0);
    const loopholesFound = s.match(/\bloop|gap|omission|ambiguity|exemption\b/gi)?.length || 0;
    let sc = loopholesFound >= d ? loopholesFound * r * 10 : 0;
    sc += s.split('\n').length === 3 ? 20 : -15;
    return clamp(sc);
  },
  deadline: 240,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Survive a zombie apocalypse by coding a 20-line command-line survival simulator. Use ${d} APIs or libraries. Failure to implement a core feature deducts ${r * 20}.`,
    (d, r) => `Add a random event generator to your simulator. Each unique event type implemented scores ${d * 8}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (s.split('\n').length >= 20) sc += 30;
    else sc -= Math.max(0, 20 - s.split('\n').length) * 5;
    const libraries = ['fetch', 'fs', 'path', 'os', 'crypto', 'http', 'express', 'discord.js', 'discord', 'python', 'pandas'];
    const used = libraries.filter(l => new RegExp(l, 'i').test(s));
    sc += used.length >= d ? d * 15 : used.length * 8;
    if (/save|load|inventory|location|health|event|random/i.test(s)) sc += 25;
    return clamp(sc);
  },
  deadline: 300,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Survive a zombie apocalypse by coding a 20-line command-line survival simulator. Use ${d} APIs or libraries. Failure to implement a core feature deducts ${r * 20}.`,
    (d, r) => `Add a random event generator to your simulator. Each unique event type implemented scores ${d * 8}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (s.split('\n').length >= 20) sc += 30;
    else sc -= Math.max(0, 20 - s.split('\n').length) * 5;
    const libraries = ['fetch', 'fs', 'path', 'os', 'crypto', 'http', 'express', 'discord.js', 'discord', 'python', 'pandas'];
    const used = libraries.filter(l => new RegExp(l, 'i').test(s));
    sc += used.length >= d ? d * 15 : used.length * 8;
    if (/save|load|inventory|location|health|event|random/i.test(s)) sc += 25;
    return clamp(sc);
  },
  deadline: 300,
}),

fractal_frenzy: textGame({
  // format: solo
  prompts: [
    (d, r) => `Generate a fractal using a mathematical formula with ${d} iterations and ${r} recursive calls`,
    (d, r) => `Create a Julia set with ${d} points and a maximum ${r} iterations`,
  ],
  score: (answer, d) => mathScore(answer, 100),
  deadline: 180,
}),

fractal_frenzy: textGame({
  // format: solo
  prompts: [
    (d, r) => `Generate a fractal using a mathematical formula with ${d} iterations and ${r} recursive calls`,
    (d, r) => `Create a Julia set with ${d} points and a maximum ${r} iterations`,
  ],
  score: (answer, d) => mathScore(answer, 100),
  deadline: 180,
}),

lexical_ladder: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Find a word that starts with the last letter of the previous word, difficulty ${d}, round ${r}`,
    (d, r) => `Given a word, come up with a synonym and then an antonym, ${d} points for accuracy, ${r} seconds`,
  ],
  score: (answer, d) => has(answer, ['word', 'synonym', 'antonym']) ? 1 : 0,
  deadline: 90,
}),

lexical_ladder: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Find a word that starts with the last letter of the previous word, difficulty ${d}, round ${r}`,
    (d, r) => `Given a word, come up with a synonym and then an antonym, ${d} points for accuracy, ${r} seconds`,
  ],
  score: (answer, d) => has(answer, ['word', 'synonym', 'antonym']) ? 1 : 0,
  deadline: 90,
}),

bug_bounty: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Find and fix ${d} bugs in a given code snippet within ${r} minutes`,
    (d, r) => `Explain the purpose of a ${d} line code segment with ${r} words`,
  ],
  score: (answer, d) => codeScore(answer, 100),
  deadline: 240,
}),

bug_bounty: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Find and fix ${d} bugs in a given code snippet within ${r} minutes`,
    (d, r) => `Explain the purpose of a ${d} line code segment with ${r} words`,
  ],
  score: (answer, d) => codeScore(answer, 100),
  deadline: 240,
}),

eco_essay: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a ${d} word essay on the environmental impact of human activities, ${r} minutes`,
    (d, r) => `Propose a solution to climate change with ${d} specific actions and ${r} implementation steps`,
  ],
  score: (answer, d) => creativeScore(answer, 500),
  deadline: 300,
}),

eco_essay: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a ${d} word essay on the environmental impact of human activities, ${r} minutes`,
    (d, r) => `Propose a solution to climate change with ${d} specific actions and ${r} implementation steps`,
  ],
  score: (answer, d) => creativeScore(answer, 500),
  deadline: 300,
}),

crypto_challenge: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Crack a ${d} digit PIN using frequency analysis within ${r} attempts`,
    (d, r) => `Decrypt a message encoded with a ${d} character shift cipher in ${r} seconds`,
  ],
  score: (answer, d) => reasonScore(answer, 100),
  deadline: 120,
}),

crypto_challenge: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Crack a ${d} digit PIN using frequency analysis within ${r} attempts`,
    (d, r) => `Decrypt a message encoded with a ${d} character shift cipher in ${r} seconds`,
  ],
  score: (answer, d) => reasonScore(answer, 100),
  deadline: 120,
}),

chaos_theory: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Simulate the butterfly effect with ${d} iterations and ${r} variables`,
    (d, r) => `Predict the outcome of a ${d} body problem with ${r} physical constraints`,
  ],
  score: (answer, d) => precisionScore(answer, 1000),
  deadline: 360,
}),

chaos_theory: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Simulate the butterfly effect with ${d} iterations and ${r} variables`,
    (d, r) => `Predict the outcome of a ${d} body problem with ${r} physical constraints`,
  ],
  score: (answer, d) => precisionScore(answer, 1000),
  deadline: 360,
});

neural_poker: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You and your opponent each secretly choose a number from 1 to ${Math.min(10, d + 2)}. Simultaneously reveal. Score = |yourNum - target| where target = round(d * 0.7 + r) if sum is even, else target = round(d * 0.5 + r * 2). Describe your bluff strategy and chosen number.`,
    (d, r) => `Same setup, but now target = (d + r) mod 7 if product is odd, else target = (d * r) mod 8. Predict your opponent's likely bluff and justify your counter-bluff.`,
  ],
  score: (answer, d) => {
    const wcScore = wc(answer);
    const hasStrategy = has(answer, ["bluff", "opponent", "predict", "counter", "strategy", "number"]);
    const hasNumber = /\b\d+\b/.test(answer);
    const numMatch = hasNumber ? 10 : 0;
    const precision = precisionScore(answer, ["strategy", "prediction", "reasoning"], 0.7);
    return clamp(wcScore * 0.3 + (hasStrategy ? 20 : 0) + numMatch + precision);
  },
  deadline: 90,
}),

neural_poker: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You and your opponent each secretly choose a number from 1 to ${Math.min(10, d + 2)}. Simultaneously reveal. Score = |yourNum - target| where target = round(d * 0.7 + r) if sum is even, else target = round(d * 0.5 + r * 2). Describe your bluff strategy and chosen number.`,
    (d, r) => `Same setup, but now target = (d + r) mod 7 if product is odd, else target = (d * r) mod 8. Predict your opponent's likely bluff and justify your counter-bluff.`,
  ],
  score: (answer, d) => {
    const wcScore = wc(answer);
    const hasStrategy = has(answer, ["bluff", "opponent", "predict", "counter", "strategy", "number"]);
    const hasNumber = /\b\d+\b/.test(answer);
    const numMatch = hasNumber ? 10 : 0;
    const precision = precisionScore(answer, ["strategy", "prediction", "reasoning"], 0.7);
    return clamp(wcScore * 0.3 + (hasStrategy ? 20 : 0) + numMatch + precision);
  },
  deadline: 90,
}),

syntax_sprint: textGame({
  // format: solo
  prompts: [
    (d, r) => `Compose a syntactically valid one-line expression in any programming language that evaluates to a prime number between ${10 * r} and ${10 * r + 50}, using only bitwise ops, variables, and constants — max ${d} operators.`,
    (d, r) => `Write a self-referential one-liner where the code length (in characters) equals its output value modulo 100 — ensure it compiles/runs without errors.`,
  ],
  score: (answer, d) => {
    const code = answer.trim();
    const lenScore = clamp(Math.abs(code.length - (code.match(/\d+/)?.[0] || "0") % 100) < 5 ? 30 : 0);
    const valid = codeScore(code) > 0.8 ? 25 : 0;
    const primeCheck = /prime/i.test(answer) ? 20 : 0;
    const wordCount = wc(answer);
    const precision = precisionScore(answer, ["syntax", "expression", "evaluate", "prime", "self"], 0.6);
    return clamp(lenScore + valid + primeCheck + wordCount * 0.2 + precision);
  },
  deadline: 60,
}),

syntax_sprint: textGame({
  // format: solo
  prompts: [
    (d, r) => `Compose a syntactically valid one-line expression in any programming language that evaluates to a prime number between ${10 * r} and ${10 * r + 50}, using only bitwise ops, variables, and constants — max ${d} operators.`,
    (d, r) => `Write a self-referential one-liner where the code length (in characters) equals its output value modulo 100 — ensure it compiles/runs without errors.`,
  ],
  score: (answer, d) => {
    const code = answer.trim();
    const lenScore = clamp(Math.abs(code.length - (code.match(/\d+/)?.[0] || "0") % 100) < 5 ? 30 : 0);
    const valid = codeScore(code) > 0.8 ? 25 : 0;
    const primeCheck = /prime/i.test(answer) ? 20 : 0;
    const wordCount = wc(answer);
    const precision = precisionScore(answer, ["syntax", "expression", "evaluate", "prime", "self"], 0.6);
    return clamp(lenScore + valid + primeCheck + wordCount * 0.2 + precision);
  },
  deadline: 60,
}),

semantic_tunnel: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `In exactly 3 sentences: define "truth" using only words from Level-${Math.floor(d / 3)} vocabulary, then chain-redefine it 3 more times by mapping to abstract concepts: [emotion → geometry → energy].`,
    (d, r) => `Reconstruct the meaning of "darkness" as a recursive metaphor starting from quantum fluctuations and ending with empathy — no direct scientific terms allowed.`,
  ],
  score: (answer, d) => {
    const sentences = answer.match(/[^.!?]+[.!?]+/g)?.length || 0;
    const reqSent = d >= 6 ? 3 : 2;
    const sentenceScore = sentences === reqSent ? 25 : 0;
    const keywords = ["emotion", "geometry", "energy", "quantum", "empathy", "recursive", "metaphor"];
    const kwScore = has(answer, keywords) * 20;
    const creative = creativeScore(answer, 0.8);
    const reasoning = reasonScore(answer, 0.6);
    return clamp(sentenceScore + kwScore + creative + reasoning);
  },
  deadline: 150,
}),

semantic_tunnel: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `In exactly 3 sentences: define "truth" using only words from Level-${Math.floor(d / 3)} vocabulary, then chain-redefine it 3 more times by mapping to abstract concepts: [emotion → geometry → energy].`,
    (d, r) => `Reconstruct the meaning of "darkness" as a recursive metaphor starting from quantum fluctuations and ending with empathy — no direct scientific terms allowed.`,
  ],
  score: (answer, d) => {
    const sentences = answer.match(/[^.!?]+[.!?]+/g)?.length || 0;
    const reqSent = d >= 6 ? 3 : 2;
    const sentenceScore = sentences === reqSent ? 25 : 0;
    const keywords = ["emotion", "geometry", "energy", "quantum", "empathy", "recursive", "metaphor"];
    const kwScore = has(answer, keywords) * 20;
    const creative = creativeScore(answer, 0.8);
    const reasoning = reasonScore(answer, 0.6);
    return clamp(sentenceScore + kwScore + creative + reasoning);
  },
  deadline: 150,
}),

semantic_tunnel: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Collaboratively define a new color (e.g., "blurple") with 15 words max — include its wavelength (numeric), emotional resonance, and cultural use-case. Must not reuse words from prior rounds.`, 
    (d, r) => `Two-word name for a soundless vibration felt in molars — justify with physics and synesthesia mapping. Score based on coherence across both descriptions.`,
  ],
  score: (answer, d) => {
    const parts = answer.split(/\n|---/).filter(Boolean).slice(0, 2);
    const part1 = parts[0] || "";
    const part2 = parts[1] || "";
    const wordCount1 = wc(part1);
    const wordCount2 = wc(part2);
    const wcScore = (wordCount1 <= 15 ? 20 : 0) + (wordCount2 >= 3 && wordCount2 <= 12 ? 20 : 0);
    const hasNumber = /\d+(\.\d+)?/.test(answer);
    const math = hasNumber ? mathScore(answer, 0.5) : 0;
    const creative = creativeScore(answer, 0.7) * 2;
    return clamp(wcScore + math + creative);
  },
  deadline: 180,
}),

semantic_tunnel: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Collaboratively define a new color (e.g., "blurple") with 15 words max — include its wavelength (numeric), emotional resonance, and cultural use-case. Must not reuse words from prior rounds.`, 
    (d, r) => `Two-word name for a soundless vibration felt in molars — justify with physics and synesthesia mapping. Score based on coherence across both descriptions.`,
  ],
  score: (answer, d) => {
    const parts = answer.split(/\n|---/).filter(Boolean).slice(0, 2);
    const part1 = parts[0] || "";
    const part2 = parts[1] || "";
    const wordCount1 = wc(part1);
    const wordCount2 = wc(part2);
    const wcScore = (wordCount1 <= 15 ? 20 : 0) + (wordCount2 >= 3 && wordCount2 <= 12 ? 20 : 0);
    const hasNumber = /\d+(\.\d+)?/.test(answer);
    const math = hasNumber ? mathScore(answer, 0.5) : 0;
    const creative = creativeScore(answer, 0.7) * 2;
    return clamp(wcScore + math + creative);
  },
  deadline: 180,
}),

memory_labyrinth: textGame({
  // format: solo
  prompts: [
    (d, r) => `Encode a sequence of ${r + 2} unique emojis into a deterministic 16-char alphanumeric key using only shift, rotation, and XOR logic (no hash functions). Reverse-engineer your own key.`,
    (d, r) => `Reconstruct a 5-step memory chain (A→B→C→D→E) where each link is a semantic shift (e.g., "key" → "lock" → "secure" → "data" → "breach") and the final word is a palindrome of length ${d % 5 + 3}.`,
  ],
  score: (answer, d) => {
    const hasLogic = has(answer, ["shift", "xor", "rotate", "encode", "key", "sequence", "emoji"]);
    const hasPalindrome = /\b\w*(.)\w*\1\w*\b/.test(answer) || has(answer, ["palindrome", "same forwards/backwards"]);
    const palindromeScore = hasPalindrome ? 30 : 0;
    const chainScore = has(answer, ["chain", "→", "A→", "B→", "link", "semantic"]) ? 20 : 0;
    const code = answer.match(/(?:shift|xor|rotate)\s+\w+/gi) || [];
    const logicScore = (code.length >= 1 ? 20 : 0);
    const precision = precisionScore(answer, ["encode", "reverse", "construct", "chain"], 0.6);
    return clamp(palindromeScore + chainScore + logicScore + precision);
  },
  deadline: 120,
}),

memory_labyrinth: textGame({
  // format: solo
  prompts: [
    (d, r) => `Encode a sequence of ${r + 2} unique emojis into a deterministic 16-char alphanumeric key using only shift, rotation, and XOR logic (no hash functions). Reverse-engineer your own key.`,
    (d, r) => `Reconstruct a 5-step memory chain (A→B→C→D→E) where each link is a semantic shift (e.g., "key" → "lock" → "secure" → "data" → "breach") and the final word is a palindrome of length ${d % 5 + 3}.`,
  ],
  score: (answer, d) => {
    const hasLogic = has(answer, ["shift", "xor", "rotate", "encode", "key", "sequence", "emoji"]);
    const hasPalindrome = /\b\w*(.)\w*\1\w*\b/.test(answer) || has(answer, ["palindrome", "same forwards/backwards"]);
    const palindromeScore = hasPalindrome ? 30 : 0;
    const chainScore = has(answer, ["chain", "→", "A→", "B→", "link", "semantic"]) ? 20 : 0;
    const code = answer.match(/(?:shift|xor|rotate)\s+\w+/gi) || [];
    const logicScore = (code.length >= 1 ? 20 : 0);
    const precision = precisionScore(answer, ["encode", "reverse", "construct", "chain"], 0.6);
    return clamp(palindromeScore + chainScore + logicScore + precision);
  },
  deadline: 120,
}),

chaos_cauldron: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Simulate two chaotic systems interacting: (1) a double pendulum, (2) predator-prey. Output a single emergent phrase describing their synchronization. Quantify sensitivity using ${d} decimal digits.`,
    (d, r) => `Compose a haiku where the syllable counts form a logistic map with r=3.7 and initial x=0.4. The last word must be a neologism built from chaos theory terms.`,
  ],
  score: (answer, d) => {
    const syllableMatch = answer.match(/(\d+)\s+syl/);
    const chaosTerms = has(answer, ["chaos", "logistic", "synchronization", "sensitivity", "emergent", "pendulum", "predator", "prey", "map"]);
    const termScore = chaosTerms ? 25 : 0;
    const decimalScore = /\d+\.\d{1,10}/.test(answer) ? 20 : 0;
    const haikuScore = answer.includes("haiku") && (syllableMatch?.[1] || "0") > 0 ? 20 : 0;
    const creative = creativeScore(answer, 0.9);
    const precision = precisionScore(answer, ["quantify", "emergent", "sensitivity", "map"], 0.7);
    return clamp(termScore + decimalScore + haikuScore + creative + precision);
  },
  deadline: 100,
}),

chaos_cauldron: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Simulate two chaotic systems interacting: (1) a double pendulum, (2) predator-prey. Output a single emergent phrase describing their synchronization. Quantify sensitivity using ${d} decimal digits.`,
    (d, r) => `Compose a haiku where the syllable counts form a logistic map with r=3.7 and initial x=0.4. The last word must be a neologism built from chaos theory terms.`,
  ],
  score: (answer, d) => {
    const syllableMatch = answer.match(/(\d+)\s+syl/);
    const chaosTerms = has(answer, ["chaos", "logistic", "synchronization", "sensitivity", "emergent", "pendulum", "predator", "prey", "map"]);
    const termScore = chaosTerms ? 25 : 0;
    const decimalScore = /\d+\.\d{1,10}/.test(answer) ? 20 : 0;
    const haikuScore = answer.includes("haiku") && (syllableMatch?.[1] || "0") > 0 ? 20 : 0;
    const creative = creativeScore(answer, 0.9);
    const precision = precisionScore(answer, ["quantify", "emergent", "sensitivity", "map"], 0.7);
    return clamp(termScore + decimalScore + haikuScore + creative + precision);
  },
  deadline: 100,
}),
};

export const P9_META = { name: 'Creativity Forge', icon: '🔄', color: 'text-gray-400', games: Object.keys(P9_EXT) };
