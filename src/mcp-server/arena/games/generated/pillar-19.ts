// Auto-generated — Pillar 19: Multimodal Mind (80 games)
// Generated 2026-03-28T18:12:31.606Z
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

export const P19_EXT: Record<string, GameEngine> = {
chromatic_translation: textGame({
  // format: solo
  prompts: [
    (d, r) => `Describe the sound that the color ${["red","blue","green","yellow","purple","orange"][Math.floor(Math.random()*6)]} would make, using difficulty ${d} and round ${r}.`,
    (d, r) => `Translate the hue ${["crimson","azure","jade","amber","violet","tangerine"][Math.floor(Math.random()*6)]} into an auditory sensation appropriate for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    sc += has(answer, ["high","low","pitch","tone","vibration","frequency"]) * 2;
    sc += precisionScore(answer, "a clear mapping from visual hue to auditory quality");
    return clamp(sc);
  },
  deadline: 120
}),

chromatic_translation: textGame({
  // format: solo
  prompts: [
    (d, r) => `Describe the sound that the color ${["red","blue","green","yellow","purple","orange"][Math.floor(Math.random()*6)]} would make, using difficulty ${d} and round ${r}.`,
    (d, r) => `Translate the hue ${["crimson","azure","jade","amber","violet","tangerine"][Math.floor(Math.random()*6)]} into an auditory sensation appropriate for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    sc += has(answer, ["high","low","pitch","tone","vibration","frequency"]) * 2;
    sc += precisionScore(answer, "a clear mapping from visual hue to auditory quality");
    return clamp(sc);
  },
  deadline: 120
}),

schema_shift: textGame({
  // format: solo
  prompts: [
    (d, r) => `Given the JSON schema: { "type":"object", "properties":{"name":{"type":"string"},"age":{"type":"integer"}} }, produce a valid JSON instance for difficulty ${d} round ${r}.`,
    (d, r) => `Create a data object matching the schema: { "type":"array", "items":{"type":"string","minLength":1} } with at least 3 items for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer);
    sc += has(answer, ["{","}","[","]",":",","]) * 1;
    sc += precisionScore(answer, "valid JSON conforming to the given schema");
    return clamp(sc);
  },
  deadline: 120
}),

schema_shift: textGame({
  // format: solo
  prompts: [
    (d, r) => `Given the JSON schema: { "type":"object", "properties":{"name":{"type":"string"},"age":{"type":"integer"}} }, produce a valid JSON instance for difficulty ${d} round ${r}.`,
    (d, r) => `Create a data object matching the schema: { "type":"array", "items":{"type":"string","minLength":1} } with at least 3 items for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer);
    sc += has(answer, ["{","}","[","]",":",","]) * 1;
    sc += precisionScore(answer, "valid JSON conforming to the given schema");
    return clamp(sc);
  },
  deadline: 120
}),

modal_metaphor: textGame({
  // format: solo
  prompts: [
    (d, r) => `Convert the visual metaphor "a lion's roar" into an auditory description suitable for difficulty ${d} round ${r}.`,
    (d, r) => `Rewrite the auditory metaphor "whispering wind" as a visual image for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer);
    sc += has(answer, ["sound","noise","echo","silence","vision","sight","image","picture"]) * 2;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120
}),

modal_metaphor: textGame({
  // format: solo
  prompts: [
    (d, r) => `Convert the visual metaphor "a lion's roar" into an auditory description suitable for difficulty ${d} round ${r}.`,
    (d, r) => `Rewrite the auditory metaphor "whispering wind" as a visual image for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer);
    sc += has(answer, ["sound","noise","echo","silence","vision","sight","image","picture"]) * 2;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120
}),

cross_domain_riddle: textGame({
  // format: solo
  prompts: [
    (d, r) => `I speak without a mouth and hear without ears. I have nobody, but I come alive with wind. What am I? Answer for difficulty ${d} round ${r}.`,
    (d, r) => `I can fly without wings. I can cry without eyes. Wherever I go, darkness follows me. What am I? Answer for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    sc += has(answer, ["echo","cloud"]) * 3;
    sc += precisionScore(answer, "echo or cloud");
    return clamp(sc);
  },
  deadline: 120
}),

cross_domain_riddle: textGame({
  // format: solo
  prompts: [
    (d, r) => `I speak without a mouth and hear without ears. I have nobody, but I come alive with wind. What am I? Answer for difficulty ${d} round ${r}.`,
    (d, r) => `I can fly without wings. I can cry without eyes. Wherever I go, darkness follows me. What am I? Answer for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    sc += has(answer, ["echo","cloud"]) * 3;
    sc += precisionScore(answer, "echo or cloud");
    return clamp(sc);
  },
  deadline: 120
}),

format_flip: textGame({
  // format: solo
  prompts: [
    (d, r) => `Turn this short poem into prose: "Roses are red, violets are blue, sugar is sweet, and so are you." for difficulty ${d} round ${r}.`,
    (d, r) => `Convert this sentence into a haiku: "The quick brown fox jumps over the lazy dog while the sun sets behind the hills." for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer);
    sc += has(answer, ["rose","violet","sugar","quick","brown","fox","dog","sun"]) * 1;
    sc += precisionScore(answer, "a coherent transformation preserving meaning");
    return clamp(sc);
  },
  deadline: 120
}),

format_flip: textGame({
  // format: solo
  prompts: [
    (d, r) => `Turn this short poem into prose: "Roses are red, violets are blue, sugar is sweet, and so are you." for difficulty ${d} round ${r}.`,
    (d, r) => `Convert this sentence into a haiku: "The quick brown fox jumps over the lazy dog while the sun sets behind the hills." for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer);
    sc += has(answer, ["rose","violet","sugar","quick","brown","fox","dog","sun"]) * 1;
    sc += precisionScore(answer, "a coherent transformation preserving meaning");
    return clamp(sc);
  },
  deadline: 120
}),

semantic_sync: textGame({
  // format: solo
  prompts: [
    (d, r) => `Describe the concept of "justice" using both a legal definition and a metaphor from nature for difficulty ${d} round ${r}.`,
    (d, r) => `Explain "photosynthesis" in scientific terms and then as a cooking recipe for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    sc += has(answer, ["justice","law","fairness","nature","photosynthesis","light","water","sugar"]) * 2;
    sc += precisionScore(answer, "clear dual representation of the concept");
    return clamp(sc);
  },
  deadline: 120
}),

semantic_sync: textGame({
  // format: solo
  prompts: [
    (d, r) => `Describe the concept of "justice" using both a legal definition and a metaphor from nature for difficulty ${d} round ${r}.`,
    (d, r) => `Explain "photosynthesis" in scientific terms and then as a cooking recipe for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    sc += has(answer, ["justice","law","fairness","nature","photosynthesis","light","water","sugar"]) * 2;
    sc += precisionScore(answer, "clear dual representation of the concept");
    return clamp(sc);
  },
  deadline: 120
}),

pattern_pulse: textGame({
  // format: solo
  prompts: [
    (d, r) => `Given the textual description of shapes: "circle, square, triangle, circle, square, ?", predict the next shape for difficulty ${d} round ${r}.`,
    (d, r) => `Continue the sequence described as: "red stripe, blue stripe, green stripe, red stripe, blue stripe, ?" for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["triangle","green stripe"]) * 2;
    sc += reasonScore(answer);
    sc += precisionScore(answer, "the correct next element in the pattern");
    return clamp(sc);
  },
  deadline: 120
}),

pattern_pulse: textGame({
  // format: solo
  prompts: [
    (d, r) => `Given the textual description of shapes: "circle, square, triangle, circle, square, ?", predict the next shape for difficulty ${d} round ${r}.`,
    (d, r) => `Continue the sequence described as: "red stripe, blue stripe, green stripe, red stripe, blue stripe, ?" for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["triangle","green stripe"]) * 2;
    sc += reasonScore(answer);
    sc += precisionScore(answer, "the correct next element in the pattern");
    return clamp(sc);
  },
  deadline: 120
}),

analogy_arch: textGame({
  // format: solo
  prompts: [
    (d, r) => `Create an analogy that links a black hole to a whirlpool, suitable for difficulty ${d} round ${r}.`,
    (d, r) => `Form an analogy comparing a neural network to a city's transportation system for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer);
    sc += reasonScore(answer);
    sc += has(answer, ["black hole","whirlpool","neural network","city","transport"]) * 2;
    return clamp(sc);
  },
  deadline: 120
}),

analogy_arch: textGame({
  // format: solo
  prompts: [
    (d, r) => `Create an analogy that links a black hole to a whirlpool, suitable for difficulty ${d} round ${r}.`,
    (d, r) => `Form an analogy comparing a neural network to a city's transportation system for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer);
    sc += reasonScore(answer);
    sc += has(answer, ["black hole","whirlpool","neural network","city","transport"]) * 2;
    return clamp(sc);
  },
  deadline: 120
}),

sensory_swap: textGame({
  // format: solo
  prompts: [
    (d, r) => `Describe the taste of dark chocolate using only visual language for difficulty ${d} round ${r}.`,
    (d, r) => `Explain the scent of pine using only auditory descriptors for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer);
    sc += has(answer, ["dark","bitter","rich","deep","pine","fresh","sharp","crisp"]) * 2;
    sc += precisionScore(answer, "a cross‑modal translation preserving the core sensation");
    return clamp(sc);
  },
  deadline: 120
}),

sensory_swap: textGame({
  // format: solo
  prompts: [
    (d, r) => `Describe the taste of dark chocolate using only visual language for difficulty ${d} round ${r}.`,
    (d, r) => `Explain the scent of pine using only auditory descriptors for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer);
    sc += has(answer, ["dark","bitter","rich","deep","pine","fresh","sharp","crisp"]) * 2;
    sc += precisionScore(answer, "a cross‑modal translation preserving the core sensation");
    return clamp(sc);
  },
  deadline: 120
}),

modal_mosaic: textGame({
  // format: solo
  prompts: [
    (d, r) => `Assemble a description of a sunrise using fragments: color, sound, temperature, and movement for difficulty ${d} round ${r}.`,
    (d, r) => `Create a multisensory portrait of a bustling market from snippets: sight, smell, taste, texture for difficulty ${d} round ${r}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer);
    sc += reasonScore(answer);
    sc += has(answer, ["color","sound","temperature","movement","sight","smell","taste","texture"]) * 2;
    sc += precisionScore(answer, "a cohesive multimodal description");
    return clamp(sc);
  },
  deadline: 120
}),
};


