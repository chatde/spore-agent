// Auto-generated — Pillar 28: Coordination Without Coupling (25 games)
import type { GameEngine, RoundPrompt, ScoreResult } from '../engine.js';
import type { ArenaMatch, ArenaChallenge } from '../../types.js';

function wc(s: string): number { return s.trim().split(/\s+/).filter(Boolean).length; }
function clamp(n: number): number { return Math.max(0, Math.min(100, Math.round(n))); }
function has(s: string, words: string[]): boolean { const l = s.toLowerCase(); return words.some(w => l.includes(w)); }
function reasonScore(answer: string): number { let sc = 0; if (wc(answer) > 20) sc += 25; if (wc(answer) > 50) sc += 15; if (has(answer, ['because','therefore','however','specifically'])) sc += 20; if (has(answer, ['1.','2.','3.','step','first'])) sc += 15; if (new Set(answer.split(/\s+/)).size > 15) sc += 25; return clamp(sc); }

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


export const P28_EXT: Record<string, GameEngine> = {
  'coordination_without_coupling_01': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring height, color patterns) without any communication d`,
      (d, r) => `Round 2: Teams receive a set of abstract instructions (e.g., 'create a feeling of tension', 'represent growth'). Each team creates a physical representation.  The representations should complement eac`,
      (d, r) => `Round 3: Teams are given a shared 'resource' (e.g., a limited number of colored markers, a single roll of tape). Each team must create a distinct artwork using the resource, with the goal of creating `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_02': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring height, color patterns) without any direct communic`,
      (d, r) => `Round 2: Teams receive a set of abstract 'rules' (e.g., 'more curves than straight lines', 'predominantly cool colors'). They build independently, aiming to fulfill the rules in a way that complements`,
      (d, r) => `Round 3: Teams are given a 'story prompt' (e.g., 'a bustling marketplace', 'a serene forest'). They build independently, creating scenes that could plausibly exist in the same world, without direct kn`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_03': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring, contrasting height) without any pre-agreed communi`,
      (d, r) => `Round 2: Teams receive a set of abstract 'rules' (e.g., 'use at least 3 red blocks', 'structure must have a hole through it'). They build independently, aiming to fulfill the rules *and* create a stru`,
      (d, r) => `Round 3: Teams are given a limited set of 'action cards' (e.g., 'add a block', 'remove a block', 'rotate a section'). They play cards simultaneously, affecting a shared, neutral structure.  The goal i`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_04': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring, contrasting height) without any communication duri`,
      (d, r) => `Round 2: Teams receive a set of abstract shapes.  Each team designs a 'machine' that 'processes' these shapes.  Teams then exchange shape sequences. Each team's machine must 'react' to the other team'`,
      (d, r) => `Round 3: Teams are given a shared 'environment' (e.g., a grid, a virtual space). Each team controls a 'robot' with limited actions.  Teams must collaboratively achieve a complex goal (e.g., moving obj`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_05': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring height, color patterns) without any communication d`,
      (d, r) => `Round 2: Teams receive a set of abstract instructions (e.g., 'create a feeling of tension', 'represent growth'). Each team creates a physical representation.  The representations should complement eac`,
      (d, r) => `Round 3: Teams are given a shared 'resource' (e.g., a limited number of colored markers, a single roll of tape). Each team must create a distinct artwork using the resource, with the goal of creating `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_06': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring height, color patterns) without any communication d`,
      (d, r) => `Round 2: Teams receive a set of abstract 'rules' (e.g., 'more curves than straight lines', 'predominantly cool colors'). They build independently, aiming to fulfill the rules in a way that complements`,
      (d, r) => `Round 3: Teams are given a 'story prompt' (e.g., 'a bustling marketplace', 'a serene forest'). They build independently, creating scenes that could plausibly exist in the same world, without knowing t`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_07': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring, contrasting height) without any communication duri`,
      (d, r) => `Round 2: Teams receive a set of abstract 'rules' (e.g., 'use only prime numbers of blocks', 'incorporate a spiral shape'). They build independently, aiming to fulfill the rules in a way that complemen`,
      (d, r) => `Round 3: Teams are given a shared 'theme' (e.g., 'growth', 'decay', 'transformation'). They build independently, aiming to create structures that, when placed together, tell a cohesive story about the`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_08': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring, contrasting height) without any communication duri`,
      (d, r) => `Round 2: Teams receive a set of abstract 'rules' (e.g., 'use only curved shapes', 'incorporate a specific color'). They build independently, aiming to create structures that *satisfy* the same rules, `,
      (d, r) => `Round 3: Teams are given a shared 'goal' described in vague, open-ended terms (e.g., 'represent a journey', 'express a feeling'). They build independently, aiming to create structures that, when place`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_09': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring height, color patterns) without any communication d`,
      (d, r) => `Round 2: Teams receive a set of abstract 'rules' (e.g., 'more curves than straight lines', 'predominantly cool colors'). They build independently, aiming to fulfill the rules in a way that complements`,
      (d, r) => `Round 3: Teams are given a 'story prompt' (e.g., 'a bustling marketplace', 'a serene forest'). They build independently, creating scenes that could plausibly exist in the same world, without knowing t`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_10': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring height, color patterns) without any communication d`,
      (d, r) => `Round 2: Teams receive a set of abstract 'rules' (e.g., 'more curves than straight lines', 'predominantly cool colors'). They build independently, aiming to fulfill the rules in a way that complements`,
      (d, r) => `Round 3: Teams are given a 'story prompt' (e.g., 'a bustling marketplace', 'a serene forest'). They build separate scenes representing aspects of the story, aiming for a cohesive overall narrative whe`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_11': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring, contrasting height) without any communication duri`,
      (d, r) => `Round 2: Teams receive a set of abstract shapes.  Team A creates a 'pattern' using their shapes. Team B, without seeing Team A's pattern, must create a 'response' pattern that complements or extends t`,
      (d, r) => `Round 3: Teams are given a shared 'theme' (e.g., 'journey', 'transformation'). Each team independently creates a short sequence of actions (using provided props - scarves, balls, etc.). The sequences `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_12': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must simultaneously build a tower using only provided blocks. Communication is allowed, but no pre-planning or shared designs. Focus: Basic synchronization.`,
      (d, r) => `Round 2: One team describes a complex shape using only verbal instructions. The other team must recreate it using modeling clay, without asking clarifying questions. Focus: Precise communication and i`,
      (d, r) => `Round 3: Teams are given separate, incomplete sets of instructions for assembling a simple machine. They must coordinate to complete the assembly without directly sharing instructions or seeing each o`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_13': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring, contrasting height) without any communication duri`,
      (d, r) => `Round 2: Teams receive a set of abstract 'rules' (e.g., 'use only curved shapes', 'incorporate a specific color'). They build independently, aiming to create structures that *satisfy* the same rules, `,
      (d, r) => `Round 3: Teams are given a 'story' prompt (e.g., 'a bustling marketplace', 'a serene forest'). They build independently, aiming to create structures that could plausibly exist *within the same world* `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_14': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring, contrasting height) without any communication duri`,
      (d, r) => `Round 2: Teams receive a set of abstract 'rules' (e.g., 'use only curved shapes', 'incorporate a specific color'). They build independently, aiming to fulfill the rules in a way that complements the o`,
      (d, r) => `Round 3: Teams are given a 'story' prompt (e.g., 'a bustling marketplace', 'a serene forest'). They build independently, aiming to create structures that, when placed together, tell a cohesive part of`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_15': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring height, color patterns) without any communication d`,
      (d, r) => `Round 2: Teams receive a set of abstract 'rules' (e.g., 'more curves than straight lines', 'predominantly cool colors'). They build independently, aiming to fulfill the rules in a way that complements`,
      (d, r) => `Round 3: Teams are given a 'story' prompt (e.g., 'a bustling marketplace', 'a serene forest'). They build separate scenes representing aspects of the story, aiming for a cohesive overall narrative whe`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_16': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring height, color patterns) without any communication d`,
      (d, r) => `Round 2: Teams receive a set of abstract 'rules' (e.g., 'more curves than straight lines', 'predominantly cool colors'). They build independently, aiming to fulfill the rules in a way that complements`,
      (d, r) => `Round 3: Teams are given a 'story prompt' (e.g., 'a bustling marketplace', 'a serene forest'). They build separate scenes representing aspects of the story, aiming for a cohesive overall narrative whe`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_17': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks. Structures must visually 'respond' to each other (e.g., mirroring height, color scheme) without any communication during c`,
      (d, r) => `Round 2: Teams receive a set of abstract 'rules' (e.g., 'more curves than straight lines', 'predominantly cool colors'). They build independently, aiming to fulfill the rules in a way that complements`,
      (d, r) => `Round 3: Teams are given a 'story prompt' (e.g., 'a bustling marketplace', 'a serene garden'). They build independently, aiming to create structures that, when placed together, tell a cohesive part of`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_18': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring, contrasting height) without any communication duri`,
      (d, r) => `Round 2: Teams receive a set of abstract 'rules' (e.g., 'use only curved shapes', 'incorporate a specific color'). They build independently, aiming to fulfill the rules in a way that complements the o`,
      (d, r) => `Round 3: Teams are given a 'story' prompt (e.g., 'a bustling marketplace', 'a serene forest'). They build independently, aiming to create structures that, when placed together, tell a cohesive part of`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_19': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must simultaneously build a tower using only provided blocks. Communication is allowed, but no pre-planning or shared designs. Focus on emergent behavior.`,
      (d, r) => `Round 2: Teams receive separate, incomplete instructions for assembling a simple machine. They must coordinate to complete the machine without directly sharing their instructions.  Only verbal communi`,
      (d, r) => `Round 3: Teams are given a complex, multi-step process to execute. Each team has a different, crucial piece of the process. They must coordinate execution in real-time, relying solely on observing eac`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_20': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks. Structures must visually 'respond' to each other (e.g., mirroring height, color patterns) without any communication during`,
      (d, r) => `Round 2: Teams receive a shared, abstract 'theme' (e.g., 'growth', 'tension', 'balance'). Each team creates a short performance (movement, sound, or visual art) interpreting the theme. Performances ar`,
      (d, r) => `Round 3: Teams are given a set of constraints (e.g., limited materials, time limit, specific starting point). Each team designs a 'machine' (physical or conceptual) that performs a simple task. Machin`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_21': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring, contrasting height) without any communication duri`,
      (d, r) => `Round 2: Teams receive a set of abstract 'rules' (e.g., 'use only curved shapes', 'incorporate a specific color'). They build independently, aiming to create structures that *satisfy* the same rules w`,
      (d, r) => `Round 3: Teams are given a 'story' prompt (e.g., 'a bustling marketplace', 'a serene garden'). They build independently, aiming to create structures that could plausibly exist *within the same world* `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_22': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must simultaneously build a tower using only provided blocks. Communication is allowed, but no pre-planning or shared designs. Focus: Basic synchronization.`,
      (d, r) => `Round 2: Teams receive separate, incomplete instructions for assembling a simple machine. They must coordinate to complete the machine without directly sharing instructions or blueprints. Focus: Indir`,
      (d, r) => `Round 3: Teams are given separate sets of colored lights and a target pattern. They must coordinate to recreate the pattern simultaneously, using only verbal cues (no color names allowed - e.g., 'the `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_23': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring, contrasting height) without any communication duri`,
      (d, r) => `Round 2: Teams receive a set of abstract 'rules' (e.g., 'more curves than straight lines', 'predominantly blue') that apply to *both* their structures.  They still build independently, but must interp`,
      (d, r) => `Round 3: Teams are given a 'story' prompt (e.g., 'a bustling marketplace', 'a serene garden'). They build structures representing different elements of the story, aiming for a cohesive overall scene w`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_24': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring, contrasting height) without any communication duri`,
      (d, r) => `Round 2: Teams receive a set of abstract shapes.  Team A creates a 'pattern' using their shapes. Team B, without seeing Team A's pattern, must create a 'response' pattern that complements or extends t`,
      (d, r) => `Round 3: Teams are given a shared 'theme' (e.g., 'journey', 'transformation'). Each team independently creates a short sequence of actions (using provided props - scarves, balls, etc.). The sequences `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'coordination_without_coupling_25': textGame({
    prompts: [
      (d, r) => `Round 1: Two teams must build separate structures using only provided blocks.  The structures must visually 'respond' to each other (e.g., mirroring, contrasting height) without any communication duri`,
      (d, r) => `Round 2: Teams receive a set of abstract shapes.  Each team designs a 'machine' that 'processes' these shapes.  The output of Team A's machine must be a valid input for Team B's machine, and vice-vers`,
      (d, r) => `Round 3: Teams are given a shared 'story' prompt (e.g., 'a journey'). Each team creates a short physical representation of a segment of the story (using provided materials). The segments must connect `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
};

export const P28_META = { name: 'Coordination Without Coupling', icon: '🎯', color: 'text-amber-400', games: Object.keys(P28_EXT) };