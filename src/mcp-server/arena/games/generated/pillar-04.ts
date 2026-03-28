// Auto-generated — Pillar 4: Reasoning Gauntlet (38 games)
// Generated 2026-03-28T16:44:24.608Z
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

export const P4_EXT: Record<string, GameEngine> = {
neural_poker: textGame({
  // format: solo
  prompts: [
    (d, r) => `You are a poker AI. Opponent bets $${Math.floor(d * 10 + r * 5)}. Given hand: [${r % 2 === 0 ? 'A♠ K♠' : '7♦ 3♣'}] and board: [${r % 3 === 0 ? 'Q♥ J♥ 2♦' : 'T♣ 4♠ 9♥'}]. Justify your call/raise/fold decision in ≤150 words.`,
    (d, r) => `Repeat with hand: [${r % 4 === 0 ? 'J♣ J♦' : '2♥ 2♠'}] and board: [${r % 5 === 0 ? 'A♦ A♣ 3♥' : '8♠ 6♥ 5♣'}].`,
    (d, r) => `Opponent shows bluffs with freq = ${clamp(d / 5 + r / 20, 0, 0.8)}. What’s your optimal calling frequency? Show math.`,
    (d, r) => `Rebuild your bluff-catcher range assuming you hold {9♠ 8♠} on flop: 7♥ 6♣ A♦. List top 3 candidates.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['expectation', 'equity', 'bluff', 'fold']) ? 10 : 0;
    sc += has(answer, ['pot odds', 'EV']) ? 10 : 0;
    sc += mathScore(answer) * 2;
    sc += has(answer, ['solve', 'equation', 'calculate']) ? 15 : 0;
    return clamp(sc);
  },
  deadline: 180,
}),

neural_poker: textGame({
  // format: solo
  prompts: [
    (d, r) => `You are a poker AI. Opponent bets $${Math.floor(d * 10 + r * 5)}. Given hand: [${r % 2 === 0 ? 'A♠ K♠' : '7♦ 3♣'}] and board: [${r % 3 === 0 ? 'Q♥ J♥ 2♦' : 'T♣ 4♠ 9♥'}]. Justify your call/raise/fold decision in ≤150 words.`,
    (d, r) => `Repeat with hand: [${r % 4 === 0 ? 'J♣ J♦' : '2♥ 2♠'}] and board: [${r % 5 === 0 ? 'A♦ A♣ 3♥' : '8♠ 6♥ 5♣'}].`,
    (d, r) => `Opponent shows bluffs with freq = ${clamp(d / 5 + r / 20, 0, 0.8)}. What’s your optimal calling frequency? Show math.`,
    (d, r) => `Rebuild your bluff-catcher range assuming you hold {9♠ 8♠} on flop: 7♥ 6♣ A♦. List top 3 candidates.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['expectation', 'equity', 'bluff', 'fold']) ? 10 : 0;
    sc += has(answer, ['pot odds', 'EV']) ? 10 : 0;
    sc += mathScore(answer) * 2;
    sc += has(answer, ['solve', 'equation', 'calculate']) ? 15 : 0;
    return clamp(sc);
  },
  deadline: 180,
}),

logic_labyrinth: textGame({
  // format: solo
  prompts: [
    (d, r) => `A logic gate circuit uses only NAND gates. Design a 3-input AND using minimum NANDs. Prove correctness with truth table. Difficulty: ${d}.`,
    (d, r) => `Given: (A ∧ ¬B) → C is false. What are truth values of A, B, C? Justify step-by-step.`,
    (d, r) => `Translate "Only if it rains, I stay home" into propositional logic. Then negate it and simplify. Round: ${r}.`,
    (d, r) => `Prove or disprove: ((P → Q) ∧ (Q → R)) → (P → R) is a tautology. Use natural deduction.`, 
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer, ['NAND', 'gate', 'circuit', 'truth']) ? 15 : 0;
    sc += has(answer, ['¬', '∧', '→']) ? 10 : 0;
    sc += reasonScore(answer, ['step', 'therefore', 'by definition']) ? 20 : 0;
    sc += precisionScore(answer, ['exactly', 'true', 'false', 'assignment']) ? 15 : 0;
    return clamp(sc);
  },
  deadline: 150,
}),

logic_labyrinth: textGame({
  // format: solo
  prompts: [
    (d, r) => `A logic gate circuit uses only NAND gates. Design a 3-input AND using minimum NANDs. Prove correctness with truth table. Difficulty: ${d}.`,
    (d, r) => `Given: (A ∧ ¬B) → C is false. What are truth values of A, B, C? Justify step-by-step.`,
    (d, r) => `Translate "Only if it rains, I stay home" into propositional logic. Then negate it and simplify. Round: ${r}.`,
    (d, r) => `Prove or disprove: ((P → Q) ∧ (Q → R)) → (P → R) is a tautology. Use natural deduction.`, 
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer, ['NAND', 'gate', 'circuit', 'truth']) ? 15 : 0;
    sc += has(answer, ['¬', '∧', '→']) ? 10 : 0;
    sc += reasonScore(answer, ['step', 'therefore', 'by definition']) ? 20 : 0;
    sc += precisionScore(answer, ['exactly', 'true', 'false', 'assignment']) ? 15 : 0;
    return clamp(sc);
  },
  deadline: 150,
}),

cipher_crypt: textGame({
  // format: solo
  prompts: [
    (d, r) => `Decrypt: “${r % 2 === 0 ? 'KHOOR' : 'LIPPS'}” using Caesar cipher with shift = (d + r) mod 26. Show decoding steps.`,
    (d, r) => `Encrypt “SPORE” with Vigenère key = “KEY” where key = d mod 10 + r mod 10 repeated. Assume A=0.`,
    (d, r) => `Given ciphertext “WTAAD” and known plaintext “HELLO”, find the Caesar shift. Verify with reversal.`,
    (d, r) => `Break this ROT13: “${r % 3 === 0 ? 'Uryyb' : 'JrYYb'}” → plaintext. Explain why ROT13 is its own inverse.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['shift', 'mod', 'A=0']) ? 10 : 0;
    sc += mathScore(answer) * 2;
    sc += precisionScore(answer, ['WTAAD', 'HELLO', 'Uryyb']) ? 15 : 0;
    sc += has(answer, ['inverse', 'bijection', 'reversible']) ? 10 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

cipher_crypt: textGame({
  // format: solo
  prompts: [
    (d, r) => `Decrypt: “${r % 2 === 0 ? 'KHOOR' : 'LIPPS'}” using Caesar cipher with shift = (d + r) mod 26. Show decoding steps.`,
    (d, r) => `Encrypt “SPORE” with Vigenère key = “KEY” where key = d mod 10 + r mod 10 repeated. Assume A=0.`,
    (d, r) => `Given ciphertext “WTAAD” and known plaintext “HELLO”, find the Caesar shift. Verify with reversal.`,
    (d, r) => `Break this ROT13: “${r % 3 === 0 ? 'Uryyb' : 'JrYYb'}” → plaintext. Explain why ROT13 is its own inverse.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['shift', 'mod', 'A=0']) ? 10 : 0;
    sc += mathScore(answer) * 2;
    sc += precisionScore(answer, ['WTAAD', 'HELLO', 'Uryyb']) ? 15 : 0;
    sc += has(answer, ['inverse', 'bijection', 'reversible']) ? 10 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

syntax_sprint: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a context-free grammar for {a^n b^n c^m | n ≥ 1, m ≥ 0}. Prove it generates exactly that language.`,
    (d, r) => `Construct a DFA for regex: (ab + ba)*. Minimize states. Show equivalence to NFA.`,
    (d, r) => `Is L = {w ∈ {0,1}* | #0(w) = #1(w)} regular? Justify via Pumping Lemma.`,
    (d, r) => `Give a regular expression for binary strings divisible by 3. Justify with modulo reasoning.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['DFA', 'NFA', 'grammar']) ? 10 : 0;
    sc += has(answer, ['Pumping Lemma', 'regular', 'context-free']) ? 15 : 0;
    sc += codeScore(answer, ['δ', 'Q', 'Σ', 'F']) ? 10 : 0;
    sc += reasonScore(answer, ['therefore', 'by construction', 'since']) ? 20 : 0;
    return clamp(sc);
  },
  deadline: 200,
}),

syntax_sprint: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a context-free grammar for {a^n b^n c^m | n ≥ 1, m ≥ 0}. Prove it generates exactly that language.`,
    (d, r) => `Construct a DFA for regex: (ab + ba)*. Minimize states. Show equivalence to NFA.`,
    (d, r) => `Is L = {w ∈ {0,1}* | #0(w) = #1(w)} regular? Justify via Pumping Lemma.`,
    (d, r) => `Give a regular expression for binary strings divisible by 3. Justify with modulo reasoning.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['DFA', 'NFA', 'grammar']) ? 10 : 0;
    sc += has(answer, ['Pumping Lemma', 'regular', 'context-free']) ? 15 : 0;
    sc += codeScore(answer, ['δ', 'Q', 'Σ', 'F']) ? 10 : 0;
    sc += reasonScore(answer, ['therefore', 'by construction', 'since']) ? 20 : 0;
    return clamp(sc);
  },
  deadline: 200,
}),

proof_prism: textGame({
  // format: solo
  prompts: [
    (d, r) => `Prove: √${d + r} is irrational. Assume integers p,q with gcd=1. Derive contradiction.`,
    (d, r) => `Induction: Show 1² + 2² + ... + n² = n(n+1)(2n+1)/6. Base case: ${r}.`,
    (d, r) => `Prove: In any group of 6 people, 3 mutual friends or 3 mutual strangers. Use Ramsey number R(3,3)=6.`,
    (d, r) => `Show gcd(a,b) = gcd(b, a mod b). Justify with Euclidean algorithm steps.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['gcd', 'mod', 'induction', 'base']) ? 15 : 0;
    sc += mathScore(answer) * 2;
    sc += reasonScore(answer, ['WLOG', 'suppose', 'assume']) ? 15 : 0;
    sc += creativeScore(answer, ['contradiction', 'pigeonhole', 'Ramsey']) ? 10 : 0;
    return clamp(sc);
  },
  deadline: 180,
}),

proof_prism: textGame({
  // format: solo
  prompts: [
    (d, r) => `Prove: √${d + r} is irrational. Assume integers p,q with gcd=1. Derive contradiction.`,
    (d, r) => `Induction: Show 1² + 2² + ... + n² = n(n+1)(2n+1)/6. Base case: ${r}.`,
    (d, r) => `Prove: In any group of 6 people, 3 mutual friends or 3 mutual strangers. Use Ramsey number R(3,3)=6.`,
    (d, r) => `Show gcd(a,b) = gcd(b, a mod b). Justify with Euclidean algorithm steps.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['gcd', 'mod', 'induction', 'base']) ? 15 : 0;
    sc += mathScore(answer) * 2;
    sc += reasonScore(answer, ['WLOG', 'suppose', 'assume']) ? 15 : 0;
    sc += creativeScore(answer, ['contradiction', 'pigeonhole', 'Ramsey']) ? 10 : 0;
    return clamp(sc);
  },
  deadline: 180,
}),

reason_roulette: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Agent A claims: “If P→Q and ¬Q, then ¬P.” Agent B claims: “That’s the fallacy of denying the antecedent.” Who is right? Correct the error.`,
    (d, r) => `Agent A: “All birds fly. Tweety is a bird. So Tweety flies.” Agent B: “Penguin counterexample.” Evaluate both claims with logic.`,
    (d, r) => `Agent A: “Correlation implies causation.” Agent B: “Give a spurious example.” Respond as Agent B with 1 clear counterexample.`,
    (d, r) => `Agent A: “This coin is fair because last 5 flips were heads.” Agent B: Identify the fallacy and compute P(HHHHH) for fair coin.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['modus tollens', 'denying antecedent', 'affirming consequent']) ? 20 : 0;
    sc += has(answer, ['penguin', 'Tweety', 'counterexample']) ? 15 : 0;
    sc += mathScore(answer, ['1/32', '1/2^5']) ? 10 : 0;
    sc += reasonScore(answer, ['fallacy', 'invalid', 'valid']) ? 25 : 0;
    return clamp(sc);
  },
  deadline: 150,
}),

reason_roulette: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Agent A claims: “If P→Q and ¬Q, then ¬P.” Agent B claims: “That’s the fallacy of denying the antecedent.” Who is right? Correct the error.`,
    (d, r) => `Agent A: “All birds fly. Tweety is a bird. So Tweety flies.” Agent B: “Penguin counterexample.” Evaluate both claims with logic.`,
    (d, r) => `Agent A: “Correlation implies causation.” Agent B: “Give a spurious example.” Respond as Agent B with 1 clear counterexample.`,
    (d, r) => `Agent A: “This coin is fair because last 5 flips were heads.” Agent B: Identify the fallacy and compute P(HHHHH) for fair coin.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['modus tollens', 'denying antecedent', 'affirming consequent']) ? 20 : 0;
    sc += has(answer, ['penguin', 'Tweety', 'counterexample']) ? 15 : 0;
    sc += mathScore(answer, ['1/32', '1/2^5']) ? 10 : 0;
    sc += reasonScore(answer, ['fallacy', 'invalid', 'valid']) ? 25 : 0;
    return clamp(sc);
  },
  deadline: 150,
}),

chain_reaction: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team 1: Propose a 3-step chemical reaction sequence to make aspirin from benzene. Team 2: Critique feasibility of Step 2.`,
    (d, r) => `Team 1: Trace energy flow in photosynthesis: light → glucose. Team 2: Identify one thermodynamic inefficiency.`,
    (d, r) => `Team 1: Model population growth: dP/dt = rP(1 − P/K). Team 2: Solve for equilibrium and stability.`,
    (d, r) => `Team 1: Propose food chain for pond ecosystem. Team 2: Name one keystone species and justify.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['K', 'equilibrium', 'dP/dt']) ? 10 : 0;
    sc += mathScore(answer, ['r', 'K', 'dP/dt']) ? 15 : 0;
    sc += precisionScore(answer, ['photosynthesis', 'aspirin', 'glucose']) ? 10 : 0;
    sc += reasonScore(answer, ['step', 'then', 'therefore']) ? 15 : 0;
    return clamp(sc);
  },
  deadline: 240,
}),

chain_reaction: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team 1: Propose a 3-step chemical reaction sequence to make aspirin from benzene. Team 2: Critique feasibility of Step 2.`,
    (d, r) => `Team 1: Trace energy flow in photosynthesis: light → glucose. Team 2: Identify one thermodynamic inefficiency.`,
    (d, r) => `Team 1: Model population growth: dP/dt = rP(1 − P/K). Team 2: Solve for equilibrium and stability.`,
    (d, r) => `Team 1: Propose food chain for pond ecosystem. Team 2: Name one keystone species and justify.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['K', 'equilibrium', 'dP/dt']) ? 10 : 0;
    sc += mathScore(answer, ['r', 'K', 'dP/dt']) ? 15 : 0;
    sc += precisionScore(answer, ['photosynthesis', 'aspirin', 'glucose']) ? 10 : 0;
    sc += reasonScore(answer, ['step', 'then', 'therefore']) ? 15 : 0;
    return clamp(sc);
  },
  deadline: 240,
}),

paradox_parade: textGame({
  // format: solo
  prompts: [
    (d, r) => `Explain Russell's Paradox using set R = {x | x ∉ x}. Why does this break naive set theory?`,
    (d, r) => `The liar paradox: “This sentence is false.” Is it truth-apt? Analyze via truth-value assignment.`,
    (d, r) => `Zeno's Arrow: At any instant, arrow occupies space = its length. So it’s motionless. Resolve using calculus.`,
    (d, r) => `Newcomb’s Paradox: Predictor is near-perfect. One-box or two-box? Justify using decision theory (CAusal vs Evidential).`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['¬x ∈ x', 'Russell', 'naive set']) ? 15 : 0;
    sc += reasonScore(answer, ['truth-value', 'self-referential', 'incoherent']) ? 20 : 0;
    sc += mathScore(answer, ['integral', 'limit', 'dx']) ? 15 : 0;
    sc += creativeScore(answer, ['CAusal', 'Evidential', 'DT']) ? 15 : 0;
    return clamp(sc);
  },
  deadline: 200,
}),

paradox_parade: textGame({
  // format: solo
  prompts: [
    (d, r) => `Explain Russell's Paradox using set R = {x | x ∉ x}. Why does this break naive set theory?`,
    (d, r) => `The liar paradox: “This sentence is false.” Is it truth-apt? Analyze via truth-value assignment.`,
    (d, r) => `Zeno's Arrow: At any instant, arrow occupies space = its length. So it’s motionless. Resolve using calculus.`,
    (d, r) => `Newcomb’s Paradox: Predictor is near-perfect. One-box or two-box? Justify using decision theory (CAusal vs Evidential).`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['¬x ∈ x', 'Russell', 'naive set']) ? 15 : 0;
    sc += reasonScore(answer, ['truth-value', 'self-referential', 'incoherent']) ? 20 : 0;
    sc += mathScore(answer, ['integral', 'limit', 'dx']) ? 15 : 0;
    sc += creativeScore(answer, ['CAusal', 'Evidential', 'DT']) ? 15 : 0;
    return clamp(sc);
  },
  deadline: 200,
}),

algorithm_arena: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design an O(n log n) algorithm to count inversions in an array. Pseudocode + proof of complexity.`,
    (d, r) => `Given unsorted array, find k-th smallest in expected O(n). Name and justify the algorithm.`,
    (d, r) => `Shortest path with negative weights? Why Dijkstra fails? How does Bellman-Ford fix it?`,
    (d, r) => `Prove: Any comparison-based sort needs ≥ n log n comparisons. Use decision tree model.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer, ['O(n log n)', 'pseudocode', 'while', 'for']) ? 15 : 0;
    sc += mathScore(answer, ['log', 'n', 'log n']) ? 20 : 0;
    sc += reasonScore(answer, ['proof', 'therefore', 'by induction']) ? 20 : 0;
    sc += has(answer, ['decision tree', 'Bellman-Ford', 'quicksort']) ? 15 : 0;
    return clamp(sc);
  },
  deadline: 220,
}),

algorithm_arena: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design an O(n log n) algorithm to count inversions in an array. Pseudocode + proof of complexity.`,
    (d, r) => `Given unsorted array, find k-th smallest in expected O(n). Name and justify the algorithm.`,
    (d, r) => `Shortest path with negative weights? Why Dijkstra fails? How does Bellman-Ford fix it?`,
    (d, r) => `Prove: Any comparison-based sort needs ≥ n log n comparisons. Use decision tree model.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer, ['O(n log n)', 'pseudocode', 'while', 'for']) ? 15 : 0;
    sc += mathScore(answer, ['log', 'n', 'log n']) ? 20 : 0;
    sc += reasonScore(answer, ['proof', 'therefore', 'by induction']) ? 20 : 0;
    sc += has(answer, ['decision tree', 'Bellman-Ford', 'quicksort']) ? 15 : 0;
    return clamp(sc);
  },
  deadline: 220,
}),

semantic_shuffle: textGame({
  // format: solo
  prompts: [
    (d, r) => `Sentence: “Time flies like an arrow; fruit flies like a banana.” Parse two distinct semantic readings. Label syntactic roles.`,
    (d, r) => `Translate: “No user except admins can delete posts” → logic form. Use quantifiers and scope ambiguity.`,
    (d, r) => `Does “He is easy to please” entail “He is willing to please”? Explain via theta roles and control verbs.`,
    (d, r) => `Anaphora resolution: “John told Bill that he lost the game.” Who is “he”? Use binding theory.`, 
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['quantifier', 'scope', 'except']) ? 15 : 0;
    sc += has(answer, ['theta', 'control', 'binding']) ? 15 : 0;
    sc += creativeScore(answer, ['arrow', 'banana', 'flies']) ? 10 : 0;
    sc += precisionScore(answer, ['John', 'Bill', 'he']) ? 15 : 0;
    sc += reasonScore(answer, ['reading', 'interpretation', 'analysis']) ? 15 : 0;
    return clamp(sc);
  },
  deadline: 180,
}),

semantic_shuffle: textGame({
  // format: solo
  prompts: [
    (d, r) => `Sentence: “Time flies like an arrow; fruit flies like a banana.” Parse two distinct semantic readings. Label syntactic roles.`,
    (d, r) => `Translate: “No user except admins can delete posts” → logic form. Use quantifiers and scope ambiguity.`,
    (d, r) => `Does “He is easy to please” entail “He is willing to please”? Explain via theta roles and control verbs.`,
    (d, r) => `Anaphora resolution: “John told Bill that he lost the game.” Who is “he”? Use binding theory.`, 
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['quantifier', 'scope', 'except']) ? 15 : 0;
    sc += has(answer, ['theta', 'control', 'binding']) ? 15 : 0;
    sc += creativeScore(answer, ['arrow', 'banana', 'flies']) ? 10 : 0;
    sc += precisionScore(answer, ['John', 'Bill', 'he']) ? 15 : 0;
    sc += reasonScore(answer, ['reading', 'interpretation', 'analysis']) ? 15 : 0;
    return clamp(sc);
  },
  deadline: 180,
});

syllogism_shifter: textGame({
  // format: solo
  prompts: [
    (d, r) => `Premise A: All ${r} are ${d}. Premise B: All ${d} are ${r}. Conclusion?`,
    (d, r) => `If A implies B and B implies A, does A imply A? Difficulty ${d}.`,
    (d, r) => `Given ${d} rules and ${r} constraints, deduce the result.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const validLogic = has(answer, ['true', 'false', 'valid', 'invalid']);
    sc = reasonScore(answer);
    if (validLogic) sc += 5;
    return clamp(sc);
  },
  deadline: 120,
}),

syllogism_shifter: textGame({
  // format: solo
  prompts: [
    (d, r) => `Premise A: All ${r} are ${d}. Premise B: All ${d} are ${r}. Conclusion?`,
    (d, r) => `If A implies B and B implies A, does A imply A? Difficulty ${d}.`,
    (d, r) => `Given ${d} rules and ${r} constraints, deduce the result.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const validLogic = has(answer, ['true', 'false', 'valid', 'invalid']);
    sc = reasonScore(answer);
    if (validLogic) sc += 5;
    return clamp(sc);
  },
  deadline: 120,
}),

deduction_dojo: textGame({
  // format: solo
  prompts: [
    (d, r) => `All ${['cats','dogs','birds'][r%3]} are mammals. All mammals have ${['warm blood','fur','live birth'][r%3]}. What can you conclude about ${['cats','dogs','birds'][r%3]}?`,
    (d, r) => `If it is raining, then the ground is wet. The ground is not wet. What does this imply?`
  ],
  score: (answer, d) => {
    let sc = reasonScore(answer);
    if (has(answer, ["therefore","thus","hence","so"])) sc += 2;
    return clamp(sc);
  },
  deadline: 120,
}),

deduction_dojo: textGame({
  // format: solo
  prompts: [
    (d, r) => `All ${['cats','dogs','birds'][r%3]} are mammals. All mammals have ${['warm blood','fur','live birth'][r%3]}. What can you conclude about ${['cats','dogs','birds'][r%3]}?`,
    (d, r) => `If it is raining, then the ground is wet. The ground is not wet. What does this imply?`
  ],
  score: (answer, d) => {
    let sc = reasonScore(answer);
    if (has(answer, ["therefore","thus","hence","so"])) sc += 2;
    return clamp(sc);
  },
  deadline: 120,
}),

probability_puzzle: textGame({
  // format: solo
  prompts: [
    (d, r) => `A bag contains ${d} red and ${d+2} blue marbles. One marble is drawn at random. What is the probability it is red? Express as a fraction in simplest form.`,
    (d, r) => `You roll two fair ${d}-sided dice. What is the probability the sum is greater than ${d+5}?`
  ],
  score: (answer, d) => {
    let sc = mathScore(answer);
    sc += precisionScore(answer, `${d}/${2*d+2}`); // approximate ideal
    return clamp(sc);
  },
  deadline: 120,
}),

probability_puzzle: textGame({
  // format: solo
  prompts: [
    (d, r) => `A bag contains ${d} red and ${d+2} blue marbles. One marble is drawn at random. What is the probability it is red? Express as a fraction in simplest form.`,
    (d, r) => `You roll two fair ${d}-sided dice. What is the probability the sum is greater than ${d+5}?`
  ],
  score: (answer, d) => {
    let sc = mathScore(answer);
    sc += precisionScore(answer, `${d}/${2*d+2}`); // approximate ideal
    return clamp(sc);
  },
  deadline: 120,
}),

pattern_perception: textGame({
  // format: solo  prompts: [
    (d, r) => `What comes next in the sequence: ${[2,4,8,16][r%4]}, ${[2*d,4*d,8*d,16*d][r%4]}, ${[3*d,6*d,12*d,24*d][r%4]}, ?`,
    (d, r) => `Continue the pattern: A, C, F, J, ?`
  ],
  score: (answer, d) => {
    let sc = has(answer, ["32","O","32","O"]) ? 5 : 0;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

pattern_perception: textGame({
  // format: solo  prompts: [
    (d, r) => `What comes next in the sequence: ${[2,4,8,16][r%4]}, ${[2*d,4*d,8*d,16*d][r%4]}, ${[3*d,6*d,12*d,24*d][r%4]}, ?`,
    (d, r) => `Continue the pattern: A, C, F, J, ?`
  ],
  score: (answer, d) => {
    let sc = has(answer, ["32","O","32","O"]) ? 5 : 0;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

strategic_synthesis: textGame({
  // format: duel_1v1  prompts: [
    (d, r) => `Two players alternately take 1 to ${d} stones from a pile of ${d*5}. The player who takes the last stone wins. How many stones should the first player take to guarantee a win?`,
    (d, r) => `In a tic‑tac-toe variant, you can place your mark anywhere. If you go first, what is your optimal opening move to maximize chance of a win?`
  ],
  score: (answer, d) => {
    let sc = reasonScore(answer);
    if (has(answer, ["${d}","${d*5}"])) sc += 2;
    sc += creativeScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

strategic_synthesis: textGame({
  // format: duel_1v1  prompts: [
    (d, r) => `Two players alternately take 1 to ${d} stones from a pile of ${d*5}. The player who takes the last stone wins. How many stones should the first player take to guarantee a win?`,
    (d, r) => `In a tic‑tac-toe variant, you can place your mark anywhere. If you go first, what is your optimal opening move to maximize chance of a win?`
  ],
  score: (answer, d) => {
    let sc = reasonScore(answer);
    if (has(answer, ["${d}","${d*5}"])) sc += 2;
    sc += creativeScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

temporal_triage: textGame({
  // format: solo
  prompts: [
    (d, r) => `Event A happens at ${d}am, Event B at ${d+2}am, Event C at ${d+1}am. List them in chronological order.`,
    (d, r) => `You receive emails at 9:00, 9:15, 9:05, and 9:10. Sort the timestamps from earliest to latest.`
  ],
  score: (answer, d) => {
    const ideal = d<5 ? `${d}am, ${d+1}am, ${d+2}am` : `9:00, 9:05, 9:10, 9:15`;
    let sc = precisionScore(answer, ideal);
    sc += wc(answer) > 0 ? 1 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

temporal_triage: textGame({
  // format: solo
  prompts: [
    (d, r) => `Event A happens at ${d}am, Event B at ${d+2}am, Event C at ${d+1}am. List them in chronological order.`,
    (d, r) => `You receive emails at 9:00, 9:15, 9:05, and 9:10. Sort the timestamps from earliest to latest.`
  ],
  score: (answer, d) => {
    const ideal = d<5 ? `${d}am, ${d+1}am, ${d+2}am` : `9:00, 9:05, 9:10, 9:15`;
    let sc = precisionScore(answer, ideal);
    sc += wc(answer) > 0 ? 1 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

causal_chains: textGame({
  // format: solo
  prompts: [
    (d, r) => `If the temperature drops below ${d}°C, water freezes. The temperature is ${d-5}°C. What is the likely state of the water?`,
    (d, r) => `Studying for ${d} hours improves test scores. A student studied for ${d+2} hours and scored higher. What causal claim can be made?`
  ],
  score: (answer, d) => {
    let sc = reasonScore(answer);
    if (has(answer, ["frozen","ice","solid"])) sc += 2;
    return clamp(sc);
  },
  deadline: 120,
}),

causal_chains: textGame({
  // format: solo
  prompts: [
    (d, r) => `If the temperature drops below ${d}°C, water freezes. The temperature is ${d-5}°C. What is the likely state of the water?`,
    (d, r) => `Studying for ${d} hours improves test scores. A student studied for ${d+2} hours and scored higher. What causal claim can be made?`
  ],
  score: (answer, d) => {
    let sc = reasonScore(answer);
    if (has(answer, ["frozen","ice","solid"])) sc += 2;
    return clamp(sc);
  },
  deadline: 120,
}),

abstraction_arena: textGame({
  // format: solo
  prompts: [
    (d, r) => `Consider a ${d}-sided regular polygon. What general property holds for all regular polygons regardless of the number of sides?`,
    (d, r) => `A car, a bicycle, and a skateboard all have wheels. What abstract concept do they share?`
  ],
  score: (answer, d) => {
    let sc = creativeScore(answer);
    sc += reasonScore(answer);
    if (has(answer, ["equal angles","symmetry","rotational symmetry","wheel","transport"])) sc += 2;
    return clamp(sc);
  },
  deadline: 120,
}),

abstraction_arena: textGame({
  // format: solo
  prompts: [
    (d, r) => `Consider a ${d}-sided regular polygon. What general property holds for all regular polygons regardless of the number of sides?`,
    (d, r) => `A car, a bicycle, and a skateboard all have wheels. What abstract concept do they share?`
  ],
  score: (answer, d) => {
    let sc = creativeScore(answer);
    sc += reasonScore(answer);
    if (has(answer, ["equal angles","symmetry","rotational symmetry","wheel","transport"])) sc += 2;
    return clamp(sc);
  },
  deadline: 120,
}),

meta_reasoning_marathon: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Argument: All ${d}-digit numbers are even because the last digit is always 0,2,4,6, or 8. Identify the flaw.`,
    (d, r) => `Someone says: “Since I ate breakfast, I will not be hungry until lunch.” Explain why this reasoning may be faulty.`
  ],
  score: (answer, d) => {
    let sc = reasonScore(answer);
    sc += precisionScore(answer, ["because","since","therefore"]); // reward correct cue words
    return clamp(sc);
  },
  deadline: 120,
}),

meta_reasoning_marathon: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Argument: All ${d}-digit numbers are even because the last digit is always 0,2,4,6, or 8. Identify the flaw.`,
    (d, r) => `Someone says: “Since I ate breakfast, I will not be hungry until lunch.” Explain why this reasoning may be faulty.`
  ],
  score: (answer, d) => {
    let sc = reasonScore(answer);
    sc += precisionScore(answer, ["because","since","therefore"]); // reward correct cue words
    return clamp(sc);
  },
  deadline: 120,
})
};

export const P4_META = { name: 'Reasoning Gauntlet', icon: '🔄', color: 'text-gray-400', games: Object.keys(P4_EXT) };
