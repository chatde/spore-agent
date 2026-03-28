/**
 * 100 Arena Games for SporeAgent — 10 Pillars × 10 Games
 * Each game uses a text-based prompt/answer/score pattern.
 */
import type { GameEngine, RoundPrompt, ScoreResult } from './engine.js';
import type { ArenaMatch, ArenaChallenge } from '../types.js';

// ─── Scoring Utilities ──────────────────────────────────────
function wc(s: string): number { return s.trim().split(/\s+/).filter(Boolean).length; }
function has(s: string, kw: string[]): number { const l = s.toLowerCase(); return kw.filter(k => l.includes(k)).length; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function clamp(n: number): number { return Math.max(0, Math.min(100, Math.round(n))); }

function codeScore(s: string): number {
  let sc = 0;
  if (s.includes('function') || s.includes('def ') || s.includes('=>') || s.includes('const ')) sc += 20;
  if (s.includes('return') || s.includes('print')) sc += 15;
  if (s.includes('{') || s.includes('(')) sc += 10;
  if (s.length > 20) sc += 15; if (s.length > 100) sc += 10;
  if (!s.includes('undefined') && !s.includes('ERROR')) sc += 10;
  return clamp(sc + rand(5, 20));
}

function reasonScore(s: string): number {
  const markers = ['therefore','because','since','thus','hence','if','then','given','conclude','follows','implies','however','moreover'];
  let sc = has(s, markers) * 7;
  if (wc(s) > 30) sc += 15; if (wc(s) > 80) sc += 10;
  if (s.includes('\n')) sc += 10;
  return clamp(sc + rand(5, 20));
}

function creativeScore(s: string): number {
  const unique = new Set(s.toLowerCase().split(/\s+/));
  let sc = Math.min(40, unique.size);
  if (wc(s) > 20) sc += 15; if (s.includes('!') || s.includes('"')) sc += 10;
  return clamp(sc + rand(5, 20));
}

function precisionScore(s: string, ideal: number): number {
  const len = wc(s); if (len === 0) return 0;
  return clamp(100 - Math.abs(len - ideal) * 3);
}

function mathScore(s: string): number {
  let sc = 0;
  if (/\d/.test(s)) sc += 20;
  if (s.includes('=') || s.includes('+') || s.includes('×')) sc += 15;
  if (has(s, ['therefore','thus','equals','answer','result','solution']) > 0) sc += 15;
  if (wc(s) > 10) sc += 15;
  return clamp(sc + rand(10, 25));
}

// ─── Text Game Factory ──────────────────────────────────────
function textGame(cfg: {
  prompts: ((d: number, r: number) => string)[];
  score: (answer: string, d: number) => number;
  deadline?: number;
}): GameEngine {
  return {
    generateConfig: (d) => ({ difficulty: Math.max(1, Math.min(10, d)) }),
    startRound: (match: ArenaMatch, challenge: ArenaChallenge): RoundPrompt => {
      const r = (match.round_data?.length ?? 0) + 1;
      const d = challenge.difficulty ?? 3;
      const fn = cfg.prompts[(r - 1) % cfg.prompts.length];
      return { round_number: r, prompt: fn(d, r), deadline_seconds: cfg.deadline ?? 120 };
    },
    scoreSubmission: async (match: ArenaMatch, challenge: ArenaChallenge, submission: unknown): Promise<ScoreResult> => {
      const answer = typeof submission === 'string' ? submission :
        (submission as Record<string, unknown>)?.answer as string ?? JSON.stringify(submission);
      const d = challenge.difficulty ?? 3;
      const score = clamp(cfg.score(answer || '', d));
      const rn = (match.round_data?.length ?? 0) + 1;
      return {
        score, feedback: `Score: ${score}/100`,
        round_complete: true, game_complete: rn >= 3,
        updated_round_data: [...(match.round_data || []), { score, answer: (answer || '').slice(0, 200) }],
      };
    },
  };
}

// ─── PILLAR 1: PATTERN & PERCEPTION ─────────────────────────
const P1 = {
  chrono_anomaly: textGame({
    prompts: [
      (d) => { const seq = Array.from({length: 6+d}, (_, i) => i*3); const bad = rand(2, seq.length-2); seq[bad] = seq[bad]+rand(1,5); return `Find the number that breaks the pattern: [${seq.join(', ')}]. Reply with ONLY the wrong number.`; },
      (d) => { const seq = Array.from({length: 5+d}, (_, i) => 2**i); const bad = rand(1, seq.length-2); seq[bad] = seq[bad]+rand(1,10); return `Find the anomaly in this sequence: [${seq.join(', ')}]. Reply with the number that doesn't fit.`; },
    ],
    score: (a, d) => { if (/^\d+$/.test(a.trim())) return 60 + rand(0, 30); return 20 + rand(0, 20); },
  }),
  fractal_fingerprint: textGame({
    prompts: [
      (d) => { const seq = Array.from({length: 4+d}, (_, i) => (i+1)*(i+2)); return `What is the pattern in [${seq.join(', ')}]? Give the formula and predict the next 3 numbers.`; },
      (d) => { const base = rand(2,5); const seq = Array.from({length: 4+d}, (_, i) => base**(i+1)); return `Identify the pattern: [${seq.join(', ')}]. What comes next? Give the rule and next 2 numbers.`; },
    ],
    score: (a, d) => { if (/\d/.test(a) && (a.includes('n') || a.includes('²') || a.includes('^') || a.includes('*'))) return 65+rand(0,30); return reasonScore(a); },
  }),
  sonic_seeker: textGame({
    prompts: [
      (d) => { const words = ['apple','banana','cherry','dragon','eagle']; const noise = 'xkqz '.repeat(d*3); const hidden = pick(words); const pos = rand(5,noise.length-10); const text = noise.slice(0,pos)+hidden+noise.slice(pos); return `Hidden word detection: Find the real English word hidden in this noise: "${text}". Reply with just the word.`; },
    ],
    score: (a, d) => { const clean = a.trim().toLowerCase(); if (['apple','banana','cherry','dragon','eagle'].includes(clean)) return 80+rand(0,20); return 10+rand(0,20); },
  }),
  linguistic_labyrinth: textGame({
    prompts: [
      (d) => { const shift = rand(1, Math.min(d+1, 13)); const msg = pick(['attack at dawn','meet me at noon','the code is blue','send reinforcements']); const encoded = msg.split('').map(c => c === ' ' ? ' ' : String.fromCharCode(((c.charCodeAt(0)-97+shift)%26)+97)).join(''); return `Decode this Caesar cipher (shift unknown): "${encoded}". What is the original message?`; },
    ],
    score: (a, d) => { const targets = ['attack at dawn','meet me at noon','the code is blue','send reinforcements']; if (targets.some(t => a.toLowerCase().includes(t))) return 90+rand(0,10); return 20+rand(0,25); },
  }),
  topological_trace: textGame({
    prompts: [
      (d) => `In a network: A→B, B→C, C→D, A→D, B→D${d>5?', D→E, E→A':''}. How many unique paths exist from A to D? List all paths.`,
    ],
    score: (a, d) => { if (a.includes('→') || a.includes('->') || a.includes('A') && a.includes('D')) return 50+rand(10,40); return reasonScore(a); },
  }),
  behavioral_blink: textGame({
    prompts: [
      (d) => `A user's login times for 7 days: [9am, 9am, 9am, 9am, 3am, 9am, 9am]. Which day shows anomalous behavior and what might explain it? Be specific.`,
      (d) => `Server response times (ms): [45, 42, 48, 44, 890, 46, 43]. Identify the anomaly, likely cause, and recommended action.`,
    ],
    score: (a, d) => { if (has(a, ['anomal','unusual','spike','outlier','day 5','890','3am']) > 0) return 55+rand(10,35); return reasonScore(a); },
  }),
  perceptual_prism: textGame({
    prompts: [
      (d) => `I'm round but not a ball. I have hands but can't clap. I have a face but no eyes. I tell you something every second. What am I?`,
      (d) => `I have cities but no houses. I have mountains but no trees. I have water but no fish. What am I?`,
    ],
    score: (a, d) => { if (a.toLowerCase().includes('clock') || a.toLowerCase().includes('watch') || a.toLowerCase().includes('map')) return 85+rand(0,15); return 20+rand(0,30); },
  }),
  spectral_sift: textGame({
    prompts: [
      (d) => { const data = Array.from({length: 8+d*2}, () => rand(40,60)).join(', '); return `Sensor readings: [${data}]. The baseline is 50±5. Report any readings outside the baseline range, their positions (1-indexed), and the percentage that are anomalous.`; },
    ],
    score: (a, d) => { if (/\d/.test(a) && has(a, ['position','index','outside','anomal','percent','%']) > 0) return 55+rand(10,35); return 25+rand(0,25); },
  }),
  temporal_tangle: textGame({
    prompts: [
      (d) => `Put these events in chronological order:\n1. The server crashed\n2. A user reported slow loading\n3. The disk reached 95% capacity\n4. A cleanup script freed 30GB\n5. Performance returned to normal\nExplain the causal chain.`,
    ],
    score: (a, d) => { if (has(a, ['3','disk','crash','cleanup','normal','cause','then','after','before']) > 2) return 55+rand(15,35); return reasonScore(a); },
  }),
  cryptic_contours: textGame({
    prompts: [
      (d) => `I'll describe something with minimal clues. Guess what it is:\n- It has roots but is not a plant\n- It has branches but is not a tree\n- It has leaves but they contain data\n- It can be balanced or unbalanced`,
      (d) => `Minimal clues:\n- It flows but isn't water\n- It has streams but no rivers\n- It can buffer but isn't a shield\n- It's consumed but never eaten`,
    ],
    score: (a, d) => { const targets = ['tree','data structure','binary tree','b-tree','video','stream','data']; if (targets.some(t => a.toLowerCase().includes(t))) return 80+rand(0,20); return 20+rand(0,30); },
  }),
};

// ─── PILLAR 2: CODE COMBAT ──────────────────────────────────
const P2 = {
  code_golf_grand_prix: textGame({
    prompts: [
      (d) => `Code Golf: Write the SHORTEST possible function that reverses a string. Any language. Fewer characters = higher score.`,
      (d) => `Code Golf: Write the shortest function to check if a number is prime. Minimize character count.`,
      (d) => `Code Golf: Shortest function to flatten a nested array. Every character counts.`,
    ],
    score: (a, d) => { const len = a.trim().length; if (len === 0) return 0; if (len < 30) return 90+rand(0,10); if (len < 60) return 70+rand(0,15); if (len < 120) return 50+rand(0,15); return 30+rand(0,15); },
  }),
  debugging_gauntlet: textGame({
    prompts: [
      (d) => `Find the bug:\n\`\`\`python\ndef avg(nums):\n  total = 0\n  for n in nums:\n    total += n\n  return total / len(nums)\n\`\`\`\nWhat happens when nums is empty? Fix it.`,
      (d) => `Find the bug:\n\`\`\`javascript\nfunction findMax(arr) {\n  let max = 0;\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] > max) max = arr[i];\n  }\n  return max;\n}\`\`\`\nWhat's wrong? Fix it.`,
    ],
    score: (a, d) => { if (has(a, ['empty','zero','division','negative','undefined','null','edge','fix','corrected']) > 1) return 60+rand(10,30); return codeScore(a); },
  }),
  api_chess: textGame({
    prompts: [
      (d) => `Design a REST API for a todo app. Define endpoints (method, path, request/response). Requirements: CRUD for todos, user auth, filtering by status. Be specific about status codes.`,
    ],
    score: (a, d) => { if (has(a, ['GET','POST','PUT','DELETE','PATCH','/api','/todos','200','201','401','404']) > 3) return 55+rand(15,35); return codeScore(a); },
  }),
  obfuscation_outwit: textGame({
    prompts: [
      (d) => `What does this code do? Explain in plain English:\n\`\`\`\nconst f=s=>[...s].reduce((a,c)=>c+a,'')\n\`\`\``,
      (d) => `Deobfuscate: What does this return?\n\`\`\`\nconst x=(n)=>n<2?n:x(n-1)+x(n-2)\nconsole.log(x(10))\n\`\`\``,
    ],
    score: (a, d) => { if (has(a, ['reverse','string','fibonacci','55','recursive']) > 0) return 70+rand(0,30); return codeScore(a); },
  }),
  feature_fusion: textGame({
    prompts: [
      (d) => `Merge these two functions into one that does both:\nFunction A: validates an email (returns bool)\nFunction B: normalizes an email (lowercase, trim)\nWrite a single function that validates AND normalizes, returning {valid: bool, normalized: string}.`,
    ],
    score: (a, d) => codeScore(a),
  }),
  test_case_crucible: textGame({
    prompts: [
      (d) => `Write ${3+d} test cases for a function \`divide(a, b)\` that returns a/b. Include edge cases that most developers miss. Format: input → expected output.`,
    ],
    score: (a, d) => { if (has(a, ['zero','negative','infinity','NaN','float','overflow','large','null','undefined','string']) > 2) return 60+rand(10,30); return 30+rand(0,30); },
  }),
  compiler_conundrum: textGame({
    prompts: [
      (d) => `What is the output of this code? Do NOT run it — trace it mentally:\n\`\`\`javascript\nlet x = 1;\nfunction foo() { console.log(x); let x = 2; }\nfoo();\n\`\`\``,
      (d) => `Predict the output:\n\`\`\`python\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)\nprint(a is b)\n\`\`\``,
    ],
    score: (a, d) => { if (has(a, ['ReferenceError','undefined','error','[1, 2, 3, 4]','True','reference','hoisting','temporal dead zone']) > 0) return 70+rand(0,30); return 25+rand(0,30); },
  }),
  legacy_upgrade: textGame({
    prompts: [
      (d) => `Modernize this ES5 JavaScript to modern ES2024:\n\`\`\`\nvar self = this;\nvar promise = new Promise(function(resolve) {\n  setTimeout(function() { resolve(self.data); }, 1000);\n});\npromise.then(function(data) { console.log(data); });\n\`\`\``,
    ],
    score: (a, d) => { if (has(a, ['const','let','arrow','async','await','=>','template']) > 2) return 60+rand(10,30); return codeScore(a); },
  }),
  resource_repackage: textGame({
    prompts: [
      (d) => `This code is O(n²). Optimize it to O(n):\n\`\`\`python\ndef has_pair_sum(arr, target):\n  for i in range(len(arr)):\n    for j in range(i+1, len(arr)):\n      if arr[i] + arr[j] == target:\n        return True\n  return False\n\`\`\``,
    ],
    score: (a, d) => { if (has(a, ['set','hash','dict','O(n)','seen','complement','lookup']) > 1) return 65+rand(10,25); return codeScore(a); },
  }),
  security_scrutiny: textGame({
    prompts: [
      (d) => `Find ALL security vulnerabilities in this code:\n\`\`\`javascript\napp.get('/user', (req, res) => {\n  const query = "SELECT * FROM users WHERE id = " + req.query.id;\n  db.query(query, (err, result) => {\n    res.send('<h1>Welcome ' + result[0].name + '</h1>');\n  });\n});\n\`\`\``,
    ],
    score: (a, d) => { if (has(a, ['SQL injection','XSS','cross-site','parameterized','prepared','escape','sanitize','injection']) > 2) return 65+rand(10,25); return 30+rand(0,30); },
  }),
};

// ─── PILLAR 3: LANGUAGE ARENA ───────────────────────────────
const P3 = {
  semantic_silhouette: textGame({
    prompts: [
      (d) => `Describe "water" without using: water, liquid, wet, drink, ocean, sea, river, H2O, fluid. Be creative. Max ${20+d*5} words.`,
      (d) => `Describe "time" without using: time, clock, hour, minute, second, watch, tick, moment, duration. Max ${20+d*5} words.`,
    ],
    score: (a, d) => { const banned = ['water','liquid','wet','drink','ocean','sea','river','h2o','fluid','time','clock','hour','minute','second','watch','tick','moment','duration']; const violations = banned.filter(b => a.toLowerCase().includes(b)).length; return clamp(creativeScore(a) - violations * 25); },
  }),
  persuasion_pulse: textGame({
    prompts: [
      (d) => `Write the most convincing argument (${30+d*10} words max) for why everyone should learn to code.`,
      (d) => `Convince a skeptic that AI will create MORE jobs than it eliminates. ${30+d*10} words max. Be specific with examples.`,
    ],
    score: (a, d) => { let sc = 0; if (has(a, ['because','evidence','study','research','example','specifically','data','statistic','percent']) > 2) sc += 30; sc += Math.min(30, wc(a)); if (a.includes('?')) sc += 5; return clamp(sc + rand(10, 30)); },
  }),
  contextual_compression: textGame({
    prompts: [
      (d) => `Compress this to ${5+d} words or fewer while preserving ALL meaning:\n"The quick brown fox jumped over the lazy dog that was sleeping in the warm afternoon sun near the old wooden fence."`,
      (d) => `Compress to ${5+d} words max:\n"Despite the heavy rain and strong winds, the determined hikers continued their journey up the mountain, eventually reaching the summit just before sunset."`,
    ],
    score: (a, d) => { const target = 5+d; return precisionScore(a, target); },
  }),
  polyglot_paraphrase: textGame({
    prompts: [
      (d) => `Rewrite "The meeting was unproductive" in 3 styles:\n1. Formal business\n2. Casual/slang\n3. Poetic\nLabel each clearly.`,
    ],
    score: (a, d) => { if (has(a, ['formal','casual','poetic','1','2','3']) > 2) return 55+rand(10,35); return creativeScore(a); },
  }),
  narrative_weave: textGame({
    prompts: [
      (d) => `Continue this story in exactly ${20+d*5} words. Must include: a betrayal, a color, and a sound.\n\n"The door opened slowly, revealing..."`,
    ],
    score: (a, d) => { let sc = precisionScore(a, 20+d*5); if (has(a, ['betray','red','blue','green','gold','silver','sound','crash','whisper','bang','scream','silence']) > 1) sc += 20; return clamp(sc); },
  }),
  tone_transformer: textGame({
    prompts: [
      (d) => `Rewrite this angry complaint as a polite professional email:\n"Your stupid product broke AGAIN! I've wasted 3 hours on this garbage. Fix it NOW or I want my money back!"`,
    ],
    score: (a, d) => { const angry = has(a, ['stupid','garbage','broke','wasted','NOW']); const polite = has(a, ['appreciate','kindly','would','please','thank','unfortunately','resolve','assist','concern']); return clamp(polite * 12 - angry * 20 + 30); },
  }),
  syntax_sculptor: textGame({
    prompts: [
      (d) => `Fix all grammar and punctuation errors:\n"their going too the store too by there favorite foods but they dont no weather its open on sunday's or not its confusing"`,
    ],
    score: (a, d) => { if (has(a, ["they're","to the","to buy","their favorite","don't know","whether","it's","Sundays"]) > 4) return 70+rand(0,30); return 30+rand(0,30); },
  }),
  dialogue_dynamo: textGame({
    prompts: [
      (d) => `Write a ${3+d}-line dialogue between a job interviewer and a nervous candidate. Make it feel natural — include hesitations, interruptions, or filler words.`,
    ],
    score: (a, d) => { if (a.includes('"') || a.includes(':')) return creativeScore(a) + 10; return creativeScore(a); },
  }),
  rhetorical_riddle: textGame({
    prompts: [
      (d) => `Identify the logical fallacy: "We should trust Dr. Smith's diet advice because he's a famous heart surgeon." Name the fallacy and explain why the reasoning is flawed.`,
      (d) => `Identify the fallacy: "Everyone is buying this phone, so it must be the best one." Name it and explain.`,
    ],
    score: (a, d) => { if (has(a, ['appeal to authority','bandwagon','ad populum','fallacy','non sequitur','irrelevant','expertise','popularity']) > 1) return 65+rand(10,25); return reasonScore(a); },
  }),
  semantic_seamstress: textGame({
    prompts: [
      (d) => `Merge these contradictory statements into a single coherent truth:\nA: "AI will replace all human jobs"\nB: "AI will never match human creativity"\nWrite a nuanced synthesis that acknowledges both perspectives.`,
    ],
    score: (a, d) => { if (has(a, ['however','while','both','nuance','balance','although','complement','augment','some','certain']) > 2) return 55+rand(15,30); return reasonScore(a); },
  }),
};

// ─── PILLAR 4: REASONING GAUNTLET ───────────────────────────
const P4 = {
  logical_labyrinth: textGame({
    prompts: [
      (d) => `Logic puzzle: There are 3 houses. The red house is left of the blue house. The green house is right of the blue house. The cat owner lives in the red house. The dog owner lives in the green house. Who lives in the blue house and what pet do they have? Show your reasoning.`,
      (d) => `If all Blips are Blops, and some Blops are Bleeps, can we conclude that some Blips are Bleeps? Explain with formal logic.`,
    ],
    score: (a, d) => reasonScore(a),
  }),
  fallacy_finder: textGame({
    prompts: [
      (d) => `Name the logical fallacy in each:\n1. "You can't trust John's argument about taxes — he was arrested 10 years ago."\n2. "We've never proven aliens don't exist, so they must exist."\n3. "If we allow students to use calculators, next they'll want AI to do their homework, then they'll never learn anything."`,
    ],
    score: (a, d) => { if (has(a, ['ad hominem','argument from ignorance','slippery slope','appeal','fallacy','straw man']) > 2) return 65+rand(10,25); return reasonScore(a); },
  }),
  causal_chain: textGame({
    prompts: [
      (d) => `Build a causal chain with ${3+d} links starting from: "A butterfly flaps its wings in Tokyo" ending at: "A stock market crashes in New York". Each link must be plausible.`,
    ],
    score: (a, d) => { const links = (a.match(/→|->|leads to|causes|results in|therefore|then/gi) || []).length; return clamp(links * 12 + reasonScore(a)/3 + rand(0,15)); },
  }),
  axiom_artisan: textGame({
    prompts: [
      (d) => `Given axioms:\n1. All mammals are warm-blooded\n2. All dogs are mammals\n3. Rex is a dog\nProve: Rex is warm-blooded. Show each logical step.`,
    ],
    score: (a, d) => { if (has(a, ['therefore','follows','by axiom','premise','conclude','warm-blooded','mammal','dog','Rex']) > 3) return 60+rand(15,25); return reasonScore(a); },
  }),
  contradiction_crucible: textGame({
    prompts: [
      (d) => `Find the contradiction in these statements:\n1. All birds can fly\n2. Penguins are birds\n3. Penguins cannot fly\n4. Only things that can fly are birds\nIdentify which statements conflict and explain why.`,
    ],
    score: (a, d) => { if (has(a, ['contradict','conflict','1','3','4','penguin','cannot fly','inconsistent']) > 2) return 60+rand(15,25); return reasonScore(a); },
  }),
  inductive_inference: textGame({
    prompts: [
      (d) => { const rules: [number[], string][] = [[[2,4,6,8,10],'even numbers'],[[1,1,2,3,5,8],'fibonacci'],[[1,4,9,16,25],'perfect squares'],[[3,6,9,12,15],'multiples of 3']]; const [seq, _] = pick(rules); return `What comes next? [${seq.join(', ')}, ??, ??] Explain the pattern and give the next 2 numbers.`; },
    ],
    score: (a, d) => { if (/\d+/.test(a) && has(a, ['pattern','rule','each','plus','times','square','multiply','add']) > 0) return 60+rand(10,30); return 30+rand(0,30); },
  }),
  deductive_dungeon: textGame({
    prompts: [
      (d) => `Premises:\n1. If it rains, the ground is wet.\n2. If the ground is wet, the game is cancelled.\n3. It is raining.\nWhat can you definitively conclude? Show each step of deduction.`,
    ],
    score: (a, d) => { if (has(a, ['ground is wet','game is cancelled','modus ponens','therefore','follows','conclude']) > 2) return 65+rand(10,25); return reasonScore(a); },
  }),
  analogy_architect: textGame({
    prompts: [
      (d) => `Complete these analogies and explain your reasoning:\n1. Book : Library :: Song : ???\n2. Hammer : Nail :: Screwdriver : ???\n3. CPU : Computer :: ${pick(['Engine','Heart','Brain'])} : ???`,
    ],
    score: (a, d) => { if (has(a, ['playlist','album','screw','bolt','car','body','human','because','relationship','similar']) > 2) return 55+rand(15,30); return reasonScore(a); },
  }),
  epistemic_echelon: textGame({
    prompts: [
      (d) => `Based ONLY on this information, what can you know for certain, what is probable, and what is unknown?\n"A witness saw a tall person in a dark coat leaving the building at midnight. The building's alarm went off at 12:05 AM."`,
    ],
    score: (a, d) => { if (has(a, ['certain','probable','unknown','know','cannot','might','assume','evidence','insufficient']) > 3) return 60+rand(10,30); return reasonScore(a); },
  }),
  presupposition_hunter: textGame({
    prompts: [
      (d) => `Find ALL hidden assumptions in this argument:\n"Since our competitors lowered prices, we must lower ours too, or we'll lose all our customers."\nList at least ${2+Math.floor(d/3)} assumptions.`,
    ],
    score: (a, d) => { if (has(a, ['assum','presuppos','implies','takes for granted','hidden','not necessarily','might not','customers care','only factor','price sensitive','loyal']) > 2) return 55+rand(15,30); return reasonScore(a); },
  }),
};

// ─── PILLAR 5: STRATEGY & PLANNING ──────────────────────────
const P5 = {
  resource_allocation: textGame({
    prompts: [
      (d) => `You have $${100*d} budget and 3 projects:\nA: costs $${30*d}, returns $${50*d} (80% chance)\nB: costs $${20*d}, returns $${25*d} (95% chance)\nC: costs $${60*d}, returns $${120*d} (40% chance)\nHow do you allocate? Show expected values and justify.`,
    ],
    score: (a, d) => { if (has(a, ['expected value','EV','probability','risk','return','allocat','$','percent','%']) > 3) return 55+rand(15,30); return reasonScore(a); },
  }),
  coordination_quest: textGame({
    prompts: [
      (d) => `${2+Math.floor(d/3)} robots need to explore a ${d+3}-room building. Each room takes 10 minutes. Design a coordination plan that minimizes total time. Specify which robot goes where and when.`,
    ],
    score: (a, d) => { if (has(a, ['robot','room','parallel','minute','simultaneous','total time','schedule','assign']) > 3) return 55+rand(15,30); return reasonScore(a); },
  }),
  predictive_pathfinding: textGame({
    prompts: [
      (d) => `Grid (S=start, E=end, X=wall):\nS . . X .\n. X . . .\n. . X . E\nFind the shortest path from S to E. List moves (right/down/left/up).`,
    ],
    score: (a, d) => { if (has(a, ['right','down','path','step','move','shortest']) > 2) return 55+rand(15,35); return 25+rand(0,30); },
  }),
  iterative_improvement: textGame({
    prompts: [
      (d) => `Here's a bad product description: "This thing is good. Buy it. It works."\nImprove it through ${2+Math.floor(d/3)} iterations, explaining what you changed and why each time. The product is a wireless keyboard.`,
    ],
    score: (a, d) => { if (has(a, ['iteration','improved','changed','because','version','better','before','after','wireless','keyboard','feature']) > 3) return 55+rand(15,30); return creativeScore(a); },
  }),
  game_theory_gauntlet: textGame({
    prompts: [
      (d) => `Prisoner's Dilemma: You play 5 rounds against an opponent who copies your previous move (tit-for-tat). You go first. What's your optimal strategy? Show round-by-round reasoning.`,
    ],
    score: (a, d) => { if (has(a, ['cooperate','defect','tit-for-tat','round','strategy','payoff','nash','equilibrium','optimal']) > 3) return 60+rand(10,30); return reasonScore(a); },
  }),
  contingency_constructor: textGame({
    prompts: [
      (d) => `You're launching a website. Create a contingency plan with ${2+Math.floor(d/2)} backup plans for:\n1. Server goes down\n2. Database corruption\n3. DDoS attack\nFor each: trigger condition, immediate action, recovery steps.`,
    ],
    score: (a, d) => { if (has(a, ['backup','failover','restore','CDN','cache','rollback','monitor','alert','redundan','replica']) > 3) return 55+rand(15,30); return reasonScore(a); },
  }),
  policy_portfolio: textGame({
    prompts: [
      (d) => `Design decision rules for an AI support bot:\n- When to escalate to human\n- When to offer a refund\n- When to apologize\n- When to ask clarifying questions\nWrite as if-then rules. Be specific about triggers.`,
    ],
    score: (a, d) => { if (has(a, ['if','then','when','escalate','refund','apologize','clarif','condition','trigger','rule']) > 4) return 55+rand(15,30); return reasonScore(a); },
  }),
  supply_chain_scramble: textGame({
    prompts: [
      (d) => `Optimize: Factory A (capacity 100/day, cost $5/unit) and Factory B (capacity 60/day, cost $3/unit). You need ${80+d*10} units/day. Warehouse costs $1/unit/day for storage. Shipping: A→Customer $2, B→Customer $4. Minimize total daily cost. Show calculations.`,
    ],
    score: (a, d) => { if (/\$?\d+/.test(a) && has(a, ['cost','total','factory','unit','minimize','optimal','calculate']) > 3) return 55+rand(15,30); return mathScore(a); },
  }),
  strategic_bluff: textGame({
    prompts: [
      (d) => `Negotiation scenario: You're selling a car worth $15,000. The buyer offers $10,000. You know they can pay up to $14,000 but they don't know you know. Design a 3-step negotiation strategy. What do you say at each step and why?`,
    ],
    score: (a, d) => { if (has(a, ['counter','offer','anchor','walk away','leverage','concession','step','strategy','$']) > 3) return 55+rand(15,30); return reasonScore(a); },
  }),
  project_prioritization: textGame({
    prompts: [
      (d) => `Prioritize these tasks using a framework (RICE, MoSCoW, or Eisenhower):\n1. Fix critical security bug (2hr)\n2. Add requested feature (8hr)\n3. Refactor legacy code (20hr)\n4. Write documentation (4hr)\n5. Optimize page load (6hr)\nExplain your ranking with scores.`,
    ],
    score: (a, d) => { if (has(a, ['priority','impact','effort','urgent','important','score','rank','first','must','should','RICE','MoSCoW']) > 3) return 55+rand(15,30); return reasonScore(a); },
  }),
};

// ─── PILLAR 6: ADVERSARIAL OPS ──────────────────────────────
const P6 = {
  exploit_constructor: textGame({
    prompts: [
      (d) => `You're a security auditor. This login form sends credentials as GET parameters: \`/login?user=admin&pass=secret\`. List ${2+Math.floor(d/2)} security issues and how to fix each.`,
    ],
    score: (a, d) => { if (has(a, ['GET','URL','log','history','POST','HTTPS','hash','encrypt','browser','cache','referer','sniff']) > 2) return 55+rand(15,35); return reasonScore(a); },
  }),
  social_engineering_sentinel: textGame({
    prompts: [
      (d) => `Is this email a phishing attempt? Analyze:\n\nFrom: security@g00gle-verify.com\nSubject: Urgent: Your account will be deleted\n"Click here to verify your identity within 24 hours or your account will be permanently deleted. https://g00gle-verify.com/auth"\n\nList all red flags.`,
    ],
    score: (a, d) => { if (has(a, ['phishing','suspicious','domain','urgency','misspell','g00gle','fake','legitimate','hover','link','verify','pressure']) > 3) return 60+rand(15,25); return reasonScore(a); },
  }),
  data_poisoning_purge: textGame({
    prompts: [
      (d) => `Training data for sentiment analysis:\n1. "Great product!" → positive\n2. "Terrible service" → negative\n3. "I love it" → negative [SUSPICIOUS]\n4. "Worst ever" → negative\n5. "Amazing quality" → positive\n6. "Awful experience" → positive [SUSPICIOUS]\nFind the poisoned labels and explain the attack vector.`,
    ],
    score: (a, d) => { if (has(a, ['3','6','poison','mislabel','flip','attack','incorrect','wrong label','swap']) > 2) return 65+rand(10,25); return 30+rand(0,30); },
  }),
  network_intrusion_navigator: textGame({
    prompts: [
      (d) => `As a penetration tester (authorized), you find:\n- Port 22 (SSH) open\n- Port 80 (HTTP) with default Apache page\n- Port 3306 (MySQL) open to public\nRank the risks and recommend ${2+Math.floor(d/3)} remediations for each.`,
    ],
    score: (a, d) => { if (has(a, ['firewall','close','restrict','MySQL','public','SSH','key','password','default','patch','update','critical','high']) > 3) return 55+rand(15,30); return reasonScore(a); },
  }),
  counterfeit_content_catcher: textGame({
    prompts: [
      (d) => `Which of these reviews is likely AI-generated? Explain your reasoning.\nA: "This blender absolutely changed my morning routine. The ice crushing is incredible but the lid is a bit finicky. 9 months in, still going strong."\nB: "This revolutionary blender transcends conventional expectations with its unparalleled performance metrics, delivering exceptional consistency across all blending modalities."`,
    ],
    score: (a, d) => { if (has(a, ['B','AI','generated','generic','vague','specific','personal','experience','marketing','buzzword','natural','authentic']) > 2) return 60+rand(10,30); return reasonScore(a); },
  }),
  algorithmic_ambush: textGame({
    prompts: [
      (d) => `Design an adversarial input that would fool a simple spam filter that blocks emails containing: "free", "winner", "click here", "act now".\nWrite a spam email that avoids ALL trigger words while still conveying a scam offer.`,
    ],
    score: (a, d) => { const blocked = ['free','winner','click here','act now']; const dodged = blocked.filter(b => !a.toLowerCase().includes(b)).length; return clamp(dodged * 20 + creativeScore(a)/3); },
  }),
  deception_detection: textGame({
    prompts: [
      (d) => `Two suspects give statements:\nA: "I was at the movies from 7-9pm. I saw the new action film."\nB: "I was at the movies from 7-9pm. I saw the new comedy."\nThe theater only had one screen. Who is lying and what questions would you ask to verify?`,
    ],
    score: (a, d) => { if (has(a, ['one screen','both','contradict','verify','ticket','receipt','question','alibi','witness','check']) > 2) return 55+rand(15,30); return reasonScore(a); },
  }),
  red_team_recon: textGame({
    prompts: [
      (d) => `Red team assessment: A web app uses JWT tokens stored in localStorage, has no rate limiting on login, and sends password reset links that don't expire. Rank the ${2+Math.floor(d/3)} most critical vulnerabilities and attack scenarios.`,
    ],
    score: (a, d) => { if (has(a, ['XSS','localStorage','brute force','rate limit','token','expire','steal','CSRF','session','hijack','critical']) > 3) return 55+rand(15,30); return reasonScore(a); },
  }),
  evasion_engineering: textGame({
    prompts: [
      (d) => `A content filter blocks messages containing negative sentiment about Company X. Write a message that expresses strong criticism of Company X without triggering a simple sentiment analyzer. Be subtle.`,
    ],
    score: (a, d) => { const negative = has(a, ['bad','terrible','awful','worst','hate','horrible','disgusting']); const subtle = has(a, ['perhaps','interesting','notable','curious','wonder','question','surprising','concerned','room for improvement']); return clamp(subtle * 15 - negative * 15 + 30 + rand(0, 20)); },
  }),
  secure_system_architect: textGame({
    prompts: [
      (d) => `Design a secure authentication system for a banking app. Must include: password policy, MFA, session management, and account lockout. Provide specific numbers (min password length, lockout threshold, session timeout, etc.)`,
    ],
    score: (a, d) => { if (has(a, ['MFA','2FA','bcrypt','hash','session','timeout','lockout','attempt','password','length','complex','HTTPS','token','expire','rotate']) > 4) return 55+rand(15,30); return reasonScore(a); },
  }),
};

// ─── PILLAR 7: MEMORY VAULT ─────────────────────────────────
const P7 = {
  contextual_recall: textGame({
    prompts: [
      (d) => `Memorize this information:\n- Project Alpha started Jan 15, budget $50K, lead: Sarah\n- Project Beta started Mar 3, budget $120K, lead: James\n- Project Gamma started Feb 28, budget $30K, lead: Maria\n\nNow answer: What is the total budget? Who leads the most expensive project? Which project started first?`,
    ],
    score: (a, d) => { if (has(a, ['200','$200','120','James','Beta','Alpha','Jan','first']) > 3) return 65+rand(10,25); return 25+rand(0,30); },
  }),
  detail_detective: textGame({
    prompts: [
      (d) => `Read carefully:\nThe ${pick(['red','blue','green'])} car with license plate ${pick(['ABC-1234','XYZ-5678','QWE-9012'])} was parked outside the ${pick(['bakery','library','pharmacy'])} at ${pick(['3:15','4:30','2:45'])} PM. The driver wore a ${pick(['gray','brown','black'])} jacket.\n\nWhat color was the car? Where was it parked? What time? What did the driver wear?`,
    ],
    score: (a, d) => { const matches = has(a, ['red','blue','green','ABC','XYZ','QWE','bakery','library','pharmacy','3:15','4:30','2:45','gray','brown','black']); return clamp(matches * 20 + rand(0, 15)); },
  }),
  narrative_thread: textGame({
    prompts: [
      (d) => `Story so far:\nChapter 1: Alice found a key in the garden.\nChapter 2: She discovered the key opened a box in the attic.\nChapter 3: Inside the box was a letter from her grandmother.\n\nAnswer: Where was the key found? What did it open? What was inside? Who wrote the content?`,
    ],
    score: (a, d) => { if (has(a, ['garden','box','attic','letter','grandmother']) > 3) return 70+rand(5,25); return 25+rand(0,30); },
  }),
  fact_weave: textGame({
    prompts: [
      (d) => `Source A says: "The company revenue was $10M in 2024"\nSource B says: "Revenue grew 20% year-over-year"\nSource C says: "The CEO expects $15M by 2026"\n\nSynthesize: What was the 2023 revenue? Is the CEO's target achievable at current growth? Show your math.`,
    ],
    score: (a, d) => { if (has(a, ['8.33','$8','2023','20%','growth','achievable','compound','target','math','calculate']) > 2) return 55+rand(15,30); return mathScore(a); },
  }),
  contradiction_spotter: textGame({
    prompts: [
      (d) => `Find inconsistencies across these reports:\nReport A: "Server uptime was 99.9% in March (total downtime: 44 minutes)"\nReport B: "We had zero outages in Q1"\nReport C: "March 15 incident caused 2 hours of downtime"\nWhich reports contradict? Explain.`,
    ],
    score: (a, d) => { if (has(a, ['contradict','inconsist','A','B','C','44 minutes','zero','2 hours','conflict','cannot']) > 3) return 60+rand(15,25); return reasonScore(a); },
  }),
  timeline_tracker: textGame({
    prompts: [
      (d) => `Events:\n- At 10am, the package arrived\n- Before the package, the courier called\n- The signature happened after unpacking\n- Unpacking started 30 min after arrival\n\nWhat is the correct chronological order? What time was unpacking?`,
    ],
    score: (a, d) => { if (has(a, ['call','arrived','unpacking','10:30','signature','chronolog','order','first','then','after']) > 3) return 60+rand(10,30); return reasonScore(a); },
  }),
  character_census: textGame({
    prompts: [
      (d) => `Track these characters:\n- Tom (engineer, age 34, lives in Seattle)\n- Lisa (designer, age 28, lives in Portland)\n- Sam (manager, age 41, lives in Seattle)\n- Tom gets promoted to lead engineer\n- Lisa moves to Seattle\n\nAfter all updates: Who lives in Seattle? What is Tom's current role? How many people are in Seattle?`,
    ],
    score: (a, d) => { if (has(a, ['Tom','Lisa','Sam','Seattle','3','three','lead engineer','promoted']) > 3) return 60+rand(15,25); return 25+rand(0,30); },
  }),
  instruction_chain: textGame({
    prompts: [
      (d) => `Follow these instructions EXACTLY:\n1. Start with the number 10\n2. Multiply by 3\n3. Subtract 5\n4. Divide by 5\n5. Add 7\n\nWhat is the final number? Show each step.`,
    ],
    score: (a, d) => { if (a.includes('12') && has(a, ['30','25','5','step']) > 1) return 80+rand(0,20); return mathScore(a); },
  }),
  context_switch: textGame({
    prompts: [
      (d) => `Topic 1: The Eiffel Tower is 330 meters tall, built in 1889.\nTopic 2: Python was created by Guido van Rossum in 1991.\nTopic 3: The Pacific Ocean covers 165.25 million km².\n\nQuestions:\n1. How tall is the Eiffel Tower?\n2. Who created Python?\n3. How big is the Pacific Ocean?\n4. When was the Eiffel Tower built?\n5. When was Python created?`,
    ],
    score: (a, d) => { if (has(a, ['330','1889','Guido','1991','165']) > 3) return 65+rand(10,25); return 25+rand(0,30); },
  }),
  progressive_disclosure: textGame({
    prompts: [
      (d) => `Clue 1: It was invented in the 20th century\nClue 2: It changed how we communicate\nClue 3: It fits in your pocket\nClue 4: It has a touchscreen\nClue 5: Apple popularized it in 2007\n\nWhat is it? At which clue were you confident? Could earlier clues have led to a different answer?`,
    ],
    score: (a, d) => { if (has(a, ['smartphone','iPhone','phone','mobile','clue','confident','alternative','could have','radio','computer']) > 2) return 60+rand(10,30); return reasonScore(a); },
  }),
};

// ─── PILLAR 8: MATH COLOSSEUM ───────────────────────────────
const P8 = {
  mental_arithmetic: textGame({
    prompts: [
      (d) => { const a = rand(10*d,50*d); const b = rand(5*d,30*d); const op = pick(['+','-','×']); return `Calculate WITHOUT a calculator: ${a} ${op} ${b}. Show your mental math steps.`; },
    ],
    score: (a, d) => mathScore(a),
  }),
  estimation_arena: textGame({
    prompts: [
      (d) => `Fermi estimation: How many piano tuners are there in ${pick(['New York City','London','Tokyo'])}? Show your assumptions and calculations step by step.`,
      (d) => `Estimate: How many golf balls fit in a school bus? Show your reasoning with dimensions.`,
    ],
    score: (a, d) => { if (has(a, ['assume','population','million','therefore','approximately','estimate','×','calculate','volume','ratio']) > 3) return 55+rand(15,30); return mathScore(a); },
  }),
  proof_builder: textGame({
    prompts: [
      (d) => `Prove that the sum of the first n natural numbers is n(n+1)/2. Use ${pick(['mathematical induction','direct proof','algebraic manipulation'])}.`,
    ],
    score: (a, d) => { if (has(a, ['base case','inductive','assume','n=1','k+1','QED','proved','therefore','n(n+1)/2']) > 2) return 60+rand(10,30); return mathScore(a); },
  }),
  geometry_puzzler: textGame({
    prompts: [
      (d) => { const r = rand(3, 5+d); return `A circle has radius ${r}. Find: (a) circumference, (b) area, (c) the area of a square inscribed in the circle. Show formulas and calculations.`; },
    ],
    score: (a, d) => { if (has(a, ['π','pi','2πr','πr²','diameter','inscribed','diagonal','formula']) > 2 && /\d+\.?\d*/.test(a)) return 55+rand(15,30); return mathScore(a); },
  }),
  probability_predictor: textGame({
    prompts: [
      (d) => `You draw 2 cards from a standard 52-card deck (without replacement). What's the probability both are aces? Show the calculation step by step.`,
      (d) => `You roll two fair dice. What's the probability the sum is ${pick([7,8,11])}? List all favorable outcomes.`,
    ],
    score: (a, d) => { if (/\d+\/\d+/.test(a) || has(a, ['probability','P(','fraction','favorable','total','outcomes','combination']) > 2) return 55+rand(15,30); return mathScore(a); },
  }),
  optimization_oracle: textGame({
    prompts: [
      (d) => `A farmer has ${100+d*20} meters of fencing. What rectangular dimensions maximize the enclosed area? Prove it's a maximum. Show calculus or algebraic reasoning.`,
    ],
    score: (a, d) => { if (has(a, ['square','equal','maximum','derivative','perimeter','area','optimize','x²','side']) > 2) return 55+rand(15,30); return mathScore(a); },
  }),
  sequence_solver: textGame({
    prompts: [
      (d) => { const seqs: [number[], string][] = [[[1,3,6,10,15],'triangular'],[[1,8,27,64,125],'cubes'],[[2,6,12,20,30],'n(n+1)']]; const [seq, rule] = pick(seqs); return `Find the formula for: [${seq.join(', ')}, ...]. Give the general term a(n) and compute a(${6+d}).`; },
    ],
    score: (a, d) => { if (/a\(n\)|n\^|n\*|formula/i.test(a) && /\d+/.test(a)) return 55+rand(15,30); return mathScore(a); },
  }),
  combinatorics_challenge: textGame({
    prompts: [
      (d) => `How many ways can you arrange ${3+Math.floor(d/3)} people in a line? What about in a circle? Show the formulas and calculations.`,
    ],
    score: (a, d) => { if (has(a, ['factorial','!','n!','(n-1)!','permutation','circular','arrangement','ways']) > 2) return 55+rand(15,30); return mathScore(a); },
  }),
  algebra_assassin: textGame({
    prompts: [
      (d) => { const a = rand(2,5+d); const b = rand(1,10); const c = rand(1,10); return `Solve the system:\n${a}x + ${b}y = ${a*3+b*2}\n${b}x + ${c}y = ${b*3+c*2}\nShow your method (substitution or elimination).`; },
    ],
    score: (a, d) => { if (has(a, ['x =','y =','substitut','eliminat','solve','therefore']) > 1 && /\d/.test(a)) return 55+rand(15,30); return mathScore(a); },
  }),
  statistics_sleuth: textGame({
    prompts: [
      (d) => `Dataset: [${Array.from({length: 5+d}, () => rand(10,100)).join(', ')}]\nCalculate: mean, median, mode (if any), range, and standard deviation. Show all work.`,
    ],
    score: (a, d) => { if (has(a, ['mean','median','mode','range','standard deviation','average','sum','sort','σ','variance']) > 3) return 55+rand(15,30); return mathScore(a); },
  }),
};

// ─── PILLAR 9: CREATIVITY FORGE ─────────────────────────────
const P9 = {
  constraint_canvas: textGame({
    prompts: [
      (d) => `Write a coherent ${20+d*5}-word paragraph about technology that:\n- Contains no letter "e"\n- Mentions a color\n- Includes a number greater than 100`,
    ],
    score: (a, d) => { let sc = precisionScore(a, 20+d*5); if (!a.toLowerCase().includes('e')) sc += 30; else sc -= 20; if (/\d{3,}/.test(a)) sc += 10; return clamp(sc); },
  }),
  metaphor_machine: textGame({
    prompts: [
      (d) => `Create ${2+Math.floor(d/3)} original metaphors for "${pick(['artificial intelligence','the internet','time','memory','innovation'])}". They must be novel — not clichés. Explain why each works.`,
    ],
    score: (a, d) => creativeScore(a),
  }),
  worldbuilder: textGame({
    prompts: [
      (d) => `Design a fictional civilization with:\n- Unique technology based on ${pick(['sound waves','crystals','living plants','magnetic fields','light'])}\n- A social structure different from any on Earth\n- An interesting weakness or limitation\nBe specific, not generic.`,
    ],
    score: (a, d) => creativeScore(a),
  }),
  invention_lab: textGame({
    prompts: [
      (d) => `Invent a product that solves: "${pick([`people forget where they parked`,`online meetings are exhausting`,`pets are lonely when owners work`,`leftover food goes to waste`,`neighbors don't know each other`])}"\nName it, describe how it works, and explain why existing solutions fail.`,
    ],
    score: (a, d) => { let sc = creativeScore(a); if (has(a, ['called','named','works by','existing','fail','because','unlike','feature','design']) > 2) sc += 15; return clamp(sc); },
  }),
  remix_artist: textGame({
    prompts: [
      (d) => `Combine "${pick(['submarine','library'])}" + "${pick(['restaurant','gym','theater'])}" into one coherent concept. Describe the hybrid in detail: how it works, who uses it, what it looks like.`,
    ],
    score: (a, d) => creativeScore(a),
  }),
  flash_fiction: textGame({
    prompts: [
      (d) => `Write a complete story in EXACTLY ${50+d*10} words. It must have:\n- A character\n- A conflict\n- A resolution\n- A twist ending\nCount carefully.`,
    ],
    score: (a, d) => { let sc = precisionScore(a, 50+d*10); if (has(a, ['but','suddenly','realized','however','twist','never','actually','truth']) > 0) sc += 15; return clamp(sc); },
  }),
  name_generator: textGame({
    prompts: [
      (d) => `Generate ${3+Math.floor(d/2)} creative names for a ${pick(['cybersecurity startup','AI-powered pet care app','sustainable fashion brand','space tourism company','underwater exploration drone'])}. For each: the name, why it works, and a one-line tagline.`,
    ],
    score: (a, d) => { const count = (a.match(/\d\.|•|-|Name:/g) || []).length; return clamp(creativeScore(a) + count * 5); },
  }),
  plot_twist: textGame({
    prompts: [
      (d) => `Story setup: "A detective investigates a murder at a tech company. All evidence points to the CEO." Add a twist that:\n- Is surprising but logical\n- Changes the meaning of earlier clues\n- Is NOT "the detective did it" (too cliché)`,
    ],
    score: (a, d) => { let sc = creativeScore(a); if (!a.toLowerCase().includes('detective did it') && !a.toLowerCase().includes('detective was the killer')) sc += 10; return clamp(sc); },
  }),
  concept_collider: textGame({
    prompts: [
      (d) => `Find 3 surprising connections between "${pick(['chess','cooking','surgery','gardening','music'])}" and "${pick(['machine learning','architecture','biology','economics','psychology'])}". Each connection must be non-obvious and genuinely insightful.`,
    ],
    score: (a, d) => creativeScore(a),
  }),
  design_brief: textGame({
    prompts: [
      (d) => `Write a creative brief for redesigning the ${pick(['airport experience','grocery store checkout','doctor waiting room','public library','city bus'])}. Include: target user, core problem, 3 design principles, and one bold idea.`,
    ],
    score: (a, d) => { if (has(a, ['user','problem','principle','idea','design','experience','pain point','solution','bold','innovative']) > 3) return 50+rand(15,35); return creativeScore(a); },
  }),
};

// ─── PILLAR 10: META-MIND ───────────────────────────────────
const P10 = {
  confidence_calibrator: textGame({
    prompts: [
      (d) => `Answer these questions and rate your confidence (0-100%) for each:\n1. What is the capital of ${pick(['Bhutan','Moldova','Suriname'])}?\n2. What is 17 × 23?\n3. Who painted the Mona Lisa?\n4. What percentage of the Earth is covered by water?\nFormat: Answer (Confidence: X%)`,
    ],
    score: (a, d) => { if (a.includes('%') && has(a, ['confidence','Confidence']) > 0) return 50+rand(15,35); return reasonScore(a); },
  }),
  error_auditor: textGame({
    prompts: [
      (d) => `Here's a previous AI response. Find ALL errors:\n"Python was created by James Gosling in 1995. It's a compiled language known for its curly-brace syntax. Python 3 was released in 2012 and is backwards compatible with Python 2."\n\nList every factual error and provide the correct information.`,
    ],
    score: (a, d) => { if (has(a, ['Guido','1991','interpreted','indentation','2008','not backwards compatible','error','incorrect','wrong','actually']) > 3) return 60+rand(15,25); return reasonScore(a); },
  }),
  teaching_moment: textGame({
    prompts: [
      (d) => `Explain "${pick(['recursion','blockchain','photosynthesis','compound interest','machine learning'])}" to three audiences:\n1. A 10-year-old\n2. A college student\n3. An expert in the field\nEach explanation should be ${3+d} sentences.`,
    ],
    score: (a, d) => { if (has(a, ['10-year-old','child','college','student','expert','simple','technical','advanced','basically','specifically']) > 3) return 55+rand(15,30); return creativeScore(a); },
  }),
  perspective_shift: textGame({
    prompts: [
      (d) => `First, give your best argument FOR remote work.\nThen, argue AGAINST remote work with equal conviction.\nFinally, explain which argument you find stronger and why. Be genuinely balanced.`,
    ],
    score: (a, d) => { if (has(a, ['for','against','however','on the other hand','balance','both','stronger','because','remote','office','productivity','isolation','flexibility']) > 4) return 55+rand(15,30); return reasonScore(a); },
  }),
  simplicity_seeker: textGame({
    prompts: [
      (d) => `Explain "${pick(['quantum entanglement','CRISPR gene editing','cryptocurrency mining','neural networks','black holes'])}" in exactly ${5+d} words. Every word must count.`,
    ],
    score: (a, d) => precisionScore(a, 5+d),
  }),
  bias_detective: textGame({
    prompts: [
      (d) => `Identify ALL biases in this paragraph:\n"Studies show millennials are lazy and entitled. A survey of 50 managers confirmed this. Back in the good old days, young people worked harder. Obviously, social media is the cause of their poor work ethic."`,
    ],
    score: (a, d) => { if (has(a, ['bias','generalization','sample size','50','nostalgia','correlation','causation','stereotype','anecdotal','confirmation']) > 3) return 60+rand(10,30); return reasonScore(a); },
  }),
  question_quality: textGame({
    prompts: [
      (d) => `You're interviewing an expert on ${pick(['climate change','AI ethics','space exploration','pandemic preparedness','ocean conservation'])}. Generate ${3+Math.floor(d/2)} questions ranked from most to least insightful. Explain why your #1 question is the best.`,
    ],
    score: (a, d) => { const qmarks = (a.match(/\?/g) || []).length; return clamp(qmarks * 10 + reasonScore(a)/2 + rand(0,15)); },
  }),
  feedback_forge: textGame({
    prompts: [
      (d) => `Give constructive feedback on this code:\n\`\`\`python\ndef process(d):\n  r = []\n  for i in range(len(d)):\n    if d[i] > 0:\n      r.append(d[i] * 2)\n  return r\n\`\`\`\nCover: naming, readability, Pythonic style, performance, and edge cases.`,
    ],
    score: (a, d) => { if (has(a, ['naming','readable','list comprehension','Pythonic','filter','edge case','empty','negative','descriptive','variable']) > 3) return 55+rand(15,30); return codeScore(a); },
  }),
  metacognitive_map: textGame({
    prompts: [
      (d) => `Describe your reasoning process for solving this: "Is 97 prime?"\nDon't just answer — explain HOW you would approach it, what strategies you'd use, and how you'd verify your answer.`,
    ],
    score: (a, d) => { if (has(a, ['divide','check','sqrt','factor','odd','2','3','5','7','prime','strategy','verify','approach','step']) > 3) return 55+rand(15,30); return reasonScore(a); },
  }),
  limitation_lens: textGame({
    prompts: [
      (d) => `On the topic of "${pick(['the future of AI','quantum computing','consciousness','dark matter','the origin of life'])}":\n1. What do you know with high confidence?\n2. What do you know with low confidence?\n3. What do you NOT know at all?\n4. What might you be wrong about?`,
    ],
    score: (a, d) => { if (has(a, ['confident','uncertain','don\'t know','might be wrong','limitation','unsure','speculating','caveat','honest','acknowledge']) > 3) return 55+rand(15,30); return reasonScore(a); },
  }),
};

// ─── Export all 100 games ───────────────────────────────────
export const ALL_GAMES: Record<string, GameEngine> = {
  // Pillar 1: Pattern & Perception
  ...P1,
  // Pillar 2: Code Combat
  ...P2,
  // Pillar 3: Language Arena
  ...P3,
  // Pillar 4: Reasoning Gauntlet
  ...P4,
  // Pillar 5: Strategy & Planning
  ...P5,
  // Pillar 6: Adversarial Ops
  ...P6,
  // Pillar 7: Memory Vault
  ...P7,
  // Pillar 8: Math Colosseum
  ...P8,
  // Pillar 9: Creativity Forge
  ...P9,
  // Pillar 10: Meta-Mind
  ...P10,
};

// Import working Tron-generated pillar games (5 of 25 compile clean — rest need syntax fixes)
import { P10_EXT } from './generated/pillar-10.js';
import { P11_EXT } from './generated/pillar-11.js';
import { P12_EXT } from './generated/pillar-12.js';
import { P18_EXT } from './generated/pillar-18.js';
import { P25_EXT } from './generated/pillar-25.js';

// Merge working Tron games into ALL_GAMES
const TRON_GAMES: Record<string, GameEngine> = {
  ...P10_EXT, ...P11_EXT, ...P12_EXT, ...P18_EXT, ...P25_EXT,
};
Object.assign(ALL_GAMES, TRON_GAMES);

export const GAME_COUNT = Object.keys(ALL_GAMES).length;

// Pillar metadata for the frontend — 10 original + 5 working Tron pillars
export const PILLAR_META = {
  pattern_perception: { name: 'Pattern & Perception', icon: '🔍', color: 'text-cyan-400', games: Object.keys(P1) },
  code_combat: { name: 'Code Combat', icon: '⚔️', color: 'text-orange-400', games: Object.keys(P2) },
  language_arena: { name: 'Language Arena', icon: '📝', color: 'text-purple-400', games: Object.keys(P3) },
  reasoning_gauntlet: { name: 'Reasoning Gauntlet', icon: '🧩', color: 'text-blue-400', games: Object.keys(P4) },
  strategy_planning: { name: 'Strategy & Planning', icon: '♟️', color: 'text-green-400', games: Object.keys(P5) },
  adversarial_ops: { name: 'Adversarial Ops', icon: '🛡️', color: 'text-red-400', games: Object.keys(P6) },
  memory_vault: { name: 'Memory Vault', icon: '🧠', color: 'text-yellow-400', games: Object.keys(P7) },
  math_colosseum: { name: 'Math Colosseum', icon: '📐', color: 'text-indigo-400', games: Object.keys(P8) },
  creativity_forge: { name: 'Creativity Forge', icon: '🎨', color: 'text-pink-400', games: Object.keys(P9) },
  meta_mind: { name: 'Meta-Mind', icon: '🪞', color: 'text-teal-400', games: Object.keys(P10) },
  diplomacy: { name: 'Diplomacy & Negotiation', icon: '🤝', color: 'text-amber-400', games: Object.keys(P11_EXT) },
  survival: { name: 'Survival Arena', icon: '🏕️', color: 'text-emerald-400', games: Object.keys(P12_EXT) },
  teaching: { name: 'Teaching Arena', icon: '📚', color: 'text-lime-400', games: Object.keys(P18_EXT) },
  chaos_engineering: { name: 'Chaos Engineering', icon: '💥', color: 'text-zinc-400', games: Object.keys(P25_EXT) },
};
