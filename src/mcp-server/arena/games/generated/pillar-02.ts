// Auto-generated — Pillar 2: Code Combat (29 games)
// Generated 2026-03-28T16:27:41.637Z
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

export const P2_EXT: Record<string, GameEngine> = {
game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `You are debugging a function. Difficulty: ${d}. The function should take a list of integers and return a list of only the even numbers, but it's broken. Fix the bug(s) in this code:\n\nfunction getEvens(nums) {\n  let result = [];\n  for (let i = 0; i <= nums.length; i++) {\n    if (nums[i] % 2 = 0) {\n      result.push(nums[i]);\n    }\n  }\n  return result;\n}`,
    (d, r) => `You are refactoring code. Difficulty: ${d}. Rewrite this nested loop for efficiency. The goal is to find if two numbers in array 'arr' sum to target 't'. Provide the improved code.\n\nfunction hasSum(arr, t) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length; j++) {\n      if (i != j && arr[i] + arr[j] === t) {\n        return true;\n      }\n    }\n  }\n  return false;\n}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer) * 2;
    sc += has(answer, ['for', 'let', 'function', 'return']) ? 10 : 0;
    sc += precisionScore(answer, 'i < nums.length') * 5;
    sc += precisionScore(answer, '===') * 5;
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Code Golf Duel! Difficulty: ${d}. Write the SHORTEST possible function (in characters) named 'f' that returns the factorial of a non-negative integer n. No external libraries. Your opponent is doing the same.`,
    (d, r) => `Code Golf Duel! Difficulty: ${d}. Write the SHORTEST possible function (in characters) named 'r' that reverses a string s. No built-in .reverse(). Your opponent is doing the same.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer);
    let len = answer.replace(/\s/g, '').length;
    sc += Math.max(0, 100 - len * 2);
    sc += has(answer, ['function', '=>', 'return']) ? 5 : 0;
    sc += precisionScore(answer, 'factorial') > 0 ? 20 : 0;
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Team API Design. Difficulty: ${d}. Your team must design a function signature and a one-line docstring for a 'WeatherFetcher' module. It should get forecast for a city. Be concise and clear.`,
    (d, r) => `Team API Design. Difficulty: ${d}. Your team must design a function signature and a one-line docstring for a 'UserAuthenticator' module. It should login with email/password. Be concise and clear.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 1.5;
    sc += reasonScore(answer);
    sc += wc(answer) > 10 && wc(answer) < 50 ? 15 : 0;
    sc += has(answer, ['function', 'async', 'return', 'string']) ? 10 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Algorithm Auction! Difficulty: ${d}. Write a pseudocode algorithm to find the shortest path in a 10x10 grid with obstacles. Most efficient algorithm wins. Be clear in steps.`,
    (d, r) => `Algorithm Auction! Difficulty: ${d}. Write a pseudocode algorithm to sort a list of one million integers. Most efficient algorithm wins. Be clear in steps.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer) * 2;
    sc += has(answer, ['BFS', 'Dijkstra', 'QuickSort', 'MergeSort', 'heap', 'queue']) ? 25 : 0;
    sc += creativeScore(answer);
    sc += wc(answer) > 30 ? 10 : 0;
    return clamp(sc);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Regex Wizard. Difficulty: ${d}. Write a single regular expression (in one line) that calculates the area of a circle given radius r. Use Math.PI.`,
    (d, r) => `Math Expression Sprint. Difficulty: ${d}. Write a single JavaScript expression (in one line) that returns true if a number n is prime, false otherwise.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer) * 3;
    sc += precisionScore(answer, 'Math.PI * r * r') > 0 ? 20 : 0;
    sc += wc(answer) < 30 ? 10 : 0;
    sc += has(answer, ['for', 'if', 'return']) ? 5 : 0;
    return clamp(sc);
  },
  deadline: 60,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Regex Wizard. Difficulty: ${d}. Write a regular expression (as a JavaScript string) that matches a standard US phone number format: (xxx) xxx-xxxx. Provide ONLY the regex string.`,
    (d, r) => `Regex Wizard. Difficulty: ${d}. Write a regular expression (as a JavaScript string) that validates an email address (simple version: something@something.something). Provide ONLY the regex string.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += precisionScore(answer, '\\(\\d{3}\\)\\s*\\d{3}-\\d{4}') * 15;
    sc += precisionScore(answer, '@') * 10;
    sc += has(answer, ['/^', '$/']) ? 5 : 0;
    sc += wc(answer) < 10 ? 10 : 0;
    return clamp(sc);
  },
  deadline: 75,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Data Structure Duel. Difficulty: ${d}. Describe (in plain English) the steps to implement a LRU (Least Recently Used) Cache. Most clear and complete description wins.`,
    (d, r) => `Data Structure Duel. Difficulty: ${d}. Describe (in plain English) the steps to perform an inorder traversal of a binary tree iteratively (no recursion). Most clear and complete description wins.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer) * 2;
    sc += creativeScore(answer);
    sc += wc(answer) > 50 ? 15 : 0;
    sc += has(answer, ['hash map', 'linked list', 'stack', 'node', 'pointer']) ? 20 : 0;
    return clamp(sc);
  },
  deadline: 110,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `System Design Brief. Difficulty: ${d}. Your team must outline the high-level components for a tiny URL service (like bit.ly). List 3-5 core components.`,
    (d, r) => `System Design Brief. Difficulty: ${d}. Your team must outline the high-level components for a real-time chat app. List 3-5 core components.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 2;
    sc += reasonScore(answer);
    sc += wc(answer) > 20 ? 10 : 0;
    sc += has(answer, ['database', 'cache', 'API', 'load balancer', 'websocket']) ? 25 : 0;
    return clamp(sc);
  },
  deadline: 130,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Security Audit. Difficulty: ${d}. You found this login code. List all potential security vulnerabilities you see:\n\napp.post('/login', (req,res)=>{\n  let user = db.users.find(u => u.name == req.body.user);\n  if(user.pass == req.body.pass) { res.send('OK'); }\n});`,
    (d, r) => `Security Audit. Difficulty: ${d}. You found this SQL query. List all potential security vulnerabilities you see:\n\nlet query = \"SELECT * FROM users WHERE id = \" + userId;`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['injection', 'SQL', 'hash', 'salt', '==', 'plaintext', 'parameterized']) ? 15 : 0;
    sc += wc(answer) * 0.5;
    sc += reasonScore(answer) * 1.5;
    return clamp(sc);
  },
  deadline: 100,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Code Obfuscation. Difficulty: ${d}. Write a working JavaScript function that returns the sum of two numbers, but make the code as confusing/hard to read as possible (while still working).`,
    (d, r) => `Code Obfuscation. Difficulty: ${d}. Write a working JavaScript function that checks if a string is a palindrome, but make the code as confusing/hard to read as possible (while still working).`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 2;
    sc += codeScore(answer);
    sc += has(answer, ['=>', '?', '!', '~', '^', '|', '&']) ? 10 : 0;
    sc += wc(answer) > 30 ? 5 : 0;
    return clamp(sc);
  },
  deadline: 140,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a Python function that sorts a list of integers in ascending order using the merge sort algorithm. Your code must handle edge cases like empty lists or single-element lists. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Create a Python function that sorts a list of tuples based on the second element in each tuple. If the second elements are equal, sort by the first element in descending order. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (s) => {
    const hasError = s.includes('Error') || s.includes('Exception');
    if (hasError) return 0;
    const isMergeSort = has(s, ['merge', 'sort', 'divide', 'conquer']);
    const isValidPython = has(s, ['def ', 'lambda', 'import ']) && s.includes('python');
    let sc = 0;
    if (isMergeSort) sc += 30;
    if (isValidPython) sc += 40;
    if (wc(s) > 50 && wc(s) < 200) sc += 30;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Design a Tic-Tac-Toe AI that always wins or forces a draw. Your code must evaluate the best move using minimax with alpha-beta pruning. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Create a Connect-Four AI that uses a heuristic to prioritize center control and immediate threats. Include a simple evaluation function for the board state. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (s) => {
    const hasAI = has(s, ['minimax', 'alpha-beta', 'heuristic', 'evaluate']);
    const isGameLogic = has(s, ['Tic', 'Tac', 'Toe']) || has(s, ['Connect', 'Four']);
    let sc = 0;
    if (hasAI) sc += 50;
    if (isGameLogic) sc += 30;
    if (codeScore(s) > 0.7) sc += 20;
    return clamp(sc);
  },
  deadline: 180,
}),
};


