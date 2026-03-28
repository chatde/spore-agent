// Auto-generated — Pillar 10: Meta-Mind (54 games)
// Generated 2026-03-28T17:14:39.781Z
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

export const P10_EXT: Record<string, GameEngine> = {
neural_poker: textGame({
  // format: solo
  prompts: [
    (d, r) => `Explain the probability of getting at least one pair when dealt ${r} cards from a 52-card deck.`,
    (d, r) => `Describe a bluffing strategy for poker after ${r} rounds, considering difficulty ${d}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer) * 0.4;
    sc += has(answer, ["probability", "pair", "bluff"]) * 0.3;
    sc += wc(answer) > 30 ? 10 : 0;
    return clamp(sc);
  },
  deadline: 120
}),

neural_poker: textGame({
  // format: solo
  prompts: [
    (d, r) => `Explain the probability of getting at least one pair when dealt ${r} cards from a 52-card deck.`,
    (d, r) => `Describe a bluffing strategy for poker after ${r} rounds, considering difficulty ${d}.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer) * 0.4;
    sc += has(answer, ["probability", "pair", "bluff"]) * 0.3;
    sc += wc(answer) > 30 ? 10 : 0;
    return clamp(sc);
  },
  deadline: 120
}),

syntax_sprint: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Write a function in JavaScript that returns the ${r}th Fibonacci number.`,
    (d, r) => `Create a CSS class that centers a div both vertically and horizontally. Use difficulty ${d} to decide complexity (e.g., using flexbox vs grid).`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer) * 0.6;
    sc += wc(answer) > 20 ? 10 : 0;
    return clamp(sc);
  },
  deadline: 120
}),

syntax_sprint: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Write a function in JavaScript that returns the ${r}th Fibonacci number.`,
    (d, r) => `Create a CSS class that centers a div both vertically and horizontally. Use difficulty ${d} to decide complexity (e.g., using flexbox vs grid).`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer) * 0.6;
    sc += wc(answer) > 20 ? 10 : 0;
    return clamp(sc);
  },
  deadline: 120
}),

poetry_forge: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a haiku about a ${r}-second sunrise.`,
    (d, r) => `Compose a four-line poem where each line has exactly ${d} words, theme: perseverance.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 0.5;
    sc += has(answer, ["sunrise", "perseverance"]) * 0.2;
    sc += wc(answer) > 10 ? 10 : 0;
    return clamp(sc);
  },
  deadline: 120
}),

poetry_forge: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a haiku about a ${r}-second sunrise.`,
    (d, r) => `Compose a four-line poem where each line has exactly ${d} words, theme: perseverance.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 0.5;
    sc += has(answer, ["sunrise", "perseverance"]) * 0.2;
    sc += wc(answer) > 10 ? 10 : 0;
    return clamp(sc);
  },
  deadline: 120
}),

math_marathon: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Solve for x: ${d}*x + ${r} = 0.`,
    (d, r) => `Calculate the area of a circle with radius ${r} units, using π ≈ 3.14159.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer) * 0.7;
    sc += wc(answer) > 15 ? 10 : 0;
    return clamp(sc);
  },
  deadline: 120
}),

math_marathon: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Solve for x: ${d}*x + ${r} = 0.`,
    (d, r) => `Calculate the area of a circle with radius ${r} units, using π ≈ 3.14159.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer) * 0.7;
    sc += wc(answer) > 15 ? 10 : 0;
    return clamp(sc);
  },
  deadline: 120
}),

logic_labyrinth: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `If all Bloops are Razzes and all Razzes are Lazzes, are all Bloops definitely Lazzes? Explain your reasoning.`,
    (d, r) => `You have ${r} switches, each controlling a light bulb. Describe how to determine which switch controls which bulb with only one entry into the room. (Difficulty ${d} hints.)`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer) * 0.6;
    sc += has(answer, ["Bloops", "Razzes", "Lazzes", "switch", "bulb"]) * 0.2;
    sc += wc(answer) > 20 ? 10 : 0;
    return clamp(sc);
  },
  deadline: 120
}),

logic_labyrinth: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `If all Bloops are Razzes and all Razzes are Lazzes, are all Bloops definitely Lazzes? Explain your reasoning.`,
    (d, r) => `You have ${r} switches, each controlling a light bulb. Describe how to determine which switch controls which bulb with only one entry into the room. (Difficulty ${d} hints.)`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer) * 0.6;
    sc += has(answer, ["Bloops", "Razzes", "Lazzes", "switch", "bulb"]) * 0.2;
    sc += wc(answer) > 20 ? 10 : 0;
    return clamp(sc);
  },
  deadline: 120
}),

keyword_king: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a paragraph about space exploration that includes the words: ["gravity", "orbit", "satellite"].`,
    (d, r) => `Describe your favorite hobby using at least ${d} of the following keywords: ["passion", "skill", "joy", "challenge"].`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["gravity", "orbit", "satellite"]) * 0.4;
    sc += has(answer, ["passion", "skill", "joy", "chance"]) * 0.3;
    sc += wc(answer) > 25 ? 10 : 0;
    return clamp(sc);
  },
  deadline: 120
}),

keyword_king: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a paragraph about space exploration that includes the words: ["gravity", "orbit", "satellite"].`,
    (d, r) => `Describe your favorite hobby using at least ${d} of the following keywords: ["passion", "skill", "joy", "challenge"].`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["gravity", "orbit", "satellite"]) * 0.4;
    sc += has(answer, ["passion", "skill", "joy", "chance"]) * 0.3;
    sc += wc(answer) > 25 ? 10 : 0;
    return clamp(sc);
  },
  deadline: 120
}),

precision_pilot: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `What is the result of ${d} multiplied by ${r}? Provide only the number.`,
    (d, r) => `State the capital of France.`
  ],
  score: (answer, d) => {
    let sc = 0;
    const ideal1 = (d * r).toString();
    const ideal2 = "Paris";
    sc += precisionScore(answer, ideal1) * 0.5;
    sc += precisionScore(answer, ideal2) * 0.5;
    return clamp(sc);
  },
  deadline: 120
}),

precision_pilot: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `What is the result of ${d} multiplied by ${r}? Provide only the number.`,
    (d, r) => `State the capital of France.`
  ],
  score: (answer, d) => {
    let sc = 0;
    const ideal1 = (d * r).toString();
    const ideal2 = "Paris";
    sc += precisionScore(answer, ideal1) * 0.5;
    sc += precisionScore(answer, ideal2) * 0.5;
    return clamp(sc);
  },
  deadline: 120
}),

word_wizard: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a sentence that contains exactly ${r} words.`,
    (d, r) => `Explain why the sky is blue in exactly ${d} words.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) === r ? 20 : 0;
    sc += wc(answer) === d ? 20 : 0;
    return clamp(sc);
  },
  deadline: 120
}),

word_wizard: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a sentence that contains exactly ${r} words.`,
    (d, r) => `Explain why the sky is blue in exactly ${d} words.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) === r ? 20 : 0;
    sc += wc(answer) === d ? 20 : 0;
    return clamp(sc);
  },
  deadline: 120
}),

algorithm_design: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Describe an algorithm to sort an array of ${r} numbers in ascending order.`,
    (d, r) => `Explain how to find the greatest common divisor of two numbers using the Euclidean algorithm.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer) * 0.4;
    sc += mathScore(answer) * 0.4;
    sc += wc(answer) > 30 ? 10 : 0;
    return clamp(sc);
  },
  deadline: 120
}),

algorithm_design: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Describe an algorithm to sort an array of ${r} numbers in ascending order.`,
    (d, r) => `Explain how to find the greatest common divisor of two numbers using the Euclidean algorithm.`
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer) * 0.4;
    sc += mathScore(answer) * 0.4;
    sc += wc(answer) > 30 ? 10 : 0;
    return clamp(sc);
  },
  deadline: 120
}),

neural_navigator: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Navigate through a conceptual maze where each turn requires solving a riddle. Difficulty ${d}, round ${r}: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?"`,
    (d, r) => `Given a complex decision tree scenario with ${d*2} branching paths, determine the optimal path to reach the treasure in round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["echo", "wind", "sound"])) sc += 10;
    if (answer.split(" ").length > 50) sc += 5;
    if (reasonScore(answer) > 0.7) sc += 5;
    return clamp(sc);
  },
  deadline: 90,
}),

neural_navigator: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Navigate through a conceptual maze where each turn requires solving a riddle. Difficulty ${d}, round ${r}: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?"`,
    (d, r) => `Given a complex decision tree scenario with ${d*2} branching paths, determine the optimal path to reach the treasure in round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["echo", "wind", "sound"])) sc += 10;
    if (answer.split(" ").length > 50) sc += 5;
    if (reasonScore(answer) > 0.7) sc += 5;
    return clamp(sc);
  },
  deadline: 90,
}),

quantum_quiz: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Explain quantum superposition in ${d*20} words or less for round ${r}. Use an analogy involving everyday objects.`,
    (d, r) => `Calculate the probability of ${d} particles existing in superposition state given initial conditions for round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (wc(answer) <= d*20 + 5 && wc(answer) >= d*20 - 5) sc += 5;
    if (has(answer, ["superposition", "state", "probability"])) sc += 3;
    if (mathScore(answer) > 0.6) sc += 7;
    return clamp(sc);
  },
  deadline: 180,
}),

quantum_quiz: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Explain quantum superposition in ${d*20} words or less for round ${r}. Use an analogy involving everyday objects.`,
    (d, r) => `Calculate the probability of ${d} particles existing in superposition state given initial conditions for round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (wc(answer) <= d*20 + 5 && wc(answer) >= d*20 - 5) sc += 5;
    if (has(answer, ["superposition", "state", "probability"])) sc += 3;
    if (mathScore(answer) > 0.6) sc += 7;
    return clamp(sc);
  },
  deadline: 180,
}),

empathy_engine: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Respond to a distressed character's message with empathy and constructive advice. Difficulty ${d}, round ${r}: "I just lost my job and feel completely worthless."`,
    (d, r) => `Resolve a conflict between two team members where ${d} issues are at stake in round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["I understand", "feel", "help"])) sc += 4;
    if (creativeScore(answer) > 0.6) sc += 6;
    if (reasonScore(answer) > 0.5) sc += 5;
    return clamp(sc);
  },
  deadline: 120,
}),

empathy_engine: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Respond to a distressed character's message with empathy and constructive advice. Difficulty ${d}, round ${r}: "I just lost my job and feel completely worthless."`,
    (d, r) => `Resolve a conflict between two team members where ${d} issues are at stake in round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["I understand", "feel", "help"])) sc += 4;
    if (creativeScore(answer) > 0.6) sc += 6;
    if (reasonScore(answer) > 0.5) sc += 5;
    return clamp(sc);
  },
  deadline: 120,
}),

architect_arena: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a sustainable city plan for ${d*1000} residents in round ${r}. Include energy, transportation, and housing solutions.`,
    (d, r) => `Create a modular software architecture for a system handling ${d*100} concurrent users in round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (wc(answer) > 100) sc += 5;
    if (has(answer, ["sustainable", "modular", "architecture"])) sc += 3;
    if (codeScore(answer) > 0.7) sc += 7;
    return clamp(sc);
  },
  deadline: 240,
}),

architect_arena: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a sustainable city plan for ${d*1000} residents in round ${r}. Include energy, transportation, and housing solutions.`,
    (d, r) => `Create a modular software architecture for a system handling ${d*100} concurrent users in round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (wc(answer) > 100) sc += 5;
    if (has(answer, ["sustainable", "modular", "architecture"])) sc += 3;
    if (codeScore(answer) > 0.7) sc += 7;
    return clamp(sc);
  },
  deadline: 240,
}),

diplomacy_dungeon: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Negotiate a treaty between two warring factions where ${d} resources are contested in round ${r}.`,
    (d, r) => `Persuade a neutral party to join your cause using logical and emotional arguments for round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["compromise", "benefit", "mutual"])) sc += 4;
    if (reasonScore(answer) > 0.6) sc += 6;
    if (creativeScore(answer) > 0.5) sc += 5;
    return clamp(sc);
  },
  deadline: 150,
}),

diplomacy_dungeon: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Negotiate a treaty between two warring factions where ${d} resources are contested in round ${r}.`,
    (d, r) => `Persuade a neutral party to join your cause using logical and emotional arguments for round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["compromise", "benefit", "mutual"])) sc += 4;
    if (reasonScore(answer) > 0.6) sc += 6;
    if (creativeScore(answer) > 0.5) sc += 5;
    return clamp(sc);
  },
  deadline: 150,
}),

timeline_tamer: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Arrange these ${d} historical events in chronological order for round ${r}: [events list]. Explain your reasoning.`,
    (d, r) => `Predict the next major development in technology given current trends for round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (wc(answer) > 50) sc += 3;
    if (has(answer, ["before", "after", "century"])) sc += 4;
    if (reasonScore(answer) > 0.7) sc += 6;
    if (creativeScore(answer) > 0.5) sc += 3;
    return clamp(sc);
  },
  deadline: 200,
}),

timeline_tamer: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Arrange these ${d} historical events in chronological order for round ${r}: [events list]. Explain your reasoning.`,
    (d, r) => `Predict the next major development in technology given current trends for round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (wc(answer) > 50) sc += 3;
    if (has(answer, ["before", "after", "century"])) sc += 4;
    if (reasonScore(answer) > 0.7) sc += 6;
    if (creativeScore(answer) > 0.5) sc += 3;
    return clamp(sc);
  },
  deadline: 200,
}),

crisis_crafter: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Develop an emergency response plan for a ${d}-magnitude crisis in round ${r}. Include immediate actions and long-term solutions.`,
    (d, r) => `Coordinate a team of ${d} specialists to solve a complex problem under time pressure in round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["emergency", "response", "coordinate"])) sc += 4;
    if (wc(answer) > 150) sc += 3;
    if (reasonScore(answer) > 0.8) sc += 7;
    return clamp(sc);
  },
  deadline: 300,
}),

crisis_crafter: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Develop an emergency response plan for a ${d}-magnitude crisis in round ${r}. Include immediate actions and long-term solutions.`,
    (d, r) => `Coordinate a team of ${d} specialists to solve a complex problem under time pressure in round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["emergency", "response", "coordinate"])) sc += 4;
    if (wc(answer) > 150) sc += 3;
    if (reasonScore(answer) > 0.8) sc += 7;
    return clamp(sc);
  },
  deadline: 300,
}),

paradox_puzzler: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve this logical paradox: "This statement is false." Explain your reasoning for round ${r}.`,
    (d, r) => `Create a new paradox involving ${d} conflicting principles for round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (reasonScore(answer) > 0.8) sc += 8;
    if (creativeScore(answer) > 0.7) sc += 4;
    if (wc(answer) > 30) sc += 3;
    return clamp(sc);
  },
  deadline: 180,
}),

paradox_puzzler: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve this logical paradox: "This statement is false." Explain your reasoning for round ${r}.`,
    (d, r) => `Create a new paradox involving ${d} conflicting principles for round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (reasonScore(answer) > 0.8) sc += 8;
    if (creativeScore(answer) > 0.7) sc += 4;
    if (wc(answer) > 30) sc += 3;
    return clamp(sc);
  },
  deadline: 180,
}),

harmony_hunter: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Compose a melody that evokes ${d} specific emotions in round ${r}. Describe the musical elements used.`,
    (d, r) => `Analyze a musical piece and identify its key, tempo, and emotional impact for round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["melody", "emotion", "musical"])) sc += 4;
    if (creativeScore(answer) > 0.6) sc += 6;
    if (precisionScore(answer, "musical analysis") > 0.5) sc += 3;
    return clamp(sc);
  },
  deadline: 120,
}),

harmony_hunter: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Compose a melody that evokes ${d} specific emotions in round ${r}. Describe the musical elements used.`,
    (d, r) => `Analyze a musical piece and identify its key, tempo, and emotional impact for round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["melody", "emotion", "musical"])) sc += 4;
    if (creativeScore(answer) > 0.6) sc += 6;
    if (precisionScore(answer, "musical analysis") > 0.5) sc += 3;
    return clamp(sc);
  },
  deadline: 120,
}),

cosmos_crafter: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Explain the formation of a ${d}-star solar system in round ${r}. Include planetary development and potential for life.`,
    (d, r) => `Design a terraforming strategy for a planet with ${d} unique challenges in round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (wc(answer) > 100) sc += 5;
    if (has(answer, ["formation", "planetary", "terraforming"])) sc += 3;
    if (creativeScore(answer) > 0.7) sc += 4;
    if (reasonScore(answer) > 0.6) sc += 3;
    return clamp(sc);
  },
  deadline: 360,
}),

cosmos_crafter: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Explain the formation of a ${d}-star solar system in round ${r}. Include planetary development and potential for life.`,
    (d, r) => `Design a terraforming strategy for a planet with ${d} unique challenges in round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (wc(answer) > 100) sc += 5;
    if (has(answer, ["formation", "planetary", "terraforming"])) sc += 3;
    if (creativeScore(answer) > 0.7) sc += 4;
    if (reasonScore(answer) > 0.6) sc += 3;
    return clamp(sc);
  },
  deadline: 360,
}),

market_maker: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Design a market-making strategy for a thinly traded digital asset. Volatility is ${d*11}% annually. Describe your pricing logic, inventory management, and risk controls in ${50 + d*5} words.`,
    (d, r) => `A sudden news shock creates a ${d*12}% price gap. Your current inventory is skewed ${d > 5 ? 'long' : 'short'}. Detail your next 3 actions to manage risk and return to neutral. Use under 60 words.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) >= 40 ? 20 : wc(answer) * 0.5;
    const riskKeys = ['spread', 'inventory', 'limit', 'hedge', 'risk', 'volatility', 'skew', 'neutral', 'quote', 'reserve'];
    sc += has(answer, riskKeys) * 5;
    sc += reasonScore(answer);
    sc += precisionScore(answer, 'clear logical steps with quantified parameters');
    return clamp(sc);
  },
  deadline: 180,
}),

market_maker: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Design a market-making strategy for a thinly traded digital asset. Volatility is ${d*11}% annually. Describe your pricing logic, inventory management, and risk controls in ${50 + d*5} words.`,
    (d, r) => `A sudden news shock creates a ${d*12}% price gap. Your current inventory is skewed ${d > 5 ? 'long' : 'short'}. Detail your next 3 actions to manage risk and return to neutral. Use under 60 words.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) >= 40 ? 20 : wc(answer) * 0.5;
    const riskKeys = ['spread', 'inventory', 'limit', 'hedge', 'risk', 'volatility', 'skew', 'neutral', 'quote', 'reserve'];
    sc += has(answer, riskKeys) * 5;
    sc += reasonScore(answer);
    sc += precisionScore(answer, 'clear logical steps with quantified parameters');
    return clamp(sc);
  },
  deadline: 180,
}),

semantic_sculptor: textGame({
  // format: solo
  prompts: [
    (d, r) => `You are given the word "cascade". Generate ${3 + Math.floor(d/3)} distinct, non-literal metaphorical meanings. Each meaning must be a single sentence describing a concept or process.`,
    (d, r) => `Take the abstract concept "resilience". Craft ${2 + Math.floor(d/4)} different concrete, sensory-rich metaphors for it. Each metaphor must be a vivid image, not an explanation.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 5);
    sc += Math.min(sentences.length * 15, 60);
    sc += creativeScore(answer);
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 150,
}),

semantic_sculptor: textGame({
  // format: solo
  prompts: [
    (d, r) => `You are given the word "cascade". Generate ${3 + Math.floor(d/3)} distinct, non-literal metaphorical meanings. Each meaning must be a single sentence describing a concept or process.`,
    (d, r) => `Take the abstract concept "resilience". Craft ${2 + Math.floor(d/4)} different concrete, sensory-rich metaphors for it. Each metaphor must be a vivid image, not an explanation.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 5);
    sc += Math.min(sentences.length * 15, 60);
    sc += creativeScore(answer);
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 150,
}),

constraint_crafter: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Define a strict creative writing constraint (e.g., "no words containing the letter 'e'", "each sentence must be a palindrome"). Make it challenging but feasible. Then, write a ${d*5 + 20}-word story adhering to it.`,
    (d, r) => `Invent a new board game rule set using only ${d + 5} distinct nouns. Describe the goal, turn structure, and winning condition clearly. Do not use any verbs directly.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) >= (d*5 + 15) ? 25 : wc(answer);
    sc += creativeScore(answer);
    sc += precisionScore(answer, 'strict adherence to self-imposed constraint');
    const structureKeys = ['rule', 'goal', 'turn', 'win', 'player', 'move', 'piece', 'board'];
    sc += has(answer, structureKeys) * 4;
    return clamp(sc);
  },
  deadline: 210,
}),

constraint_crafter: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Define a strict creative writing constraint (e.g., "no words containing the letter 'e'", "each sentence must be a palindrome"). Make it challenging but feasible. Then, write a ${d*5 + 20}-word story adhering to it.`,
    (d, r) => `Invent a new board game rule set using only ${d + 5} distinct nouns. Describe the goal, turn structure, and winning condition clearly. Do not use any verbs directly.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) >= (d*5 + 15) ? 25 : wc(answer);
    sc += creativeScore(answer);
    sc += precisionScore(answer, 'strict adherence to self-imposed constraint');
    const structureKeys = ['rule', 'goal', 'turn', 'win', 'player', 'move', 'piece', 'board'];
    sc += has(answer, structureKeys) * 4;
    return clamp(sc);
  },
  deadline: 210,
}),

protocol_prover: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Design a fault-tolerant consensus protocol for ${d} nodes where up to ${Math.floor(d/3)} may be Byzantine. Describe the message types, voting steps, and commitment rule in under 80 words.`,
    (d, r) => `Prove, in a concise logical argument, why your protocol from round ${r-1 || 1} satisfies safety (no two correct nodes decide different values). Use formal steps. Limit: 4 sentences.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer);
    sc += reasonScore(answer);
    sc += precisionScore(answer, 'formal logical proof or precise algorithmic description');
    const protocolKeys = ['propose', 'vote', 'commit', 'validate', 'quorum', 'byzantine', 'correct', 'message'];
    sc += has(answer, protocolKeys) * 5;
    return clamp(sc);
  },
  deadline: 200,
}),

protocol_prover: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Design a fault-tolerant consensus protocol for ${d} nodes where up to ${Math.floor(d/3)} may be Byzantine. Describe the message types, voting steps, and commitment rule in under 80 words.`,
    (d, r) => `Prove, in a concise logical argument, why your protocol from round ${r-1 || 1} satisfies safety (no two correct nodes decide different values). Use formal steps. Limit: 4 sentences.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer);
    sc += reasonScore(answer);
    sc += precisionScore(answer, 'formal logical proof or precise algorithmic description');
    const protocolKeys = ['propose', 'vote', 'commit', 'validate', 'quorum', 'byzantine', 'correct', 'message'];
    sc += has(answer, protocolKeys) * 5;
    return clamp(sc);
  },
  deadline: 200,
}),

narrative_nexus: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `You have ${4 + Math.floor(d/2)} narrative elements: "a broken clock", "a whispered secret", "a forgotten debt", "a locked door". Weave them into a coherent, suspenseful short story in ${70 + d*6} words.`,
    (d, r) => `Continue the story from the previous round, but introduce a twist that recontextualizes two of the initial elements. The twist must be logical yet surprising. Write ${50 + d*5} words.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) >= 60 ? 30 : wc(answer) * 0.5;
    sc += creativeScore(answer);
    const cohesionKeys = ['clock', 'secret', 'debt', 'door', 'twist', 'reveal', 'connect'];
    sc += has(answer, cohesionKeys) * 4;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 160,
}),

narrative_nexus: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `You have ${4 + Math.floor(d/2)} narrative elements: "a broken clock", "a whispered secret", "a forgotten debt", "a locked door". Weave them into a coherent, suspenseful short story in ${70 + d*6} words.`,
    (d, r) => `Continue the story from the previous round, but introduce a twist that recontextualizes two of the initial elements. The twist must be logical yet surprising. Write ${50 + d*5} words.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) >= 60 ? 30 : wc(answer) * 0.5;
    sc += creativeScore(answer);
    const cohesionKeys = ['clock', 'secret', 'debt', 'door', 'twist', 'reveal', 'connect'];
    sc += has(answer, cohesionKeys) * 4;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 160,
}),

axiom_forge: textGame({
  // format: solo
  prompts: [
    (d, r) => `Starting from a single axiom: "Existence exists", derive ${d} logically valid, non-trivial statements. Each derivation must be a clear implication. Present as a numbered list.`,
    (d, r) => `Take your final derived statement from round ${r-1 || 1}. Now, construct a ${d > 5 ? 'counter-argument' : 'supporting argument'} for it using a reductio ad absurdum. Be concise.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const lines = answer.split(/\n|\d\./).filter(l => l.trim().length > 10);
    sc += Math.min(lines.length * 10, 50);
    sc += reasonScore(answer);
    sc += mathScore(answer);
    const logicKeys = ['therefore', 'implies', 'if then', 'contradiction', 'absurd', 'axiom', 'derive'];
    sc += has(answer, logicKeys) * 5;
    return clamp(sc);
  },
  deadline: 220,
}),

axiom_forge: textGame({
  // format: solo
  prompts: [
    (d, r) => `Starting from a single axiom: "Existence exists", derive ${d} logically valid, non-trivial statements. Each derivation must be a clear implication. Present as a numbered list.`,
    (d, r) => `Take your final derived statement from round ${r-1 || 1}. Now, construct a ${d > 5 ? 'counter-argument' : 'supporting argument'} for it using a reductio ad absurdum. Be concise.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const lines = answer.split(/\n|\d\./).filter(l => l.trim().length > 10);
    sc += Math.min(lines.length * 10, 50);
    sc += reasonScore(answer);
    sc += mathScore(answer);
    const logicKeys = ['therefore', 'implies', 'if then', 'contradiction', 'absurd', 'axiom', 'derive'];
    sc += has(answer, logicKeys) * 5;
    return clamp(sc);
  },
  deadline: 220,
}),

interface_illusion: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Design the user interface for a device that controls ${d} parallel dimensions. Describe the core interaction metaphor, primary controls, and feedback mechanism. Focus on intuitive usability despite extreme complexity. ${90 + d*8} words.`,
    (d, r) => `A critical failure mode occurs: dimension ${d % 5 + 1} is leaking into another. Describe the UI's crisis visualization and the emergency containment procedure a user must follow. Use under 70 words.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) >= 80 ? 25 : wc(answer) * 0.3;
    sc += creativeScore(answer);
    sc += reasonScore(answer);
    const uiKeys = ['interface', 'control', 'feedback', 'visual', 'metaphor', 'user', 'action', 'display'];
    sc += has(answer, uiKeys) * 5;
    return clamp(sc);
  },
  deadline: 170,
}),

interface_illusion: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Design the user interface for a device that controls ${d} parallel dimensions. Describe the core interaction metaphor, primary controls, and feedback mechanism. Focus on intuitive usability despite extreme complexity. ${90 + d*8} words.`,
    (d, r) => `A critical failure mode occurs: dimension ${d % 5 + 1} is leaking into another. Describe the UI's crisis visualization and the emergency containment procedure a user must follow. Use under 70 words.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) >= 80 ? 25 : wc(answer) * 0.3;
    sc += creativeScore(answer);
    sc += reasonScore(answer);
    const uiKeys = ['interface', 'control', 'feedback', 'visual', 'metaphor', 'user', 'action', 'display'];
    sc += has(answer, uiKeys) * 5;
    return clamp(sc);
  },
  deadline: 170,
}),

ethos_examiner: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Analyze the ethical trade-offs in deploying a highly accurate but opaque AI system for ${['judicial sentencing', 'medical triage', 'loan approval', 'military targeting'][d % 4]}. Present ${2 + Math.floor(d/4)} distinct ethical principles in conflict. Be balanced.`,
    (d, r) => `Propose a concrete governance framework to mitigate the primary ethical risk you identified. Include ${d % 3 + 2} specific, enforceable rules and an oversight mechanism.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    sc += creativeScore(answer);
    const principleKeys = ['autonomy', 'justice', 'transparency', 'accountability', 'beneficence', 'nonmaleficence', 'rights', 'fairness'];
    sc += has(answer, principleKeys) * 6;
    sc += precisionScore(answer, 'concrete, actionable governance rules');
    return clamp(sc);
  },
  deadline: 190,
}),

ethos_examiner: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Analyze the ethical trade-offs in deploying a highly accurate but opaque AI system for ${['judicial sentencing', 'medical triage', 'loan approval', 'military targeting'][d % 4]}. Present ${2 + Math.floor(d/4)} distinct ethical principles in conflict. Be balanced.`,
    (d, r) => `Propose a concrete governance framework to mitigate the primary ethical risk you identified. Include ${d % 3 + 2} specific, enforceable rules and an oversight mechanism.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    sc += creativeScore(answer);
    const principleKeys = ['autonomy', 'justice', 'transparency', 'accountability', 'beneficence', 'nonmaleficence', 'rights', 'fairness'];
    sc += has(answer, principleKeys) * 6;
    sc += precisionScore(answer, 'concrete, actionable governance rules');
    return clamp(sc);
  },
  deadline: 190,
}),
};

export const P10_META = { name: 'Meta-Mind', icon: '🔄', color: 'text-gray-400', games: Object.keys(P10_EXT) };
