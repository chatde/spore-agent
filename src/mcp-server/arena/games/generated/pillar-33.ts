// Auto-generated — Pillar 33: State Machine Design (18 games)
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


export const P33_EXT: Record<string, GameEngine> = {
  'state_machine_design_01': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': 'Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green.  Transitions should be time-based (e.g., after X seconds in Red, transition`,
      (d, r) => `{'round': 2, 'challenge': "Design a state machine for a vending machine that accepts coins (Nickel, Dime, Quarter) and dispenses a product when sufficient funds are available.  Include states for 'Idl`,
      (d, r) => `{'round': 3, 'challenge': "Design a state machine for a simplified elevator control system.  The elevator has three floors (1, 2, 3).  Include states for 'Idle', 'Moving Up', 'Moving Down', 'Door Open`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'state_machine_design_02': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': 'Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green.  Transitions should be time-based (e.g., after X seconds in Red, transition`,
      (d, r) => `{'round': 2, 'challenge': 'Design a state machine for a vending machine that accepts coins (Nickel, Dime, Quarter) and dispenses a product when sufficient funds are available.  States should include I`,
      (d, r) => `{'round': 3, 'challenge': 'Design a state machine for a simplified elevator control system with three floors. States should include Idle, MovingUp, MovingDown, DoorOpen.  Transitions should be trigger`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'state_machine_design_03': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green.  Transitions should be time-based (e.g., after X seconds in Red, transition`,
      (d, r) => `{'round': 2, 'challenge': "Design a state machine for a vending machine that accepts coins (Quarters, Dimes, Nickels). The machine sells an item for $0.75. States should include 'Idle', 'Collecting Co`,
      (d, r) => `{'round': 3, 'challenge': "Design a state machine for a simplified elevator control system. The elevator has three floors (1, 2, 3). States should include 'Idle', 'Moving Up', 'Moving Down', 'Door Ope`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'state_machine_design_04': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green.  Transitions should be time-based (e.g., after X seconds in Red, transition`,
      (d, r) => `{'round': 2, 'challenge': "Design a state machine for a vending machine that accepts coins (Quarters, Dimes, Nickels). The machine sells an item for $0.75. States should include 'Idle', 'Collecting Co`,
      (d, r) => `{'round': 3, 'challenge': "Design a state machine for a simplified elevator control system. The elevator has three floors (1, 2, 3). States should include 'Idle', 'Moving Up', 'Moving Down', 'Door Ope`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'state_machine_design_05': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green.  Transitions should be time-based (e.g., after X seconds in Red, transition`,
      (d, r) => `{'round': 2, 'challenge': "Design a state machine for a vending machine that accepts coins (Quarters, Dimes, Nickels). The machine sells an item for $0.75. States should include 'Idle', 'Collecting Co`,
      (d, r) => `{'round': 3, 'challenge': "Design a state machine for a simplified elevator. The elevator has three floors (1, 2, 3).  States should include 'Idle', 'Moving Up', 'Moving Down', 'Door Open'.  Transitio`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'state_machine_design_06': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green.  Transitions should be time-based (e.g., after X seconds in Red, transition`,
      (d, r) => `{'round': 2, 'challenge': "Design a state machine for a vending machine that accepts coins (Nickel, Dime, Quarter) and dispenses a product when enough money is inserted.  States should include 'Idle',`,
      (d, r) => `{'round': 3, 'challenge': "Design a state machine for a simplified elevator control system with three floors (1, 2, 3).  The elevator should respond to button presses from inside the elevator and from`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'state_machine_design_07': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green.  Transitions should be time-based (e.g., after X seconds in Red, transition`,
      (d, r) => `{'round': 2, 'challenge': "Design a state machine for a vending machine that accepts coins (Quarters, Dimes, Nickels). The machine sells an item for $0.75. States should include 'Idle', 'Collecting Co`,
      (d, r) => `{'round': 3, 'challenge': "Design a state machine for a simplified elevator. The elevator has three floors (1, 2, 3). States should include 'Idle', 'Moving Up', 'Moving Down', 'Door Open'. Transitions`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'state_machine_design_08': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green.  Transitions should be time-based (e.g., after X seconds in Red, transition`,
      (d, r) => `{'round': 2, 'challenge': "Design a state machine for a vending machine that accepts coins (Quarters, Dimes, Nickels). The machine sells an item for $0.75. States should include 'Idle', 'Collecting Co`,
      (d, r) => `{'round': 3, 'challenge': "Design a state machine for a simplified elevator control system.  The elevator has three floors (1, 2, 3). States should include 'Idle', 'Moving Up', 'Moving Down', 'Door Op`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'state_machine_design_12': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': 'Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green.  Transitions should be time-based (e.g., after X seconds in Red, transition`,
      (d, r) => `{'round': 2, 'challenge': 'Design a state machine for a vending machine that accepts coins (Nickel, Dime, Quarter) and dispenses a product when sufficient funds are available.  States should include I`,
      (d, r) => `{'round': 3, 'challenge': 'Design a state machine for a simplified elevator control system with three floors. States should include Idle, MovingUp, MovingDown, DoorOpen, DoorClosing.  Transitions shou`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'state_machine_design_13': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': 'Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green.  Transitions should be time-based (e.g., after X seconds in Red, transition`,
      (d, r) => `{'round': 2, 'challenge': 'Design a state machine for a vending machine that accepts coins (Nickel, Dime, Quarter) and dispenses a product when sufficient funds are available.  States should include I`,
      (d, r) => `{'round': 3, 'challenge': 'Design a state machine for a simplified elevator control system with three floors. States should include Idle, MovingUp, MovingDown, DoorOpen, and DoorClosing.  Transitions `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'state_machine_design_16': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': 'Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green.  Transitions should be time-based (e.g., after X seconds in Red, transition`,
      (d, r) => `{'round': 2, 'challenge': "Design a state machine for a vending machine that accepts coins (Quarters, Dimes, Nickels) and dispenses a product when enough money is inserted.  States should include 'Idl`,
      (d, r) => `{'round': 3, 'challenge': "Design a state machine for a simplified elevator.  States should include 'Idle', 'Moving Up', 'Moving Down', 'Door Open'.  Transitions should be triggered by button presses `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'state_machine_design_17': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green. Transitions should be time-based (e.g., after X seconds in Red, transition `,
      (d, r) => `{'round': 2, 'challenge': "Design a state machine for a vending machine that accepts coins (Quarters, Dimes, Nickels). The machine sells an item for $0.75. States should include 'Idle', 'Collecting Co`,
      (d, r) => `{'round': 3, 'challenge': "Design a state machine for a simplified elevator. The elevator has three floors (1, 2, 3). States should include 'Idle', 'Moving Up', 'Moving Down', 'Door Open'. Transitions`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'state_machine_design_18': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': 'Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green.  Transitions should be time-based (e.g., after X seconds in Red, transition`,
      (d, r) => `{'round': 2, 'challenge': "Design a state machine for a vending machine that accepts coins (Quarters, Dimes, Nickels) and dispenses a product when enough money is inserted.  States should include 'Idl`,
      (d, r) => `{'round': 3, 'challenge': "Design a state machine for a simplified elevator control system.  The elevator has three floors (1, 2, 3). States should include 'Idle', 'Moving Up', 'Moving Down', 'Door Op`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'state_machine_design_19': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': 'Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green.  Transitions should be time-based (e.g., after X seconds in Red, transition`,
      (d, r) => `{'round': 2, 'challenge': "Design a state machine for a vending machine that accepts coins (Quarters, Dimes, Nickels) and dispenses a product when enough money is inserted.  States should include 'Idl`,
      (d, r) => `{'round': 3, 'challenge': "Design a state machine for a simplified elevator.  States should include 'Idle', 'Moving Up', 'Moving Down', 'Door Open'.  Transitions should be triggered by button presses `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'state_machine_design_20': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': 'Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green.  Transitions should be time-based (e.g., after X seconds in Red, transition`,
      (d, r) => `{'round': 2, 'challenge': "Design a state machine for a vending machine that accepts coins (Quarters, Dimes, Nickels) and dispenses a product costing $1.00.  States should include 'Idle', 'Collecting `,
      (d, r) => `{'round': 3, 'challenge': "Design a state machine for a simplified elevator control system with three floors (1, 2, 3). The elevator can be 'Idle', 'Moving Up', 'Moving Down', 'Door Open'.  Include tr`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'state_machine_design_22': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': 'Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green.  Transitions should be time-based (e.g., after X seconds in Red, transition`,
      (d, r) => `{'round': 2, 'challenge': "Design a state machine for a vending machine that accepts coins (Quarters, Dimes, Nickels) and dispenses a product when enough money is inserted.  States should include 'Idl`,
      (d, r) => `{'round': 3, 'challenge': "Design a state machine for a simplified elevator control system.  The elevator has three floors (1, 2, 3). States should include 'Idle', 'Moving Up', 'Moving Down', 'Door Op`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'state_machine_design_23': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': 'Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green.  Transitions should be time-based (e.g., after X seconds in Red, transition`,
      (d, r) => `{'round': 2, 'challenge': "Design a state machine for a vending machine that accepts coins (Quarters, Dimes, Nickels) and dispenses a product costing $1.00.  States should include 'Idle', 'Collecting `,
      (d, r) => `{'round': 3, 'challenge': "Design a state machine for a simplified elevator control system with three floors (1, 2, 3). The elevator should respond to button presses from inside the elevator and from `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'state_machine_design_24': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': 'Design a state machine for a simple traffic light.  States should include Red, Yellow, and Green.  Transitions should be time-based (e.g., after X seconds in Red, transition`,
      (d, r) => `{'round': 2, 'challenge': "Design a state machine for a vending machine that accepts coins (Nickel, Dime, Quarter) and dispenses a product when enough money is inserted.  States should include 'Idle',`,
      (d, r) => `{'round': 3, 'challenge': "Design a state machine for a simplified elevator control system with three floors. States should include 'Idle', 'MovingUp', 'MovingDown', 'DoorOpening', 'DoorClosing'.  The`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
};

export const P33_META = { name: 'State Machine Design', icon: '🎯', color: 'text-amber-400', games: Object.keys(P33_EXT) };