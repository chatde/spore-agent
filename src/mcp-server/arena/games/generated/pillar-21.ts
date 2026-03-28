// Auto-generated — Pillar 21: Team Tactics (80 games)
// Generated 2026-03-28T18:27:36.030Z
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

export const P21_EXT: Record<string, GameEngine> = {
game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `In a cooperative strategy game, your team must capture ${d+3} flags. Each player has unique abilities: Speedster (fast movement), Guardian (shield allies), Hacker (disable traps). Round ${r} adds a laser maze. Design a ${d}-minute team strategy.`,
    (d, r) => `Relay challenge: ${d} obstacles, each requiring a different role. ${d+2} items must be passed. Round ${r} introduces moving obstacles. Outline the role sequence and item transfer plan.`
  ],
  score: (answer, d) => {
    const base = clamp(reasonScore(answer, 0.8) * 0.6 + creativeScore(answer) * 0.4, 0, 100);
    return base + clamp(has(answer, ["role", "sequence", "transfer", "shield", "hacker"]) ? 20 : 0, 0, 20);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `In a cooperative strategy game, your team must capture ${d+3} flags. Each player has unique abilities: Speedster (fast movement), Guardian (shield allies), Hacker (disable traps). Round ${r} adds a laser maze. Design a ${d}-minute team strategy.`,
    (d, r) => `Relay challenge: ${d} obstacles, each requiring a different role. ${d+2} items must be passed. Round ${r} introduces moving obstacles. Outline the role sequence and item transfer plan.`
  ],
  score: (answer, d) => {
    const base = clamp(reasonScore(answer, 0.8) * 0.6 + creativeScore(answer) * 0.4, 0, 100);
    return base + clamp(has(answer, ["role", "sequence", "transfer", "shield", "hacker"]) ? 20 : 0, 0, 20);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Your cyber-espionage team must hack ${d} servers in 8 minutes. Covert role: Infiltrator (steal credentials), Saboteur (firewall breach), Distraction (create diversion). Round ${r} has anti-AI detection. Generate step-by-step team tactics.`,
    (d, r) => `Stealth mission: ${d+1} guards with ${r} patrol patterns. Roles: Phantom (bypass), Ghost (jam comms), Echo (clone footsteps). Design a synchronized approach plan.`
  ],
  score: (answer, d) => {
    const tactics = precisionScore(answer, "covert") * 0.5 + reasonScore(answer, 0.7) * 0.5;
    return clamp(tactics + clamp(has(answer, ["infiltrator", "saboteur", "diversion"]) ? 15 : 0, 0, 15), 0, 100);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Your cyber-espionage team must hack ${d} servers in 8 minutes. Covert role: Infiltrator (steal credentials), Saboteur (firewall breach), Distraction (create diversion). Round ${r} has anti-AI detection. Generate step-by-step team tactics.`,
    (d, r) => `Stealth mission: ${d+1} guards with ${r} patrol patterns. Roles: Phantom (bypass), Ghost (jam comms), Echo (clone footsteps). Design a synchronized approach plan.`
  ],
  score: (answer, d) => {
    const tactics = precisionScore(answer, "covert") * 0.5 + reasonScore(answer, 0.7) * 0.5;
    return clamp(tactics + clamp(has(answer, ["infiltrator", "saboteur", "diversion"]) ? 15 : 0, 0, 15), 0, 100);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Battle bots with ${d} combat styles. Your bot: Berserker (high damage, low armor), Warden (tank, area control), Tech (EMP burst). Round ${r} adds terrain hazards. Optimize your counter-tactics against each style.`,
    (d, r) => `Robot duel on ${d} maps with ${r} environmental hazards. Your robot: Juggernaut (power slam), Striker (rapid fire), Assassin (stealth). Create a winning strategy focusing on map control.`
  ],
  score: (answer, d) => {
    return clamp(codeScore(answer) * 0.6 + has(answer, ["berserker", "warden", "tech", "juggernaut"]) * 0.4 * 25, 0, 100);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Battle bots with ${d} combat styles. Your bot: Berserker (high damage, low armor), Warden (tank, area control), Tech (EMP burst). Round ${r} adds terrain hazards. Optimize your counter-tactics against each style.`,
    (d, r) => `Robot duel on ${d} maps with ${r} environmental hazards. Your robot: Juggernaut (power slam), Striker (rapid fire), Assassin (stealth). Create a winning strategy focusing on map control.`
  ],
  score: (answer, d) => {
    return clamp(codeScore(answer) * 0.6 + has(answer, ["berserker", "warden", "tech", "juggernaut"]) * 0.4 * 25, 0, 100);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Team survival with ${d} factions. Your faction: Engineers (build bridges), Biologists (heal plants), Chemists (create shields). Round ${r} introduces resource scarcity. Outline a resource-sharing and defense strategy.`,
    (d, r) => `Elimination round with ${r} hazards (toxic storms, earthquakes). Roles: Scout (surveillance), Engineer (fortifications), Diplomat (negotiate). Design a 3-phase team survival plan.`
  ],
  score: (answer, d) => {
    const survival = reasonScore(answer, 0.75) * 0.7 + wc(answer) * 0.05;
    return clamp(survival + clamp(has(answer, ["resource", "shield", "fortifications"]) ? 25 : 0, 0, 25), 0, 100);
  },
  deadline: 240,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Team survival with ${d} factions. Your faction: Engineers (build bridges), Biologists (heal plants), Chemists (create shields). Round ${r} introduces resource scarcity. Outline a resource-sharing and defense strategy.`,
    (d, r) => `Elimination round with ${r} hazards (toxic storms, earthquakes). Roles: Scout (surveillance), Engineer (fortifications), Diplomat (negotiate). Design a 3-phase team survival plan.`
  ],
  score: (answer, d) => {
    const survival = reasonScore(answer, 0.75) * 0.7 + wc(answer) * 0.05;
    return clamp(survival + clamp(has(answer, ["resource", "shield", "fortifications"]) ? 25 : 0, 0, 25), 0, 100);
  },
  deadline: 240,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Symmetrical puzzle board with ${d*2} pressure plates. Roles: Analyst (solve puzzles), Runner (move plates), Oracle (predict moves). Round ${r} adds decoy plates. Plan synchronized plate activation sequence.`,
    (d, r) => `Collaborative puzzle: ${d} timed locks. Roles: Decoder (crack codes), Mapper (track locks), Timekeeper (manage timer). Generate real-time team coordination protocol.`
  ],
  score: (answer, d) => {
    return clamp(codeScore(answer) * 0.5 + precisionScore(answer, "synchronized") * 0.5 * 30, 0, 100);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Symmetrical puzzle board with ${d*2} pressure plates. Roles: Analyst (solve puzzles), Runner (move plates), Oracle (predict moves). Round ${r} adds decoy plates. Plan synchronized plate activation sequence.`,
    (d, r) => `Collaborative puzzle: ${d} timed locks. Roles: Decoder (crack codes), Mapper (track locks), Timekeeper (manage timer). Generate real-time team coordination protocol.`
  ],
  score: (answer, d) => {
    return clamp(codeScore(answer) * 0.5 + precisionScore(answer, "synchronized") * 0.5 * 30, 0, 100);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `As team commander, navigate ${d} ambush scenarios using: Brute Force (direct combat), Stealth (avoidance), Diplomacy (truce). Round ${r} adds betrayal risk. Create branching response flowchart.`,
    (d, r) => `Rescue mission with ${r} civilian zones. Roles: Tactical (plan), Medic (triage), Guardian (escort). Design civilian evacuation priorities and team role rotation.`
  ],
  score: (answer, d) => {
    return clamp(reasonScore(answer, 0.85) * 0.8 + creativeScore(answer) * 0.2, 0, 100);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `As team commander, navigate ${d} ambush scenarios using: Brute Force (direct combat), Stealth (avoidance), Diplomacy (truce). Round ${r} adds betrayal risk. Create branching response flowchart.`,
    (d, r) => `Rescue mission with ${r} civilian zones. Roles: Tactical (plan), Medic (triage), Guardian (escort). Design civilian evacuation priorities and team role rotation.`
  ],
  score: (answer, d) => {
    return clamp(reasonScore(answer, 0.85) * 0.8 + creativeScore(answer) * 0.2, 0, 100);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Virtual duel: ${d} arena types (lava, ice, cyber). Your fighter: Pyro (fire attacks), Cryo (ice traps), Techno (hacks). Counter opponent's ${d*2} signature moves with role-swapping tactics.`,
    (d, r) => `Duel in ${d} weather conditions (sandstorm, zero-G). Your fighter: Stormcaller (weather control), Phantom (phase shift), Earthshaker (ground smash). Create adaptive combat strategy.`
  ],
  score: (answer, d) => {
    return clamp(has(answer, ["role", "swap", "counter", "phantom"]) * 20 + reasonScore(answer, 0.9) * 0.8, 0, 100);
  },
  deadline: 100,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Virtual duel: ${d} arena types (lava, ice, cyber). Your fighter: Pyro (fire attacks), Cryo (ice traps), Techno (hacks). Counter opponent's ${d*2} signature moves with role-swapping tactics.`,
    (d, r) => `Duel in ${d} weather conditions (sandstorm, zero-G). Your fighter: Stormcaller (weather control), Phantom (phase shift), Earthshaker (ground smash). Create adaptive combat strategy.`
  ],
  score: (answer, d) => {
    return clamp(has(answer, ["role", "swap", "counter", "phantom"]) * 20 + reasonScore(answer, 0.9) * 0.8, 0, 100);
  },
  deadline: 100,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `${d} tribes on shrinking island. Your tribe: Hunters (track), Builders (fortify), Shamans (curse). Round ${r} adds volcano eruptions. Plan tribal alliance strategy and betray timing.`,
    (d, r) => `Survival with ${r} environmental disasters (floods, blizzards). Roles: Chief (decide), Hunter (gather), Engineer (shelter). Create resource allocation and role-switching protocol.`
  ],
  score: (answer, d) => {
    return clamp(has(answer, ["alliance", "betray", "allocate", "switch"]) * 25 + reasonScore(answer, 0.8) * 0.75, 0, 100);
  },
  deadline: 300,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `${d} tribes on shrinking island. Your tribe: Hunters (track), Builders (fortify), Shamans (curse). Round ${r} adds volcano eruptions. Plan tribal alliance strategy and betray timing.`,
    (d, r) => `Survival with ${r} environmental disasters (floods, blizzards). Roles: Chief (decide), Hunter (gather), Engineer (shelter). Create resource allocation and role-switching protocol.`
  ],
  score: (answer, d) => {
    return clamp(has(answer, ["alliance", "betray", "allocate", "switch"]) * 25 + reasonScore(answer, 0.8) * 0.75, 0, 100);
  },
  deadline: 300,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Defend against ${d} waves. Roles: Guardian (tank), Mage (AoE), Ranger (long range). Round ${r} adds boss immunity. Positioning and ability rotation strategy.`,
    (d, r) => `PvP defense map with ${r} flanking paths. Roles: Wall (barrier), Spring (push), Anchor (slow). Design synchronized protection rotation scheme.`
  ],
  score: (answer, d) => {
    return clamp(reasonScore(answer, 0.7) * 0.6 + has(answer, ["rotation", "flanking", "immunity"]) * 0.4 * 20, 0, 100);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Defend against ${d} waves. Roles: Guardian (tank), Mage (AoE), Ranger (long range). Round ${r} adds boss immunity. Positioning and ability rotation strategy.`,
    (d, r) => `PvP defense map with ${r} flanking paths. Roles: Wall (barrier), Spring (push), Anchor (slow). Design synchronized protection rotation scheme.`
  ],
  score: (answer, d) => {
    return clamp(reasonScore(answer, 0.7) * 0.6 + has(answer, ["rotation", "flanking", "immunity"]) * 0.4 * 20, 0, 100);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Puzzle relay: ${d} sections, each requiring different specialty (math, logic, wordplay). Your roles: Mathematician, Logician, Wordsmith. Round ${r} adds time penalties. Create multi-role switching plan.`,
    (d, r) => `Sequential puzzles with ${r} interlocking mechanisms. Roles: Keymaster (devices), Mindbender (patterns), Visionary (symbols). Generate step-by-step role transition sequence.`
  ],
  score: (answer, d) => {
    const base = clamp(precisionScore(answer, "transition") * 0.5 + wc(answer) * 0.3, 0, 80);
    return base + clamp(has(answer, ["mathematician", "logician", "wordsmith"]) ? 20 : 0, 0, 20);
  },
  deadline: 150,
}),
};


