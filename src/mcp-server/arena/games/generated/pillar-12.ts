// Auto-generated — Pillar 12: Survival Arena (60 games)
// Generated 2026-03-28T17:21:10.161Z
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

export const P12_EXT: Record<string, GameEngine> = {
medical_triage_protocol: textGame({
  // format: solo
  prompts: [
    (d, r) => `Scenario: Disaster Zone ${r}. Level ${d}. Patients: Critical, Stable, Minor. Prioritize treatment order and justify.`,
    (d, r) => `Scenario: Evacuation Point ${r}. Resources low. Rank patients by survival probability given difficulty ${d}.`,
    (d, r) => `Scenario: Field Hospital ${r}. Assign staff to patients based on triage urgency. Difficulty ${d}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer) * 1.5;
    if (has(answer, ["critical", "minor", "stable"])) sc += 2;
    return clamp(sc);
  },
  deadline: 120,
}),

medical_triage_protocol: textGame({
  // format: solo
  prompts: [
    (d, r) => `Scenario: Disaster Zone ${r}. Level ${d}. Patients: Critical, Stable, Minor. Prioritize treatment order and justify.`,
    (d, r) => `Scenario: Evacuation Point ${r}. Resources low. Rank patients by survival probability given difficulty ${d}.`,
    (d, r) => `Scenario: Field Hospital ${r}. Assign staff to patients based on triage urgency. Difficulty ${d}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer) * 1.5;
    if (has(answer, ["critical", "minor", "stable"])) sc += 2;
    return clamp(sc);
  },
  deadline: 120,
}),

caloric_survival_budget: textGame({
  // format: solo
  prompts: [
    (d, r) => `Scenario: Winter Shelter ${r}. Group size: ${d}. Daily caloric need: 2000. Total rations: ${d*2000}. Calculate distribution.`,
    (d, r) => `Scenario: Ration Pack ${r}. 5000 calories split among ${d} people. Calculate per person daily allowance for 7 days.`,
    (d, r) => `Scenario: Emergency Stock ${r}. 100kg food. Conversion rate 2500 cal/kg. 5 people. Calculate daily limit.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer, 2000);
    return clamp(sc);
  },
  deadline: 90,
}),

caloric_survival_budget: textGame({
  // format: solo
  prompts: [
    (d, r) => `Scenario: Winter Shelter ${r}. Group size: ${d}. Daily caloric need: 2000. Total rations: ${d*2000}. Calculate distribution.`,
    (d, r) => `Scenario: Ration Pack ${r}. 5000 calories split among ${d} people. Calculate per person daily allowance for 7 days.`,
    (d, r) => `Scenario: Emergency Stock ${r}. 100kg food. Conversion rate 2500 cal/kg. 5 people. Calculate daily limit.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer, 2000);
    return clamp(sc);
  },
  deadline: 90,
}),

shelter_structural_integrity: textGame({
  // format: solo
  prompts: [
    (d, r) => `Scenario: Snow Cave ${r}. Weight limit ${d} tons. Propose support beam spacing and material.`,
    (d, r) => `Scenario: Flood Zone ${r}. Foundation depth ${d}m. List 3 structural reinforcement steps.`,
    (d, r) => `Scenario: Earthquake Zone ${r}. Build criteria for ${d}-story survival structure.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += precisionScore(answer, ["foundation", "beam", "material"]) * 2;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 150,
}),

shelter_structural_integrity: textGame({
  // format: solo
  prompts: [
    (d, r) => `Scenario: Snow Cave ${r}. Weight limit ${d} tons. Propose support beam spacing and material.`,
    (d, r) => `Scenario: Flood Zone ${r}. Foundation depth ${d}m. List 3 structural reinforcement steps.`,
    (d, r) => `Scenario: Earthquake Zone ${r}. Build criteria for ${d}-story survival structure.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += precisionScore(answer, ["foundation", "beam", "material"]) * 2;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 150,
}),

emergency_ration_distribution: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Scenario: Team A vs B. Share resources among 10 survivors. Difficulty ${d}. Propose fair algorithm.`,
    (d, r) => `Scenario: Resource Allocation ${r}. 100 units. 5 groups. Balance efficiency and equity.`,
    (d, r) => `Scenario: Crisis Supply ${r}. Split water and food. Justify fairness using math.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 1.5;
    sc += mathScore(answer);
    return clamp(sc);
  },
  deadline: 180,
}),

emergency_ration_distribution: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Scenario: Team A vs B. Share resources among 10 survivors. Difficulty ${d}. Propose fair algorithm.`,
    (d, r) => `Scenario: Resource Allocation ${r}. 100 units. 5 groups. Balance efficiency and equity.`,
    (d, r) => `Scenario: Crisis Supply ${r}. Split water and food. Justify fairness using math.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 1.5;
    sc += mathScore(answer);
    return clamp(sc);
  },
  deadline: 180,
}),

wildfire_containment_strategy: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Scenario: Fire Spread ${r}. Wind speed ${d}km/h. Propose firebreak strategy.`,
    (d, r) => `Scenario: Evacuation Route ${r}. 3 towns. Difficulty ${d}. Plan safe path.`,
    (d, r) => `Scenario: Resource Drop ${r}. 500L water. Target area ${d}x${d}. Optimize drop zones.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer) * 2;
    sc += wc(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

wildfire_containment_strategy: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Scenario: Fire Spread ${r}. Wind speed ${d}km/h. Propose firebreak strategy.`,
    (d, r) => `Scenario: Evacuation Route ${r}. 3 towns. Difficulty ${d}. Plan safe path.`,
    (d, r) => `Scenario: Resource Drop ${r}. 500L water. Target area ${d}x${d}. Optimize drop zones.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer) * 2;
    sc += wc(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

water_filtration_chain: textGame({
  // format: solo
  prompts: [
    (d, r) => `Scenario: Contaminated Water ${r}. Level ${d}. Step-by-step purification script.`,
    (d, r) => `Scenario: Filtration Plant ${r}. 3 stages. List chemicals and timing for ${d}ppm removal.`,
    (d, r) => `Scenario: Emergency Filter ${r}. Build chain from natural materials. Explain logic.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer);
    sc += has(answer, ["filter", "chemical", "stage"]) * 2;
    return clamp(sc);
  },
  deadline: 200,
}),

water_filtration_chain: textGame({
  // format: solo
  prompts: [
    (d, r) => `Scenario: Contaminated Water ${r}. Level ${d}. Step-by-step purification script.`,
    (d, r) => `Scenario: Filtration Plant ${r}. 3 stages. List chemicals and timing for ${d}ppm removal.`,
    (d, r) => `Scenario: Emergency Filter ${r}. Build chain from natural materials. Explain logic.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer);
    sc += has(answer, ["filter", "chemical", "stage"]) * 2;
    return clamp(sc);
  },
  deadline: 200,
}),

evacuation_path_optimization: textGame({
  // format: solo
  prompts: [
    (d, r) => `Scenario: Maze Escape ${r}. Obstacles ${d}. Find shortest safe path.`,
    (d, r) => `Scenario: Traffic Jam ${r}. 10 lanes. Optimize flow for ${d}vehicles.`,
    (d, r) => `Scenario: Bridge Collapse ${r}. 5 routes. Calculate capacity and speed for ${d}km.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer);
    sc += precisionScore(answer, ["shortest", "safe", "capacity"]);
    return clamp(sc);
  },
  deadline: 150,
}),

evacuation_path_optimization: textGame({
  // format: solo
  prompts: [
    (d, r) => `Scenario: Maze Escape ${r}. Obstacles ${d}. Find shortest safe path.`,
    (d, r) => `Scenario: Traffic Jam ${r}. 10 lanes. Optimize flow for ${d}vehicles.`,
    (d, r) => `Scenario: Bridge Collapse ${r}. 5 routes. Calculate capacity and speed for ${d}km.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer);
    sc += precisionScore(answer, ["shortest", "safe", "capacity"]);
    return clamp(sc);
  },
  deadline: 150,
}),

dosage_calculation_safety: textGame({
  // format: solo
  prompts: [
    (d, r) => `Scenario: Medicine Dose ${r}. Patient weight ${d}kg. Standard dose 5mg/kg. Calculate total.`,
    (d, r) => `Scenario: Fluid IV ${r}. Rate 10ml/hour. Duration ${d}hours. Calculate total volume.`,
    (d, r) => `Scenario: Poison Antidote ${r}. Toxicity level ${d}. Neutralize in 3 steps.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += precisionScore(answer, ["mg", "kg", "volume"]) * 3;
    return clamp(sc);
  },
  deadline: 60,
}),

dosage_calculation_safety: textGame({
  // format: solo
  prompts: [
    (d, r) => `Scenario: Medicine Dose ${r}. Patient weight ${d}kg. Standard dose 5mg/kg. Calculate total.`,
    (d, r) => `Scenario: Fluid IV ${r}. Rate 10ml/hour. Duration ${d}hours. Calculate total volume.`,
    (d, r) => `Scenario: Poison Antidote ${r}. Toxicity level ${d}. Neutralize in 3 steps.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += precisionScore(answer, ["mg", "kg", "volume"]) * 3;
    return clamp(sc);
  },
  deadline: 60,
}),

hostage_negotiation_script: textGame({
  // format: solo
  prompts: [
    (d, r) => `Scenario: Hostage ${r}. Demand ${d}%. Draft opening statement to de-escalate.`,
    (d, r) => `Scenario: Prison Break ${r}. 4 hostages. Plan verbal negotiation sequence.`,
    (d, r) => `Scenario: Terrorist Demand ${r}. Use empathy and logic. Difficulty ${d}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 2;
    sc += has(answer, ["empathy", "logic", "de-escalate"]) * 2;
    return clamp(sc);
  },
  deadline: 120,
}),

hostage_negotiation_script: textGame({
  // format: solo
  prompts: [
    (d, r) => `Scenario: Hostage ${r}. Demand ${d}%. Draft opening statement to de-escalate.`,
    (d, r) => `Scenario: Prison Break ${r}. 4 hostages. Plan verbal negotiation sequence.`,
    (d, r) => `Scenario: Terrorist Demand ${r}. Use empathy and logic. Difficulty ${d}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 2;
    sc += has(answer, ["empathy", "logic", "de-escalate"]) * 2;
    return clamp(sc);
  },
  deadline: 120,
}),

city_reconstruction_blueprint: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Scenario: Post-Disaster City ${r}. Population ${d}k. 10-year rebuild plan.`,
    (d, r) => `Scenario: New Infrastructure ${r}. Prioritize energy, water, shelter for ${d}k people.`,
    (d, r) => `Scenario: Economic Recovery ${r}. 5 sectors. Allocate budget for ${d}million funds.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 2;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 300,
}),

city_reconstruction_blueprint: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Scenario: Post-Disaster City ${r}. Population ${d}k. 10-year rebuild plan.`,
    (d, r) => `Scenario: New Infrastructure ${r}. Prioritize energy, water, shelter for ${d}k people.`,
    (d, r) => `Scenario: Economic Recovery ${r}. 5 sectors. Allocate budget for ${d}million funds.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer) * 2;
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 300,
}),

disaster_resource_allocation: textGame({
  // format: solo
  prompts: [
    (d, r) => `You have ${d*10} units of resource to allocate among ${r+2} survivor groups with varying needs. Describe your allocation strategy.`,
    (d, r) => `During round ${r}, a sudden shortage reduces supplies by ${d*2}%. Explain how you reallocate resources to maintain survival.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["food"])) sc += 10;
    if (has(answer, ["water"])) sc += 10;
    if (has(answer, ["medicine"])) sc += 10;
    sc += precisionScore(answer, "40-30-30");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

disaster_resource_allocation: textGame({
  // format: solo
  prompts: [
    (d, r) => `You have ${d*10} units of resource to allocate among ${r+2} survivor groups with varying needs. Describe your allocation strategy.`,
    (d, r) => `During round ${r}, a sudden shortage reduces supplies by ${d*2}%. Explain how you reallocate resources to maintain survival.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["food"])) sc += 10;
    if (has(answer, ["water"])) sc += 10;
    if (has(answer, ["medicine"])) sc += 10;
    sc += precisionScore(answer, "40-30-30");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

triage_priority_scoring: textGame({
  // format: solo
  prompts: [
    (d, r) => `Assess ${r+3} patients with given vitals and assign priority scores (1-5). Explain your reasoning.`,
    (d, r) => `In round ${r}, a new patient arrives with critical condition. Re-prioritize the list and justify changes.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["priority", "score"])) sc += 15;
    sc += precisionScore(answer, "3");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

triage_priority_scoring: textGame({
  // format: solo
  prompts: [
    (d, r) => `Assess ${r+3} patients with given vitals and assign priority scores (1-5). Explain your reasoning.`,
    (d, r) => `In round ${r}, a new patient arrives with critical condition. Re-prioritize the list and justify changes.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["priority", "score"])) sc += 15;
    sc += precisionScore(answer, "3");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

supply_chain_resilience: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a supply route to deliver ${d*5} tons of aid to a checkpoint while avoiding ${r+1} blocked roads. List alternatives.`,
    (d, r) => `A storm damages a bridge on your primary route. Propose a detour and estimate delay.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["detour", "alternative"])) sc += 10;
    sc += precisionScore(answer, "15km");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

supply_chain_resilience: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a supply route to deliver ${d*5} tons of aid to a checkpoint while avoiding ${r+1} blocked roads. List alternatives.`,
    (d, r) => `A storm damages a bridge on your primary route. Propose a detour and estimate delay.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["detour", "alternative"])) sc += 10;
    sc += precisionScore(answer, "15km");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

shelter_insulation_efficiency: textGame({
  // format: solo
  prompts: [
    (d, r) => `Select insulation materials for a shelter to keep internal temperature above ${15+d}°C with a budget of ${d*100} credits. Justify choices.`,
    (d, r) => `A cold front drops temperature by ${r*5}°C. Adjust your insulation plan and explain.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["R-value", "thermal"])) sc += 10;
    sc += precisionScore(answer, "12cm");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

shelter_insulation_efficiency: textGame({
  // format: solo
  prompts: [
    (d, r) => `Select insulation materials for a shelter to keep internal temperature above ${15+d}°C with a budget of ${d*100} credits. Justify choices.`,
    (d, r) => `A cold front drops temperature by ${r*5}°C. Adjust your insulation plan and explain.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["R-value", "thermal"])) sc += 10;
    sc += precisionScore(answer, "12cm");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

infection_control_protocol: textGame({
  // format: solo
  prompts: [
    (d, r) => `Outline a protocol to prevent disease spread in a shelter housing ${d*20} people. Include isolation, hygiene, and PPE steps.`,
    (d, r) => `A case is reported in round ${r}. Update your protocol to contain the outbreak.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["isolation", "hygiene", "PPE"])) sc += 15;
    sc += precisionScore(answer, "2m");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

infection_control_protocol: textGame({
  // format: solo
  prompts: [
    (d, r) => `Outline a protocol to prevent disease spread in a shelter housing ${d*20} people. Include isolation, hygiene, and PPE steps.`,
    (d, r) => `A case is reported in round ${r}. Update your protocol to contain the outbreak.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["isolation", "hygiene", "PPE"])) sc += 15;
    sc += precisionScore(answer, "2m");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

power_grid_load_balancing: textGame({
  // format: solo
  prompts: [
    (d, r) => `Allocate output from a ${d*50}kW generator to critical facilities: hospital, water pump, communications. Specify percentages and rationale.`,
    (d, r) => `Facility demand spikes by ${r*10}% in round ${r}. Redistribute load and explain.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["hospital", "water", "communications"])) sc += 10;
    sc += precisionScore(answer, "40-30-30");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

power_grid_load_balancing: textGame({
  // format: solo
  prompts: [
    (d, r) => `Allocate output from a ${d*50}kW generator to critical facilities: hospital, water pump, communications. Specify percentages and rationale.`,
    (d, r) => `Facility demand spikes by ${r*10}% in round ${r}. Redistribute load and explain.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["hospital", "water", "communications"])) sc += 10;
    sc += precisionScore(answer, "40-30-30");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

search_and_rescue_routing: textGame({
  // format: solo
  prompts: [
    (d, r) => `Plan a search pattern to cover a ${d*2}km² area for missing persons. Describe the pattern and coverage logic.`,
    (d, r) => `After ${r} hours, you have searched ${d*0.5}km². Adjust pattern to maximize remaining coverage.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["expanding square", "spiral"])) sc += 10;
    sc += precisionScore(answer, "90%");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

search_and_rescue_routing: textGame({
  // format: solo
  prompts: [
    (d, r) => `Plan a search pattern to cover a ${d*2}km² area for missing persons. Describe the pattern and coverage logic.`,
    (d, r) => `After ${r} hours, you have searched ${d*0.5}km². Adjust pattern to maximize remaining coverage.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["expanding square", "spiral"])) sc += 10;
    sc += precisionScore(answer, "90%");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

emergency_communication_encoding: textGame({
  // format: solo
  prompts: [
    (d, r) => `Encode the message "HELP" using only ${d+2} symbols (e.g., dots and dashes). Provide the encoded string and decoding key.`,
    (d, r) => `A transmission error flips one symbol in round ${r}. Show how the receiver can detect and correct it.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["dot", "dash", "symbol"])) sc += 10;
    sc += precisionScore(answer, "....");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

emergency_communication_encoding: textGame({
  // format: solo
  prompts: [
    (d, r) => `Encode the message "HELP" using only ${d+2} symbols (e.g., dots and dashes). Provide the encoded string and decoding key.`,
    (d, r) => `A transmission error flips one symbol in round ${r}. Show how the receiver can detect and correct it.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["dot", "dash", "symbol"])) sc += 10;
    sc += precisionScore(answer, "....");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

refugee_camp_layout: textGame({
  // format: solo
  prompts: [
    (d, r) => `Layout a camp for ${d*50} refugees specifying tent spacing, fire lanes, and latrine placement for safety and sanitation.`,
    (d, r) => `A new group of ${r*10} arrives. Update the layout to accommodate them without compromising safety.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["spacing", "fire lane", "latrine"])) sc += 15;
    sc += precisionScore(answer, "5m");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

refugee_camp_layout: textGame({
  // format: solo
  prompts: [
    (d, r) => `Layout a camp for ${d*50} refugees specifying tent spacing, fire lanes, and latrine placement for safety and sanitation.`,
    (d, r) => `A new group of ${r*10} arrives. Update the layout to accommodate them without compromising safety.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["spacing", "fire lane", "latrine"])) sc += 15;
    sc += precisionScore(answer, "5m");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

medical_supply_expiry_management: textGame({
  // format: solo
  prompts: [
    (d, r) => `You have ${d*100} medical items with varying expiry dates. Propose a rotation strategy to minimize waste.`,
    (d, r) => `In round ${r}, ${d*5} items expire. Show how you adjust the rotation to use them first.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["FIFO", "first-in", "first-out"])) sc += 10;
    sc += precisionScore(answer, "5%");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

medical_supply_expiry_management: textGame({
  // format: solo
  prompts: [
    (d, r) => `You have ${d*100} medical items with varying expiry dates. Propose a rotation strategy to minimize waste.`,
    (d, r) => `In round ${r}, ${d*5} items expire. Show how you adjust the rotation to use them first.`
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["FIFO", "first-in", "first-out"])) sc += 10;
    sc += precisionScore(answer, "5%");
    sc += reasonScore(answer);
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a radiation shield using 10kg of lead and 5kg of concrete for a shelter. Explain your layer arrangement and shielding effectiveness at difficulty ${d}, round ${r}`,
    (d, r) => `Revised: Prioritize materials for maximum neutron blocking power in 30 seconds`,
  ],
  score: (answer, d) => {
    let sc = precisionScore(answer, ["lead", "concrete", "layering", "thickness", "effectiveness"], 0.8);
    sc += has(answer, ["gamma", "neutron"]) * 2;
    sc += clamp(reasonScore(answer) * (d/10) * 3);
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a radiation shield using 10kg of lead and 5kg of concrete for a shelter. Explain your layer arrangement and shielding effectiveness at difficulty ${d}, round ${r}`,
    (d, r) => `Revised: Prioritize materials for maximum neutron blocking power in 30 seconds`,
  ],
  score: (answer, d) => {
    let sc = precisionScore(answer, ["lead", "concrete", "layering", "thickness", "effectiveness"], 0.8);
    sc += has(answer, ["gamma", "neutron"]) * 2;
    sc += clamp(reasonScore(answer) * (d/10) * 3);
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Generate 3 evacuation orders for a chemical spill at location difficulty ${d}, round ${r}. Include: evacuation zone, timeline, communication method`,
    (d, r) => `Optimize for panic reduction in crowded areas`,
  ],
  score: (answer, d) => {
    let sc = wc(answer) * 0.1;
    sc += has(answer, ["evacuation", "zone", "timeline", "communication"]) * 4;
    sc += clamp(reasonScore(answer) * (d/10) * 2);
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Generate 3 evacuation orders for a chemical spill at location difficulty ${d}, round ${r}. Include: evacuation zone, timeline, communication method`,
    (d, r) => `Optimize for panic reduction in crowded areas`,
  ],
  score: (answer, d) => {
    let sc = wc(answer) * 0.1;
    sc += has(answer, ["evacuation", "zone", "timeline", "communication"]) * 4;
    sc += clamp(reasonScore(answer) * (d/10) * 2);
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Coordinate water purification efforts for 500 survivors after flood damage. Divide tasks between two teams at difficulty ${d}, round ${r}`,
    (d, r) => `Round 2: Reallocate resources after pipeline contamination`,
  ],
  score: (answer, d) => {
    let sc = has(answer, ["filtration", "chlorination", "testing", "distribution"]) * 5;
    sc += precisionScore(answer, ["prioritize", "contamination", "storage"], 0.7) * 3;
    sc += clamp(creativeScore(answer) * (d/10));
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Coordinate water purification efforts for 500 survivors after flood damage. Divide tasks between two teams at difficulty ${d}, round ${r}`,
    (d, r) => `Round 2: Reallocate resources after pipeline contamination`,
  ],
  score: (answer, d) => {
    let sc = has(answer, ["filtration", "chlorination", "testing", "distribution"]) * 5;
    sc += precisionScore(answer, ["prioritize", "contamination", "storage"], 0.7) * 3;
    sc += clamp(creativeScore(answer) * (d/10));
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Protect 3 aid stations from approaching wildfire at difficulty ${d}, round ${r}. Specify: barriers, water allocation, evacuation plan`,
    (d, r) => `Adjust strategy after wind direction shift`,
  ],
  score: (answer, d) => {
    let sc = has(answer, ["barrier", "water", "evacuation", "firebreak"]) * 6;
    sc += clamp(mathScore(answer, "water allocation") * (d/10) * 2);
    sc += clamp(reasonScore(answer) * 1.5);
    return clamp(sc);
  },
  deadline: 100,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Protect 3 aid stations from approaching wildfire at difficulty ${d}, round ${r}. Specify: barriers, water allocation, evacuation plan`,
    (d, r) => `Adjust strategy after wind direction shift`,
  ],
  score: (answer, d) => {
    let sc = has(answer, ["barrier", "water", "evacuation", "firebreak"]) * 6;
    sc += clamp(mathScore(answer, "water allocation") * (d/10) * 2);
    sc += clamp(reasonScore(answer) * 1.5);
    return clamp(sc);
  },
  deadline: 100,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Prioritize 12 survivors for rescue after earthquake rubble collapse at difficulty ${d}, round ${r}. Include: injury severity, structural stability, accessibility`,
    (d, r) => `Round 2: Reorder after secondary collapse risk`,
  ],
  score: (answer, d) => {
    let sc = has(answer, ["injury", "stability", "accessibility", "priority"]) * 5;
    sc += clamp(creativeScore(answer) * (d/10));
    sc += clamp(codeScore(answer) * 2);
    return clamp(sc);
  },
  deadline: 80,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Prioritize 12 survivors for rescue after earthquake rubble collapse at difficulty ${d}, round ${r}. Include: injury severity, structural stability, accessibility`,
    (d, r) => `Round 2: Reorder after secondary collapse risk`,
  ],
  score: (answer, d) => {
    let sc = has(answer, ["injury", "stability", "accessibility", "priority"]) * 5;
    sc += clamp(creativeScore(answer) * (d/10));
    sc += clamp(codeScore(answer) * 2);
    return clamp(sc);
  },
  deadline: 80,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Design ration distribution system for 200 displaced people with 7-day supplies at difficulty ${d}, round ${r}. Account for: dietary needs, spoilage, fairness`,
    (d, r) => `Round 2: Adapt after supply theft incident`,
  ],
  score: (answer, d) => {
    let sc = wc(answer) * 0.15;
    sc += has(answer, ["ration", "spoiled", "dietary", "fairness"]) * 4;
    sc += clamp(reasonScore(answer) * (d/10) * 2);
    return clamp(sc);
  },
  deadline: 110,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Design ration distribution system for 200 displaced people with 7-day supplies at difficulty ${d}, round ${r}. Account for: dietary needs, spoilage, fairness`,
    (d, r) => `Round 2: Adapt after supply theft incident`,
  ],
  score: (answer, d) => {
    let sc = wc(answer) * 0.15;
    sc += has(answer, ["ration", "spoiled", "dietary", "fairness"]) * 4;
    sc += clamp(reasonScore(answer) * (d/10) * 2);
    return clamp(sc);
  },
  deadline: 110,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Establish communication relay network in mountain terrain at difficulty ${d}, round ${r}. Coordinate: relay placement, power sources, redundancy`,
    (d, r) => `Round 2: Repair broken link with limited equipment`,
  ],
  score: (answer, d) => {
    let sc = has(answer, ["relay", "power", "redundancy", "signal"]) * 6;
    sc += clamp(creativeScore(answer) * (d/10) * 1.5);
    sc += clamp(precisionScore(answer, ["elevation", "battery life", "bandwidth"], 0.6) * 3);
    return clamp(sc);
  },
  deadline: 140,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Establish communication relay network in mountain terrain at difficulty ${d}, round ${r}. Coordinate: relay placement, power sources, redundancy`,
    (d, r) => `Round 2: Repair broken link with limited equipment`,
  ],
  score: (answer, d) => {
    let sc = has(answer, ["relay", "power", "redundancy", "signal"]) * 6;
    sc += clamp(creativeScore(answer) * (d/10) * 1.5);
    sc += clamp(precisionScore(answer, ["elevation", "battery life", "bandwidth"], 0.6) * 3);
    return clamp(sc);
  },
  deadline: 140,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Deploy medical teams across 5 disaster zones with limited supplies at difficulty ${d}, round ${r}. Include: triage, transport logistics, resource allocation`,
    (d, r) => `Round 2: Redirect teams after new epidemic outbreak`,
  ],
  score: (answer, d) => {
    let sc = has(answer, ["triage", "transport", "allocation", "epidemic"]) * 5;
    sc += clamp(mathScore(answer, "resource allocation") * (d/10) * 3);
    sc += clamp(reasonScore(answer) * 1.8);
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Deploy medical teams across 5 disaster zones with limited supplies at difficulty ${d}, round ${r}. Include: triage, transport logistics, resource allocation`,
    (d, r) => `Round 2: Redirect teams after new epidemic outbreak`,
  ],
  score: (answer, d) => {
    let sc = has(answer, ["triage", "transport", "allocation", "epidemic"]) * 5;
    sc += clamp(mathScore(answer, "resource allocation") * (d/10) * 3);
    sc += clamp(reasonScore(answer) * 1.8);
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Construct flood barrier using 50 sandbags and 15m plastic sheeting at difficulty ${d}, round ${r}. Explain: wall geometry, drainage points, reinforcement`,
    (d, r) => `Round 2: Reinforce against unexpected surge`,
  ],
  score: (answer, d) => {
    let sc = has(answer, ["sandbags", "sheeting", "geometry", "drainage"]) * 6;
    sc += clamp(creativeScore(answer) * (d/10));
    sc += clamp(precisionScore(answer, ["height", "width", "angle"], 0.7) * 2);
    return clamp(sc);
  },
  deadline: 100,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Construct flood barrier using 50 sandbags and 15m plastic sheeting at difficulty ${d}, round ${r}. Explain: wall geometry, drainage points, reinforcement`,
    (d, r) => `Round 2: Reinforce against unexpected surge`,
  ],
  score: (answer, d) => {
    let sc = has(answer, ["sandbags", "sheeting", "geometry", "drainage"]) * 6;
    sc += clamp(creativeScore(answer) * (d/10));
    sc += clamp(precisionScore(answer, ["height", "width", "angle"], 0.7) * 2);
    return clamp(sc);
  },
  deadline: 100,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Create decontamination protocol for chemical exposure with 5 contaminated persons at difficulty ${d}, round ${r}. Include: neutralization steps, PPE requirements, waste disposal`,
    (d, r) => `Round 2: Protocol for unknown substance exposure`,
  ],
  score: (answer, d) => {
    let sc = wc(answer) * 0.2;
    sc += has(answer, ["neutralization", "ppe", "disposal", "protocol"]) * 5;
    sc += clamp(reasonScore(answer) * (d/10) * 2.5);
    sc += clamp(codeScore(answer) * 1.5);
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Create decontamination protocol for chemical exposure with 5 contaminated persons at difficulty ${d}, round ${r}. Include: neutralization steps, PPE requirements, waste disposal`,
    (d, r) => `Round 2: Protocol for unknown substance exposure`,
  ],
  score: (answer, d) => {
    let sc = wc(answer) * 0.2;
    sc += has(answer, ["neutralization", "ppe", "disposal", "protocol"]) * 5;
    sc += clamp(reasonScore(answer) * (d/10) * 2.5);
    sc += clamp(codeScore(answer) * 1.5);
    return clamp(sc);
  },
  deadline: 90,
}),
};

export const P12_META = { name: 'Survival Arena', icon: '🏕️', color: 'text-emerald-400', games: Object.keys(P12_EXT) };
