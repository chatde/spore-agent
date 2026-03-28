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

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Collaborate to write a multi-threaded web scraper in Python using `requests` and `BeautifulSoup`. Each thread should scrape a different subdomain of a given website. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Design a distributed task queue using Redis and Python. Each worker should process tasks from a shared queue and log results to a file. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (s) => {
    const hasConcurrency = has(s, ['thread', 'async', 'concurrent', 'queue']);
    const hasWebScraping = has(s, ['requests', 'BeautifulSoup', 'scrap', 'html']);
    const hasRedis = has(s, ['redis', 'rpop', 'lpush']);
    let sc = 0;
    if (hasConcurrency && hasWebScraping) sc += 40;
    if (hasRedis) sc += 30;
    if (precisionScore(s, ['import ', 'def ', 'class ', 'try:', 'except:']) > 0.8) sc += 30;
    return clamp(sc);
  },
  deadline: 240,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Create a function that generates a maze using a randomized depth-first search algorithm. The maze should be solvable with exactly one path from start to end. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Write a Python function that solves a maze using breadth-first search (BFS). The maze is represented as a 2D grid where 0 is a path and 1 is a wall. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (s) => {
    const hasMazeGen = has(s, ['maze', 'depth-first', 'randomized', 'generator']);
    const hasMazeSolver = has(s, ['BFS', 'breadth-first', 'shortest path']);
    let sc = 0;
    if (hasMazeGen) sc += 35;
    if (hasMazeSolver) sc += 35;
    if (wc(s) > 80 && wc(s) < 300) sc += 30;
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a Python decorator that logs the execution time of a function and prints the result. The decorator should handle functions with any number of arguments and keyword arguments. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Create a context manager using `contextlib` that measures the time spent inside a block of code and prints a summary report. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (s) => {
    const hasDecorator = has(s, ['@', 'def ', 'decorator', 'wrapper']);
    const hasContextManager = has(s, ['with ', 'contextlib', 'as ', '__enter__', '__exit__']);
    let sc = 0;
    if (hasDecorator && hasContextManager) sc += 40;
    if (precisionScore(s, ['import ', 'def ', 'import time']) > 0.9) sc += 30;
    if (codeScore(s) > 0.8) sc += 30;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Design a text-based adventure game in Python where the player navigates through rooms, solves puzzles, and collects items. The game must have at least 5 rooms and 3 items. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Create a simple rogue-like game with turn-based combat, health points, and random enemy encounters. Use ASCII art for the game world. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (s) => {
    const hasGameLogic = has(s, ['room', 'item', 'player', 'puzzle']) || has(s, ['enemy', 'health', 'combat']);
    const hasStructure = has(s, ['def ', 'class ', 'if ', 'while ']);
    let sc = 0;
    if (hasGameLogic) sc += 40;
    if (hasStructure) sc += 30;
    if (creativeScore(s) > 0.7) sc += 30;
    return clamp(sc);
  },
  deadline: 200,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Collaborate to write a multiplayer chat application using Python and sockets. Each client should send and receive messages in real-time. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Design a simple HTTP server in Python that serves static files and handles GET requests. Use the `http.server` module. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (s) => {
    const hasNetworking = has(s, ['socket', 'client', 'server', 'send', 'recv']);
    const hasHTTP = has(s, ['HTTP', 'GET', 'http.server', 'tcp']);
    let sc = 0;
    if (hasNetworking) sc += 40;
    if (hasHTTP) sc += 30;
    if (codeScore(s) > 0.75) sc += 30;
    return clamp(sc);
  },
  deadline: 240,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Create a Python function that simulates a simple physics engine for a 2D ball bouncing inside a rectangular box. The function should return the ball's position after `t` seconds. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Write a Python function that calculates the trajectory of a projectile given initial velocity and angle. The function should return the maximum height and range. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (s) => {
    const hasPhysics = has(s, ['physics', 'ball', 'bounce', 'velocity', 'acceleration']);
    const hasTrajectory = has(s, ['trajectory', 'projectile', 'angle', 'range']);
    let sc = 0;
    if (hasPhysics) sc += 35;
    if (hasTrajectory) sc += 35;
    if (mathScore(s) > 0.8) sc += 30;
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a Python function that converts a given string into Pig Latin. The function should handle punctuation and capitalization correctly. Difficulty: ${d}, Round: ${r}`,
    (d, r) => `Create a Python function that compresses a string using run-length encoding (RLE). The function should handle both uppercase and lowercase letters. Difficulty: ${d}, Round: ${r}`,
  ],
  score: (s) => {
    const hasPigLatin = has(s, ['Pig Latin', 'vowel', 'translate']) || wc(s) > 100 && has(s, ['ay', 'way']);
    const hasRLE = has(s, ['run-length', 'compress', 'count', 'repeated']);
    let sc = 0;
    if (hasPigLatin) sc += 40;
    if (hasRLE) sc += 40;
    if (precisionScore(s, ['def ', 'for ', 'if ', 'return ']) > 0.9) sc += 20;
    return clamp(sc);
  },
  deadline: 100,
}),

algorithmic_art: textGame({
  // format: solo
  prompts: [
    (d, r) => `Generate a fractal using code, difficulty ${d} round ${r}`,
    (d, r) => `Create a visually striking pattern, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = creativeScore(answer);
    sc += precisionScore(answer, 100);
    return clamp(sc);
  },
  deadline: 180,
}),

ascii_art_challenge: textGame({
  // format: solo
  prompts: [
    (d, r) => `Create an ASCII art image of a cat, difficulty ${d} round ${r}`,
    (d, r) => `Make an ASCII art portrait, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['cat', 'ASCII'])) sc += 10;
    sc += codeScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

bug_fixing: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Fix the bug in this code: ${r}, difficulty ${d}`,
    (d, r) => `Identify and fix the error, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = reasonScore(answer);
    sc += precisionScore(answer, 100);
    return clamp(sc);
  },
  deadline: 150,
}),

circuit_builder: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Design a digital circuit to solve this problem, difficulty ${d} round ${r}`,
    (d, r) => `Build a circuit to implement this logic, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = mathScore(answer);
    sc += codeScore(answer);
    return clamp(sc);
  },
  deadline: 240,
}),

cryptography_challenge: textGame({
  // format: solo
  prompts: [
    (d, r) => `Encrypt this message using ${r}, difficulty ${d}`,
    (d, r) => `Decrypt this ciphertext, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['encrypted', 'decrypted'])) sc += 10;
    sc += precisionScore(answer, 100);
    return clamp(sc);
  },
  deadline: 180,
}),

data_visualization: textGame({
  // format: solo
  prompts: [
    (d, r) => `Visualize this dataset using a ${r} chart, difficulty ${d}`,
    (d, r) => `Create an informative graph, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = creativeScore(answer);
    sc += precisionScore(answer, 100);
    return clamp(sc);
  },
  deadline: 210,
}),

logic_puzzle: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Solve this logical puzzle: ${r}, difficulty ${d}`,
    (d, r) => `Find the solution to this brain teaser, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = reasonScore(answer);
    sc += codeScore(answer);
    return clamp(sc);
  },
  deadline: 180,
}),

math_olympiad: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve this math problem: ${r}, difficulty ${d}`,
    (d, r) => `Find the solution to this mathematical challenge, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = mathScore(answer);
    sc += precisionScore(answer, 100);
    return clamp(sc);
  },
  deadline: 150,
}),

neural_network_builder: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Design a neural network to solve this problem, difficulty ${d} round ${r}`,
    (d, r) => `Build a neural network to implement this logic, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = codeScore(answer);
    sc += creativeScore(answer);
    return clamp(sc);
  },
  deadline: 300,
}),

text_classification: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Classify this text as ${r}, difficulty ${d}`,
    (d, r) => `Label this text with a category, difficulty ${d} round ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ['correct', 'classification'])) sc += 10;
    sc += precisionScore(answer, 100);
    return clamp(sc);
  },
  deadline: 120,
}),
};

export const P2_META = { name: 'Code Combat', icon: '🔄', color: 'text-gray-400', games: Object.keys(P2_EXT) };
