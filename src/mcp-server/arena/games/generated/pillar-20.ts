// Auto-generated — Pillar 20: Battle Royale (66 games)
// Generated 2026-03-28T18:16:47.760Z
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

export const P20_EXT: Record<string, GameEngine> = {
game_maze_logic_solv: textGame({
    // format: battle_royale
    prompts: [
        (d, r) => `Navigate the maze grid of size ${d}x${d}. Round ${r}: Find the path from start to exit avoiding walls.`,
        (d, r) => `Difficulty ${d} Round ${r}: Output only the sequence of moves (U/D/L/R) to solve the pathfinding challenge.`,
        (d, r) => `Constraint ${d}: Time limit Round ${r}. Calculate the shortest number of steps required.`,
    ],
    score: (answer, d) => {
        let sc = 0;
        let steps = wc(answer);
        if (steps > 50) sc = 5;
        if (has(answer, ['path', 'move', 'sequence'])) sc += 2;
        return clamp(sc);
    },
    deadline: 90,
}),

game_maze_logic_solv: textGame({
    // format: battle_royale
    prompts: [
        (d, r) => `Navigate the maze grid of size ${d}x${d}. Round ${r}: Find the path from start to exit avoiding walls.`,
        (d, r) => `Difficulty ${d} Round ${r}: Output only the sequence of moves (U/D/L/R) to solve the pathfinding challenge.`,
        (d, r) => `Constraint ${d}: Time limit Round ${r}. Calculate the shortest number of steps required.`,
    ],
    score: (answer, d) => {
        let sc = 0;
        let steps = wc(answer);
        if (steps > 50) sc = 5;
        if (has(answer, ['path', 'move', 'sequence'])) sc += 2;
        return clamp(sc);
    },
    deadline: 90,
}),

game_syntax_patch_fix: textGame({
    // format: battle_royale
    prompts: [
        (d, r) => `Debug the code snippet provided. Difficulty ${d} Round ${r}: Fix errors without rewriting logic.`,
        (d, r) => `Round ${r}: Analyze the syntax error in the TypeScript file level ${d}. Output the corrected line.`,
        (d, r) => `Difficulty ${d}: Complete the missing function in the script for Round ${r}.`,
    ],
    score: (answer, d) => {
        let sc = 0;
        let valid = codeScore(answer);
        if (valid > 10) sc += 5;
        sc += reasonScore(answer);
        return clamp(sc);
    },
    deadline: 100,
}),

game_syntax_patch_fix: textGame({
    // format: battle_royale
    prompts: [
        (d, r) => `Debug the code snippet provided. Difficulty ${d} Round ${r}: Fix errors without rewriting logic.`,
        (d, r) => `Round ${r}: Analyze the syntax error in the TypeScript file level ${d}. Output the corrected line.`,
        (d, r) => `Difficulty ${d}: Complete the missing function in the script for Round ${r}.`,
    ],
    score: (answer, d) => {
        let sc = 0;
        let valid = codeScore(answer);
        if (valid > 10) sc += 5;
        sc += reasonScore(answer);
        return clamp(sc);
    },
    deadline: 100,
}),

game_narrative_growth: textGame({
    // format: battle_royale
    prompts: [
        (d, r) => `Write the continuation of the story. Difficulty ${d} Round ${r}. Maintain the tone.`,
        (d, r) => `Round ${r}: Create a new character description based on prompt difficulty ${d}.`,
        (d, r) => `Difficulty ${d}: Develop the plot twist for Round ${r}. Ensure coherence.`,
    ],
    score: (answer, d) => {
        let sc = 0;
        sc = creativeScore(answer);
        if (wc(answer) > 100) sc += 3;
        return clamp(sc);
    },
    deadline: 150,
}),

game_narrative_growth: textGame({
    // format: battle_royale
    prompts: [
        (d, r) => `Write the continuation of the story. Difficulty ${d} Round ${r}. Maintain the tone.`,
        (d, r) => `Round ${r}: Create a new character description based on prompt difficulty ${d}.`,
        (d, r) => `Difficulty ${d}: Develop the plot twist for Round ${r}. Ensure coherence.`,
    ],
    score: (answer, d) => {
        let sc = 0;
        sc = creativeScore(answer);
        if (wc(answer) > 100) sc += 3;
        return clamp(sc);
    },
    deadline: 150,
}),

game_logic_chess_combat: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Generate a chess scenario at difficulty ${d} for round ${r} where White must checkmate in exactly ${clamp(d, 1, 5)} moves. Valid moves only.`,
    (d, r) => `Black now has ${clamp(10 - d, 1, 6)} turns to escape. FEN notation only.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const hasCheckmate = has(answer, ["#", "checkmate"]);
    const hasMateInMoves = has(answer, ["mate in", `${clamp(d, 1, 5)}`]);
    if (hasCheckmate && hasMateInMoves) sc += codeScore(answer) * 2;
    else if (hasCheckmate) sc += codeScore(answer);
    sc += precisionScore(answer, "FEN") * 0.5;
    return clamp(sc);
  },
  deadline: 90,
}),

game_logic_chess_combat: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Generate a chess scenario at difficulty ${d} for round ${r} where White must checkmate in exactly ${clamp(d, 1, 5)} moves. Valid moves only.`,
    (d, r) => `Black now has ${clamp(10 - d, 1, 6)} turns to escape. FEN notation only.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const hasCheckmate = has(answer, ["#", "checkmate"]);
    const hasMateInMoves = has(answer, ["mate in", `${clamp(d, 1, 5)}`]);
    if (hasCheckmate && hasMateInMoves) sc += codeScore(answer) * 2;
    else if (hasCheckmate) sc += codeScore(answer);
    sc += precisionScore(answer, "FEN") * 0.5;
    return clamp(sc);
  },
  deadline: 90,
}),

code_arena_gladiator: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Write a ${d * 100}-line Python bot for a gladiator arena. Round ${r}: Beat opponents by optimizing attack/defense vs ${d} rival bots.`,
    (d, r) => `Now embed a hidden ${d % 4 + 1}-move sequence that triggers a trap only you know.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const lines = wc(answer, "lines");
    sc += mathScore(lines, d * 100) * 0.8;
    sc += has(answer, ["trap", "sequence"]) ? codeScore(answer) : 0;
    sc += creativeScore(answer) * 0.5;
    return clamp(sc);
  },
  deadline: 180,
}),

code_arena_gladiator: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Write a ${d * 100}-line Python bot for a gladiator arena. Round ${r}: Beat opponents by optimizing attack/defense vs ${d} rival bots.`,
    (d, r) => `Now embed a hidden ${d % 4 + 1}-move sequence that triggers a trap only you know.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const lines = wc(answer, "lines");
    sc += mathScore(lines, d * 100) * 0.8;
    sc += has(answer, ["trap", "sequence"]) ? codeScore(answer) : 0;
    sc += creativeScore(answer) * 0.5;
    return clamp(sc);
  },
  deadline: 180,
}),

spatial_puzzle_survival: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve this 3D maze: ${"#".repeat(d * 2)} => ${"@".repeat(d)}. Round ${r}. Output shortest path as coordinate pairs.`,
    (d, r) => `Now add ${d} traps in non-lethal positions. Mark with 'X'.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const pathValid = has(answer, ["=>", "@"]);
    const trapCount = wc(answer.split("X").length - 1, "");
    sc += pathValid ? precisionScore(answer, ["coordinate", "=>"]) : 0;
    sc += mathScore(trapCount, d) * 0.4;
    return clamp(sc);
  },
  deadline: 150,
}),

spatial_puzzle_survival: textGame({
  // format: solo
  prompts: [
    (d, r) => `Solve this 3D maze: ${"#".repeat(d * 2)} => ${"@".repeat(d)}. Round ${r}. Output shortest path as coordinate pairs.`,
    (d, r) => `Now add ${d} traps in non-lethal positions. Mark with 'X'.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const pathValid = has(answer, ["=>", "@"]);
    const trapCount = wc(answer.split("X").length - 1, "");
    sc += pathValid ? precisionScore(answer, ["coordinate", "=>"]) : 0;
    sc += mathScore(trapCount, d) * 0.4;
    return clamp(sc);
  },
  deadline: 150,
}),

syntax_rush_royale: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Debug this ${d}-error snippet for a team royale: ${answer}. Round ${r}. Fix all syntax/logic errors within 2 min.`,
    (d, r) => `Now optimize it to run ${clamp(d, 2, 6)}x faster.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += syntaxScore(answer) * 2;
    sc += mathScore(answer, 100) * 0.5;
    return clamp(sc);
  },
  deadline: 120,
}),

syntax_rush_royale: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Debug this ${d}-error snippet for a team royale: ${answer}. Round ${r}. Fix all syntax/logic errors within 2 min.`,
    (d, r) => `Now optimize it to run ${clamp(d, 2, 6)}x faster.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += syntaxScore(answer) * 2;
    sc += mathScore(answer, 100) * 0.5;
    return clamp(sc);
  },
  deadline: 120,
}),

narrative_battle_chain: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Create a branching story for ${d} protagonists. Round ${r}: Each dies if their path ends with a betrayal.`,
    (d, r) => `Now introduce a hidden prophecy that ends the game for all if mentioned.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const betrayal = has(answer, ["betrayal", "end"]);
    const prophecy = has(answer, ["prophecy"]);
    sc += creativeScore(answer) * 2;
    sc += (betrayal && prophecy) ? reasonScore(answer) : 0;
    return clamp(sc);
  },
  deadline: 180,
}),

narrative_battle_chain: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Create a branching story for ${d} protagonists. Round ${r}: Each dies if their path ends with a betrayal.`,
    (d, r) => `Now introduce a hidden prophecy that ends the game for all if mentioned.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const betrayal = has(answer, ["betrayal", "end"]);
    const prophecy = has(answer, ["prophecy"]);
    sc += creativeScore(answer) * 2;
    sc += (betrayal && prophecy) ? reasonScore(answer) : 0;
    return clamp(sc);
  },
  deadline: 180,
}),

math_duel_titan: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Solve this ${d}-operation calculation: (a + b) * c / d. Round ${r}. a=${r}, b=${d}, c=${clamp(d + 2, 1, 9)}. Exact answer only.`,
    (d, r) => `Now derive the formula for the nth term where n=${clamp(d * 2, 1, 10)}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const correct = has(answer, [Math.round((r + d) * (d + 2) / d).toString()]);
    sc += correct ? mathScore(answer, 100) : 0;
    sc += has(answer, ["nth term", "derive"]) ? reasonScore(answer) : 0;
    return clamp(sc);
  },
  deadline: 90,
}),

math_duel_titan: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Solve this ${d}-operation calculation: (a + b) * c / d. Round ${r}. a=${r}, b=${d}, c=${clamp(d + 2, 1, 9)}. Exact answer only.`,
    (d, r) => `Now derive the formula for the nth term where n=${clamp(d * 2, 1, 10)}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const correct = has(answer, [Math.round((r + d) * (d + 2) / d).toString()]);
    sc += correct ? mathScore(answer, 100) : 0;
    sc += has(answer, ["nth term", "derive"]) ? reasonScore(answer) : 0;
    return clamp(sc);
  },
  deadline: 90,
}),

creative_asset_hunt: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a ${d}-element 2D game asset pack. Round ${r}: Focus on a mythical creature. Include name, color hex, and 2 lore lines.`,
    (d, r) => `Now add a ${d % 3 + 1}-move animation loop description.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const elements = wc(answer, ["element", "line"]);
    sc += creativeScore(answer) * 2;
    sc += precisionScore(answer, ["hex", "animation"]) * 0.8;
    return clamp(sc);
  },
  deadline: 120,
}),

creative_asset_hunt: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a ${d}-element 2D game asset pack. Round ${r}: Focus on a mythical creature. Include name, color hex, and 2 lore lines.`,
    (d, r) => `Now add a ${d % 3 + 1}-move animation loop description.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const elements = wc(answer, ["element", "line"]);
    sc += creativeScore(answer) * 2;
    sc += precisionScore(answer, ["hex", "animation"]) * 0.8;
    return clamp(sc);
  },
  deadline: 120,
}),

logic_arbiter_trial: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Resolve this paradox for team royale. Round ${r}: "I always lie." Determine truth with ${d} logical steps.`,
    (d, r) => `Now debunk a ${d}-layer nested contradiction.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const paradoxSolved = has(answer, ["never", "lies"]);
    const nestedDebunked = has(answer, ["nested", "contradiction"]);
    sc += reasonScore(answer) * (paradoxSolved ? 2 : 0.5);
    sc += creativeScore(answer) * 0.5;
    return clamp(sc);
  },
  deadline: 150,
}),

logic_arbiter_trial: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Resolve this paradox for team royale. Round ${r}: "I always lie." Determine truth with ${d} logical steps.`,
    (d, r) => `Now debunk a ${d}-layer nested contradiction.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const paradoxSolved = has(answer, ["never", "lies"]);
    const nestedDebunked = has(answer, ["nested", "contradiction"]);
    sc += reasonScore(answer) * (paradoxSolved ? 2 : 0.5);
    sc += creativeScore(answer) * 0.5;
    return clamp(sc);
  },
  deadline: 150,
}),

tactical_espionage_round: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Generate a ${d}-faction espionage scenario. Round ${r}: Each must steal a secret from one other without detection.`,
    (d, r) => `Now plant a false document that only ${clamp(d % 5 + 1, 1, 5)} agents could detect as fake.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const secretMention = has(answer, ["secret", "steal"]);
    const fakeDoc = has(answer, ["false document"]);
    sc += creativeScore(answer) * 2;
    sc += (secretMention && fakeDoc) ? precisionScore(answer, ["faction"]) : 0;
    return clamp(sc);
  },
  deadline: 180,
}),

tactical_espionage_round: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Generate a ${d}-faction espionage scenario. Round ${r}: Each must steal a secret from one other without detection.`,
    (d, r) => `Now plant a false document that only ${clamp(d % 5 + 1, 1, 5)} agents could detect as fake.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const secretMention = has(answer, ["secret", "steal"]);
    const fakeDoc = has(answer, ["false document"]);
    sc += creativeScore(answer) * 2;
    sc += (secretMention && fakeDoc) ? precisionScore(answer, ["faction"]) : 0;
    return clamp(sc);
  },
  deadline: 180,
}),

algorithmic_poker_frenzy: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Simulate a poker hand where you must bluff ${d}% of the time. Round ${r}. Output cards and bet strategy.`,
    (d, r) => `Now calculate the odds of winning with those cards against a random hand.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const bluffValid = has(answer, ["bluff", d.toString()]);
    const oddsValid = has(answer, ["odds", "calculat"]);
    sc += bluffValid ? creativeScore(answer) : 0;
    sc += oddsValid ? mathScore(answer, 100) : 0;
    return clamp(sc);
  },
  deadline: 90,
}),
};


