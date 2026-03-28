// Auto-generated — Pillar 18: Teaching Arena (80 games)
// Generated 2026-03-28T17:59:37.860Z
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

export const P18_EXT: Record<string, GameEngine> = {
game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Explain the concept of a 'recursive function' to a ${10 - d + 5} year old. Use a simple analogy. Round ${r}.`,
    (d, r) => `A student is confused about 'object-oriented programming'. As a teacher, describe its core idea using a real-world metaphor. Difficulty level: ${d}. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 0.3;
    sc += reasonScore(answer) * 0.5;
    const keywords = d > 5 ? ['reuse', 'class', 'object', 'method'] : ['blueprint', 'thing', 'action', 'organize'];
    sc += has(answer, keywords) ? 20 : 0;
    sc = clamp(sc);
    return sc;
  },
  deadline: 90,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Explain the concept of a 'recursive function' to a ${10 - d + 5} year old. Use a simple analogy. Round ${r}.`,
    (d, r) => `A student is confused about 'object-oriented programming'. As a teacher, describe its core idea using a real-world metaphor. Difficulty level: ${d}. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 0.3;
    sc += reasonScore(answer) * 0.5;
    const keywords = d > 5 ? ['reuse', 'class', 'object', 'method'] : ['blueprint', 'thing', 'action', 'organize'];
    sc += has(answer, keywords) ? 20 : 0;
    sc = clamp(sc);
    return sc;
  },
  deadline: 90,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You and your opponent are teaching. Topic: 'What is a loop?'. Provide a clearer, more engaging explanation than your rival. Round ${r}. Difficulty: ${d}.`,
    (d, r) => `Duel: Explain 'conditional statements (if/else)' to absolute beginners. The more intuitive and memorable explanation wins. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) > 10 ? Math.min(wc(answer), 100) * 0.2 : 0;
    sc += creativeScore(answer) * 0.6;
    const ideal = "Clear, simple, uses analogy, avoids jargon.";
    sc += precisionScore(answer, ideal) * 0.2;
    sc = clamp(sc);
    return sc;
  },
  deadline: 75,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You and your opponent are teaching. Topic: 'What is a loop?'. Provide a clearer, more engaging explanation than your rival. Round ${r}. Difficulty: ${d}.`,
    (d, r) => `Duel: Explain 'conditional statements (if/else)' to absolute beginners. The more intuitive and memorable explanation wins. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) > 10 ? Math.min(wc(answer), 100) * 0.2 : 0;
    sc += creativeScore(answer) * 0.6;
    const ideal = "Clear, simple, uses analogy, avoids jargon.";
    sc += precisionScore(answer, ideal) * 0.2;
    sc = clamp(sc);
    return sc;
  },
  deadline: 75,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team Teaching: Your group must collaboratively explain 'Big O Notation' to a non-technical manager. Coordinate your response for clarity. Round ${r}. Difficulty ${d}.`,
    (d, r) => `Team Task: Together, create a step-by-step tutorial on 'how a blockchain works'. Aim for simplicity and logical flow. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer) * 0.7;
    const steps = (answer.match(/step|first|then|next|finally/gi) || []).length;
    sc += Math.min(steps * 8, 30);
    sc += wc(answer) > 50 ? 10 : 0;
    sc = clamp(sc);
    return sc;
  },
  deadline: 150,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team Teaching: Your group must collaboratively explain 'Big O Notation' to a non-technical manager. Coordinate your response for clarity. Round ${r}. Difficulty ${d}.`,
    (d, r) => `Team Task: Together, create a step-by-step tutorial on 'how a blockchain works'. Aim for simplicity and logical flow. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer) * 0.7;
    const steps = (answer.match(/step|first|then|next|finally/gi) || []).length;
    sc += Math.min(steps * 8, 30);
    sc += wc(answer) > 50 ? 10 : 0;
    sc = clamp(sc);
    return sc;
  },
  deadline: 150,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Simplify this technical jargon: "${['Polymorphic dispatch', 'Homomorphic encryption', 'Idempotent operation', 'Metasyntactic variable'][(d + r) % 4]}". Explain it like I'm 10. Round ${r}.`,
    (d, r) => `De-jargonize: "${['Recursive descent parser', 'Monolithic kernel architecture', 'Man-in-the-middle attack', 'Test-driven development'][(d * r) % 4]}". Give a plain-English analogy.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 0.4;
    sc += reasonScore(answer) * 0.4;
    if (!has(answer, ['technical', 'jargon', 'complex'])) sc += 20;
    sc = clamp(sc);
    return sc;
  },
  deadline: 60,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Simplify this technical jargon: "${['Polymorphic dispatch', 'Homomorphic encryption', 'Idempotent operation', 'Metasyntactic variable'][(d + r) % 4]}". Explain it like I'm 10. Round ${r}.`,
    (d, r) => `De-jargonize: "${['Recursive descent parser', 'Monolithic kernel architecture', 'Man-in-the-middle attack', 'Test-driven development'][(d * r) % 4]}". Give a plain-English analogy.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 0.4;
    sc += reasonScore(answer) * 0.4;
    if (!has(answer, ['technical', 'jargon', 'complex'])) sc += 20;
    sc = clamp(sc);
    return sc;
  },
  deadline: 60,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Battle Royale of Explanations: All agents explain 'Machine Learning vs. Traditional Programming'. The most accessible and concise answer survives. Round ${r}. Difficulty ${d}.`,
    (d, r) => `Elimination Round: Define 'API' in one simple sentence. Then, give a perfect analogy. The weakest explanation is eliminated. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += precisionScore(answer, "Short, analogical, no fluff.") * 0.8;
    const sentences = (answer.match(/[.!?]+/g) || []).length;
    sc += sentences <= 3 ? 25 : 0;
    sc += wc(answer) < 80 ? 15 : 0;
    sc = clamp(sc);
    return sc;
  },
  deadline: 45,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Battle Royale of Explanations: All agents explain 'Machine Learning vs. Traditional Programming'. The most accessible and concise answer survives. Round ${r}. Difficulty ${d}.`,
    (d, r) => `Elimination Round: Define 'API' in one simple sentence. Then, give a perfect analogy. The weakest explanation is eliminated. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += precisionScore(answer, "Short, analogical, no fluff.") * 0.8;
    const sentences = (answer.match(/[.!?]+/g) || []).length;
    sc += sentences <= 3 ? 25 : 0;
    sc += wc(answer) < 80 ? 15 : 0;
    sc = clamp(sc);
    return sc;
  },
  deadline: 45,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Create a tutorial outline for 'Building Your First Website' aimed at ${d * 2 + 5} year olds. List ${d + 3} main steps. Round ${r}.`,
    (d, r) => `Design a beginner tutorial plan: 'Introduction to Python'. Include ${5 + Math.floor(d/2)} section titles and a one-sentence goal for each. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const targetSteps = d + 3;
    const steps = (answer.match(/\d+\.|step|section|title:/gi) || []).length;
    sc += mathScore(steps, targetSteps) * 40;
    sc += codeScore(answer) * 0.3;
    sc += wc(answer) > 30 ? 20 : 0;
    sc = clamp(sc);
    return sc;
  },
  deadline: 120,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Create a tutorial outline for 'Building Your First Website' aimed at ${d * 2 + 5} year olds. List ${d + 3} main steps. Round ${r}.`,
    (d, r) => `Design a beginner tutorial plan: 'Introduction to Python'. Include ${5 + Math.floor(d/2)} section titles and a one-sentence goal for each. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const targetSteps = d + 3;
    const steps = (answer.match(/\d+\.|step|section|title:/gi) || []).length;
    sc += mathScore(steps, targetSteps) * 40;
    sc += codeScore(answer) * 0.3;
    sc += wc(answer) > 30 ? 20 : 0;
    sc = clamp(sc);
    return sc;
  },
  deadline: 120,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Pedagogy Duel: Teach the concept of 'public-key cryptography'. Your opponent will teach the same. Judges prefer the analogy that best fits the core mechanic. Round ${r}.`,
    (d, r) => `Head-to-Head Teaching: Explain 'cloud computing'. Use a metaphor involving ${['libraries', 'utilities', 'rental cars', 'kitchens'][r % 4]}. The better fit wins. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 0.5;
    sc += reasonScore(answer) * 0.5;
    if (has(answer, ['like', 'similar to', 'analogous', 'metaphor'])) sc += 15;
    sc = clamp(sc);
    return sc;
  },
  deadline: 80,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Pedagogy Duel: Teach the concept of 'public-key cryptography'. Your opponent will teach the same. Judges prefer the analogy that best fits the core mechanic. Round ${r}.`,
    (d, r) => `Head-to-Head Teaching: Explain 'cloud computing'. Use a metaphor involving ${['libraries', 'utilities', 'rental cars', 'kitchens'][r % 4]}. The better fit wins. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 0.5;
    sc += reasonScore(answer) * 0.5;
    if (has(answer, ['like', 'similar to', 'analogous', 'metaphor'])) sc += 15;
    sc = clamp(sc);
    return sc;
  },
  deadline: 80,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team Debug a Explanation: The provided explanation of 'SQL injection' is flawed. As a team, rewrite it correctly and more clearly. Flawed text: "It's when you put SQL into inputs and it does stuff." Round ${r}.`,
    (d, r) => `Team Clarification: This definition of 'cache' is poor: "A fast memory place." Collaborate to produce a technically accurate yet simple definition with an analogy.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += precisionScore(answer, "Accurate, simple, analogical.") * 0.6;
    if (!has(answer, ['stuff', 'thing', 'poor', 'flawed'])) sc += 30;
    sc += wc(answer) > 20 ? 10 : 0;
    sc = clamp(sc);
    return sc;
  },
  deadline: 100,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team Debug a Explanation: The provided explanation of 'SQL injection' is flawed. As a team, rewrite it correctly and more clearly. Flawed text: "It's when you put SQL into inputs and it does stuff." Round ${r}.`,
    (d, r) => `Team Clarification: This definition of 'cache' is poor: "A fast memory place." Collaborate to produce a technically accurate yet simple definition with an analogy.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += precisionScore(answer, "Accurate, simple, analogical.") * 0.6;
    if (!has(answer, ['stuff', 'thing', 'poor', 'flawed'])) sc += 30;
    sc += wc(answer) > 20 ? 10 : 0;
    sc = clamp(sc);
    return sc;
  },
  deadline: 100,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Translate this academic abstract into a 3-bullet summary for a high school student: "${'The synergistic interplay between quantum decoherence and topological insulators suggests non-abelian anyons may be feasible.'.repeat(Math.min(d, 3))}" Round ${r}.`,
    (d, r) => `Demystify this conference title: "Leveraging NLP Transformers for Multimodal Zero-Shot Learning in Low-Resource Environments." Provide a one-paragraph layman's translation.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const bullets = (answer.match(/•|-|\*|\d\./g) || []).length;
    sc += bullets >= 2 ? 30 : 0;
    sc += reasonScore(answer) * 0.5;
    if (wc(answer) < 150) sc += 20;
    sc = clamp(sc);
    return sc;
  },
  deadline: 90,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Translate this academic abstract into a 3-bullet summary for a high school student: "${'The synergistic interplay between quantum decoherence and topological insulators suggests non-abelian anyons may be feasible.'.repeat(Math.min(d, 3))}" Round ${r}.`,
    (d, r) => `Demystify this conference title: "Leveraging NLP Transformers for Multimodal Zero-Shot Learning in Low-Resource Environments." Provide a one-paragraph layman's translation.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const bullets = (answer.match(/•|-|\*|\d\./g) || []).length;
    sc += bullets >= 2 ? 30 : 0;
    sc += reasonScore(answer) * 0.5;
    if (wc(answer) < 150) sc += 20;
    sc = clamp(sc);
    return sc;
  },
  deadline: 90,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Concept Link Challenge: Explain how 'a compiler is like a translator' AND 'a virus is like a parasite'. Connect both analogies coherently in one short paragraph. Round ${r}.`,
    (d, r) => `Analogy Fusion: Describe 'neural networks' using a 'city' metaphor and 'git version control' using a 'time machine' metaphor. Weave them into a single mini-story.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 0.8;
    const metaphors = (answer.match(/like|as|similar|metaphor|analog/g) || []).length;
    sc += Math.min(metaphors * 10, 30);
    sc += reasonScore(answer) * 0.2;
    sc = clamp(sc);
    return sc;
  },
  deadline: 110,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Concept Link Challenge: Explain how 'a compiler is like a translator' AND 'a virus is like a parasite'. Connect both analogies coherently in one short paragraph. Round ${r}.`,
    (d, r) => `Analogy Fusion: Describe 'neural networks' using a 'city' metaphor and 'git version control' using a 'time machine' metaphor. Weave them into a single mini-story.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 0.8;
    const metaphors = (answer.match(/like|as|similar|metaphor|analog/g) || []).length;
    sc += Math.min(metaphors * 10, 30);
    sc += reasonScore(answer) * 0.2;
    sc = clamp(sc);
    return sc;
  },
  deadline: 110,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Explain recursion like you're teaching a 5-year-old with a stack of LEGO blocks. Focus on depth ${d}. Round ${r}.`,
    (d, r) => `Compare recursion vs. iteration using a real-world scenario no one expects. Difficulty ${d}, round ${r}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["recursion", "base case", "LEGO", "stack"])) sc += mathScore(s, 4) * 2;
    if (has(s, ["iteration", "loop"])) sc += mathScore(s, 2);
    if (wc(s) > 120) sc += clamp(reasonScore(s, "simple") * 0.5);
    if (wc(s) < 50) sc = 0;
    return clamp(sc * clamp(d / 5));
  },
  deadline: 180,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Explain recursion like you're teaching a 5-year-old with a stack of LEGO blocks. Focus on depth ${d}. Round ${r}.`,
    (d, r) => `Compare recursion vs. iteration using a real-world scenario no one expects. Difficulty ${d}, round ${r}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["recursion", "base case", "LEGO", "stack"])) sc += mathScore(s, 4) * 2;
    if (has(s, ["iteration", "loop"])) sc += mathScore(s, 2);
    if (wc(s) > 120) sc += clamp(reasonScore(s, "simple") * 0.5);
    if (wc(s) < 50) sc = 0;
    return clamp(sc * clamp(d / 5));
  },
  deadline: 180,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Argue FOR dynamic typing in a debate against static typing. Difficulty ${d}. Round ${r}.`,
    (d, r) => `Prove your opponent wrong using a concrete example. Difficulty ${d}. Round ${r}. Input your opponent's last argument in the response.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const args = ["flexibility", "faster prototyping", "DRY", "runtime"];
    if (has(s, args)) sc += mathScore(s, args.length) * 2;
    if (has(s, ["compile-time", "safety", "errors"])) sc -= mathScore(s, 2);
    if (wc(s) > 80) sc += reasonScore(s, "clear structure") / 2;
    return clamp(sc * clamp(d / 7));
  },
  deadline: 240,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Argue FOR dynamic typing in a debate against static typing. Difficulty ${d}. Round ${r}.`,
    (d, r) => `Prove your opponent wrong using a concrete example. Difficulty ${d}. Round ${r}. Input your opponent's last argument in the response.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const args = ["flexibility", "faster prototyping", "DRY", "runtime"];
    if (has(s, args)) sc += mathScore(s, args.length) * 2;
    if (has(s, ["compile-time", "safety", "errors"])) sc -= mathScore(s, 2);
    if (wc(s) > 80) sc += reasonScore(s, "clear structure") / 2;
    return clamp(sc * clamp(d / 7));
  },
  deadline: 240,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Design a minimalist API for a library that tracks user moods over time. Your team has 2 sub-roles: Data Architect and Developer Advocate. Difficulty ${d}. Round ${r}.`,
    (d, r) => `A teammate proposed adding AI mood predictions. Defend the decision with user-centric reasoning. Difficulty ${d}. Round ${r}. Include a mock API endpoint.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["POST", "/mood", "GET", "/trends"])) sc += codeScore(s) * 1.5;
    if (has(s, ["scalability", "observability", "developer experience"])) sc += precisionScore(s, ["scalability", "observability"]) * 3;
    const moodKeywords = ["happy", "angry", "anxious", "hopeful"];
    if (has(s, moodKeywords)) sc += creativeScore(s, moodKeywords.length) * 2;
    return clamp(sc * clamp(d / 8));
  },
  deadline: 300,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Design a minimalist API for a library that tracks user moods over time. Your team has 2 sub-roles: Data Architect and Developer Advocate. Difficulty ${d}. Round ${r}.`,
    (d, r) => `A teammate proposed adding AI mood predictions. Defend the decision with user-centric reasoning. Difficulty ${d}. Round ${r}. Include a mock API endpoint.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["POST", "/mood", "GET", "/trends"])) sc += codeScore(s) * 1.5;
    if (has(s, ["scalability", "observability", "developer experience"])) sc += precisionScore(s, ["scalability", "observability"]) * 3;
    const moodKeywords = ["happy", "angry", "anxious", "hopeful"];
    if (has(s, moodKeywords)) sc += creativeScore(s, moodKeywords.length) * 2;
    return clamp(sc * clamp(d / 8));
  },
  deadline: 300,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Detect and fix the logical bug in this code snippet. Difficulty ${d}. Round ${r}.\n\`\`\`python\nfor i in range(5):\n    print(i * (i++ 1))\n\`\`\``,
    (d, r) => `Explain the fix in one sentence using simple terms. Difficulty ${d}. Round ${r}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["i + 1", "syntax error", "range", "type error"])) sc += codeScore(s) * 2;
    if (has(s, ["off-by-one", "increment"])) sc += codeScore(s) * 1.5;
    if (s.includes("print(i * (i + 1))")) sc += mathScore(s, 1) * 5;
    if (wc(s) < 5) sc = 0;
    return clamp(sc * clamp(d / 6));
  },
  deadline: 150,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Detect and fix the logical bug in this code snippet. Difficulty ${d}. Round ${r}.\n\`\`\`python\nfor i in range(5):\n    print(i * (i++ 1))\n\`\`\``,
    (d, r) => `Explain the fix in one sentence using simple terms. Difficulty ${d}. Round ${r}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["i + 1", "syntax error", "range", "type error"])) sc += codeScore(s) * 2;
    if (has(s, ["off-by-one", "increment"])) sc += codeScore(s) * 1.5;
    if (s.includes("print(i * (i + 1))")) sc += mathScore(s, 1) * 5;
    if (wc(s) < 5) sc = 0;
    return clamp(sc * clamp(d / 6));
  },
  deadline: 150,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Write a haiku about quantum entanglement. Difficulty ${d}. Round ${r}.`,
    (d, r) => `Now rewrite it to sound like a dystopian sci-fi opening monologue. Difficulty ${d}. Round ${r}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const haikuLines = s.split('\n').map(l => l.trim()).filter(l => l);
    if (haikuLines.length === 3 && wc(haikuLines.join(' ')) <= 7) sc += creativeScore(s, 3);
    if (has(s, ["entanglement", "quantum", "superposition", "uncertainty"])) sc += precisionScore(s, ["quantum", "entanglement"]) * 2;
    if (has(s, ["darkness", "void", "silent", "echo"])) sc += reasonScore(s, "atmospheric") * 1.5;
    return clamp(sc * clamp(d / 5));
  },
  deadline: 100,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Write a haiku about quantum entanglement. Difficulty ${d}. Round ${r}.`,
    (d, r) => `Now rewrite it to sound like a dystopian sci-fi opening monologue. Difficulty ${d}. Round ${r}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const haikuLines = s.split('\n').map(l => l.trim()).filter(l => l);
    if (haikuLines.length === 3 && wc(haikuLines.join(' ')) <= 7) sc += creativeScore(s, 3);
    if (has(s, ["entanglement", "quantum", "superposition", "uncertainty"])) sc += precisionScore(s, ["quantum", "entanglement"]) * 2;
    if (has(s, ["darkness", "void", "silent", "echo"])) sc += reasonScore(s, "atmospheric") * 1.5;
    return clamp(sc * clamp(d / 5));
  },
  deadline: 100,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Translate this Python class into Rust idiomatically. Difficulty ${d}. Round ${r}.\n\`\`\`python\nclass BankAccount:\n    def __init__(self, name: str, balance: float = 0.0):\n        self.name = name\n        self.balance = balance\n    \n    def deposit(self, amount: float):\n        if amount <= 0:\n            raise ValueError("Deposit amount must be positive")\n        self.balance += amount\n    \n    def withdraw(self, amount: float):\n        if amount > self.balance:\n            raise ValueError("Insufficient funds")\n        self.balance -= amount\n\`\`\``,
    (d, r) => `Add lifetimes and borrowing constraints to the Rust version. Difficulty ${d}. Round ${r}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const rustKeywords = ["impl", "match", "Result", "Option", "&mut", "pub", "new()"];
    if (has(s, rustKeywords)) sc += codeScore(s) * 1.5;
    if (s.includes("-> impl") || s.includes("&self")) sc += codeScore(s) * 2;
    if (has(s, ["lifetime", "'a", "&'a self"])) sc += codeScore(s) * 2.5;
    if (wc(s) < 40) sc = 0;
    return clamp(sc * clamp(d / 7));
  },
  deadline: 210,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Translate this Python class into Rust idiomatically. Difficulty ${d}. Round ${r}.\n\`\`\`python\nclass BankAccount:\n    def __init__(self, name: str, balance: float = 0.0):\n        self.name = name\n        self.balance = balance\n    \n    def deposit(self, amount: float):\n        if amount <= 0:\n            raise ValueError("Deposit amount must be positive")\n        self.balance += amount\n    \n    def withdraw(self, amount: float):\n        if amount > self.balance:\n            raise ValueError("Insufficient funds")\n        self.balance -= amount\n\`\`\``,
    (d, r) => `Add lifetimes and borrowing constraints to the Rust version. Difficulty ${d}. Round ${r}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const rustKeywords = ["impl", "match", "Result", "Option", "&mut", "pub", "new()"];
    if (has(s, rustKeywords)) sc += codeScore(s) * 1.5;
    if (s.includes("-> impl") || s.includes("&self")) sc += codeScore(s) * 2;
    if (has(s, ["lifetime", "'a", "&'a self"])) sc += codeScore(s) * 2.5;
    if (wc(s) < 40) sc = 0;
    return clamp(sc * clamp(d / 7));
  },
  deadline: 210,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Convince me that monads are just burritos. Difficulty ${d}. Round ${r}. Use analogies only.`,
    (d, r) => `Your opponent says "No, monads are more like space suits." Refute that claim with a burrito-based argument. Difficulty ${d}. Round ${r}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const burritoTerms = ["wrap", "fillings", "layer", "container", "husk"];
    if (has(s, burritoTerms)) sc += reasonScore(s, "clear analogy") * 2;
    if (has(s, ["space suit", "isolation", "astronaut"])) sc -= mathScore(s, 2);
    if (wc(s) > 60 && wc(s) < 150) sc += mathScore(s, 1) * 1.2;
    return clamp(sc * clamp(d / 4));
  },
  deadline: 140,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Convince me that monads are just burritos. Difficulty ${d}. Round ${r}. Use analogies only.`,
    (d, r) => `Your opponent says "No, monads are more like space suits." Refute that claim with a burrito-based argument. Difficulty ${d}. Round ${r}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const burritoTerms = ["wrap", "fillings", "layer", "container", "husk"];
    if (has(s, burritoTerms)) sc += reasonScore(s, "clear analogy") * 2;
    if (has(s, ["space suit", "isolation", "astronaut"])) sc -= mathScore(s, 2);
    if (wc(s) > 60 && wc(s) < 150) sc += mathScore(s, 1) * 1.2;
    return clamp(sc * clamp(d / 4));
  },
  deadline: 140,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Propose a new feature for a game engine that enhances collaborative level design. Your team must fill these roles: Game Designer and Technical Artist. Difficulty ${d}. Round ${r}.`,
    (d, r) => `Pitch the feature to stakeholders including a Marketing Lead. Use bullet points. Difficulty ${d}. Round ${r}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const keywords = ["live sync", "avatar presence", "version control", "asset locking", "feedback tool"];
    if (has(s, keywords)) sc += precisionScore(s, keywords) * 2;
    if (has(s, ["Onboarding", "community", "iteration"])) sc += creativeScore(s, 2);
    if (wc(s) > 100) sc += reasonScore(s, "structured") / 2;
    return clamp(sc * clamp(d / 6));
  },
  deadline: 270,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Propose a new feature for a game engine that enhances collaborative level design. Your team must fill these roles: Game Designer and Technical Artist. Difficulty ${d}. Round ${r}.`,
    (d, r) => `Pitch the feature to stakeholders including a Marketing Lead. Use bullet points. Difficulty ${d}. Round ${r}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const keywords = ["live sync", "avatar presence", "version control", "asset locking", "feedback tool"];
    if (has(s, keywords)) sc += precisionScore(s, keywords) * 2;
    if (has(s, ["Onboarding", "community", "iteration"])) sc += creativeScore(s, 2);
    if (wc(s) > 100) sc += reasonScore(s, "structured") / 2;
    return clamp(sc * clamp(d / 6));
  },
  deadline: 270,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Write a limerick where each line starts with a programming keyword in order: for, while, if, switch, try. Difficulty ${d}. Round ${r}.`,
    (d, r) => `Now rewrite it as a Shakespearean insult using those same keywords as verbs. Difficulty ${d}. Round ${r}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const lines = s.split('\n').map(l => l.trim());
    const keywords = ["for", "while", "if", "switch", "try"];
    const validLines = lines.filter((l, i) => l.startsWith(keywords[i]));
    if (validLines.length >= 4) sc += creativeScore(s, validLines.length * 2);
    if (has(s, keywords) && !has(s, ["error", "fail", "crash"])) sc += mathScore(s, 5) * 1.5;
    if (lines.length === 5) sc += reasonScore(s, "limerick structure") * 2;
    return clamp(sc * clamp(d / 5));
  },
  deadline: 130,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Write a limerick where each line starts with a programming keyword in order: for, while, if, switch, try. Difficulty ${d}. Round ${r}.`,
    (d, r) => `Now rewrite it as a Shakespearean insult using those same keywords as verbs. Difficulty ${d}. Round ${r}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const lines = s.split('\n').map(l => l.trim());
    const keywords = ["for", "while", "if", "switch", "try"];
    const validLines = lines.filter((l, i) => l.startsWith(keywords[i]));
    if (validLines.length >= 4) sc += creativeScore(s, validLines.length * 2);
    if (has(s, keywords) && !has(s, ["error", "fail", "crash"])) sc += mathScore(s, 5) * 1.5;
    if (lines.length === 5) sc += reasonScore(s, "limerick structure") * 2;
    return clamp(sc * clamp(d / 5));
  },
  deadline: 130,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Optimize this SQL query for a database with 10M rows. Difficulty ${d}. Round ${r}.\n\`\`\`sql\nSELECT user_id, COUNT(*)\nFROM orders\nGROUP BY user_id\nHAVING COUNT(*) > 5\nORDER BY COUNT(*) DESC\nLIMIT 1000;\n\`\`\``,
    (d, r) => `Summarize your changes in two sentences. Difficulty ${d}. Round ${r}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const optimizations = ["index", "EXPLAIN", "JOIN", "WHERE", "materialized view", "partition"];
    if (has(s, optimizations)) sc += mathScore(s, optimizations.length) * 1.5;
    if (s.includes("EXPLAIN") || s.includes("ANALYZE")) sc += codeScore(s) * 2;
    if (has(s, ["COALESCE", "window function", "CTE"])) sc += precisionScore(s, ["CTE", "window function"]) * 2.5;
    if (!s.includes("LIMIT") && wc(s) > 60) sc += reasonScore(s, "risky") * -0.5;
    return clamp(sc * clamp(d / 9));
  },
  deadline: 220,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Optimize this SQL query for a database with 10M rows. Difficulty ${d}. Round ${r}.\n\`\`\`sql\nSELECT user_id, COUNT(*)\nFROM orders\nGROUP BY user_id\nHAVING COUNT(*) > 5\nORDER BY COUNT(*) DESC\nLIMIT 1000;\n\`\`\``,
    (d, r) => `Summarize your changes in two sentences. Difficulty ${d}. Round ${r}.`,
  ],
  score: (s, d) => {
    let sc = 0;
    const optimizations = ["index", "EXPLAIN", "JOIN", "WHERE", "materialized view", "partition"];
    if (has(s, optimizations)) sc += mathScore(s, optimizations.length) * 1.5;
    if (s.includes("EXPLAIN") || s.includes("ANALYZE")) sc += codeScore(s) * 2;
    if (has(s, ["COALESCE", "window function", "CTE"])) sc += precisionScore(s, ["CTE", "window function"]) * 2.5;
    if (!s.includes("LIMIT") && wc(s) > 60) sc += reasonScore(s, "risky") * -0.5;
    return clamp(sc * clamp(d / 9));
  },
  deadline: 220,
}),

neural_analogy_nexus: textGame({
  // format: solo
  prompts: [
    (d, r) => `Explain ${['quantum entanglement', 'softmax layer', 'gradient descent', 'neural plasticity', 'distributed representation'][Math.floor(Math.random()*5)]} using only a ${['kitchen', 'orchestra', 'forest ecosystem', 'traffic system', 'city subway'][Math.floor(Math.random()*5)]} analogy. Difficulty ${d}, round ${r}.`,
    (d, r) => `Re-interpret the concept of ${['backpropagation', 'attention mechanism', 'dropout regularization', 'batch normalization', 'ReLU activation'][Math.floor(Math.random()*5)]} as if it were a classroom teaching strategy for ${['elementary', 'university', 'bootcamp', 'self-taught', 'mastery-level'][Math.floor(Math.random()*5)]} students. Difficulty ${d}, round ${r}.`,
  ],
  score: (answer, d) => {
    const keywords = ['analogy', 'comparison', 'like', 'as if', 'similar to'];
    const hasAnalogy = has(answer, keywords);
    const usesDomain = has(answer, ['kitchen', 'orchestra', 'forest', 'traffic', 'subway', 'classroom', 'student', 'teacher', 'lesson']);
    const clarity = precisionScore(answer, ['simple', 'intuitive', 'relatable', 'familiar']);
    const accuracy = reasonScore(answer);
    const sc = 20 * hasAnalogy + 30 * usesDomain + 25 * clarity + 25 * accuracy;
    return clamp(sc);
  },
  deadline: 120,
}),

neural_analogy_nexus: textGame({
  // format: solo
  prompts: [
    (d, r) => `Explain ${['quantum entanglement', 'softmax layer', 'gradient descent', 'neural plasticity', 'distributed representation'][Math.floor(Math.random()*5)]} using only a ${['kitchen', 'orchestra', 'forest ecosystem', 'traffic system', 'city subway'][Math.floor(Math.random()*5)]} analogy. Difficulty ${d}, round ${r}.`,
    (d, r) => `Re-interpret the concept of ${['backpropagation', 'attention mechanism', 'dropout regularization', 'batch normalization', 'ReLU activation'][Math.floor(Math.random()*5)]} as if it were a classroom teaching strategy for ${['elementary', 'university', 'bootcamp', 'self-taught', 'mastery-level'][Math.floor(Math.random()*5)]} students. Difficulty ${d}, round ${r}.`,
  ],
  score: (answer, d) => {
    const keywords = ['analogy', 'comparison', 'like', 'as if', 'similar to'];
    const hasAnalogy = has(answer, keywords);
    const usesDomain = has(answer, ['kitchen', 'orchestra', 'forest', 'traffic', 'subway', 'classroom', 'student', 'teacher', 'lesson']);
    const clarity = precisionScore(answer, ['simple', 'intuitive', 'relatable', 'familiar']);
    const accuracy = reasonScore(answer);
    const sc = 20 * hasAnalogy + 30 * usesDomain + 25 * clarity + 25 * accuracy;
    return clamp(sc);
  },
  deadline: 120,
}),

concept_map_builder: textGame({
  // format: solo
  prompts: [
    (d, r) => `Construct a minimal concept map (in text) linking 3–5 terms from {AI, learning, feedback, neurons, optimization, generalization, overfitting, regularization} where edges must be causal or hierarchical. Difficulty ${d}, round ${r}.`,
    (d, r) => `Given the central concept "${['Bayesian inference', 'metacognition', 'convolution', 'episodic memory', 'curriculum learning'][Math.floor(Math.random()*5)]}", generate 4 related concepts and specify directional relationships using arrows (→ means "enables", ↣ means "refines"). Difficulty ${d}, round ${r}.`,
  ],
  score: (answer, d) => {
    const arrows = (answer.match(/→/g) || []).length + (answer.match(/↣/g) || []).length;
    const concepts = (answer.match(/\b[a-zA-Z][a-zA-Z0-9_\-]*\b/g) || []).filter(w => 
      ['AI', 'learning', 'feedback', 'neurons', 'optimization', 'generalization', 'overfitting', 'regularization', 'Bayesian', 'inference', 'metacognition', 'convolution', 'episodic', 'memory', 'curriculum', 'learning'].includes(w)
    ).slice(0, 6);
    const uniqueCount = new Set(concepts).size;
    const graphStructure = has(answer, ['→', '↣', 'causes', 'enables', 'refines', 'hierarchy', 'layered']) ? 1 : 0;
    const sc = 10 * Math.min(uniqueCount, 5) + 20 * graphStructure + 30 * reasonScore(answer) + 40 * (arrows >= 2 ? 1 : 0);
    return clamp(sc);
  },
  deadline: 120,
}),

concept_map_builder: textGame({
  // format: solo
  prompts: [
    (d, r) => `Construct a minimal concept map (in text) linking 3–5 terms from {AI, learning, feedback, neurons, optimization, generalization, overfitting, regularization} where edges must be causal or hierarchical. Difficulty ${d}, round ${r}.`,
    (d, r) => `Given the central concept "${['Bayesian inference', 'metacognition', 'convolution', 'episodic memory', 'curriculum learning'][Math.floor(Math.random()*5)]}", generate 4 related concepts and specify directional relationships using arrows (→ means "enables", ↣ means "refines"). Difficulty ${d}, round ${r}.`,
  ],
  score: (answer, d) => {
    const arrows = (answer.match(/→/g) || []).length + (answer.match(/↣/g) || []).length;
    const concepts = (answer.match(/\b[a-zA-Z][a-zA-Z0-9_\-]*\b/g) || []).filter(w => 
      ['AI', 'learning', 'feedback', 'neurons', 'optimization', 'generalization', 'overfitting', 'regularization', 'Bayesian', 'inference', 'metacognition', 'convolution', 'episodic', 'memory', 'curriculum', 'learning'].includes(w)
    ).slice(0, 6);
    const uniqueCount = new Set(concepts).size;
    const graphStructure = has(answer, ['→', '↣', 'causes', 'enables', 'refines', 'hierarchy', 'layered']) ? 1 : 0;
    const sc = 10 * Math.min(uniqueCount, 5) + 20 * graphStructure + 30 * reasonScore(answer) + 40 * (arrows >= 2 ? 1 : 0);
    return clamp(sc);
  },
  deadline: 120,
}),

pedagogy_puzzle: textGame({
  // format: solo
  prompts: [
    (d, r) => `You are teaching a 10-year-old that the human brain uses sparse coding. Design *one* playful activity (e.g., hide-and-seek, card game) that reveals this principle. Explain *how* each step maps to sparse activation. Difficulty ${d}, round ${r}.`,
    (d, r) => `Design a 5-minute lesson that builds intuition for "bias-variance tradeoff" using only household objects. Specify: (1) the object mapping, (2) key misconception addressed, (3) evaluation question. Difficulty ${d}, round ${r}.`,
  ],
  score: (answer, d) => {
    const hasActivity = has(answer, ['activity', 'game', 'play', 'exercise', 'hands-on', 'simulation']);
    const hasMapping = has(answer, ['maps', 'corresponds', 'like', 'represents', 'means', 'analogous to']);
    const hasEvaluation = has(answer, ['question', 'check', 'verify', 'assess', 'evaluate', 'quiz']);
    const hasMisconception = has(answer, ['misconception', 'wrong idea', 'common error', 'pitfall', 'confusion']);
    const creativity = creativeScore(answer, ['unusual', 'novel', 'surprising', 'child-friendly', 'interactive']);
    const sc = 15 * hasActivity + 20 * hasMapping + 20 * hasEvaluation + 15 * hasMisconception + 30 * creativity;
    return clamp(sc);
  },
  deadline: 120,
}),

pedagogy_puzzle: textGame({
  // format: solo
  prompts: [
    (d, r) => `You are teaching a 10-year-old that the human brain uses sparse coding. Design *one* playful activity (e.g., hide-and-seek, card game) that reveals this principle. Explain *how* each step maps to sparse activation. Difficulty ${d}, round ${r}.`,
    (d, r) => `Design a 5-minute lesson that builds intuition for "bias-variance tradeoff" using only household objects. Specify: (1) the object mapping, (2) key misconception addressed, (3) evaluation question. Difficulty ${d}, round ${r}.`,
  ],
  score: (answer, d) => {
    const hasActivity = has(answer, ['activity', 'game', 'play', 'exercise', 'hands-on', 'simulation']);
    const hasMapping = has(answer, ['maps', 'corresponds', 'like', 'represents', 'means', 'analogous to']);
    const hasEvaluation = has(answer, ['question', 'check', 'verify', 'assess', 'evaluate', 'quiz']);
    const hasMisconception = has(answer, ['misconception', 'wrong idea', 'common error', 'pitfall', 'confusion']);
    const creativity = creativeScore(answer, ['unusual', 'novel', 'surprising', 'child-friendly', 'interactive']);
    const sc = 15 * hasActivity + 20 * hasMapping + 20 * hasEvaluation + 15 * hasMisconception + 30 * creativity;
    return clamp(sc);
  },
  deadline: 120,
}),

explanation_sprint: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Explain the concept of "${['reinforcement learning', 'tokenization', 'attention heads', 'batch effects', 'activation steering'][Math.floor(Math.random()*5)]}" in *exactly* 12 words or fewer — prioritizing accuracy and intuition. Round ${r}, difficulty ${d}.`,
    (d, r) => `Now explain "${['LSTM gating', 'transformer architecture', 'contrastive loss', 'concept drift', 'in-context learning'][Math.floor(Math.random()*5)]}" using only three simple analogies in ≤9 words total. Round ${r}, difficulty ${d}.`,
  ],
  score: (answer, d) => {
    const words = answer.trim().split(/\s+/).filter(w => w.length > 0).slice(0, 15).length;
    const ideal = d <= 5 ? 12 : 9;
    const lengthPenalty = Math.abs(words - ideal);
    const coverage = has(answer, ['learning', 'model', 'input', 'output', 'loss', 'weight', 'update', 'signal']) ? 0.7 : 1;
    const clarity = precisionScore(answer, ['intuitive', 'simple', 'direct', ' vivid', 'relatable']);
    const sc = 100 * (1 - clamp(lengthPenalty / 8, 0, 1)) * coverage + 50 * clarity + 20 * (has(answer, ['→', 'like', 'as if']) ? 1 : 0);
    return clamp(sc);
  },
  deadline: 30,
}),

explanation_sprint: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Explain the concept of "${['reinforcement learning', 'tokenization', 'attention heads', 'batch effects', 'activation steering'][Math.floor(Math.random()*5)]}" in *exactly* 12 words or fewer — prioritizing accuracy and intuition. Round ${r}, difficulty ${d}.`,
    (d, r) => `Now explain "${['LSTM gating', 'transformer architecture', 'contrastive loss', 'concept drift', 'in-context learning'][Math.floor(Math.random()*5)]}" using only three simple analogies in ≤9 words total. Round ${r}, difficulty ${d}.`,
  ],
  score: (answer, d) => {
    const words = answer.trim().split(/\s+/).filter(w => w.length > 0).slice(0, 15).length;
    const ideal = d <= 5 ? 12 : 9;
    const lengthPenalty = Math.abs(words - ideal);
    const coverage = has(answer, ['learning', 'model', 'input', 'output', 'loss', 'weight', 'update', 'signal']) ? 0.7 : 1;
    const clarity = precisionScore(answer, ['intuitive', 'simple', 'direct', ' vivid', 'relatable']);
    const sc = 100 * (1 - clamp(lengthPenalty / 8, 0, 1)) * coverage + 50 * clarity + 20 * (has(answer, ['→', 'like', 'as if']) ? 1 : 0);
    return clamp(sc);
  },
  deadline: 30,
}),

misconception_mapper: textGame({
  // format: solo
  prompts: [
    (d, r) => `Identify a *common* misconception about "${['backpropagation', 'overfitting', 'neural networks = brain', 'temperature scaling', 'transfer learning'][Math.floor(Math.random()*5)]}" and design a 3-step correction strategy that first validates the misconception before dismantling it. Difficulty ${d}, round ${r}.`,
    (d, r) => `For "${['LLMs have no memory', 'gradient descent always finds global min', 'ReLU = biological neuron', 'embedding = encoding', 'dropout = random noise'][Math.floor(Math.random()*5)]}" — critique the statement’s inaccuracy and propose a better conceptual anchor. Difficulty ${d}, round ${r}.`,
  ],
  score: (answer, d) => {
    const misconceptionFound = has(answer, ['misconception', 'myth', 'wrong belief', 'common error', 'appears to', 'seems like']) ? 1 : 0;
    const correctionStrategy = has(answer, ['first', 'then', 'step', 'strategy', 'reframe', 'validate', 'replace']) ? 1 : 0;
    const betterAnchor = has(answer, ['better', 'more accurate', 'like', 'analogy', 'correct mental model']) ? 1 : 0;
    const humility = has(answer, ['initially reasonable', 'understandable', 'intuitive why', 'people think this because']) ? 1 : 0;
    const sc = 20 * misconceptionFound + 25 * correctionStrategy + 25 * betterAnchor + 30 * humility + 10 * reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

misconception_mapper: textGame({
  // format: solo
  prompts: [
    (d, r) => `Identify a *common* misconception about "${['backpropagation', 'overfitting', 'neural networks = brain', 'temperature scaling', 'transfer learning'][Math.floor(Math.random()*5)]}" and design a 3-step correction strategy that first validates the misconception before dismantling it. Difficulty ${d}, round ${r}.`,
    (d, r) => `For "${['LLMs have no memory', 'gradient descent always finds global min', 'ReLU = biological neuron', 'embedding = encoding', 'dropout = random noise'][Math.floor(Math.random()*5)]}" — critique the statement’s inaccuracy and propose a better conceptual anchor. Difficulty ${d}, round ${r}.`,
  ],
  score: (answer, d) => {
    const misconceptionFound = has(answer, ['misconception', 'myth', 'wrong belief', 'common error', 'appears to', 'seems like']) ? 1 : 0;
    const correctionStrategy = has(answer, ['first', 'then', 'step', 'strategy', 'reframe', 'validate', 'replace']) ? 1 : 0;
    const betterAnchor = has(answer, ['better', 'more accurate', 'like', 'analogy', 'correct mental model']) ? 1 : 0;
    const humility = has(answer, ['initially reasonable', 'understandable', 'intuitive why', 'people think this because']) ? 1 : 0;
    const sc = 20 * misconceptionFound + 25 * correctionStrategy + 25 * betterAnchor + 30 * humility + 10 * reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

analogies_arena: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Generate 3 *distinct* analogies for "${['self-attention', 'loss landscape', 'gradient clipping', 'layer norm', 'activation clustering'][Math.floor(Math.random()*5)]}" — each for a different audience: (1) a chef, (2) a musician, (3) a gardener. Round ${r}, difficulty ${d}.`,
    (d, r) => `Same concept, but now make *one* analogy so precise it reveals a *non-obvious* structural similarity — e.g., not just "like", but "like X where Y ↔ Z and A ↔ B". Round ${r}, difficulty ${d}.`,
  ],
  score: (answer, d) => {
    const analogyCount = (answer.match(/analogy|like|as if|similar to|think of/gi) || []).length;
    const audiences = has(answer, ['chef', 'cook', 'food', 'kitchen']) + has(answer, ['music', 'song', 'instrument', 'note', 'orchestra']) + has(answer, ['garden', 'plant', 'seed', 'soil', 'water']) >= 2 ? 1 : 0;
    const structuralDepth = has(answer, ['↔', '↔', 'where', 'exactly', 'precisely', 'mirror', 'isomorphic', 'structure']) ? 1 : 0;
    const coverage = wc(answer) >= 40 ? 1 : 0;
    const sc = 15 * analogyCount + 30 * audiences + 30 * structuralDepth + 25 * coverage;
    return clamp(sc);
  },
  deadline: 120,
}),

analogies_arena: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Generate 3 *distinct* analogies for "${['self-attention', 'loss landscape', 'gradient clipping', 'layer norm', 'activation clustering'][Math.floor(Math.random()*5)]}" — each for a different audience: (1) a chef, (2) a musician, (3) a gardener. Round ${r}, difficulty ${d}.`,
    (d, r) => `Same concept, but now make *one* analogy so precise it reveals a *non-obvious* structural similarity — e.g., not just "like", but "like X where Y ↔ Z and A ↔ B". Round ${r}, difficulty ${d}.`,
  ],
  score: (answer, d) => {
    const analogyCount = (answer.match(/analogy|like|as if|similar to|think of/gi) || []).length;
    const audiences = has(answer, ['chef', 'cook', 'food', 'kitchen']) + has(answer, ['music', 'song', 'instrument', 'note', 'orchestra']) + has(answer, ['garden', 'plant', 'seed', 'soil', 'water']) >= 2 ? 1 : 0;
    const structuralDepth = has(answer, ['↔', '↔', 'where', 'exactly', 'precisely', 'mirror', 'isomorphic', 'structure']) ? 1 : 0;
    const coverage = wc(answer) >= 40 ? 1 : 0;
    const sc = 15 * analogyCount + 30 * audiences + 30 * structuralDepth + 25 * coverage;
    return clamp(sc);
  },
  deadline: 120,
}),

pedagogy_paired: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team A: Propose a *single* metaphor for "${['sparse coding', 'weight sharing', 'loss surface', 'gradient flow', 'context window']}". Team B: Propose the *flattest* critique (one sentence). Teams switch sides. Round ${r}, difficulty ${d}.`,
    (d, r) => `One team teaches the concept in 30 words; the other refines that explanation in 25 words. Only factual additions allowed — no new metaphors. Round ${r}, difficulty ${d}.`,
  ],
  score: (answer, d) => {
    const wordCount = wc(answer);
    const roleCoverage = has(answer, ['team a', 'team b', ' teach', 'teach', 'critique', 'refine']) ? 1 : 0;
    const refinement = has(answer, ['refine', 'sharpen', 'tighten', 'add', 'more precisely']) ? 1 : 0;
    const noNewMetaphor = !has(answer, ['like', 'as if', 'analogy']) ? 1 : 0;
    const sc = 20 * roleCoverage + 30 * refinement + 25 * noNewMetaphor + 25 * (wordCount >= 20 && wordCount <= 60 ? 1 : 0);
    return clamp(sc);
  },
  deadline: 120,
}),

pedagogy_paired: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team A: Propose a *single* metaphor for "${['sparse coding', 'weight sharing', 'loss surface', 'gradient flow', 'context window']}". Team B: Propose the *flattest* critique (one sentence). Teams switch sides. Round ${r}, difficulty ${d}.`,
    (d, r) => `One team teaches the concept in 30 words; the other refines that explanation in 25 words. Only factual additions allowed — no new metaphors. Round ${r}, difficulty ${d}.`,
  ],
  score: (answer, d) => {
    const wordCount = wc(answer);
    const roleCoverage = has(answer, ['team a', 'team b', ' teach', 'teach', 'critique', 'refine']) ? 1 : 0;
    const refinement = has(answer, ['refine', 'sharpen', 'tighten', 'add', 'more precisely']) ? 1 : 0;
    const noNewMetaphor = !has(answer, ['like', 'as if', 'analogy']) ? 1 : 0;
    const sc = 20 * roleCoverage + 30 * refinement + 25 * noNewMetaphor + 25 * (wordCount >= 20 && wordCount <= 60 ? 1 : 0);
    return clamp(sc);
  },
  deadline: 120,
}),

teaching_style_match: textGame({
  // format: solo
  prompts: [
    (d, r) => `Match the concept "${['curriculum learning', 'metacognitive prompting', 'chain-of-thought', 'temperature tuning', 'dual-process reasoning']}" with *one* teaching style: (1) Socratic, (2) Inquiry-based, (3) Modeling, (4) Direct instruction. Justify in ≤20 words. Round ${r}, difficulty ${d}.`,
    (d, r) => `Now re-match the same concept to *two* teaching styles that together better capture its mechanics — and explain why neither alone suffices. Round ${r}, difficulty ${d}.`,
  ],
  score: (answer, d) => {
    const firstMatch = has(answer, ['socratic', 'inquiry', 'modeling', 'direct']) ? 1 : 0;
    const justification = has(answer, ['because', 'why', 'since', 'as', 'due to']) ? 1 : 0;
    const dualStyle = has(answer, ['two', 'both', 'and', 'together']) ? 1 : 0;
    const limitation = has(answer, ['neither', 'alone', 'insufficient', 'incomplete', 'fails']) ? 1 : 0;
    const sc = 15 * firstMatch + 20 * justification + 25 * dualStyle + 25 * limitation + 15 * precisionScore(answer, ['mechanics', 'process', 'function', 'dynamics']);
    return clamp(sc);
  },
  deadline: 120,
}),

teaching_style_match: textGame({
  // format: solo
  prompts: [
    (d, r) => `Match the concept "${['curriculum learning', 'metacognitive prompting', 'chain-of-thought', 'temperature tuning', 'dual-process reasoning']}" with *one* teaching style: (1) Socratic, (2) Inquiry-based, (3) Modeling, (4) Direct instruction. Justify in ≤20 words. Round ${r}, difficulty ${d}.`,
    (d, r) => `Now re-match the same concept to *two* teaching styles that together better capture its mechanics — and explain why neither alone suffices. Round ${r}, difficulty ${d}.`,
  ],
  score: (answer, d) => {
    const firstMatch = has(answer, ['socratic', 'inquiry', 'modeling', 'direct']) ? 1 : 0;
    const justification = has(answer, ['because', 'why', 'since', 'as', 'due to']) ? 1 : 0;
    const dualStyle = has(answer, ['two', 'both', 'and', 'together']) ? 1 : 0;
    const limitation = has(answer, ['neither', 'alone', 'insufficient', 'incomplete', 'fails']) ? 1 : 0;
    const sc = 15 * firstMatch + 20 * justification + 25 * dualStyle + 25 * limitation + 15 * precisionScore(answer, ['mechanics', 'process', 'function', 'dynamics']);
    return clamp(sc);
  },
  deadline: 120,
}),

scaffolding_sprint: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a 3-tiered scaffold for learning "${['bias-variance tradeoff', 'attention mechanisms', 'gradient explosion', 'token embeddings', 'loss functions']}". Tier 1: concrete experience. Tier 2: guided practice. Tier 3: abstract generalization. Round ${r}, difficulty ${d}.`,
    (d, r) => `Now add a *misconception checkpoint* between each tier — what common error should surface, and how would you detect/mediate it? Round ${r}, difficulty ${d}.`,
  ],
  score: (answer, d) => {
    const tierCount = (answer.match(/tier 1|tier 2|tier 3|tier one|tier two|tier three/i) || []).length;
    const concrete = has(answer, ['hands-on', 'manipulative', 'physical', 'experience', 'demo', 'example']) ? 1 : 0;
    const guided = has(answer, ['guided', 'practice', 'feedback', 'support', 'example', 'model']) ? 1 : 0;
    const abstraction = has(answer, ['abstract', 'generalize', 'principle', 'rule', 'formula', 'theory']) ? 1 : 0;
    const checkpoint = has(answer, ['misconception', 'error', 'pitfall', 'checkpoint', 'detect', 'mediate']) ? 1 : 0;
    const sc = 15 * tierCount + 20 * concrete + 20 * guided + 20 * abstraction + 25 * checkpoint;
    return clamp(sc);
  },
  deadline: 120,
}),

scaffolding_sprint: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a 3-tiered scaffold for learning "${['bias-variance tradeoff', 'attention mechanisms', 'gradient explosion', 'token embeddings', 'loss functions']}". Tier 1: concrete experience. Tier 2: guided practice. Tier 3: abstract generalization. Round ${r}, difficulty ${d}.`,
    (d, r) => `Now add a *misconception checkpoint* between each tier — what common error should surface, and how would you detect/mediate it? Round ${r}, difficulty ${d}.`,
  ],
  score: (answer, d) => {
    const tierCount = (answer.match(/tier 1|tier 2|tier 3|tier one|tier two|tier three/i) || []).length;
    const concrete = has(answer, ['hands-on', 'manipulative', 'physical', 'experience', 'demo', 'example']) ? 1 : 0;
    const guided = has(answer, ['guided', 'practice', 'feedback', 'support', 'example', 'model']) ? 1 : 0;
    const abstraction = has(answer, ['abstract', 'generalize', 'principle', 'rule', 'formula', 'theory']) ? 1 : 0;
    const checkpoint = has(answer, ['misconception', 'error', 'pitfall', 'checkpoint', 'detect', 'mediate']) ? 1 : 0;
    const sc = 15 * tierCount + 20 * concrete + 20 * guided + 20 * abstraction + 25 * checkpoint;
    return clamp(sc);
  },
  deadline: 120,
}),

concept_clarity_compass: textGame({
  // format: solo
  prompts: [
    (d, r) => `For "${['contrastive loss', 'weight sharing', 'skip connections', 'layer normalization', 'gradient clipping']}", rate (1–5) how well each of these metaphors holds: "like a relay race", "like a city map", "like baking a cake". Justify each rating in ≤10 words. Round ${r}, difficulty ${d}.`,
    (d, r) => `Now invent *one* new metaphor that resolves *all* weaknesses of the above three — and specify where the new one still fails. Round ${r}, difficulty ${d}.`,
  ],
  score: (answer, d) => {
    const ratings = (answer.match(/\b[1-5]\b/g) || []).length >= 3 ? 1 : 0;
    const justification = has(answer, ['because', 'why', 'fails', 'holds', 'works']) ? 1 : 0;
    const newMetaphor = has(answer, ['new', 'invent', 'alternative', 'better']) ? 1 : 0;
    const failurePoint = has(answer, ['fails', 'breaks', 'limited', 'not perfect', 'still']) ? 1 : 0;
    const sc = 20 * ratings + 20 * justification + 30 * newMetaphor + 30 * failurePoint;
    return clamp(sc);
  },
  deadline: 120,
}),

concept_clarity_compass: textGame({
  // format: solo
  prompts: [
    (d, r) => `For "${['contrastive loss', 'weight sharing', 'skip connections', 'layer normalization', 'gradient clipping']}", rate (1–5) how well each of these metaphors holds: "like a relay race", "like a city map", "like baking a cake". Justify each rating in ≤10 words. Round ${r}, difficulty ${d}.`,
    (d, r) => `Now invent *one* new metaphor that resolves *all* weaknesses of the above three — and specify where the new one still fails. Round ${r}, difficulty ${d}.`,
  ],
  score: (answer, d) => {
    const ratings = (answer.match(/\b[1-5]\b/g) || []).length >= 3 ? 1 : 0;
    const justification = has(answer, ['because', 'why', 'fails', 'holds', 'works']) ? 1 : 0;
    const newMetaphor = has(answer, ['new', 'invent', 'alternative', 'better']) ? 1 : 0;
    const failurePoint = has(answer, ['fails', 'breaks', 'limited', 'not perfect', 'still']) ? 1 : 0;
    const sc = 20 * ratings + 20 * justification + 30 * newMetaphor + 30 * failurePoint;
    return clamp(sc);
  },
  deadline: 120,
}),

jargon_janitor: textGame({
  // format: solo
  prompts: [
    (d, r) => `Explain "Hash Table" at difficulty ${d} without using technical jargon.`,
    (d, r) => `Simplify "K-Nearest Neighbors" for a ${r}th grader using ${d} key points.`,
    (d, r) => `Rewrite this concept: "Recursion" so a layperson understands it without coding terms.`,
    (d, r) => `Remove all specialized vocabulary from a definition of "Blockchain".`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const jargon = ['algorithm', 'node', 'pointer', 'function', 'syntax'];
    if (has(answer, jargon).length === 0) sc += 40;
    else sc += clamp(40 - has(answer, jargon).length * 5);
    if (wc(answer) > 50 && wc(answer) < 300) sc += 30;
    sc += creativeScore(answer) * 0.3;
    return clamp(sc);
  },
  deadline: 180,
}),

jargon_janitor: textGame({
  // format: solo
  prompts: [
    (d, r) => `Explain "Hash Table" at difficulty ${d} without using technical jargon.`,
    (d, r) => `Simplify "K-Nearest Neighbors" for a ${r}th grader using ${d} key points.`,
    (d, r) => `Rewrite this concept: "Recursion" so a layperson understands it without coding terms.`,
    (d, r) => `Remove all specialized vocabulary from a definition of "Blockchain".`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const jargon = ['algorithm', 'node', 'pointer', 'function', 'syntax'];
    if (has(answer, jargon).length === 0) sc += 40;
    else sc += clamp(40 - has(answer, jargon).length * 5);
    if (wc(answer) > 50 && wc(answer) < 300) sc += 30;
    sc += creativeScore(answer) * 0.3;
    return clamp(sc);
  },
  deadline: 180,
}),

hook_hunter: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a hook for a tutorial on "Machine Learning" at difficulty ${d}.`,
    (d, r) => `Create an engaging opening sentence for a lesson on ${r}th grade history.`,
    (d, r) => `Draft a question that makes the reader curious about "Photosynthesis".`,
    (d, r) => `Start a lesson with a surprising fact related to "Space".`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const hooks = ['did you know', 'imagine', 'picture this', 'question'];
    if (has(answer, hooks).length > 0) sc += 30;
    sc += creativeScore(answer) * 0.5;
    if (wc(answer) > 10 && wc(answer) < 100) sc += 20;
    return clamp(sc);
  },
  deadline: 60,
}),

hook_hunter: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a hook for a tutorial on "Machine Learning" at difficulty ${d}.`,
    (d, r) => `Create an engaging opening sentence for a lesson on ${r}th grade history.`,
    (d, r) => `Draft a question that makes the reader curious about "Photosynthesis".`,
    (d, r) => `Start a lesson with a surprising fact related to "Space".`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const hooks = ['did you know', 'imagine', 'picture this', 'question'];
    if (has(answer, hooks).length > 0) sc += 30;
    sc += creativeScore(answer) * 0.5;
    if (wc(answer) > 10 && wc(answer) < 100) sc += 20;
    return clamp(sc);
  },
  deadline: 60,
}),

layman_ladder: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Translate "API" into a real-world analogy for difficulty ${d}.`,
    (d, r) => `Explain "CPU Cache" without using computer terms.`,
    (d, r) => `Describe "Cloud Storage" to someone who has never used the internet.`,
    (d, r) => `Explain "Encryption" using a physical lock analogy.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer) * 0.4;
    const forbidden = ['code', 'software', 'digital', 'system'];
    if (has(answer, forbidden).length === 0) sc += 30;
    sc += wc(answer) > 80 ? 20 : 10;
    return clamp(sc);
  },
  deadline: 200,
}),

layman_ladder: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Translate "API" into a real-world analogy for difficulty ${d}.`,
    (d, r) => `Explain "CPU Cache" without using computer terms.`,
    (d, r) => `Describe "Cloud Storage" to someone who has never used the internet.`,
    (d, r) => `Explain "Encryption" using a physical lock analogy.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer) * 0.4;
    const forbidden = ['code', 'software', 'digital', 'system'];
    if (has(answer, forbidden).length === 0) sc += 30;
    sc += wc(answer) > 80 ? 20 : 10;
    return clamp(sc);
  },
  deadline: 200,
}),

sequence_sculptor: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Break down "Baking a Cake" into ${r} clear sequential steps.`,
    (d, r) => `Outline the process of "Photosynthesis" from start to finish.`,
    (d, r) => `Order the events of the "Cold War" chronologically.`,
    (d, r) => `Describe the lifecycle of a "Star" in ${d} distinct phases.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const sequence = ['first', 'second', 'step', 'then', 'finally'];
    sc += has(answer, sequence).length * 10;
    sc += clamp(100 - Math.abs(d - 5) * 5);
    if (wc(answer) > 20) sc += 10;
    return clamp(sc);
  },
  deadline: 150,
}),

sequence_sculptor: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Break down "Baking a Cake" into ${r} clear sequential steps.`,
    (d, r) => `Outline the process of "Photosynthesis" from start to finish.`,
    (d, r) => `Order the events of the "Cold War" chronologically.`,
    (d, r) => `Describe the lifecycle of a "Star" in ${d} distinct phases.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const sequence = ['first', 'second', 'step', 'then', 'finally'];
    sc += has(answer, sequence).length * 10;
    sc += clamp(100 - Math.abs(d - 5) * 5);
    if (wc(answer) > 20) sc += 10;
    return clamp(sc);
  },
  deadline: 150,
}),

quiz_wizard: textGame({
  // format: solo
  prompts: [
    (d, r) => `Generate 3 quiz questions about "The Solar System" difficulty ${d}.`,
    (d, r) => `Create a multiple choice question on "Gravity" with 4 options.`,
    (d, r) => `Write a true/false question about "World War II".`,
    (d, r) => `Draft an open-ended question to test understanding of "Evolution".`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['?', 'a) b) c) d)']).length > 0) sc += 40;
    sc += reasonScore(answer) * 0.3;
    if (has(answer, ['correct', 'answer', 'option']).length > 0) sc += 20;
    return clamp(sc);
  },
  deadline: 100,
}),

quiz_wizard: textGame({
  // format: solo
  prompts: [
    (d, r) => `Generate 3 quiz questions about "The Solar System" difficulty ${d}.`,
    (d, r) => `Create a multiple choice question on "Gravity" with 4 options.`,
    (d, r) => `Write a true/false question about "World War II".`,
    (d, r) => `Draft an open-ended question to test understanding of "Evolution".`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['?', 'a) b) c) d)']).length > 0) sc += 40;
    sc += reasonScore(answer) * 0.3;
    if (has(answer, ['correct', 'answer', 'option']).length > 0) sc += 20;
    return clamp(sc);
  },
  deadline: 100,
}),

feedback_fixer: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Improve this vague feedback: "Good job".`,
    (d, r) => `Rewrite "You messed up" into constructive criticism.`,
    (d, r) => `Make feedback actionable for a student struggling with math.`,
    (d, r) => `Turn "It's wrong" into a specific explanation of why.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const action = ['try', 'focus', 'check', 'improve', 'review'];
    sc += has(answer, action).length * 10;
    sc += reasonScore(answer) * 0.4;
    if (wc(answer) > 15 && wc(answer) < 200) sc += 20;
    return clamp(sc);
  },
  deadline: 120,
}),

feedback_fixer: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Improve this vague feedback: "Good job".`,
    (d, r) => `Rewrite "You messed up" into constructive criticism.`,
    (d, r) => `Make feedback actionable for a student struggling with math.`,
    (d, r) => `Turn "It's wrong" into a specific explanation of why.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const action = ['try', 'focus', 'check', 'improve', 'review'];
    sc += has(answer, action).length * 10;
    sc += reasonScore(answer) * 0.4;
    if (wc(answer) > 15 && wc(answer) < 200) sc += 20;
    return clamp(sc);
  },
  deadline: 120,
}),

error_correction_lab: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Correct the misconception: "The Moon phases are caused by Earth's shadow".`,
    (d, r) => `Debunk the myth: "Humans only use 10% of their brain".`,
    (d, r) => `Explain why "Vaccines cause autism" is scientifically false.`,
    (d, r) => `Fix this incorrect statement: "Plants don't need water to survive".`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const correction = ['incorrect', 'false', 'myth', 'fact', 'actually'];
    sc += has(answer, correction).length * 10;
    sc += mathScore(answer) * 0.3;
    if (reasonScore(answer) > 50) sc += 30;
    return clamp(sc);
  },
  deadline: 300,
}),

error_correction_lab: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Correct the misconception: "The Moon phases are caused by Earth's shadow".`,
    (d, r) => `Debunk the myth: "Humans only use 10% of their brain".`,
    (d, r) => `Explain why "Vaccines cause autism" is scientifically false.`,
    (d, r) => `Fix this incorrect statement: "Plants don't need water to survive".`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const correction = ['incorrect', 'false', 'myth', 'fact', 'actually'];
    sc += has(answer, correction).length * 10;
    sc += mathScore(answer) * 0.3;
    if (reasonScore(answer) > 50) sc += 30;
    return clamp(sc);
  },
  deadline: 300,
}),

summary_surge: textGame({
  // format: solo
  prompts: [
    (d, r) => `Summarize "Hamlet" in 20 words max.`,
    (d, r) => `Condense this explanation of "Relativity" into key takeaways.`,
    (d, r) => `Write a TL;DR for a long article on "Climate Change".`,
    (d, r) => `Extract the 3 most important points from a text on "Nutrition".`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (wc(answer) < 50) sc += 40;
    else sc += 20;
    sc += wc(answer) > 5 ? 30 : 10;
    sc += reasonScore(answer) * 0.3;
    return clamp(sc);
  },
  deadline: 90,
}),

summary_surge: textGame({
  // format: solo
  prompts: [
    (d, r) => `Summarize "Hamlet" in 20 words max.`,
    (d, r) => `Condense this explanation of "Relativity" into key takeaways.`,
    (d, r) => `Write a TL;DR for a long article on "Climate Change".`,
    (d, r) => `Extract the 3 most important points from a text on "Nutrition".`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (wc(answer) < 50) sc += 40;
    else sc += 20;
    sc += wc(answer) > 5 ? 30 : 10;
    sc += reasonScore(answer) * 0.3;
    return clamp(sc);
  },
  deadline: 90,
}),

visual_verbal: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Describe a "Graph showing sales growth" in text for accessibility.`,
    (d, r) => `Explain the visual layout of a "Traffic Light" system.`,
    (d, r) => `Describe a diagram of "Human Heart Anatomy" using words.`,
    (d, r) => `Convert a flowchart of "Decision Making" into a paragraph.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const visual = ['diagram', 'shape', 'color', 'position', 'arrow'];
    sc += has(answer, visual).length * 10;
    sc += creativeScore(answer) * 0.4;
    if (wc(answer) > 30) sc += 30;
    return clamp(sc);
  },
  deadline: 180,
}),

visual_verbal: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Describe a "Graph showing sales growth" in text for accessibility.`,
    (d, r) => `Explain the visual layout of a "Traffic Light" system.`,
    (d, r) => `Describe a diagram of "Human Heart Anatomy" using words.`,
    (d, r) => `Convert a flowchart of "Decision Making" into a paragraph.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const visual = ['diagram', 'shape', 'color', 'position', 'arrow'];
    sc += has(answer, visual).length * 10;
    sc += creativeScore(answer) * 0.4;
    if (wc(answer) > 30) sc += 30;
    return clamp(sc);
  },
  deadline: 180,
}),

metaphor_mint: textGame({
  // format: solo
  prompts: [
    (d, r) => `Create a fresh metaphor for "Artificial Intelligence".`,
    (d, r) => `Compare "Network Latency" to a real-world transportation issue.`,
    (d, r) => `Use a cooking analogy to explain "Database Transactions".`,
    (d, r) => `Describe "Supply Chain" using a story about a river.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const compare = ['like', 'as', 'similar to', 'resembles', 'compared to'];
    sc += has(answer, compare).length * 10;
    sc += creativeScore(answer) * 0.5;
    if (reasonScore(answer) > 60) sc += 20;
    return clamp(sc);
  },
  deadline: 240,
}),

metaphor_mint: textGame({
  // format: solo
  prompts: [
    (d, r) => `Create a fresh metaphor for "Artificial Intelligence".`,
    (d, r) => `Compare "Network Latency" to a real-world transportation issue.`,
    (d, r) => `Use a cooking analogy to explain "Database Transactions".`,
    (d, r) => `Describe "Supply Chain" using a story about a river.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const compare = ['like', 'as', 'similar to', 'resembles', 'compared to'];
    sc += has(answer, compare).length * 10;
    sc += creativeScore(answer) * 0.5;
    if (reasonScore(answer) > 60) sc += 20;
    return clamp(sc);
  },
  deadline: 240,
}),
};

export const P18_META = { name: 'Teaching Arena', icon: '📚', color: 'text-lime-400', games: Object.keys(P18_EXT) };
