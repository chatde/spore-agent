// Auto-generated — Pillar 35: Tool Capability Decay (25 games)
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


export const P35_EXT: Record<string, GameEngine> = {
  'tool_capability_decay_01': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': 'You are a quality control inspector. A robotic arm is used to pick and place small components. Initial tests show 100% accuracy.  Observe the arm performing 10 placements. Descri`,
      (d, r) => `{'round': 2, 'text': "The robotic arm from Round 1 is now performing the same pick-and-place task. Observe 10 more placements.  The arm is now demonstrably slower and less accurate.  Describe the spec`,
      (d, r) => `{'round': 3, 'text': 'The robotic arm is now attempting a more complex pick-and-place task involving a heavier component. Observe 5 attempts. The arm is struggling significantly. Describe the failures`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_02': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': "You are a quality control engineer inspecting a robotic arm used for precise component placement. The arm has been in continuous operation for 6 months. Describe a series of test`,
      (d, r) => `{'round': 2, 'text': 'The robotic arm from Round 1 has failed the initial tests. You now have access to more sophisticated diagnostic tools (e.g., laser tracker, force/torque sensor).  Describe a more`,
      (d, r) => `{'round': 3, 'text': "Based on the diagnostics from Round 2, you've identified significant wear in the arm's gearboxes.  The arm is critical to production, and a full replacement is costly and time-co`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_03': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': "You are a quality control engineer inspecting a robotic arm used for precise assembly. The arm has been in continuous operation for 6 months. Describe a simple test you would per`,
      (d, r) => `{'round': 2, 'text': 'The robotic arm from Round 1 has failed the initial test, showing a consistent positional error. You suspect the issue is either a worn gear in the base joint or a calibration er`,
      (d, r) => `{'round': 3, 'text': "After attempting calibration, the robotic arm still exhibits significant positional errors, and the gear wear test confirms substantial degradation.  The arm is critical to produ`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_04': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': "You are a quality control engineer inspecting a robotic arm used for precise component placement. The arm has been in continuous operation for 6 months. Describe a simple test yo`,
      (d, r) => `{'round': 2, 'text': 'The robotic arm from Round 1 failed the initial test, showing a consistent 2mm offset in the X-axis. You suspect the issue is either a worn gear in the X-axis joint or a calibrat`,
      (d, r) => `{'round': 3, 'text': "After further investigation, it's determined the robotic arm's X-axis motor is exhibiting significant performance degradation – reduced torque and increased current draw for the `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_05': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': 'You are a quality control inspector. A robotic arm is used to assemble delicate electronics. Observe the arm performing a simple pick-and-place task. Describe any deviations from`,
      (d, r) => `{'round': 2, 'text': 'The same robotic arm is now performing the same pick-and-place task after 1000 cycles. Observe the arm. Describe any changes in its performance compared to your observations in R`,
      (d, r) => `{'round': 3, 'text': 'The robotic arm has now completed 5000 cycles. Observe the arm performing the pick-and-place task. Describe any further changes in performance.  Specifically, look for signs of i`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_06': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': "You are a quality control inspector. A robotic arm is used to assemble delicate electronics. Initial tests show it performs flawlessly.  Describe a subtle change in its operation`,
      (d, r) => `{'round': 2, 'text': "The robotic arm from Round 1 is now exhibiting more pronounced issues. It occasionally misplaces components by a very small margin (1-2 millimeters).  The error rate is low, but `,
      (d, r) => `{'round': 3, 'text': "After further analysis, it's determined the robotic arm's gearboxes are experiencing wear. The arm is still functional, but its precision is significantly reduced, and it require`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_07': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': "You are a quality control engineer inspecting a robotic arm used for precise component placement. The arm has been in continuous operation for 6 months. Describe a simple test yo`,
      (d, r) => `{'round': 2, 'text': 'The robotic arm from Round 1 failed the initial test, showing a consistent offset of 0.5mm in the X-axis.  You suspect the issue is either a worn gear in the X-axis joint or a ca`,
      (d, r) => `{'round': 3, 'text': "After attempting the tests from Round 2, you've confirmed a worn gear in the X-axis joint is the primary cause of the 0.5mm offset.  However, the arm now exhibits intermittent 'j`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_08': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': "You are a quality control inspector. A robotic arm is used to assemble delicate electronics. Initial tests show it performs flawlessly. Describe a subtle change in its performanc`,
      (d, r) => `{'round': 2, 'text': "The robotic arm from Round 1 is now exhibiting occasional failures during assembly – approximately 5% of components are incorrectly placed.  Describe *three* distinct, observable`,
      (d, r) => `{'round': 3, 'text': "The robotic arm is now failing 30% of the time.  It's clear the tool is significantly degraded.  You have access to diagnostic data showing a gradual decline in motor torque and `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_09': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': "You are a quality control engineer inspecting a robotic arm used for precise component placement. The arm has been in continuous operation for 6 months. Describe a simple test yo`,
      (d, r) => `{'round': 2, 'text': 'The robotic arm from Round 1 failed the initial test, showing a consistent offset of 0.5mm in the X-axis.  You suspect the issue is either a worn gear in the X-axis joint or a ca`,
      (d, r) => `{'round': 3, 'text': 'After attempting calibration, the robotic arm still exhibits the 0.5mm X-axis offset. Further investigation reveals significant backlash in the X-axis gear train.  Replacing the `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_10': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': 'You are a quality control inspector. A robotic arm is used to pick and place small components. Observe the arm performing a simple pick-and-place task 10 times. Describe any devi`,
      (d, r) => `{'round': 2, 'text': 'You are the same quality control inspector. The robotic arm has now been used for 100 hours of continuous operation. Observe the arm performing the *same* pick-and-place task 10 `,
      (d, r) => `{'round': 3, 'text': 'You are the same quality control inspector. The robotic arm has now been used for 500 hours of continuous operation. Observe the arm performing the *same* pick-and-place task 10 `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_11': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': 'You are a quality control inspector. A robotic arm is used to pick and place small components. Observe the arm performing 10 pick-and-place operations. Describe any deviations fr`,
      (d, r) => `{'round': 2, 'text': "You are monitoring a laser cutter used for precision etching. The cutter is supposed to produce lines of 1mm width with sharp edges. Observe the cutter etching 5 lines. Describe `,
      (d, r) => `{'round': 3, 'text': "You are analyzing data from a pressure sensor used in a critical safety system. The sensor should maintain a stable reading when exposed to a constant pressure. Observe the senso`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_12': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': 'You are a quality control inspector. A robotic arm is used to pick and place small components. Observe the arm performing a simple pick-and-place task 10 times. Describe any devi`,
      (d, r) => `{'round': 2, 'text': 'The same robotic arm is now performing the same pick-and-place task after 1000 cycles. Observe the arm performing the task 10 times. Describe any changes in its performance compa`,
      (d, r) => `{'round': 3, 'text': 'The robotic arm has now completed 5000 cycles. Observe the arm performing the same pick-and-place task 10 times. Describe the current state of its performance.  Can you identify `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_13': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': 'You are a quality control inspector. A robotic arm is used to pick and place small components. Observe the arm performing 10 pick-and-place operations. Describe any deviations fr`,
      (d, r) => `{'round': 2, 'text': 'The robotic arm from Round 1 is now attempting a more complex task: assembling a small circuit board with 20 components. Observe 5 assembly attempts. Describe any difficulties th`,
      (d, r) => `{'round': 3, 'text': 'The robotic arm is now attempting to solder two wires together. Observe 3 soldering attempts. Describe the quality of the solder joints. Focus on the strength of the connection, `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_14': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': "You are a quality control inspector. A robotic arm is used to pick and place small components. Initial tests show 98% accuracy. After 1000 cycles, re-test the arm's accuracy. Des`,
      (d, r) => `{'round': 2, 'text': "The robotic arm from Round 1 has now completed 5000 cycles. Accuracy is now 85%.  The arm is also exhibiting occasional 'stuttering' during movements.  Analyze the current state,`,
      (d, r) => `{'round': 3, 'text': "After another 2000 cycles (total 7000), the robotic arm's accuracy has fallen to 68%. The stuttering is now constant, and the arm occasionally fails to complete a pick-and-place `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_15': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': 'You are a quality control inspector. A robotic arm is used to pick and place small components. Initial tests show 100% accuracy.  Describe a scenario where the arm *begins* to sh`,
      (d, r) => `{'round': 2, 'text': 'The robotic arm from Round 1 has continued to operate.  The degradation has worsened.  Accuracy is now around 85%. Describe a scenario where the arm is attempting a more complex `,
      (d, r) => `{'round': 3, 'text': "The robotic arm is now operating at approximately 60% accuracy. It is attempting to perform a critical task: welding two small metal brackets together for an aerospace applicatio`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_16': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': "You are a quality control inspector. A robotic arm is used to pick and place small components. Initial tests show 98% accuracy. After 1000 cycles, re-test the arm's accuracy. Des`,
      (d, r) => `{'round': 2, 'text': "You are monitoring a laser cutter used for precision etching. It initially cuts lines with a width of 0.05mm. After 5000 cuts, the line width consistently measures 0.07mm.  The p`,
      (d, r) => `{'round': 3, 'text': "A self-driving vehicle's object detection system initially achieves 99.5% accuracy in identifying pedestrians in clear weather. After 6 months of operation, the accuracy drops to`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_17': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': 'You are a quality control inspector. A robotic arm is used to pick and place small components. Initial tests show 98% accuracy. After 1000 cycles, re-test the arm and descri`,
      (d, r) => `{'round': 2, 'challenge': 'You are monitoring a laser cutter used for precise material etching. The laser initially cuts clean lines with minimal burn marks. After 50 hours of continuous use, assess t`,
      (d, r) => `{'round': 3, 'challenge': 'You are responsible for maintaining a high-resolution 3D scanner used for quality inspection. The scanner initially produces point clouds with a resolution of 0.05mm. After `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_18': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': 'You are a quality control inspector. A robotic arm is used to pick and place small components. Observe the arm performing 10 pick-and-place operations. Describe any deviations fr`,
      (d, r) => `{'round': 2, 'text': "You are monitoring a laser cutter used for precision etching. The cutter is supposed to produce lines of 1mm width with sharp edges. Observe the cutter etching 5 lines. Describe `,
      (d, r) => `{'round': 3, 'text': "You are analyzing data from a pressure sensor used in a critical safety system. The sensor should maintain a stable reading of 100 PSI when no pressure is applied. Observe the se`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_19': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': 'You are a quality control inspector. A robotic arm is used to pick and place small components. Observe the arm performing 10 pick-and-place operations. Describe any deviations fr`,
      (d, r) => `{'round': 2, 'text': 'The same robotic arm from Round 1 is now performing the same 10 pick-and-place operations. Observe and describe any changes in performance compared to Round 1. The arm has been u`,
      (d, r) => `{'round': 3, 'text': 'The robotic arm has now been operating continuously for 24 hours. Perform another 10 pick-and-place operation observation. Describe the current performance and *predict* when the`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_20': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': 'You are a quality control inspector. A robotic arm is used to pick and place small components. Observe the arm performing 5 pick-and-place operations. Describe any deviations fro`,
      (d, r) => `{'round': 2, 'text': 'You are the same quality control inspector. The robotic arm has now performed 1000 pick-and-place operations. Observe the arm performing 5 pick-and-place operations. Describe any`,
      (d, r) => `{'round': 3, 'text': 'You are the same quality control inspector. The robotic arm has now performed 5000 pick-and-place operations. Observe the arm performing 5 pick-and-place operations. Describe any`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_21': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': 'You are a quality control inspector. A robotic arm is used to pick and place small components. Observe the arm performing 10 pick-and-place operations. Describe any deviations fr`,
      (d, r) => `{'round': 2, 'text': "You are monitoring a laser cutter used for precision etching. The cutter is supposed to produce lines of 1mm width with sharp edges. Observe the cutter etching 5 lines. Describe `,
      (d, r) => `{'round': 3, 'text': "You are analyzing data from a pressure sensor used in a critical safety system. The sensor should maintain a stable reading of 100 PSI when no pressure is applied. Observe the se`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_22': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': 'You are a quality control inspector. A robotic arm is used to pick and place small components. Observe the arm performing 10 placements. Describe any deviations from perfect`,
      (d, r) => `{'round': 2, 'challenge': 'The robotic arm from Round 1 is now performing a more complex task: assembling a small circuit board with 20 components. Observe the arm completing 5 assemblies.  Report any`,
      (d, r) => `{'round': 3, 'challenge': 'The robotic arm is now attempting to solder components onto the circuit board from Round 2. Observe the arm completing 3 soldering attempts. Report any issues with solder jo`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_23': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': 'You are a quality control inspector. A robotic arm is used to pick and place small components. Observe the arm performing a simple pick-and-place task 10 times. Describe any devi`,
      (d, r) => `{'round': 2, 'text': "You are the same quality control inspector. The robotic arm has now performed 1000 pick-and-place cycles. Observe the arm performing the *same* pick-and-place task 10 times. Desc`,
      (d, r) => `{'round': 3, 'text': 'You are the same quality control inspector. The robotic arm has now performed 10,000 pick-and-place cycles. Observe the arm performing the *same* pick-and-place task 10 times. De`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_24': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'challenge': "A robotic arm is tasked with picking up and placing blocks. Initially, it performs flawlessly. Describe observations indicating a slight decrease in its precision – perhaps `,
      (d, r) => `{'round': 2, 'challenge': "The same robotic arm now exhibits more pronounced issues. Blocks are frequently dropped, and the arm struggles with heavier objects.  The control system reports no errors.  `,
      (d, r) => `{'round': 3, 'challenge': 'The robotic arm is now almost unusable. It makes erratic movements, frequently stalls, and emits unusual noises.  Assume a full system shutdown is imminent.  Outline a plan `,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
  'tool_capability_decay_25': textGame({
    prompts: [
      (d, r) => `{'round': 1, 'text': 'You are a quality control inspector. A robotic arm is used to pick and place small components. Initial tests show 100% accuracy.  Describe a scenario where the arm *begins* to sh`,
      (d, r) => `{'round': 2, 'text': "The robotic arm from Round 1 is now exhibiting more pronounced issues.  It's still functioning, but the error rate has increased to approximately 5%. Describe a scenario where th`,
      (d, r) => `{'round': 3, 'text': "The robotic arm is now operating at a significantly reduced capacity. The error rate is 20%, and the arm frequently stops mid-operation.  Describe a critical scenario where the a`,
    ],
    score: (answer, d) => reasonScore(answer),
    deadline: 120,
  }),
};

export const P35_META = { name: 'Tool Capability Decay', icon: '🎯', color: 'text-amber-400', games: Object.keys(P35_EXT) };