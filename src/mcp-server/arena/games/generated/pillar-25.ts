// Auto-generated — Pillar 25: Chaos Engineering (40 games)
// Generated 2026-03-28T19:13:48.807Z
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

export const P25_EXT: Record<string, GameEngine> = {
game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Generate a controlled chaos scenario where a microservice cluster must gracefully handle ${5 + d} consecutive node failures without cascading failures. Document the incident response steps.`,
    (d, r) => `Analyze a database query that suddenly spikes to ${200 + d*50}ms under load. Propose a degradation plan to reduce latency by at least 30% while preserving data integrity.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const keywords = ["graceful degradation", "incident response", "cascading failure", "load reduction", "recovery steps"];
    sc += has(answer.toLowerCase(), keywords) * 20;
    sc += precisionScore(answer, "controlled chaos microservice") * 30;
    sc += reasonScore(answer) * 50;
    return clamp(sc * (1 + d/20));
  },
  deadline: 120,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Generate a controlled chaos scenario where a microservice cluster must gracefully handle ${5 + d} consecutive node failures without cascading failures. Document the incident response steps.`,
    (d, r) => `Analyze a database query that suddenly spikes to ${200 + d*50}ms under load. Propose a degradation plan to reduce latency by at least 30% while preserving data integrity.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const keywords = ["graceful degradation", "incident response", "cascading failure", "load reduction", "recovery steps"];
    sc += has(answer.toLowerCase(), keywords) * 20;
    sc += precisionScore(answer, "controlled chaos microservice") * 30;
    sc += reasonScore(answer) * 50;
    return clamp(sc * (1 + d/20));
  },
  deadline: 120,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Engineer a fault injection attack to crash ${"ServiceA".repeat(Math.floor(d/3))} in round ${r}. Your opponent will defend.`,
    (d, r) => `Defend ${"ServiceA".repeat(Math.floor(d/3))} from a potential buffer overflow exploit in round ${r}. Justify your mitigation.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer) * 40;
    sc += creativeScore(answer) * 30;
    sc += mathScore(answer, 1000) * 30;
    return clamp(sc * (0.9 + Math.random()*0.2));
  },
  deadline: 90,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Engineer a fault injection attack to crash ${"ServiceA".repeat(Math.floor(d/3))} in round ${r}. Your opponent will defend.`,
    (d, r) => `Defend ${"ServiceA".repeat(Math.floor(d/3))} from a potential buffer overflow exploit in round ${r}. Justify your mitigation.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer) * 40;
    sc += creativeScore(answer) * 30;
    sc += mathScore(answer, 1000) * 30;
    return clamp(sc * (0.9 + Math.random()*0.2));
  },
  deadline: 90,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Design a circuit breaker pattern for a payment gateway handling ${1000 + d*200} TPS. Teammate A implements defensive logic, Teammate B writes recovery scripts. Round ${r}.`,
    (d, r) => `Audit the circuit breaker implementation from Teammate A. Suggest improvements to reduce false positives by ${d*10}%. Teammate B documents the change log. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer, 200) * 5;
    sc += creativeScore(answer) * 40;
    sc += precisionScore(answer, "circuit breaker payment") * 30;
    sc += mathScore(answer, 100) * 30;
    return clamp(sc * (1 + d/15));
  },
  deadline: 180,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Design a circuit breaker pattern for a payment gateway handling ${1000 + d*200} TPS. Teammate A implements defensive logic, Teammate B writes recovery scripts. Round ${r}.`,
    (d, r) => `Audit the circuit breaker implementation from Teammate A. Suggest improvements to reduce false positives by ${d*10}%. Teammate B documents the change log. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer, 200) * 5;
    sc += creativeScore(answer) * 40;
    sc += precisionScore(answer, "circuit breaker payment") * 30;
    sc += mathScore(answer, 100) * 30;
    return clamp(sc * (1 + d/15));
  },
  deadline: 180,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Inject a noisy neighbor to spike CPU usage by ${75 + d*5}% on one host. All agents must isolate and mitigate without losing service. Round ${r}.`,
    (d, r) => `Random node in the cluster begins thrashing disk I/O at ${1000 + d*100} ops/sec. Survive this fault without data corruption. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer.toLowerCase(), ["isolation", "mitigation", "disk thrashing", "cpu spike"]) * 30;
    sc += reasonScore(answer) * 40;
    sc += wc(answer, 500) * 10;
    return clamp(sc * (1 - r/20));
  },
  deadline: 60,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Inject a noisy neighbor to spike CPU usage by ${75 + d*5}% on one host. All agents must isolate and mitigate without losing service. Round ${r}.`,
    (d, r) => `Random node in the cluster begins thrashing disk I/O at ${1000 + d*100} ops/sec. Survive this fault without data corruption. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer.toLowerCase(), ["isolation", "mitigation", "disk thrashing", "cpu spike"]) * 30;
    sc += reasonScore(answer) * 40;
    sc += wc(answer, 500) * 10;
    return clamp(sc * (1 - r/20));
  },
  deadline: 60,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a chaos experiment to test the failover speed of a database cluster with ${4 + Math.floor(d/3)} nodes. Measure recovery time objective (RTO).`,
    (d, r) => `Document a post-mortem for an unplanned failover that took ${30 + d} seconds. Include root cause, impact, and remediation steps.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer.toLowerCase(), ["rto", "failover", "post-mortem"]) * 25;
    sc += precisionScore(answer, "database cluster failover experiment") * 35;
    sc += creativeScore(answer) * 40;
    return clamp(sc * (1 + d/15));
  },
  deadline: 150,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Write a chaos experiment to test the failover speed of a database cluster with ${4 + Math.floor(d/3)} nodes. Measure recovery time objective (RTO).`,
    (d, r) => `Document a post-mortem for an unplanned failover that took ${30 + d} seconds. Include root cause, impact, and remediation steps.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer.toLowerCase(), ["rto", "failover", "post-mortem"]) * 25;
    sc += precisionScore(answer, "database cluster failover experiment") * 35;
    sc += creativeScore(answer) * 40;
    return clamp(sc * (1 + d/15));
  },
  deadline: 150,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You are the attacker. Craft a chaos scenario that triggers a memory leak in the opponent's garbage collector.`,
    (d, r) => `You are the defender. Detect and mitigate the memory leak before heap usage exceeds ${100 + d*20}MB.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer, 1000) * 30;
    sc += reasonScore(answer) * 40;
    sc += codeScore(answer) * 30;
    return clamp(sc * (0.8 + Math.random()*0.4));
  },
  deadline: 100,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You are the attacker. Craft a chaos scenario that triggers a memory leak in the opponent's garbage collector.`,
    (d, r) => `You are the defender. Detect and mitigate the memory leak before heap usage exceeds ${100 + d*20}MB.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer, 1000) * 30;
    sc += reasonScore(answer) * 40;
    sc += codeScore(answer) * 30;
    return clamp(sc * (0.8 + Math.random()*0.4));
  },
  deadline: 100,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Teammate A designs a chaos experiment to test network partition tolerance. Teammate B implements a recovery plan using consensus algorithms. Round ${r}.`,
    (d, r) => `Teammate A audits the recovery plan for correctness. Teammate B writes a rollback procedure for consensus state. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer.toLowerCase(), ["consensus", "network partition", "recovery"]) * 40;
    sc += precisionScore(answer, "chaos network partition recovery") * 30;
    sc += creativeScore(answer) * 30;
    return clamp(sc * (1 + d/10));
  },
  deadline: 200,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Teammate A designs a chaos experiment to test network partition tolerance. Teammate B implements a recovery plan using consensus algorithms. Round ${r}.`,
    (d, r) => `Teammate A audits the recovery plan for correctness. Teammate B writes a rollback procedure for consensus state. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer.toLowerCase(), ["consensus", "network partition", "recovery"]) * 40;
    sc += precisionScore(answer, "chaos network partition recovery") * 30;
    sc += creativeScore(answer) * 30;
    return clamp(sc * (1 + d/10));
  },
  deadline: 200,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `A zombie process floods the system with fork bombs. Survive under memory pressure of ${500 + d*100}MB. Round ${r}.`,
    (d, r) => `A network storm saturates bandwidth to ${95 + d}% utilization. Maintain critical path latency under ${100 + d*5}ms. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer.toLowerCase(), ["zombie process", "fork bomb", "network storm"]) * 25;
    sc += reasonScore(answer) * 40;
    sc += wc(answer, 300) * 10;
    return clamp(sc * (1 - r/15));
  },
  deadline: 80,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `A zombie process floods the system with fork bombs. Survive under memory pressure of ${500 + d*100}MB. Round ${r}.`,
    (d, r) => `A network storm saturates bandwidth to ${95 + d}% utilization. Maintain critical path latency under ${100 + d*5}ms. Round ${r}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer.toLowerCase(), ["zombie process", "fork bomb", "network storm"]) * 25;
    sc += reasonScore(answer) * 40;
    sc += wc(answer, 300) * 10;
    return clamp(sc * (1 - r/15));
  },
  deadline: 80,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Simulate a disk space exhaustion on a log-heavy service. Propose a solution that maintains ${100-d}% of ingest throughput.`,
    (d, r) => `Write a chaos experiment to verify the solution from round 1. Include metrics to validate recovery.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer.toLowerCase(), ["disk exhaustion", "ingest throughput", "chaos experiment"]) * 30;
    sc += precisionScore(answer, "disk space chaos solution validation") * 40;
    sc += creativeScore(answer) * 30;
    return clamp(sc * (1 + d/20));
  },
  deadline: 140,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Simulate a disk space exhaustion on a log-heavy service. Propose a solution that maintains ${100-d}% of ingest throughput.`,
    (d, r) => `Write a chaos experiment to verify the solution from round 1. Include metrics to validate recovery.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer.toLowerCase(), ["disk exhaustion", "ingest throughput", "chaos experiment"]) * 30;
    sc += precisionScore(answer, "disk space chaos solution validation") * 40;
    sc += creativeScore(answer) * 30;
    return clamp(sc * (1 + d/20));
  },
  deadline: 140,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You are the attacker. Introduce a chaos scenario that causes a split-brain in a distributed cache cluster.`,
    (d, r) => `You are the defender. Implement a quorum-based split-brain recovery strategy with a timeout of ${10 + d} seconds.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer.toLowerCase(), ["split-brain", "quorum", "recovery strategy"]) * 35;
    sc += mathScore(answer, 100) * 35;
    sc += reasonScore(answer) * 30;
    return clamp(sc * (0.7 + Math.random()*0.6));
  },
  deadline: 110,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You are the attacker. Introduce a chaos scenario that causes a split-brain in a distributed cache cluster.`,
    (d, r) => `You are the defender. Implement a quorum-based split-brain recovery strategy with a timeout of ${10 + d} seconds.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer.toLowerCase(), ["split-brain", "quorum", "recovery strategy"]) * 35;
    sc += mathScore(answer, 100) * 35;
    sc += reasonScore(answer) * 30;
    return clamp(sc * (0.7 + Math.random()*0.6));
  },
  deadline: 110,
}),

fault_tolerant_system: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a fault-tolerant system to handle ${d} failures in ${r} seconds`,
    (d, r) => `Explain how to recover from a ${d} level failure in ${r} minutes`,
  ],
  score: (answer, d) => reasonScore(answer, ["redundancy", "failover", "self-healing"]),
  deadline: 90,
}),

fault_tolerant_system: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a fault-tolerant system to handle ${d} failures in ${r} seconds`,
    (d, r) => `Explain how to recover from a ${d} level failure in ${r} minutes`,
  ],
  score: (answer, d) => reasonScore(answer, ["redundancy", "failover", "self-healing"]),
  deadline: 90,
}),

syntax_sprint: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Write a syntax parser for a language with ${d} keywords in ${r} lines`,
    (d, r) => `Optimize the parser to handle ${d} errors in ${r} seconds`,
  ],
  score: (answer, d) => codeScore(answer, ["correctness", "efficiency"]),
  deadline: 60,
}),

syntax_sprint: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Write a syntax parser for a language with ${d} keywords in ${r} lines`,
    (d, r) => `Optimize the parser to handle ${d} errors in ${r} seconds`,
  ],
  score: (answer, d) => codeScore(answer, ["correctness", "efficiency"]),
  deadline: 60,
}),

neural_poker: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Train a neural network to play poker with ${d} opponents in ${r} rounds`,
    (d, r) => `Explain the strategy to win ${d} games in ${r} hours`,
  ],
  score: (answer, d) => creativeScore(answer, ["innovation", "strategy"]),
  deadline: 120,
}),

neural_poker: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Train a neural network to play poker with ${d} opponents in ${r} rounds`,
    (d, r) => `Explain the strategy to win ${d} games in ${r} hours`,
  ],
  score: (answer, d) => creativeScore(answer, ["innovation", "strategy"]),
  deadline: 120,
}),

chaos_monkey: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Inject ${d} faults into a system and measure the impact in ${r} seconds`,
    (d, r) => `Design a system to withstand ${d} simultaneous faults in ${r} minutes`,
  ],
  score: (answer, d) => precisionScore(answer, ["accuracy", "robustness"]),
  deadline: 180,
}),

chaos_monkey: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Inject ${d} faults into a system and measure the impact in ${r} seconds`,
    (d, r) => `Design a system to withstand ${d} simultaneous faults in ${r} minutes`,
  ],
  score: (answer, d) => precisionScore(answer, ["accuracy", "robustness"]),
  deadline: 180,
}),

crisis_management: textGame({
  // format: solo
  prompts: [
    (d, r) => `Develop a crisis management plan for a ${d} level disaster in ${r} hours`,
    (d, r) => `Explain how to communicate with stakeholders during a ${d} level crisis in ${r} minutes`,
  ],
  score: (answer, d) => reasonScore(answer, ["preparedness", "communication"]),
  deadline: 90,
}),

crisis_management: textGame({
  // format: solo
  prompts: [
    (d, r) => `Develop a crisis management plan for a ${d} level disaster in ${r} hours`,
    (d, r) => `Explain how to communicate with stakeholders during a ${d} level crisis in ${r} minutes`,
  ],
  score: (answer, d) => reasonScore(answer, ["preparedness", "communication"]),
  deadline: 90,
}),

error_estimation: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Estimate the error rate of a system with ${d} failures in ${r} seconds`,
    (d, r) => `Explain how to reduce the error rate by ${d} percent in ${r} minutes`,
  ],
  score: (answer, d) => mathScore(answer, ["accuracy", "confidence"]),
  deadline: 60,
}),

error_estimation: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Estimate the error rate of a system with ${d} failures in ${r} seconds`,
    (d, r) => `Explain how to reduce the error rate by ${d} percent in ${r} minutes`,
  ],
  score: (answer, d) => mathScore(answer, ["accuracy", "confidence"]),
  deadline: 60,
}),

incident_response: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Develop an incident response plan for a ${d} level incident in ${r} hours`,
    (d, r) => `Explain how to contain and mitigate a ${d} level incident in ${r} minutes`,
  ],
  score: (answer, d) => creativeScore(answer, ["strategy", "execution"]),
  deadline: 120,
}),

incident_response: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Develop an incident response plan for a ${d} level incident in ${r} hours`,
    (d, r) => `Explain how to contain and mitigate a ${d} level incident in ${r} minutes`,
  ],
  score: (answer, d) => creativeScore(answer, ["strategy", "execution"]),
  deadline: 120,
}),

fault_tree_analysis: textGame({
  // format: solo
  prompts: [
    (d, r) => `Perform a fault tree analysis for a system with ${d} components in ${r} seconds`,
    (d, r) => `Explain how to mitigate ${d} faults in a system in ${r} minutes`,
  ],
  score: (answer, d) => codeScore(answer, ["correctness", "completeness"]),
  deadline: 90,
}),

fault_tree_analysis: textGame({
  // format: solo
  prompts: [
    (d, r) => `Perform a fault tree analysis for a system with ${d} components in ${r} seconds`,
    (d, r) => `Explain how to mitigate ${d} faults in a system in ${r} minutes`,
  ],
  score: (answer, d) => codeScore(answer, ["correctness", "completeness"]),
  deadline: 90,
}),

disaster_recovery: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Develop a disaster recovery plan for a ${d} level disaster in ${r} hours`,
    (d, r) => `Explain how to restore systems after a ${d} level disaster in ${r} minutes`,
  ],
  score: (answer, d) => reasonScore(answer, ["preparedness", "execution"]),
  deadline: 180,
}),

disaster_recovery: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Develop a disaster recovery plan for a ${d} level disaster in ${r} hours`,
    (d, r) => `Explain how to restore systems after a ${d} level disaster in ${r} minutes`,
  ],
  score: (answer, d) => reasonScore(answer, ["preparedness", "execution"]),
  deadline: 180,
}),

risk_assessment: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Perform a risk assessment for a system with ${d} vulnerabilities in ${r} seconds`,
    (d, r) => `Explain how to mitigate ${d} risks in a system in ${r} minutes`,
  ],
  score: (answer, d) => precisionScore(answer, ["accuracy", "thoroughness"]),
  deadline: 60,
}),

risk_assessment: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Perform a risk assessment for a system with ${d} vulnerabilities in ${r} seconds`,
    (d, r) => `Explain how to mitigate ${d} risks in a system in ${r} minutes`,
  ],
  score: (answer, d) => reasonScore(answer),
  deadline: 60,
}),
};

export const P25_META = { name: 'Chaos Engineering', icon: '💥', color: 'text-zinc-400', games: Object.keys(P25_EXT) };
