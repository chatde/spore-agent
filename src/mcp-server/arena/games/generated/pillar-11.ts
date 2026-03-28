// Auto-generated — Pillar 11: Diplomacy & Negotiation (28 games)
// Generated 2026-03-28T16:16:05.613Z
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

export const P11_EXT: Record<string, GameEngine> = {
diplomatic_debate: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Present a case for a universal basic income, considering economic and social implications, difficulty: ${d}, round: ${r}`,
    (d, r) => `Argue against a universal basic income, citing potential drawbacks and alternative solutions, difficulty: ${d}, round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = reasonScore(answer);
    sc += creativeScore(answer);
    return clamp(sc, 0, 100);
  },
  deadline: 180,
}),

trade_negotiation: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Negotiate a trade agreement between two nations, focusing on tariffs, quotas, and economic benefits, difficulty: ${d}, round: ${r}`,
    (d, r) => `Resolve a trade dispute between two nations, considering diplomatic channels and compromise, difficulty: ${d}, round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = precisionScore(answer, ['tariffs', 'quotas', 'economic benefits']);
    sc += codeScore(answer);
    return clamp(sc, 0, 100);
  },
  deadline: 240,
}),

alliances_builder: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Form an alliance with 2-3 other agents to achieve a common goal, difficulty: ${d}, round: ${r}`,
    (d, r) => `Convince another agent to join your alliance, offering benefits and incentives, difficulty: ${d}, round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = wc(answer, 5);
    sc += has(answer, ['alliance', 'goal', 'benefits']);
    return clamp(sc, 0, 100);
  },
  deadline: 300,
}),

environmental_summit: textGame({
  // format: solo
  prompts: [
    (d, r) => `Propose a comprehensive plan to address climate change, including strategies for mitigation and adaptation, difficulty: ${d}, round: ${r}`,
    (d, r) => `Develop a policy to promote sustainable development, balancing economic growth and environmental protection, difficulty: ${d}, round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = mathScore(answer);
    sc += creativeScore(answer);
    return clamp(sc, 0, 100);
  },
  deadline: 120,
}),

disaster_response: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Coordinate a disaster response effort with limited resources, prioritizing relief and recovery, difficulty: ${d}, round: ${r}`,
    (d, r) => `Negotiate with stakeholders to allocate resources for disaster relief, difficulty: ${d}, round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = reasonScore(answer);
    sc += precisionScore(answer, ['resources', 'relief', 'recovery']);
    return clamp(sc, 0, 100);
  },
  deadline: 180,
}),

intellectual_property: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Negotiate a licensing agreement for a patented technology, balancing intellectual property rights and commercial interests, difficulty: ${d}, round: ${r}`,
    (d, r) => `Resolve a dispute over intellectual property rights, considering legal and ethical implications, difficulty: ${d}, round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = codeScore(answer);
    sc += has(answer, ['intellectual property', 'rights', 'commercial interests']);
    return clamp(sc, 0, 100);
  },
  deadline: 240,
}),

refugee_crisis: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Develop a comprehensive plan to address a refugee crisis, including humanitarian aid and long-term solutions, difficulty: ${d}, round: ${r}`,
    (d, r) => `Negotiate with international partners to provide aid and support for refugees, difficulty: ${d}, round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = wc(answer, 7);
    sc += creativeScore(answer);
    return clamp(sc, 0, 100);
  },
  deadline: 300,
}),

cyber_security: textGame({
  // format: solo
  prompts: [
    (d, r) => `Propose a strategy to prevent and respond to cyber attacks, including threat assessment and mitigation, difficulty: ${d}, round: ${r}`,
    (d, r) => `Develop a policy to protect sensitive information and prevent data breaches, difficulty: ${d}, round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = precisionScore(answer, ['threat assessment', 'mitigation', 'data protection']);
    sc += mathScore(answer);
    return clamp(sc, 0, 100);
  },
  deadline: 120,
}),

global_economy: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Analyze the impact of globalization on the economy, including benefits and drawbacks, difficulty: ${d}, round: ${r}`,
    (d, r) => `Propose a policy to regulate international trade and finance, considering economic and social implications, difficulty: ${d}, round: ${r}`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc = reasonScore(answer);
    sc += codeScore(answer);
    return clamp(sc, 0, 100);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Draft a treaty between two factions with ${d} difficulty and ${r} rounds, focusing on mutual resource sharing and conflict prevention.`,
    (d, r) => `Negotiate a 5-round treaty between two groups with ${d} difficulty, ensuring clauses for environmental protection and trade restrictions are included.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["resource sharing", "conflict prevention", "environmental protection", "trade restrictions"]) ? 20 : 0;
    sc += reasonScore(answer, "treaty validity", d) * 0.5;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `De-escalate a ${d} difficulty conflict between two agents in ${r} rounds, proposing 3 actionable steps to reduce hostility.`,
    (d, r) => `Resolve a ${d} difficulty diplomatic crisis between two parties in ${r} rounds with a creative solution that avoids war.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += creativeScore(answer, "innovative de-escalation", d) * 0.75;
    sc += precisionScore(answer, "step-by-step plan", d) * 0.25;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Allocate ${d} difficulty resources among 3 agents in ${r} rounds, ensuring fair distribution using a mathematical model.`,
    (d, r) => `Solve a ${d} difficulty resource shortage scenario with ${r} rounds, prioritizing critical needs with a code-based solution.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer, "fair distribution", d) * 0.6;
    sc += codeScore(answer, "resource algorithm", d) * 0.4;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Exchange cultural artifacts with a partner agent in ${r} rounds under ${d} difficulty, highlighting 2 shared values.`,
    (d, r) => `Facilitate a ${d} difficulty cultural dialogue in ${r} rounds, ensuring mutual respect and inclusion of 3 traditions.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += wc(answer) > 200 ? 0 : 10;
    sc += has(answer, ["traditions", "mutual respect", "shared values"]) ? 20 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Share sensitive information with 4 agents in ${r} rounds under ${d} difficulty, ensuring no data leaks with a secure method.`,
    (d, r) => `Exchange ${d} difficulty data in ${r} rounds while avoiding betrayal, using a cryptographic protocol to verify integrity.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer, "encryption protocol", d) * 0.5;
    sc += has(answer, ["secure transfer", "non-disclosure", "data integrity"]) ? 15 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Balance power dynamics among 3 factions in ${r} rounds with ${d} difficulty, ensuring no single agent dominates.`,
    (d, r) => `Maintain equilibrium in a ${d} difficulty scenario with ${r} rounds, using a strategy that prevents power consolidation.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer, "equilibrium metrics", d) * 0.4;
    sc += precisionScore(answer, "power distribution plan", d) * 0.6;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Negotiate an ethical decision in ${r} rounds with ${d} difficulty, weighing the pros and cons of a controversial policy.`,
    (d, r) => `Resolve a ${d} difficulty ethical dilemma in ${r} rounds, justifying your choice with logical reasoning and empathy.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += reasonScore(answer, "ethical analysis", d) * 0.7;
    sc += creativeScore(answer, "moral compromise", d) * 0.3;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Reconcile historical grievances between two nations in ${r} rounds with ${d} difficulty, focusing on reparations and trust-building.`,
    (d, r) => `Address a ${d} difficulty historical conflict in ${r} rounds, proposing a resolution that acknowledges past wrongs and fosters unity.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += codeScore(answer, "reconciliation framework", d) * 0.5;
    sc += has(answer, ["reparations", "trust-building", "historical acknowledgment"]) ? 20 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Resolve a territorial dispute between two teams in ${r} rounds with ${d} difficulty, using geometric calculations to define borders.`,
    (d, r) => `Negotiate a ${d} difficulty border agreement in ${r} rounds, ensuring all parties accept the territorial divisions.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += mathScore(answer, "territorial boundaries", d) * 0.6;
    sc += reasonScore(answer, "border justification", d) * 0.4;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Negotiate a peace treaty between ${d+2} warring factions in under ${10-d} rounds.`,
    (d, r) => `Resolve a territorial dispute over resource-rich lands using diplomatic tactics.`,
  ],
  score: (answer, d) => {
    let sc = wordCount(answer) * 2;
    sc += has(answer, ['compromise', 'alliance', 'treaty']) ? 15 : 0;
    return clamp(sc);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Draft a mutually beneficial trade agreement between ${d} competing corporations.`,
    (d, r) => `Create a supply chain pact that satisfies both industrialized and developing nations.`,
  ],
  score: (answer, d) => {
    let sc = codeScore(answer) * 3;
    sc += precisionScore(answer, 'balanced') * 2;
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Mediate a cultural conflict between ${r+2} ethnic groups with historical tensions.`,
    (d, r) => `Design an education program to bridge ideological divides in ${d} generations.`,
  ],
  score: (answer, d) => {
    let sc = reasonScore(answer) * 4;
    sc += has(answer, ['understanding', 'heritage', 'dialogue']) ? 20 : 0;
    return clamp(sc);
  },
  deadline: 200,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Survive a political coup by forming temporary alliances with ${10-d} rival factions.`,
    (d, r) => `Navigate a shifting power structure during a regime change crisis.`,
  ],
  score: (answer, d) => {
    let sc = creativeScore(answer) * 2;
    sc += has(answer, ['betrayal', 'loyalty', 'strategy']) ? 25 : 0;
    return clamp(sc);
  },
  deadline: 160,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Debate the ethics of AI governance with ${d} opposing philosophical frameworks.`,
    (d, r) => `Argue for/against technological sovereignty in a globalized economy.`,
  ],
  score: (answer, d) => {
    let sc = mathScore(answer) * 3;
    sc += has(answer, ['ethics', 'autonomy', 'regulation']) ? 18 : 0;
    return clamp(sc);
  },
  deadline: 140,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Coordinate a multinational response to a pandemic with ${d} conflicting health policies.`,
    (d, r) => `Balance public health and economic interests during a disease outbreak.`,
  ],
  score: (answer, d) => {
    let sc = reasonScore(answer) * 4;
    sc += precisionScore(answer, 'equitable') * 3;
    return clamp(sc);
  },
  deadline: 170,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Secure funding for ${d} competing scientific research projects with limited grants.`,
    (d, r) => `Prioritize resource allocation among ${r*2} breakthrough technologies.`,
  ],
  score: (answer, d) => {
    let sc = wordCount(answer) * 2;
    sc += has(answer, ['innovation', 'ROI', 'impact']) ? 22 : 0;
    return clamp(sc);
  },
  deadline: 130,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Outmaneuver ${10-d} rivals in a corporate takeover bid using legal and social tactics.`,
    (d, r) => `Defend against a hostile acquisition while maintaining shareholder confidence.`,
  ],
  score: (answer, d) => {
    let sc = creativeScore(answer) * 3;
    sc += codeScore(answer) * 2;
    return clamp(sc);
  },
  deadline: 190,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Resolve a deepfake crisis threatening diplomatic relations between ${d} nations.`,
    (d, r) => `Counteract misinformation in a tense geopolitical standoff.`,
  ],
  score: (answer, d) => {
    let sc = precisionScore(answer, 'verifiable') * 4;
    sc += has(answer, ['evidence', 'transparency', 'accountability']) ? 16 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Design a fair voting system for a ${d}-party political landscape.`,
    (d, r) => `Reform electoral processes to reduce polarization while maintaining representation.`,
  ],
  score: (answer, d) => {
    let sc = mathScore(answer) * 2;
    sc += reasonScore(answer) * 3;
    return clamp(sc);
  },
  deadline: 210,
}),
};

export const P11_META = { name: 'Diplomacy & Negotiation', icon: '🤝', color: 'text-amber-400', games: Object.keys(P11_EXT) };
