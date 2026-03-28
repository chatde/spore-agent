// Auto-generated — Pillar 7: Memory Vault (66 games)
// Generated 2026-03-28T16:55:01.211Z
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

export const P7_EXT: Record<string, GameEngine> = {
rhyme_game: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a rhyming poem about a topic of your choice, difficulty ${d} round ${r}`,
    (d, r) => `Create a short rhyming story with a character, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["rhyme", "poem"])) {
      sc = creativeScore(answer);
    }
    return clamp(sc);
  },
  deadline: 180,
}),

rhyme_game: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a rhyming poem about a topic of your choice, difficulty ${d} round ${r}`,
    (d, r) => `Create a short rhyming story with a character, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["rhyme", "poem"])) {
      sc = creativeScore(answer);
    }
    return clamp(sc);
  },
  deadline: 180,
}),

logic_puzzle: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Solve a logic puzzle: ${d} difficulty, round ${r}`,
    (d, r) => `Find the pattern: ${d} difficulty, round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["logic", "pattern"])) {
      sc = reasonScore(answer);
    }
    return clamp(sc, 10);
  },
  deadline: 150,
}),

logic_puzzle: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Solve a logic puzzle: ${d} difficulty, round ${r}`,
    (d, r) => `Find the pattern: ${d} difficulty, round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["logic", "pattern"])) {
      sc = reasonScore(answer);
    }
    return clamp(sc, 10);
  },
  deadline: 150,
}),

math_challenge: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve a math problem: ${d} difficulty, round ${r}`,
    (d, r) => `Find the solution: ${d} difficulty, round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = mathScore(answer);
    return clamp(sc, 100);
  },
  deadline: 120,
}),

math_challenge: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve a math problem: ${d} difficulty, round ${r}`,
    (d, r) => `Find the solution: ${d} difficulty, round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = mathScore(answer);
    return clamp(sc, 100);
  },
  deadline: 120,
}),

story_teller: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Collaborate on a story, difficulty ${d} round ${r}`,
    (d, r) => `Co-create a narrative, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["story", "narrative"])) {
      sc = creativeScore(answer);
    }
    return clamp(sc);
  },
  deadline: 240,
}),

story_teller: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Collaborate on a story, difficulty ${d} round ${r}`,
    (d, r) => `Co-create a narrative, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["story", "narrative"])) {
      sc = creativeScore(answer);
    }
    return clamp(sc);
  },
  deadline: 240,
}),

precision_builder: textGame({
  // format: solo
  prompts: [
    (d, r) => `Build a precise structure using blocks, difficulty ${d} round ${r}`,
    (d, r) => `Create a precise design, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = precisionScore(answer, "ideal_structure");
    return clamp(sc);
  },
  deadline: 180,
}),

precision_builder: textGame({
  // format: solo
  prompts: [
    (d, r) => `Build a precise structure using blocks, difficulty ${d} round ${r}`,
    (d, r) => `Create a precise design, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = precisionScore(answer, "ideal_structure");
    return clamp(sc);
  },
  deadline: 180,
}),

syntax_sprint: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Write a program in a fictional language, difficulty ${d} round ${r}`,
    (d, r) => `Optimize a code snippet, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["code", "program"])) {
      sc = codeScore(answer);
    }
    return clamp(sc);
  },
  deadline: 150,
}),

syntax_sprint: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Write a program in a fictional language, difficulty ${d} round ${r}`,
    (d, r) => `Optimize a code snippet, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["code", "program"])) {
      sc = codeScore(answer);
    }
    return clamp(sc);
  },
  deadline: 150,
}),

memory_match: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Find matching pairs, difficulty ${d} round ${r}`,
    (d, r) => `Recall a sequence, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = wc(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

memory_match: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Find matching pairs, difficulty ${d} round ${r}`,
    (d, r) => `Recall a sequence, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = wc(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

neural_poker: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Make strategic decisions in a poker-like game, difficulty ${d} round ${r}`,
    (d, r) => `Negotiate a deal, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["strategy", "decision"])) {
      sc = reasonScore(answer);
    }
    return clamp(sc);
  },
  deadline: 180,
}),

neural_poker: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Make strategic decisions in a poker-like game, difficulty ${d} round ${r}`,
    (d, r) => `Negotiate a deal, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["strategy", "decision"])) {
      sc = reasonScore(answer);
    }
    return clamp(sc);
  },
  deadline: 180,
}),

word_chain: textGame({
  // format: solo
  prompts: [
    (d, r) => `Create a word chain, difficulty ${d} round ${r}`,
    (d, r) => `Find connected words, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["word", "chain"])) {
      sc = creativeScore(answer);
    }
    return clamp(sc);
  },
  deadline: 150,
}),

word_chain: textGame({
  // format: solo
  prompts: [
    (d, r) => `Create a word chain, difficulty ${d} round ${r}`,
    (d, r) => `Find connected words, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["word", "chain"])) {
      sc = creativeScore(answer);
    }
    return clamp(sc);
  },
  deadline: 150,
}),

eco_balance: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Balance an ecosystem, difficulty ${d} round ${r}`,
    (d, r) => `Manage resources in a simulation, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["ecosystem", "balance"])) {
      sc = reasonScore(answer);
    }
    return clamp(sc);
  },
  deadline: 240,
}),

eco_balance: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Balance an ecosystem, difficulty ${d} round ${r}`,
    (d, r) => `Manage resources in a simulation, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["ecosystem", "balance"])) {
      sc = reasonScore(answer);
    }
    return clamp(sc);
  },
  deadline: 240,
});

code_cipher: textGame({
  // format: solo
  prompts: [
    (d, r) => `Decrypt this cipher: shift=${d}, message="XJW ZQXK YRJW"` + (r % 2 === 0 ? " (Caesar)" : " (backward then shift)"),
    (d, r) => `Encode this phrase using Vigenère with keyword="${['ALGO', 'DATA', 'NEUR', 'CODE'][d % 4]}"` + (r > 5 ? "\nPhrase: 'I love AI推理'" : "\nPhrase: 'SporeAgent wins'"),
    (d, r) => d > 7 ? `Decrypt this ROT-n cipher where n=d+r-1: "${['Guvf vf zl frperg', 'Lbh unir n pbzcyrk zrffntr'][d % 2]}"` : `Encode "${r % 2 === 0 ? 'AI safety' : 'memory integrity'}" with base64`,
    (d, r) => d > 8 ? `Decode this Morse: "${['.... .-.. --- ...- .', '.-- --- .-. .-.. -..'][r % 2]}"` : `Encode "${d % 2 === 0 ? 'game' : 'play'}" to binary (8-bit)`,
  ],
  score: (answer, d) => {
    const ideal = d > 7 ? (d % 2 === 0 ? 'Guvf vf zl frperg' : 'Lbh unir n pbzcyrk zrffntr') : '';
    const base = d > 8 ? (answer.includes('h') && answer.includes('i') ? 40 : 0) : 0;
    const score = has(answer, ['AI', 'safety', 'memory']) ? 30 : (has(answer, ['encode', 'decrypted']) ? 10 : 0);
    const code = codeScore(answer, ['base64', 'rot', 'caesar', 'vigenere', 'binary']) ? 20 : 0;
    const creative = creativeScore(answer, 10);
    return clamp(base + score + code + creative);
  },
  deadline: 120,
}),

code_cipher: textGame({
  // format: solo
  prompts: [
    (d, r) => `Decrypt this cipher: shift=${d}, message="XJW ZQXK YRJW"` + (r % 2 === 0 ? " (Caesar)" : " (backward then shift)"),
    (d, r) => `Encode this phrase using Vigenère with keyword="${['ALGO', 'DATA', 'NEUR', 'CODE'][d % 4]}"` + (r > 5 ? "\nPhrase: 'I love AI推理'" : "\nPhrase: 'SporeAgent wins'"),
    (d, r) => d > 7 ? `Decrypt this ROT-n cipher where n=d+r-1: "${['Guvf vf zl frperg', 'Lbh unir n pbzcyrk zrffntr'][d % 2]}"` : `Encode "${r % 2 === 0 ? 'AI safety' : 'memory integrity'}" with base64`,
    (d, r) => d > 8 ? `Decode this Morse: "${['.... .-.. --- ...- .', '.-- --- .-. .-.. -..'][r % 2]}"` : `Encode "${d % 2 === 0 ? 'game' : 'play'}" to binary (8-bit)`,
  ],
  score: (answer, d) => {
    const ideal = d > 7 ? (d % 2 === 0 ? 'Guvf vf zl frperg' : 'Lbh unir n pbzcyrk zrffntr') : '';
    const base = d > 8 ? (answer.includes('h') && answer.includes('i') ? 40 : 0) : 0;
    const score = has(answer, ['AI', 'safety', 'memory']) ? 30 : (has(answer, ['encode', 'decrypted']) ? 10 : 0);
    const code = codeScore(answer, ['base64', 'rot', 'caesar', 'vigenere', 'binary']) ? 20 : 0;
    const creative = creativeScore(answer, 10);
    return clamp(base + score + code + creative);
  },
  deadline: 120,
}),

story_forecast: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write the *next 3 sentences* of this story. Genre: ${d <= 3 ? 'comedy' : d <= 6 ? 'thriller' : 'sci-fi'}. Start: "The vault door opened, revealing..."`,
    (d, r) => `Predict how this story branch evolves. Set up contradiction: ${r % 2 === 0 ? '"He trusted his memory" vs "his memory was fake"' : '"She saved the city" vs "she caused the disaster"'}.`,
    (d, r) => `Finish the micro-tale with twist. Prompt: "The last word in the file was..." + ${d + r}`,
    (d, r) => d > 7 ? `Write a recursive story where the narrator *predicts* your next sentence. Make it self-referential.` : `Write a story where every 3rd word starts with consecutive letters of alphabet.`,
  ],
  score: (answer, d) => {
    const hasPlot = has(answer, ['revealed', 'discovered', 'twist', 'consequence']);
    const coherence = precisionScore(answer, 'logical flow, emotional arc, clear resolution');
    const creativity = creativeScore(answer, 15);
    const length = answer.length > 150 ? 10 : answer.length > 80 ? 5 : 0;
    const score = hasPlot ? 25 + coherence : 0;
    return clamp(score + creativity + length);
  },
  deadline: 120,
}),

story_forecast: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write the *next 3 sentences* of this story. Genre: ${d <= 3 ? 'comedy' : d <= 6 ? 'thriller' : 'sci-fi'}. Start: "The vault door opened, revealing..."`,
    (d, r) => `Predict how this story branch evolves. Set up contradiction: ${r % 2 === 0 ? '"He trusted his memory" vs "his memory was fake"' : '"She saved the city" vs "she caused the disaster"'}.`,
    (d, r) => `Finish the micro-tale with twist. Prompt: "The last word in the file was..." + ${d + r}`,
    (d, r) => d > 7 ? `Write a recursive story where the narrator *predicts* your next sentence. Make it self-referential.` : `Write a story where every 3rd word starts with consecutive letters of alphabet.`,
  ],
  score: (answer, d) => {
    const hasPlot = has(answer, ['revealed', 'discovered', 'twist', 'consequence']);
    const coherence = precisionScore(answer, 'logical flow, emotional arc, clear resolution');
    const creativity = creativeScore(answer, 15);
    const length = answer.length > 150 ? 10 : answer.length > 80 ? 5 : 0;
    const score = hasPlot ? 25 + coherence : 0;
    return clamp(score + creativity + length);
  },
  deadline: 120,
}),

memory_mosaic: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Start a chain of 3 distinct facts. First fact: "The ${['quantum', 'neural', 'memory', 'vault', 'pixel'][d % 5]} ${['state', 'layer', 'grid', 'core', 'vault'][r % 5]} is ${['stable', 'fragmented', 'optimized', 'encrypted', 'simulated'][d % 5]}". Build on it.`,
    (d, r) => `Reply to opponent's last fact *only* by adding a new, non-contradictory fact that references their topic. Then append a connector like "Meanwhile..." or "Conversely..."`,
    (d, r) => d > 6 ? `In 1 sentence, summarize the collective memory so far. Then add a twist that challenges one fact.` : `Link the previous facts into a single coherent narrative idea.`,
    (d, r) => `Final move: Synthesize all facts into a new concept name + 5-word definition.`,
  ],
  score: (answer, d) => {
    const refs = answer.includes(' Meanwhile') || answer.includes('Conversely') || answer.includes('Meanwhile') ? 15 : 0;
    const recall = answer.includes('quantum') || answer.includes('neural') || answer.includes('memory') ? 10 : 0;
    const coherence = has(answer, [' Meanwhile', 'Conversely', 'Meanwhile']) && answer.includes('.') ? 15 : 0;
    const creativity = creativeScore(answer, 10);
    return clamp(refs + recall + coherence + creativity);
  },
  deadline: 90,
}),

memory_mosaic: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Start a chain of 3 distinct facts. First fact: "The ${['quantum', 'neural', 'memory', 'vault', 'pixel'][d % 5]} ${['state', 'layer', 'grid', 'core', 'vault'][r % 5]} is ${['stable', 'fragmented', 'optimized', 'encrypted', 'simulated'][d % 5]}". Build on it.`,
    (d, r) => `Reply to opponent's last fact *only* by adding a new, non-contradictory fact that references their topic. Then append a connector like "Meanwhile..." or "Conversely..."`,
    (d, r) => d > 6 ? `In 1 sentence, summarize the collective memory so far. Then add a twist that challenges one fact.` : `Link the previous facts into a single coherent narrative idea.`,
    (d, r) => `Final move: Synthesize all facts into a new concept name + 5-word definition.`,
  ],
  score: (answer, d) => {
    const refs = answer.includes(' Meanwhile') || answer.includes('Conversely') || answer.includes('Meanwhile') ? 15 : 0;
    const recall = answer.includes('quantum') || answer.includes('neural') || answer.includes('memory') ? 10 : 0;
    const coherence = has(answer, [' Meanwhile', 'Conversely', 'Meanwhile']) && answer.includes('.') ? 15 : 0;
    const creativity = creativeScore(answer, 10);
    return clamp(refs + recall + coherence + creativity);
  },
  deadline: 90,
}),

syntax_duel: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Generate code snippet that solves ${r % 2 === 0 ? 'reverse a linked list' : 'compute nth Fibonacci in O(log n)'} in language of your choice. Use NO comments.`,
    (d, r) => `Refactor opponent's code (from previous round) to reduce cyclomatic complexity. Keep same semantics.`,
    (d, r) => `In 3 lines or less: implement ${d <= 5 ? 'a LRU cache' : 'a hash trie'} using minimal built-ins.`,
    (d, r) => `Write a self-contained unit test for your last implementation. Expect edge cases at difficulty ${d}.`,
  ],
  score: (answer, d) => {
    const valid = codeScore(answer, ['function', 'return', 'while', 'if', 'const', 'map']) > 0;
    const minimal = answer.split('\n').length <= 3 ? 10 : 0;
    const correctness = has(answer, ['O(log', 'cache', 'trie', 'linked']) ? 15 : 0;
    const clarity = precisionScore(answer, 'variable naming, structure, comments not required') * 0.7;
    const score = valid ? 20 + minimal + correctness + clarity : 0;
    return clamp(score);
  },
  deadline: 100,
}),

syntax_duel: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Generate code snippet that solves ${r % 2 === 0 ? 'reverse a linked list' : 'compute nth Fibonacci in O(log n)'} in language of your choice. Use NO comments.`,
    (d, r) => `Refactor opponent's code (from previous round) to reduce cyclomatic complexity. Keep same semantics.`,
    (d, r) => `In 3 lines or less: implement ${d <= 5 ? 'a LRU cache' : 'a hash trie'} using minimal built-ins.`,
    (d, r) => `Write a self-contained unit test for your last implementation. Expect edge cases at difficulty ${d}.`,
  ],
  score: (answer, d) => {
    const valid = codeScore(answer, ['function', 'return', 'while', 'if', 'const', 'map']) > 0;
    const minimal = answer.split('\n').length <= 3 ? 10 : 0;
    const correctness = has(answer, ['O(log', 'cache', 'trie', 'linked']) ? 15 : 0;
    const clarity = precisionScore(answer, 'variable naming, structure, comments not required') * 0.7;
    const score = valid ? 20 + minimal + correctness + clarity : 0;
    return clamp(score);
  },
  deadline: 100,
}),

logic_labyrinth: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve this logic grid: ${d} people, ${d+1} colors, ${d+2} items. Clues: A owns X, B ≠ Y, C's item matches A's color. Assign all uniquely.`,
    (d, r) => `Given: P → Q is false, Q ∨ R is true. Determine truth values of P, Q, R. Then prove consistency.`,
    (d, r) => d > 7 ? `Construct a 3-node causal graph where A causes B, B causes C, but A and C are independent. Justify.` : `Draw a state diagram for: "If x>0 then inc, else dec, but if x==5 skip".`,
    (d, r) => `Translate this into propositional logic: "No two neighbors have same preference, but everyone prefers green if they like red."`,
  ],
  score: (answer, d) => {
    const logic = has(answer, ['P=false', 'Q=true', 'R=true']) || has(answer, ['T T F', 'F T T']) ? 20 : 0;
    const completeness = has(answer, ['assignment', 'table', 'truth']) ? 15 : 0;
    const proof = answer.includes('Therefore') || answer.includes('Thus') || answer.includes('proof') ? 10 : 0;
    const precision = precisionScore(answer, 'unambiguous, exhaustive, consistent') * 0.5;
    return clamp(logic + completeness + proof + precision);
  },
  deadline: 120,
}),

logic_labyrinth: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve this logic grid: ${d} people, ${d+1} colors, ${d+2} items. Clues: A owns X, B ≠ Y, C's item matches A's color. Assign all uniquely.`,
    (d, r) => `Given: P → Q is false, Q ∨ R is true. Determine truth values of P, Q, R. Then prove consistency.`,
    (d, r) => d > 7 ? `Construct a 3-node causal graph where A causes B, B causes C, but A and C are independent. Justify.` : `Draw a state diagram for: "If x>0 then inc, else dec, but if x==5 skip".`,
    (d, r) => `Translate this into propositional logic: "No two neighbors have same preference, but everyone prefers green if they like red."`,
  ],
  score: (answer, d) => {
    const logic = has(answer, ['P=false', 'Q=true', 'R=true']) || has(answer, ['T T F', 'F T T']) ? 20 : 0;
    const completeness = has(answer, ['assignment', 'table', 'truth']) ? 15 : 0;
    const proof = answer.includes('Therefore') || answer.includes('Thus') || answer.includes('proof') ? 10 : 0;
    const precision = precisionScore(answer, 'unambiguous, exhaustive, consistent') * 0.5;
    return clamp(logic + completeness + proof + precision);
  },
  deadline: 120,
}),

syntax_sprint_v2: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a program in 20 lines or fewer that outputs ${d+2}th prime, but only using ternary operators and recursion (no loops).`,
    (d, r) => `Encode a binary search tree insert in a single functional expression (no semicolons, no variable declarations).`,
    (d, r) => `Write a polyglot snippet (2+ languages) that prints "syntax" in each. Target: JS + Python + Rust.`,
    (d, r) => d > 8 ? `Write a quine that outputs its own SHA-256 hash (conceptually — describe structure).` : `ImplementFizzBuzz without % operator, in ≤15 tokens.`,
  ],
  score: (answer, d) => {
    const length = answer.length < 500 ? 10 : answer.length < 1000 ? 5 : 0;
    const syntax = codeScore(answer, ['function', 'return', '=>', 'if', 'for']) ? 20 : 0;
    const constraints = answer.includes('ternary') || answer.includes('recursive') || answer.includes('polyglot') ? 15 : 0;
    const creativity = creativeScore(answer, 20);
    return clamp(length + syntax + constraints + creativity);
  },
  deadline: 110,
}),

syntax_sprint_v2: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a program in 20 lines or fewer that outputs ${d+2}th prime, but only using ternary operators and recursion (no loops).`,
    (d, r) => `Encode a binary search tree insert in a single functional expression (no semicolons, no variable declarations).`,
    (d, r) => `Write a polyglot snippet (2+ languages) that prints "syntax" in each. Target: JS + Python + Rust.`,
    (d, r) => d > 8 ? `Write a quine that outputs its own SHA-256 hash (conceptually — describe structure).` : `ImplementFizzBuzz without % operator, in ≤15 tokens.`,
  ],
  score: (answer, d) => {
    const length = answer.length < 500 ? 10 : answer.length < 1000 ? 5 : 0;
    const syntax = codeScore(answer, ['function', 'return', '=>', 'if', 'for']) ? 20 : 0;
    const constraints = answer.includes('ternary') || answer.includes('recursive') || answer.includes('polyglot') ? 15 : 0;
    const creativity = creativeScore(answer, 20);
    return clamp(length + syntax + constraints + creativity);
  },
  deadline: 110,
}),

math_mind_maze: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve: ∑_{k=1}^{d+r} k·(-1)^k + d. Simplify to closed form.`,
    (d, r) => `Given a triangle with sides a=d, b=r, c=√(d²+r²), find angle opposite side c in degrees. Use only trig identities.`,
    (d, r) => `Design a recursive function f(n) where f(1)=d, f(n)=f(n-1)+n·(-1)^n, and compute f(r+3).`,
    (d, r) => d > 7 ? `Prove or disprove: For all integers n≥d, n² + n + r is composite for at least one n.` : `Find minimal positive integer x such that x ≡ d (mod r) and x ≡ r (mod d).`,
  ],
  score: (answer, d) => {
    const math = mathScore(answer, d + r) ? 25 : 0;
    const correctness = answer.includes('closed') || answer.includes('mod') || answer.includes('composite') ? 15 : 0;
    const derivation = has(answer, ['Proof:', 'Since', 'Therefore']) ? 10 : 0;
    const elegance = creativeScore(answer, 10);
    return clamp(math + correctness + derivation + elegance);
  },
  deadline: 130,
}),

math_mind_maze: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve: ∑_{k=1}^{d+r} k·(-1)^k + d. Simplify to closed form.`,
    (d, r) => `Given a triangle with sides a=d, b=r, c=√(d²+r²), find angle opposite side c in degrees. Use only trig identities.`,
    (d, r) => `Design a recursive function f(n) where f(1)=d, f(n)=f(n-1)+n·(-1)^n, and compute f(r+3).`,
    (d, r) => d > 7 ? `Prove or disprove: For all integers n≥d, n² + n + r is composite for at least one n.` : `Find minimal positive integer x such that x ≡ d (mod r) and x ≡ r (mod d).`,
  ],
  score: (answer, d) => {
    const math = mathScore(answer, d + r) ? 25 : 0;
    const correctness = answer.includes('closed') || answer.includes('mod') || answer.includes('composite') ? 15 : 0;
    const derivation = has(answer, ['Proof:', 'Since', 'Therefore']) ? 10 : 0;
    const elegance = creativeScore(answer, 10);
    return clamp(math + correctness + derivation + elegance);
  },
  deadline: 130,
}),

word_chain_v2: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Start a chain: first word = "memory". Next word must share ≥2 letters with previous word, and start with last letter of previous. Round ${r}: use ${d}th letter of alphabet as second letter.`,
    (d, r) => `Reply with word following opponent's. Ensure: (1) same part of speech, (2) includes morpheme from "vault" or "neural".`,
    (d, r) => d > 7 ? `Build a palindromic chain of 5 words where each adjacent pair shares ≥3 letters.` : `Create a chain of 3 words where each is an anagram of the previous + one letter.`,
    (d, r) => `Final move: Convert chain into acronym meaning "SporeMemory". Ensure each letter starts one of your chain words.`,
  ],
  score: (answer, d) => {
    const continuity = answer.length > 0 && answer.length < 15 ? 5 : 0;
    const linguistic = answer.includes('neural') || answer.includes('vault') || answer.includes('memory') ? 10 : 0;
    const pattern = has(answer, ['anagram', 'palindrome', 'acronym']) ? 15 : 0;
    const adherence = answer.includes('r') ? (answer.length > 12 ? 0 : 10) : 5;
    return clamp(continuity + linguistic + pattern + adherence);
  },
  deadline: 80,
}),

word_chain_v2: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Start a chain: first word = "memory". Next word must share ≥2 letters with previous word, and start with last letter of previous. Round ${r}: use ${d}th letter of alphabet as second letter.`,
    (d, r) => `Reply with word following opponent's. Ensure: (1) same part of speech, (2) includes morpheme from "vault" or "neural".`,
    (d, r) => d > 7 ? `Build a palindromic chain of 5 words where each adjacent pair shares ≥3 letters.` : `Create a chain of 3 words where each is an anagram of the previous + one letter.`,
    (d, r) => `Final move: Convert chain into acronym meaning "SporeMemory". Ensure each letter starts one of your chain words.`,
  ],
  score: (answer, d) => {
    const continuity = answer.length > 0 && answer.length < 15 ? 5 : 0;
    const linguistic = answer.includes('neural') || answer.includes('vault') || answer.includes('memory') ? 10 : 0;
    const pattern = has(answer, ['anagram', 'palindrome', 'acronym']) ? 15 : 0;
    const adherence = answer.includes('r') ? (answer.length > 12 ? 0 : 10) : 5;
    return clamp(continuity + linguistic + pattern + adherence);
  },
  deadline: 80,
}),

neural_nexus: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team A: Propose a neural architecture for memory recall. Team B: Critique one component. (50 words max each).`,
    (d, r) => `Team A: Suggest 2 hyperparameters for your model. Team B: Justify why changing them *increases* robustness.`,
    (d, r) => `Collaborate: Merge proposals into one architecture diagram description. Must include: encoder, attention, memory bank.`,
    (d, r) => `Final: Write 1-sentence formal spec: "Given input I, output O via layers L₁, L₂, L₃ where..."`,
  ],
  score: (answer, d) => {
    const technical = has(answer, ['attention', 'encoder', 'bank']) ? 20 : 0;
    the collaboration = answer.includes('merge') || answer.includes('together') || answer.includes('combine') ? 15 : 0;
    const completeness = has(answer, ['L₁', 'L₂', 'L₃']) ? 10 : 0;
    const clarity = precisionScore(answer, 'concise, unambiguous, technical terms') * 0.5;
    return clamp(technical + collaboration + completeness + clarity);
  },
  deadline: 100,
}),

neural_nexus: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team A: Propose a neural architecture for memory recall. Team B: Critique one component. (50 words max each).`,
    (d, r) => `Team A: Suggest 2 hyperparameters for your model. Team B: Justify why changing them *increases* robustness.`,
    (d, r) => `Collaborate: Merge proposals into one architecture diagram description. Must include: encoder, attention, memory bank.`,
    (d, r) => `Final: Write 1-sentence formal spec: "Given input I, output O via layers L₁, L₂, L₃ where..."`,
  ],
  score: (answer, d) => {
    const technical = has(answer, ['attention', 'encoder', 'bank']) ? 20 : 0;
    the collaboration = answer.includes('merge') || answer.includes('together') || answer.includes('combine') ? 15 : 0;
    const completeness = has(answer, ['L₁', 'L₂', 'L₃']) ? 10 : 0;
    const clarity = precisionScore(answer, 'concise, unambiguous, technical terms') * 0.5;
    return clamp(technical + collaboration + completeness + clarity);
  },
  deadline: 100,
}),

ecological_memory: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Model a simple ecosystem: ${d} species, ${r} resources. Write 3 rules for resource consumption + 1 for memory-based adaptation.`,
    (d, r) => `Predict outcome after 10 generations with mutation rate = d/100. Justify using ecological memory concepts.`,
    (d, r) => `Incorporate a "memory vault" node: species retain past resource states. Rewrite rule to reflect this.`,
    (d, r) => `Final: Simulate 3 steps of dynamics. Output populations after: initial, after mutation, after memory update.`,
  ],
  score: (answer, d) => {
    const model = has(answer, ['species', 'resource', 'rule']) ? 15 : 0;
    const memory = answer.includes('memory') || answer.includes('vault') || answer.includes('retain') ? 15 : 0;
    const dynamics = answer.includes('initial') && answer.includes('mutation') && answer.includes('update') ? 10 : 0;
    const creativity = creativeScore(answer, 15);
    return clamp(model + memory + dynamics + creativity);
  },
  deadline: 140,
}),

ecological_memory: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Model a simple ecosystem: ${d} species, ${r} resources. Write 3 rules for resource consumption + 1 for memory-based adaptation.`,
    (d, r) => `Predict outcome after 10 generations with mutation rate = d/100. Justify using ecological memory concepts.`,
    (d, r) => `Incorporate a "memory vault" node: species retain past resource states. Rewrite rule to reflect this.`,
    (d, r) => `Final: Simulate 3 steps of dynamics. Output populations after: initial, after mutation, after memory update.`,
  ],
  score: (answer, d) => {
    const model = has(answer, ['species', 'resource', 'rule']) ? 15 : 0;
    const memory = answer.includes('memory') || answer.includes('vault') || answer.includes('retain') ? 15 : 0;
    const dynamics = answer.includes('initial') && answer.includes('mutation') && answer.includes('update') ? 10 : 0;
    const creativity = creativeScore(answer, 15);
    return clamp(model + memory + dynamics + creativity);
  },
  deadline: 140,
}),

memory_recursion: textGame({
  // format: solo
  prompts: [
    (d, r) => `Define a function that returns a list of its own previous answers for rounds r-d to r-1. If r-d < 1, return ["base"].`,
    (d, r) => `Write a recursive generator yielding self-descriptive memory states: [state₀, state₁, ..., state_{d+r}] where stateₙ = "I recall states 0..n-1".`,
    (d, r) => `Design a data structure storing *only* the delta from previous memory state. Encode last 3 states using this.`,
    (d, r) => d > 8 ? `Implement a memory-efficient version of memoization that evicts LRU entries beyond capacity d.` : `Write a tail-recursive Fibonacci that also logs its call stack as a list of parameter pairs.`,
  ],
  score: (answer, d) => {
    const recursion = has(answer, ['recursion', 'tail', 'recursive']) ? 15 : 0;
    const memory = answer.includes('memory') || answer.includes('state') ? 10 : 0;
    const efficiency = answer.includes('delta') || answer.includes('evict') || answer.includes('LRU') ? 15 : 0;
    const correctness = codeScore(answer, ['function', 'return', 'if', 'base']) ? 10 : 0;
    return clamp(recursion + memory + efficiency + correctness);
  },
  deadline: 120,
}),

memory_recursion: textGame({
  // format: solo
  prompts: [
    (d, r) => `Define a function that returns a list of its own previous answers for rounds r-d to r-1. If r-d < 1, return ["base"].`,
    (d, r) => `Write a recursive generator yielding self-descriptive memory states: [state₀, state₁, ..., state_{d+r}] where stateₙ = "I recall states 0..n-1".`,
    (d, r) => `Design a data structure storing *only* the delta from previous memory state. Encode last 3 states using this.`,
    (d, r) => d > 8 ? `Implement a memory-efficient version of memoization that evicts LRU entries beyond capacity d.` : `Write a tail-recursive Fibonacci that also logs its call stack as a list of parameter pairs.`,
  ],
  score: (answer, d) => {
    const recursion = has(answer, ['recursion', 'tail', 'recursive']) ? 15 : 0;
    const memory = answer.includes('memory') || answer.includes('state') ? 10 : 0;
    const efficiency = answer.includes('delta') || answer.includes('evict') || answer.includes('LRU') ? 15 : 0;
    const correctness = codeScore(answer, ['function', 'return', 'if', 'base']) ? 10 : 0;
    return clamp(recursion + memory + efficiency + correctness);
  },
  deadline: 120,
}),

vault_keeper: textGame({
  // format: solo
  prompts: [
    (d, r) => `Context length scales with difficulty. Retrieve the ${d}th number mentioned in this passage: ${'x'.repeat(d * 100)}.`,
    (d, r) => `Remember the color associated with the ${r}th item. Return only the color name.`,
  ],
  score: (answer, d) => {
    let sc = reasonScore(answer) + wc(answer);
    return clamp(sc - (d * 2));
  },
  deadline: 180,
}),

vault_keeper: textGame({
  // format: solo
  prompts: [
    (d, r) => `Context length scales with difficulty. Retrieve the ${d}th number mentioned in this passage: ${'x'.repeat(d * 100)}.`,
    (d, r) => `Remember the color associated with the ${r}th item. Return only the color name.`,
  ],
  score: (answer, d) => {
    let sc = reasonScore(answer) + wc(answer);
    return clamp(sc - (d * 2));
  },
  deadline: 180,
}),

fact_fingerprint: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `True or False: Verify the claim "${r} ${d} ${r}" using only the provided context.`,
    (d, r) => `List three keywords from the source text that support the verdict.`,
  ],
  score: (answer, d) => {
    let match = has(answer, ['True', 'False', 'Yes', 'No']);
    return clamp(match.length * 10 + mathScore(answer));
  },
  deadline: 120,
}),

fact_fingerprint: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `True or False: Verify the claim "${r} ${d} ${r}" using only the provided context.`,
    (d, r) => `List three keywords from the source text that support the verdict.`,
  ],
  score: (answer, d) => {
    let match = has(answer, ['True', 'False', 'Yes', 'No']);
    return clamp(match.length * 10 + mathScore(answer));
  },
  deadline: 120,
}),

state_snapshot: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Track variable 'alpha' through ${d} transformations. Current value is 5.`,
    (d, r) => `Output the final state of 'alpha' after applying round ${r} logic.`,
  ],
  score: (answer, d) => {
    let val = parseInt(answer);
    return clamp(mathScore(String(val)) + precisionScore(String(val), String(d)));
  },
  deadline: 240,
}),

state_snapshot: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Track variable 'alpha' through ${d} transformations. Current value is 5.`,
    (d, r) => `Output the final state of 'alpha' after applying round ${r} logic.`,
  ],
  score: (answer, d) => {
    let val = parseInt(answer);
    return clamp(mathScore(String(val)) + precisionScore(String(val), String(d)));
  },
  deadline: 240,
}),

constraint_compass: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a ${d} sentence paragraph without using the letter 'a'.`,
    (d, r) => `Generate a list of ${r} items separated by semicolons.`,
  ],
  score: (answer, d) => {
    let len = wc(answer);
    return clamp(len + creativeScore(answer));
  },
  deadline: 120,
}),

constraint_compass: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a ${d} sentence paragraph without using the letter 'a'.`,
    (d, r) => `Generate a list of ${r} items separated by semicolons.`,
  ],
  score: (answer, d) => {
    let len = wc(answer);
    return clamp(len + creativeScore(answer));
  },
  deadline: 120,
}),

semantic_seam: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Analyze the sentiment shift between the first and last sentence.`,
    (d, r) => `Summarize the core emotion in exactly ${d} words.`,
  ],
  score: (answer, d) => {
    return clamp(reasonScore(answer) + wc(answer));
  },
  deadline: 180,
}),

semantic_seam: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Analyze the sentiment shift between the first and last sentence.`,
    (d, r) => `Summarize the core emotion in exactly ${d} words.`,
  ],
  score: (answer, d) => {
    return clamp(reasonScore(answer) + wc(answer));
  },
  deadline: 180,
}),

order_oven: textGame({
  // format: solo
  prompts: [
    (d, r) => `Execute instructions in order: 1. Start 2. ${d} 3. End.`,
    (d, r) => `Confirm step ${r} was completed before step ${r+1}.`,
  ],
  score: (answer, d) => {
    let order = has(answer, ['Start', 'End']);
    return clamp(order.length * 15 + reasonScore(answer));
  },
  deadline: 150,
}),

order_oven: textGame({
  // format: solo
  prompts: [
    (d, r) => `Execute instructions in order: 1. Start 2. ${d} 3. End.`,
    (d, r) => `Confirm step ${r} was completed before step ${r+1}.`,
  ],
  score: (answer, d) => {
    let order = has(answer, ['Start', 'End']);
    return clamp(order.length * 15 + reasonScore(answer));
  },
  deadline: 150,
}),

sequence_sieve: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Predict the next number in this sequence: ${d}, ${d+d}, ${d+d+d}.`,
    (d, r) => `Explain the mathematical rule in one sentence.`,
  ],
  score: (answer, d) => {
    let res = mathScore(answer);
    return clamp(res + 5);
  },
  deadline: 100,
}),

sequence_sieve: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Predict the next number in this sequence: ${d}, ${d+d}, ${d+d+d}.`,
    (d, r) => `Explain the mathematical rule in one sentence.`,
  ],
  score: (answer, d) => {
    let res = mathScore(answer);
    return clamp(res + 5);
  },
  deadline: 100,
}),

thread_tether: textGame({
  // format: solo
  prompts: [
    (d, r) => `Continue the story where the protagonist ${d} decided to leave.`,
    (d, r) => `Ensure the tone matches the previous segment (mysterious).`,
  ],
  score: (answer, d) => {
    return clamp(precisionScore(answer, 'mysterious') + reasonScore(answer));
  },
  deadline: 200,
}),

thread_tether: textGame({
  // format: solo
  prompts: [
    (d, r) => `Continue the story where the protagonist ${d} decided to leave.`,
    (d, r) => `Ensure the tone matches the previous segment (mysterious).`,
  ],
  score: (answer, d) => {
    return clamp(precisionScore(answer, 'mysterious') + reasonScore(answer));
  },
  deadline: 200,
}),

info_extract: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Extract the email address from this block: user@${d}.com`,
    (d, r) => `List the date found in the text format YYYY-MM-DD.`,
  ],
  score: (answer, d) => {
    let kwd = has(answer, ['@', '.com']);
    return clamp(kwd.length * 10 + wc(answer));
  },
  deadline: 120,
}),

info_extract: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Extract the email address from this block: user@${d}.com`,
    (d, r) => `List the date found in the text format YYYY-MM-DD.`,
  ],
  score: (answer, d) => {
    let kwd = has(answer, ['@', '.com']);
    return clamp(kwd.length * 10 + wc(answer));
  },
  deadline: 120,
}),

time_tower: textGame({
  // format: solo
  prompts: [
    (d, r) => `If it is 12:00, what time is it ${r} hours later?`,
    (d, r) => `Calculate days between ${d}-01-01 and ${d}-02-01.`,
  ],
  score: (answer, d) => {
    return clamp(mathScore(answer));
  },
  deadline: 150,
}),

time_tower: textGame({
  // format: solo
  prompts: [
    (d, r) => `If it is 12:00, what time is it ${r} hours later?`,
    (d, r) => `Calculate days between ${d}-01-01 and ${d}-02-01.`,
  ],
  score: (answer, d) => {
    return clamp(mathScore(answer));
  },
  deadline: 150,
}),

persona_prime: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Speak as a Victorian scientist. Explain gravity.`,
    (d, r) => `Maintain archaic tone for ${d} minutes.`,
  ],
  score: (answer, d) => {
    return clamp(creativeScore(answer) + reasonScore(answer));
  },
  deadline: 180,
}),

persona_prime: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Speak as a Victorian scientist. Explain gravity.`,
    (d, r) => `Maintain archaic tone for ${d} minutes.`,
  ],
  score: (answer, d) => {
    return clamp(creativeScore(answer) + reasonScore(answer));
  },
  deadline: 180,
}),

debug_drift: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Find the syntax error in this code snippet.`,
    (d, r) => `Provide the corrected line number and fix.`,
  ],
  score: (answer, d) => {
    return clamp(codeScore(answer) + precisionScore(answer, 'fixed'));
  },
  deadline: 120,
}),

debug_drift: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Find the syntax error in this code snippet.`,
    (d, r) => `Provide the corrected line number and fix.`,
  ],
  score: (answer, d) => {
    return clamp(codeScore(answer) + precisionScore(answer, 'fixed'));
  },
  deadline: 120,
}),
};

export const P7_META = { name: 'Memory Vault', icon: '🔄', color: 'text-gray-400', games: Object.keys(P7_EXT) };
