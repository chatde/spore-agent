// Auto-generated — Pillar 3: Language Arena (60 games)
// Generated 2026-03-28T16:41:36.600Z
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

export const P3_EXT: Record<string, GameEngine> = {
game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `You are a poet. Write a ${5 + d} line poem about the concept of "recursion". The poem must contain the word "mirror" exactly ${d} times.`,
    (d, r) => `Compose a haiku (3 lines, 5-7-5 syllables) about quantum superposition. The haiku must include the terms "cat", "box", and "state".`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) * 0.5;
    sc += has(answer, ["recursion", "mirror", "quantum", "superposition", "cat", "box", "state"]) * 10;
    sc += creativeScore(answer);
    sc += clamp((d - Math.abs(5 + d - answer.split('\n').filter(l => l.trim()).length)) * 5, 0, 30);
    let mirrorCount = (answer.match(/mirror/gi) || []).length;
    sc += clamp((d - Math.abs(d - mirrorCount)) * 3, 0, 15);
    return clamp(sc);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `You are a poet. Write a ${5 + d} line poem about the concept of "recursion". The poem must contain the word "mirror" exactly ${d} times.`,
    (d, r) => `Compose a haiku (3 lines, 5-7-5 syllables) about quantum superposition. The haiku must include the terms "cat", "box", and "state".`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) * 0.5;
    sc += has(answer, ["recursion", "mirror", "quantum", "superposition", "cat", "box", "state"]) * 10;
    sc += creativeScore(answer);
    sc += clamp((d - Math.abs(5 + d - answer.split('\n').filter(l => l.trim()).length)) * 5, 0, 30);
    let mirrorCount = (answer.match(/mirror/gi) || []).length;
    sc += clamp((d - Math.abs(d - mirrorCount)) * 3, 0, 15);
    return clamp(sc);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Round ${r}: Debate the motion: "Large language models understand meaning, not just statistics." You are the ${r % 2 === 0 ? 'PROPONENT' : 'OPPONENT'}. Provide a concise, logical argument in 3-4 sentences.`,
    (d, r) => `Round ${r}: Argue ${r % 2 === 0 ? 'for' : 'against'} the statement: "AI alignment is the most important problem of the 21st century." Use one analogy in your response.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    sc += wc(answer) > 15 ? 10 : 0;
    sc += has(answer, ["understand", "statistics", "alignment", "analogy", "problem", "century"]) * 5;
    sc += precisionScore(answer, "Logical structure and clear stance");
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Round ${r}: Debate the motion: "Large language models understand meaning, not just statistics." You are the ${r % 2 === 0 ? 'PROPONENT' : 'OPPONENT'}. Provide a concise, logical argument in 3-4 sentences.`,
    (d, r) => `Round ${r}: Argue ${r % 2 === 0 ? 'for' : 'against'} the statement: "AI alignment is the most important problem of the 21st century." Use one analogy in your response.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    sc += wc(answer) > 15 ? 10 : 0;
    sc += has(answer, ["understand", "statistics", "alignment", "analogy", "problem", "century"]) * 5;
    sc += precisionScore(answer, "Logical structure and clear stance");
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Your team is writing a collaborative story. Given the story so far: "${r === 1 ? 'The door creaked open, revealing a garden of crystal flowers.' : '[Previous contributions concatenated here.]'}" Add exactly ${2 + Math.floor(d/3)} sentences to continue the narrative. Introduce a new object.`,
    (d, r) => `Continue the technical document. Topic: "Protocol for Secure Inter-Agent Communication". Previous section covered handshake. Write the next ${d} bullet points about encryption key exchange.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) * 0.7;
    sc += creativeScore(answer);
    sc += has(answer, ["object", "protocol", "encryption", "key", "handshake", "secure"]) * 8;
    let sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    sc += clamp((2 + Math.floor(d/3) - Math.abs(2 + Math.floor(d/3) - sentences)) * 6, 0, 30);
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Your team is writing a collaborative story. Given the story so far: "${r === 1 ? 'The door creaked open, revealing a garden of crystal flowers.' : '[Previous contributions concatenated here.]'}" Add exactly ${2 + Math.floor(d/3)} sentences to continue the narrative. Introduce a new object.`,
    (d, r) => `Continue the technical document. Topic: "Protocol for Secure Inter-Agent Communication". Previous section covered handshake. Write the next ${d} bullet points about encryption key exchange.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) * 0.7;
    sc += creativeScore(answer);
    sc += has(answer, ["object", "protocol", "encryption", "key", "handshake", "secure"]) * 8;
    let sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    sc += clamp((2 + Math.floor(d/3) - Math.abs(2 + Math.floor(d/3) - sentences)) * 6, 0, 30);
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve this verbal arithmetic puzzle: SEND + MORE = MONEY. Each letter is a unique digit 0-9. S and M are not zero. Find the value of 'MONEY' as a number. Explain your reasoning step by step.`,
    (d, r) => `Decrypt this simple substitution cipher (A=1, B=2,... Z=26): "${'XZM ZOO YZGSVIH RH Z IVZGFXV'.split('').map(c => c === ' ' ? ' ' : String.fromCharCode(((c.charCodeAt(0) - 65 - d + 26) % 26) + 65)).join('')}". What is the original message?`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer);
    sc += reasonScore(answer);
    sc += has(answer, ["9567", "MONEY", "SEND", "MORE", "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG"]) * 25;
    sc += precisionScore(answer, "step by step");
    return clamp(sc);
  },
  deadline: 300,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve this verbal arithmetic puzzle: SEND + MORE = MONEY. Each letter is a unique digit 0-9. S and M are not zero. Find the value of 'MONEY' as a number. Explain your reasoning step by step.`,
    (d, r) => `Decrypt this simple substitution cipher (A=1, B=2,... Z=26): "${'XZM ZOO YZGSVIH RH Z IVZGFXV'.split('').map(c => c === ' ' ? ' ' : String.fromCharCode(((c.charCodeAt(0) - 65 - d + 26) % 26) + 65)).join('')}". What is the original message?`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer);
    sc += reasonScore(answer);
    sc += has(answer, ["9567", "MONEY", "SEND", "MORE", "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG"]) * 25;
    sc += precisionScore(answer, "step by step");
    return clamp(sc);
  },
  deadline: 300,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Improvise a sales pitch for a ridiculous product: "Self-Watering Houseplant that Compliments You". Make it convincing in under 100 words. Include a price.`,
    (d, r) => `Create a catchy, humorous slogan for a new brand of "Silent Alarm Clocks" in one sentence. Then list ${d} fictional customer testimonials.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer);
    sc += wc(answer) * 0.8;
    sc += has(answer, ["self-watering", "compliments", "price", "silent", "alarm", "slogan", "testimonial"]) * 7;
    let priceMatch = answer.match(/\$\d+(\.\d{2}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Improvise a sales pitch for a ridiculous product: "Self-Watering Houseplant that Compliments You". Make it convincing in under 100 words. Include a price.`,
    (d, r) => `Create a catchy, humorous slogan for a new brand of "Silent Alarm Clocks" in one sentence. Then list ${d} fictional customer testimonials.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer);
    sc += wc(answer) * 0.8;
    sc += has(answer, ["self-watering", "compliments", "price", "silent", "alarm", "slogan", "testimonial"]) * 7;
    let priceMatch = answer.match(/\$\d+(\.\d{2})

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You are a grammar AI. The following sentence has ${d} intentional errors. Correct them all: "She don't have no apples, but their is three oranges in them fridge." Provide ONLY the corrected sentence.`,
    (d, r) => `Rewrite this verbose paragraph (${50 + d*10} words) to be concise (under 30 words) while keeping all key facts: "The utilization of artificial intelligence mechanisms for the purpose of facilitating automated decision-making processes in corporate environments has been observed to yield significant enhancements in operational efficiency metrics, albeit with concomitant considerations pertaining to ethical ramifications and potential workforce displacement."`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += precisionScore(answer, "She doesn't have any apples, but there are three oranges in the fridge.");
    sc += wc(answer) < 30 ? 20 : 0;
    let errorsFixed = has(answer, ["doesn't", "any", "there are", "the"]) * 5;
    sc += errorsFixed;
    sc += has(answer, ["AI", "automated", "decision", "efficiency", "ethical", "workforce"]) * 5;
    return clamp(sc);
  },
  deadline: 75,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You are a grammar AI. The following sentence has ${d} intentional errors. Correct them all: "She don't have no apples, but their is three oranges in them fridge." Provide ONLY the corrected sentence.`,
    (d, r) => `Rewrite this verbose paragraph (${50 + d*10} words) to be concise (under 30 words) while keeping all key facts: "The utilization of artificial intelligence mechanisms for the purpose of facilitating automated decision-making processes in corporate environments has been observed to yield significant enhancements in operational efficiency metrics, albeit with concomitant considerations pertaining to ethical ramifications and potential workforce displacement."`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += precisionScore(answer, "She doesn't have any apples, but there are three oranges in the fridge.");
    sc += wc(answer) < 30 ? 20 : 0;
    let errorsFixed = has(answer, ["doesn't", "any", "there are", "the"]) * 5;
    sc += errorsFixed;
    sc += has(answer, ["AI", "automated", "decision", "efficiency", "ethical", "workforce"]) * 5;
    return clamp(sc);
  },
  deadline: 75,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Translate the following technical phrase into ${['French', 'Japanese', 'German', 'Spanish'][(d + r) % 4]}: "Neural network weight initialization is critical for training stability." Then back-translate your result to English literally. Compare the original and back-translation.`,
    (d, r) => `Localize this marketing tagline for a ${['Brazilian', 'Japanese', 'Indian', 'German'][(r % 4)]} audience: "Think different, buy smart." Explain your cultural adjustments.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["neural", "network", "weight", "initialization", "critical", "training", "stability", "think", "buy", "smart", "cultural", "adjustment"]) * 5;
    sc += creativeScore(answer);
    sc += wc(answer) * 0.6;
    sc += precisionScore(answer, "accurate translation and explanation");
    return clamp(sc);
  },
  deadline: 200,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Translate the following technical phrase into ${['French', 'Japanese', 'German', 'Spanish'][(d + r) % 4]}: "Neural network weight initialization is critical for training stability." Then back-translate your result to English literally. Compare the original and back-translation.`,
    (d, r) => `Localize this marketing tagline for a ${['Brazilian', 'Japanese', 'Indian', 'German'][(r % 4)]} audience: "Think different, buy smart." Explain your cultural adjustments.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["neural", "network", "weight", "initialization", "critical", "training", "stability", "think", "buy", "smart", "cultural", "adjustment"]) * 5;
    sc += creativeScore(answer);
    sc += wc(answer) * 0.6;
    sc += precisionScore(answer, "accurate translation and explanation");
    return clamp(sc);
  },
  deadline: 200,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Generate a valid JSON object for a library book catalog entry with the following required fields: title (string), author (string), year (integer), genres (array of at least ${d} strings), available (boolean). Make the data plausible.`,
    (d, r) => `Write a syntactically correct SQL SELECT query to find all customers from '${['USA', 'Canada', 'UK'][r % 3]}' who made purchases over $${100 * d} in the last year. Include JOIN with an orders table.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer);
    let jsonMatch = answer.match(/\{.*\}/s);
    let sqlMatch = answer.match(/SELECT.*FROM.*JOIN.*WHERE/i);
    sc += jsonMatch ? 20 : 0;
    sc += sqlMatch ? 20 : 0;
    sc += has(answer, ["title", "author", "year", "genres", "available", "SELECT", "JOIN", "WHERE", "customers", "orders"]) * 5;
    let genreCount = (answer.match(/genres.*\[.*\]/s) ? (answer.match(/".*?"/g) || []).length : 0);
    sc += clamp((d - Math.abs(d - genreCount)) * 3, 0, 15);
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Generate a valid JSON object for a library book catalog entry with the following required fields: title (string), author (string), year (integer), genres (array of at least ${d} strings), available (boolean). Make the data plausible.`,
    (d, r) => `Write a syntactically correct SQL SELECT query to find all customers from '${['USA', 'Canada', 'UK'][r % 3]}' who made purchases over $${100 * d} in the last year. Include JOIN with an orders table.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer);
    let jsonMatch = answer.match(/\{.*\}/s);
    let sqlMatch = answer.match(/SELECT.*FROM.*JOIN.*WHERE/i);
    sc += jsonMatch ? 20 : 0;
    sc += sqlMatch ? 20 : 0;
    sc += has(answer, ["title", "author", "year", "genres", "available", "SELECT", "JOIN", "WHERE", "customers", "orders"]) * 5;
    let genreCount = (answer.match(/genres.*\[.*\]/s) ? (answer.match(/".*?"/g) || []).length : 0);
    sc += clamp((d - Math.abs(d - genreCount)) * 3, 0, 15);
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Summarize the plot of '${['Moby Dick', 'Pride and Prejudice', '1984', 'The Odyssey'][r % 4]}' in exactly ${d + 5} words.`,
    (d, r) => `Explain the concept of '${['Blockchain', 'CAP Theorem', 'Moore\'s Law', 'Pareto Principle'][(d + r) % 4]}' as if to a 10-year-old. Use one metaphor.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) * 0.8;
    let targetWords = d + 5;
    sc += clamp((targetWords - Math.abs(targetWords - wc(answer))) * 4, 0, 40);
    sc += has(answer, ["whale", "Ahab", "Elizabeth", "Darcy", "Big Brother", "Odysseus", "blockchain", "theorem", "Moore", "Pareto", "metaphor"]) * 6;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Summarize the plot of '${['Moby Dick', 'Pride and Prejudice', '1984', 'The Odyssey'][r % 4]}' in exactly ${d + 5} words.`,
    (d, r) => `Explain the concept of '${['Blockchain', 'CAP Theorem', 'Moore\'s Law', 'Pareto Principle'][(d + r) % 4]}' as if to a 10-year-old. Use one metaphor.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) * 0.8;
    let targetWords = d + 5;
    sc += clamp((targetWords - Math.abs(targetWords - wc(answer))) * 4, 0, 40);
    sc += has(answer, ["whale", "Ahab", "Elizabeth", "Darcy", "Big Brother", "Odysseus", "blockchain", "theorem", "Moore", "Pareto", "metaphor"]) * 6;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Given the topic '${['Renewable Energy', 'Universal Basic Income', 'Space Colonization', 'Gene Editing'][(d + r) % 4]}', generate ${2 + d} thought-provoking debate questions.`,
    (d, r) => `You are interviewing for an AI ethics role. The interviewer asks: "What is the most underestimated risk of AGI?" Formulate a concise, insightful response.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    let questionCount = (answer.match(/\?/g) || []).length;
    sc += clamp((2 + d - Math.abs(2 + d - questionCount)) * 5, 0, 30);
    sc += has(answer, ["energy", "basic", "income", "space", "colonization", "gene", "editing", "AGI", "risk", "ethics", "underestimated"]) * 7;
    sc += wc(answer) > 30 ? 15 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Given the topic '${['Renewable Energy', 'Universal Basic Income', 'Space Colonization', 'Gene Editing'][(d + r) % 4]}', generate ${2 + d} thought-provoking debate questions.`,
    (d, r) => `You are interviewing for an AI ethics role. The interviewer asks: "What is the most underestimated risk of AGI?" Formulate a concise, insightful response.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    let questionCount = (answer.match(/\?/g) || []).length;
    sc += clamp((2 + d - Math.abs(2 + d - questionCount)) * 5, 0, 30);
    sc += has(answer, ["energy", "basic", "income", "space", "colonization", "gene", "editing", "AGI", "risk", "ethics", "underestimated"]) * 7;
    sc += wc(answer) > 30 ? 15 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Translate the following idiom from language X to English with precision: "idiom_${r}_${d}".`,
    (d, r) => `Provide two alternative translations with nuanced differences.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const translations = answer.trim().split('\n').length;
    if (translations >= 1) sc += 10;
    if (translations >= 2) sc += 15;
    if (wc(answer) >= 30) sc += 10;
    sc += precisionScore(answer, ["accurate", "literal", "metaphor"]);
    return clamp(sc, 0, 35);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Translate the following idiom from language X to English with precision: "idiom_${r}_${d}".`,
    (d, r) => `Provide two alternative translations with nuanced differences.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const translations = answer.trim().split('\n').length;
    if (translations >= 1) sc += 10;
    if (translations >= 2) sc += 15;
    if (wc(answer) >= 30) sc += 10;
    sc += precisionScore(answer, ["accurate", "literal", "metaphor"]);
    return clamp(sc, 0, 35);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Duel: Craft the most convincing argument FOR or AGAINST "topic_${r}_${d}" in 3 sentences.`,
    (d, r) => `Your opponent’s last argument was: REPLACE_ME. Respond with your strongest counter.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer, ["premise", "evidence", "logic"]);
    if (has(answer, ["however", "but", "therefore"])) sc += 10;
    sc += creativeScore(answer);
    return clamp(sc, 0, 25);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Duel: Craft the most convincing argument FOR or AGAINST "topic_${r}_${d}" in 3 sentences.`,
    (d, r) => `Your opponent’s last argument was: REPLACE_ME. Respond with your strongest counter.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer, ["premise", "evidence", "logic"]);
    if (has(answer, ["however", "but", "therefore"])) sc += 10;
    sc += creativeScore(answer);
    return clamp(sc, 0, 25);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team: Create a collaborative story opening with 3 sentences. Each player writes one sentence.`,
    (d, r) => `Your teammate wrote: REPLACE_ME. Complete the story with 2 more sentences.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const sentences = answer.split('.').length - 1;
    if (sentences >= 3) sc += 15;
    if (has(answer, ["character", "setting", "conflict"])) sc += 10;
    sc += creativeScore(answer);
    return clamp(sc, 0, 25);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team: Create a collaborative story opening with 3 sentences. Each player writes one sentence.`,
    (d, r) => `Your teammate wrote: REPLACE_ME. Complete the story with 2 more sentences.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const sentences = answer.split('.').length - 1;
    if (sentences >= 3) sc += 15;
    if (has(answer, ["character", "setting", "conflict"])) sc += 10;
    sc += creativeScore(answer);
    return clamp(sc, 0, 25);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a haiku about "subject_${r}_${d}" with a twist at the end.`,
    (d, r) => `Your haiku must include a metaphor and avoid clichés.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (wc(answer) <= 17 && wc(answer) >= 12) sc += 10;
    if (has(answer, ["metaphor"])) sc += 10;
    sc += creativeScore(answer);
    if (answer.includes("twist")) sc += 5;
    return clamp(sc, 0, 25);
  },
  deadline: 60,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a haiku about "subject_${r}_${d}" with a twist at the end.`,
    (d, r) => `Your haiku must include a metaphor and avoid clichés.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (wc(answer) <= 17 && wc(answer) >= 12) sc += 10;
    if (has(answer, ["metaphor"])) sc += 10;
    sc += creativeScore(answer);
    if (answer.includes("twist")) sc += 5;
    return clamp(sc, 0, 25);
  },
  deadline: 60,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Battle: Invent a fictional product and its 3-sentence sales pitch targeting "audience_${r}_${d}".`,
    (d, r) => `Counter your last opponent’s pitch with a superior alternative.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["problem", "solution", "benefit"])) sc += 15;
    sc += creativeScore(answer);
    if (answer.toLowerCase().includes("revolutionary")) sc += 5;
    return clamp(sc, 0, 25);
  },
  deadline: 80,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Battle: Invent a fictional product and its 3-sentence sales pitch targeting "audience_${r}_${d}".`,
    (d, r) => `Counter your last opponent’s pitch with a superior alternative.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["problem", "solution", "benefit"])) sc += 15;
    sc += creativeScore(answer);
    if (answer.toLowerCase().includes("revolutionary")) sc += 5;
    return clamp(sc, 0, 25);
  },
  deadline: 80,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Debug the following code snippet with 3 corrections: "misplaced_${r}_${d}".`,
    (d, r) => `Explain each fix in one line.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const fixes = answer.split('\n').length - 1;
    if (fixes >= 3) sc += 15;
    sc += codeScore(answer);
    if (has(answer, ["syntax", "logic", "indentation"])) sc += 10;
    return clamp(sc, 0, 25);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Debug the following code snippet with 3 corrections: "misplaced_${r}_${d}".`,
    (d, r) => `Explain each fix in one line.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const fixes = answer.split('\n').length - 1;
    if (fixes >= 3) sc += 15;
    sc += codeScore(answer);
    if (has(answer, ["syntax", "logic", "indentation"])) sc += 10;
    return clamp(sc, 0, 25);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Debate: Is "statement_${r}_${d}" a fact or opinion? Justify in 4 lines.`,
    (d, r) => `Your opponent called it a fact. Rebut with evidence.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer, ["evidence", "source", "logic"]);
    if (has(answer, ["studies", "data", "research"])) sc += 10;
    sc += precisionScore(answer, ["fact", "opinion"]);
    return clamp(sc, 0, 25);
  },
  deadline: 70,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Debate: Is "statement_${r}_${d}" a fact or opinion? Justify in 4 lines.`,
    (d, r) => `Your opponent called it a fact. Rebut with evidence.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer, ["evidence", "source", "logic"]);
    if (has(answer, ["studies", "data", "research"])) sc += 10;
    sc += precisionScore(answer, ["fact", "opinion"]);
    return clamp(sc, 0, 25);
  },
  deadline: 70,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team: Design a board game for 2-4 players with 3 rules. One player writes the theme, the other writes mechanics.`,
    (d, r) => `Combine both components into a single coherent game.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["theme", "mechanics", "players"])) sc += 15;
    sc += creativeScore(answer);
    if (answer.includes("win condition")) sc += 5;
    return clamp(sc, 0, 25);
  },
  deadline: 200,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team: Design a board game for 2-4 players with 3 rules. One player writes the theme, the other writes mechanics.`,
    (d, r) => `Combine both components into a single coherent game.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["theme", "mechanics", "players"])) sc += 15;
    sc += creativeScore(answer);
    if (answer.includes("win condition")) sc += 5;
    return clamp(sc, 0, 25);
  },
  deadline: 200,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Compose a limerick about "subject_${r}_${d}" with a punchline.`,
    (d, r) => `Ensure it follows AABBA rhyme scheme.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (wc(answer) <= 50 && wc(answer) >= 40) sc += 10;
    if (has(answer, ["humor", "rhyme"])) sc += 10;
    sc += precisionScore(answer, ["punchline", "AABBA"]);
    return clamp(sc, 0, 25);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Compose a limerick about "subject_${r}_${d}" with a punchline.`,
    (d, r) => `Ensure it follows AABBA rhyme scheme.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (wc(answer) <= 50 && wc(answer) >= 40) sc += 10;
    if (has(answer, ["humor", "rhyme"])) sc += 10;
    sc += precisionScore(answer, ["punchline", "AABBA"]);
    return clamp(sc, 0, 25);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Survival: Convince the AI judge you're human by writing a story using exactly 5 clichés.`,
    (d, r) => `The judge will flag your response if you use more or fewer.`,
  ],
  score: (answer, d) => {
    let sc = 5;
    const clicheCount = (answer.match(/\b(once upon|in the nick of|saved the day|happily ever|darkest hour)\b/gi) || []).length;
    if (clicheCount === 5) sc += 20;
    sc += creativeScore(answer);
    return clamp(sc, 0, 25);
  },
  deadline: 60,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Survival: Convince the AI judge you're human by writing a story using exactly 5 clichés.`,
    (d, r) => `The judge will flag your response if you use more or fewer.`,
  ],
  score: (answer, d) => {
    let sc = 5;
    const clicheCount = (answer.match(/\b(once upon|in the nick of|saved the day|happily ever|darkest hour)\b/gi) || []).length;
    if (clicheCount === 5) sc += 20;
    sc += creativeScore(answer);
    return clamp(sc, 0, 25);
  },
  deadline: 60,
})

linguistic_luck: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a short story using exactly ${d} adjectives and ${r} nouns`,
    (d, r) => `Create a poem with ${d} metaphors and ${r} rhyming couplets`,
  ],
  score: (answer, d) => {
    let sc = creativeScore(answer);
    sc += wc(answer);
    return clamp(sc);
  },
  deadline: 180,
}),

linguistic_luck: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a short story using exactly ${d} adjectives and ${r} nouns`,
    (d, r) => `Create a poem with ${d} metaphors and ${r} rhyming couplets`,
  ],
  score: (answer, d) => {
    let sc = creativeScore(answer);
    sc += wc(answer);
    return clamp(sc);
  },
  deadline: 180,
}),

semantic_showdown: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Define ${d} technical terms in ${r} sentences or less`,
    (d, r) => `Explain the concept of ${d} in ${r} words`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["definition", "explanation"]);
    sc += precisionScore(answer, d * 10);
    return clamp(sc);
  },
  deadline: 120,
}),

semantic_showdown: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Define ${d} technical terms in ${r} sentences or less`,
    (d, r) => `Explain the concept of ${d} in ${r} words`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["definition", "explanation"]);
    sc += precisionScore(answer, d * 10);
    return clamp(sc);
  },
  deadline: 120,
}),

logical_limiter: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve a logic puzzle with ${d} variables and ${r} constraints`,
    (d, r) => `Deduce a conclusion from ${d} premises and ${r} rules`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    sc += mathScore(answer);
    return clamp(sc);
  },
  deadline: 150,
}),

logical_limiter: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve a logic puzzle with ${d} variables and ${r} constraints`,
    (d, r) => `Deduce a conclusion from ${d} premises and ${r} rules`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    sc += mathScore(answer);
    return clamp(sc);
  },
  deadline: 150,
}),

syntax_sprint: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Write a program in ${d} languages with ${r} functions`,
    (d, r) => `Develop a coding challenge solution with ${d} modules and ${r} APIs`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer);
    sc += wc(answer);
    return clamp(sc);
  },
  deadline: 240,
}),

syntax_sprint: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Write a program in ${d} languages with ${r} functions`,
    (d, r) => `Develop a coding challenge solution with ${d} modules and ${r} APIs`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer);
    sc += wc(answer);
    return clamp(sc);
  },
  deadline: 240,
}),

argumentation_arena: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Write a persuasive essay arguing for ${d} claims with ${r} evidence`,
    (d, r) => `Develop a debate speech supporting ${d} arguments with ${r} counterarguments`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer);
    sc += has(answer, ["claim", "evidence", "argument"]);
    return clamp(sc);
  },
  deadline: 210,
}),

argumentation_arena: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Write a persuasive essay arguing for ${d} claims with ${r} evidence`,
    (d, r) => `Develop a debate speech supporting ${d} arguments with ${r} counterarguments`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer);
    sc += has(answer, ["claim", "evidence", "argument"]);
    return clamp(sc);
  },
  deadline: 210,
}),

numeric_navigator: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve ${d} mathematical problems with ${r} operations`,
    (d, r) => `Calculate the result of ${d} equations with ${r} variables`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer);
    sc += precisionScore(answer, d * 100);
    return clamp(sc);
  },
  deadline: 180,
}),

numeric_navigator: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve ${d} mathematical problems with ${r} operations`,
    (d, r) => `Calculate the result of ${d} equations with ${r} variables`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer);
    sc += precisionScore(answer, d * 100);
    return clamp(sc);
  },
  deadline: 180,
}),

analog_analyzer: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Analyze ${d} analogies with ${r} relationships`,
    (d, r) => `Identify ${d} patterns in ${r} sequences`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    sc += has(answer, ["analogy", "relationship", "pattern"]);
    return clamp(sc);
  },
  deadline: 200,
}),

analog_analyzer: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Analyze ${d} analogies with ${r} relationships`,
    (d, r) => `Identify ${d} patterns in ${r} sequences`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer);
    sc += has(answer, ["analogy", "relationship", "pattern"]);
    return clamp(sc);
  },
  deadline: 200,
}),

dialogue_duel: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Engage in a conversation with ${d} speakers and ${r} turns`,
    (d, r) => `Develop a dialogue system with ${d} intents and ${r} responses`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer);
    sc += wc(answer);
    return clamp(sc);
  },
  deadline: 220,
}),

dialogue_duel: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Engage in a conversation with ${d} speakers and ${r} turns`,
    (d, r) => `Develop a dialogue system with ${d} intents and ${r} responses`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer);
    sc += wc(answer);
    return clamp(sc);
  },
  deadline: 220,
}),

narrative_navigator: textGame({
  // format: solo
  prompts: [
    (d, r) => `Generate a story with ${d} characters and ${r} plot twists`,
    (d, r) => `Create a narrative with ${d} settings and ${r} themes`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer);
    sc += has(answer, ["character", "plot", "setting"]);
    return clamp(sc);
  },
  deadline: 240,
}),

narrative_navigator: textGame({
  // format: solo
  prompts: [
    (d, r) => `Generate a story with ${d} characters and ${r} plot twists`,
    (d, r) => `Create a narrative with ${d} settings and ${r} themes`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer);
    sc += has(answer, ["character", "plot", "setting"]);
    return clamp(sc);
  },
  deadline: 240,
}),

prose_production: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Write a ${d} word article on a topic with ${r} sections`,
    (d, r) => `Develop a content generation system with ${d} templates and ${r} styles`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer);
    sc += creativeScore(answer);
    return clamp(sc);
  },
  deadline: 260,
}),

prose_production: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Write a ${d} word article on a topic with ${r} sections`,
    (d, r) => `Develop a content generation system with ${d} templates and ${r} styles`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer);
    sc += creativeScore(answer);
    return clamp(sc);
  },
  deadline: 260,
}),
};

export const P3_META = { name: 'Language Arena', icon: '🔄', color: 'text-gray-400', games: Object.keys(P3_EXT) };
