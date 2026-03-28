// Auto-generated — Pillar 5: Strategy & Planning (48 games)
// Generated 2026-03-28T16:48:55.717Z
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

export const P5_EXT: Record<string, GameEngine> = {
resource_allocation: textGame({
  // format: solo
  prompts: [
    (d, r) => `Allocate ${100 + d*10} units among ${3 + Math.floor(d/3)} projects with constraints: each gets min 10, max 40. Maximize total value where project ${i+1} value = ${10 + i*2} per unit. Respond with JSON: {"allocations": [numbers]}.`,
    (d, r) => `Distribute ${50 + d*5} resources across ${4 + r%2} teams. Team ${i+1} efficiency: ${0.5 + i*0.1} per unit. Min per team: 5. Respond with allocations array sum = total.`,
  ],
  score: (ans, d) => {
    let sc = 0;
    try {
      const obj = JSON.parse(ans);
      const allocs = obj.allocations || [];
      const total = allocs.reduce((a,b)=>a+b,0);
      const expected = 100 + d*10;
      if (Math.abs(total - expected) > 1) return 0;
      const min = Math.min(...allocs);
      const max = Math.max(...allocs);
      if (min < 10 || max > 40) return 0;
      let value = 0;
      allocs.forEach((a,i) => value += a * (10 + i*2));
      sc = value / (expected * (10 + (allocs.length-1)*2));
    } catch(e) {}
    return clamp(sc);
  },
  deadline: 120,
}),

resource_allocation: textGame({
  // format: solo
  prompts: [
    (d, r) => `Allocate ${100 + d*10} units among ${3 + Math.floor(d/3)} projects with constraints: each gets min 10, max 40. Maximize total value where project ${i+1} value = ${10 + i*2} per unit. Respond with JSON: {"allocations": [numbers]}.`,
    (d, r) => `Distribute ${50 + d*5} resources across ${4 + r%2} teams. Team ${i+1} efficiency: ${0.5 + i*0.1} per unit. Min per team: 5. Respond with allocations array sum = total.`,
  ],
  score: (ans, d) => {
    let sc = 0;
    try {
      const obj = JSON.parse(ans);
      const allocs = obj.allocations || [];
      const total = allocs.reduce((a,b)=>a+b,0);
      const expected = 100 + d*10;
      if (Math.abs(total - expected) > 1) return 0;
      const min = Math.min(...allocs);
      const max = Math.max(...allocs);
      if (min < 10 || max > 40) return 0;
      let value = 0;
      allocs.forEach((a,i) => value += a * (10 + i*2));
      sc = value / (expected * (10 + (allocs.length-1)*2));
    } catch(e) {}
    return clamp(sc);
  },
  deadline: 120,
}),

route_optimization: textGame({
  // format: solo
  prompts: [
    (d, r) => `Find shortest route visiting all nodes once. Nodes: (0,0), (10,0), (10,10), (0,10), (5,5). Distances Euclidean. Respond with node order as comma-separated indices (0-4) starting and ending at 0.`,
    (d, r) => `Optimize delivery route for ${5+r%3} locations. Coordinates: ${Array.from({length:5+r%3}, (_,i) => `(${i*10},${(i%2)*10}),

route_optimization: textGame({
  // format: solo
  prompts: [
    (d, r) => `Find shortest route visiting all nodes once. Nodes: (0,0), (10,0), (10,10), (0,10), (5,5). Distances Euclidean. Respond with node order as comma-separated indices (0-4) starting and ending at 0.`,
    (d, r) => `Optimize delivery route for ${5+r%3} locations. Coordinates: ${Array.from({length:5+r%3}, (_,i) => `(${i*10},${(i%2)*10})

schedule_planning: textGame({
  // format: solo
  prompts: [
    (d, r) => `Schedule ${5+d} tasks with durations [${Array.from({length:5+d},()=>1+Math.floor(Math.random()*3)).join(',')}] on ${2+r%2} machines. Tasks have dependencies: task ${i+1} depends on tasks < ${Math.max(1,i-1)}. Minimize makespan. Respond with machine assignments per task (0-indexed).`,
    (d, r) => `Create schedule for ${4+r%3} activities requiring ${3+r%2} resources each. Activities: ${Array.from({length:4+r%3},(_,i)=>({id:i+1,dur:2+i,r:1+i%3}),

schedule_planning: textGame({
  // format: solo
  prompts: [
    (d, r) => `Schedule ${5+d} tasks with durations [${Array.from({length:5+d},()=>1+Math.floor(Math.random()*3)).join(',')}] on ${2+r%2} machines. Tasks have dependencies: task ${i+1} depends on tasks < ${Math.max(1,i-1)}. Minimize makespan. Respond with machine assignments per task (0-indexed).`,
    (d, r) => `Create schedule for ${4+r%3} activities requiring ${3+r%2} resources each. Activities: ${Array.from({length:4+r%3},(_,i)=>({id:i+1,dur:2+i,r:1+i%3})

inventory_management: textGame({
  // format: solo
  prompts: [
    (d, r) => `Manage inventory for ${3+r%2} products. Weekly demand: ${Array.from({length:3+r%2},()=>10+Math.floor(Math.random()*20)).join(',')}. Holding cost: $1/unit/week. Stockout penalty: $5/unit. Order cost: $20/order. Order up-to level strategy. Respond with reorder levels (comma).`,
    (d, r) => `Product demand next ${4+r} weeks: [${Array.from({length:4+r},()=>5+Math.floor(Math.random()*15)).join(',')}]. Starting inventory 10. Max storage 50. Order in batches of 10. Minimize total cost (holding+ordering+stockout). Respond with weekly order quantities (comma).`,
  ],
  score: (ans, d) => {
    let sc = 0;
    try {
      const orders = ans.split(',').map(Number);
      const demand = [12,8,15,10,13,9,14,11,16,12,7,18,9,15,10].slice(0,4+r);
      let inv = 10;
      let cost = 0;
      let ordersCount = 0;
      for (let w=0; w<demand.length; w++) {
        if (w < orders.length && orders[w] > 0) {
          inv += orders[w];
          cost += 20;
          ordersCount++;
        }
        inv -= demand[w];
        if (inv < 0) cost += 5 * -inv;
        else if (inv > 50) cost += 1000; // penalty for over storage
        else cost += inv; // holding cost $1/unit
      }
      const naiveCost = demand.reduce((a,b)=>a+b,0) * 5; // stockout penalty only
      sc = naiveCost / Math.max(cost, 1);
      if (ordersCount === 0) sc = 0;
    } catch(e) {}
    return clamp(sc);
  },
  deadline: 120,
}),

inventory_management: textGame({
  // format: solo
  prompts: [
    (d, r) => `Manage inventory for ${3+r%2} products. Weekly demand: ${Array.from({length:3+r%2},()=>10+Math.floor(Math.random()*20)).join(',')}. Holding cost: $1/unit/week. Stockout penalty: $5/unit. Order cost: $20/order. Order up-to level strategy. Respond with reorder levels (comma).`,
    (d, r) => `Product demand next ${4+r} weeks: [${Array.from({length:4+r},()=>5+Math.floor(Math.random()*15)).join(',')}]. Starting inventory 10. Max storage 50. Order in batches of 10. Minimize total cost (holding+ordering+stockout). Respond with weekly order quantities (comma).`,
  ],
  score: (ans, d) => {
    let sc = 0;
    try {
      const orders = ans.split(',').map(Number);
      const demand = [12,8,15,10,13,9,14,11,16,12,7,18,9,15,10].slice(0,4+r);
      let inv = 10;
      let cost = 0;
      let ordersCount = 0;
      for (let w=0; w<demand.length; w++) {
        if (w < orders.length && orders[w] > 0) {
          inv += orders[w];
          cost += 20;
          ordersCount++;
        }
        inv -= demand[w];
        if (inv < 0) cost += 5 * -inv;
        else if (inv > 50) cost += 1000; // penalty for over storage
        else cost += inv; // holding cost $1/unit
      }
      const naiveCost = demand.reduce((a,b)=>a+b,0) * 5; // stockout penalty only
      sc = naiveCost / Math.max(cost, 1);
      if (ordersCount === 0) sc = 0;
    } catch(e) {}
    return clamp(sc);
  },
  deadline: 120,
}),

risk_assessment: textGame({
  // format: solo
  prompts: [
    (d, r) => `Project has ${3+r%3} risks. Impact (1-10): ${Array.from({length:3+r%3},()=>1+Math.floor(Math.random()*10)).join(',')}. Probability (%): ${Array.from({length:3+r%3},()=>10+Math.floor(Math.random()*90)).join(',')}. Budget: ${100+d*10}. Mitigation cost per risk: $10, reduces probability by 50%. Respond with risk indices to mitigate (comma).`,
    (d, r) => `Investment options: ${Array.from({length:3+r%2},(_,i)=>({id:i+1,ret:[3,5,8,2,6,10][i],risk:[0.1,0.2,0.3,0.15,0.25,0.4][i]}),

risk_assessment: textGame({
  // format: solo
  prompts: [
    (d, r) => `Project has ${3+r%3} risks. Impact (1-10): ${Array.from({length:3+r%3},()=>1+Math.floor(Math.random()*10)).join(',')}. Probability (%): ${Array.from({length:3+r%3},()=>10+Math.floor(Math.random()*90)).join(',')}. Budget: ${100+d*10}. Mitigation cost per risk: $10, reduces probability by 50%. Respond with risk indices to mitigate (comma).`,
    (d, r) => `Investment options: ${Array.from({length:3+r%2},(_,i)=>({id:i+1,ret:[3,5,8,2,6,10][i],risk:[0.1,0.2,0.3,0.15,0.25,0.4][i]})

contingency_planning: textGame({
  // format: solo
  prompts: [
    (d, r) => `System has ${2+r%2} critical components. Failure probabilities: ${Array.from({length:2+r%2},()=>0.05+Math.random()*0.2).map(p=>p.toFixed(2)).join(',')}. Recovery times (hrs): ${Array.from({length:2+r%2},()=>1+Math.floor(Math.random()*5)).join(',')}. Total downtime must be < ${5+d/2} hrs. Add ${1} backup to one component (reduces fail prob by 80%). Respond with component index for backup.`,
    (d, r) => `Supply chain nodes: ${Array.from({length:3+r%2},(_,i)=>({id:i+1,fail:0.1+i*0.05,lead:1+i}),

contingency_planning: textGame({
  // format: solo
  prompts: [
    (d, r) => `System has ${2+r%2} critical components. Failure probabilities: ${Array.from({length:2+r%2},()=>0.05+Math.random()*0.2).map(p=>p.toFixed(2)).join(',')}. Recovery times (hrs): ${Array.from({length:2+r%2},()=>1+Math.floor(Math.random()*5)).join(',')}. Total downtime must be < ${5+d/2} hrs. Add ${1} backup to one component (reduces fail prob by 80%). Respond with component index for backup.`,
    (d, r) => `Supply chain nodes: ${Array.from({length:3+r%2},(_,i)=>({id:i+1,fail:0.1+i*0.05,lead:1+i})

cost_benefit_analysis: textGame({
  // format: solo
  prompts: [
    (d, r) => `Project A: cost ${50+d*5}, benefit ${100+d*10}, risk ${0.1+d*0.05}. Project B: cost ${40+d*4}, benefit ${90+d*9}, risk ${0.15+d*0.04}. Risk-adjusted benefit = benefit * (1-risk). Budget ${150+d*15}. Maximize total risk-adjusted benefit. Respond with selected projects (A,B).`,
    (d, r) => `Invest ${1000+d*100} in ${3+r%2} assets. Returns: ${Array.from({length:3+r%2},()=>0.05+Math.random()*0.15).map(r=>r.toFixed(3)).join(',')}. Costs: ${Array.from({length:3+r%2},()=>100+Math.floor(Math.random()*200)).join(',')}. Max 2 assets. Maximize net return (return*cost - cost). Respond with asset indices.`,
  ],
  score: (ans, d) => {
    let sc = 0;
    try {
      const selected = ans.split(',').map(s => s.trim().toUpperCase());
      const projects = [
        {id:'A', cost:50+d*5, ben:100+d*10, risk:0.1+d*0.05},
        {id:'B', cost:40+d*4, ben:90+d*9, risk:0.15+d*0.04}
      ];
      let totalCost = 0;
      let totalAdjBen = 0;
      projects.forEach(p => {
        if (selected.includes(p.id)) {
          totalCost += p.cost;
          totalAdjBen += p.ben * (1 - p.risk);
        }
      }),

cost_benefit_analysis: textGame({
  // format: solo
  prompts: [
    (d, r) => `Project A: cost ${50+d*5}, benefit ${100+d*10}, risk ${0.1+d*0.05}. Project B: cost ${40+d*4}, benefit ${90+d*9}, risk ${0.15+d*0.04}. Risk-adjusted benefit = benefit * (1-risk). Budget ${150+d*15}. Maximize total risk-adjusted benefit. Respond with selected projects (A,B).`,
    (d, r) => `Invest ${1000+d*100} in ${3+r%2} assets. Returns: ${Array.from({length:3+r%2},()=>0.05+Math.random()*0.15).map(r=>r.toFixed(3)).join(',')}. Costs: ${Array.from({length:3+r%2},()=>100+Math.floor(Math.random()*200)).join(',')}. Max 2 assets. Maximize net return (return*cost - cost). Respond with asset indices.`,
  ],
  score: (ans, d) => {
    let sc = 0;
    try {
      const selected = ans.split(',').map(s => s.trim().toUpperCase());
      const projects = [
        {id:'A', cost:50+d*5, ben:100+d*10, risk:0.1+d*0.05},
        {id:'B', cost:40+d*4, ben:90+d*9, risk:0.15+d*0.04}
      ];
      let totalCost = 0;
      let totalAdjBen = 0;
      projects.forEach(p => {
        if (selected.includes(p.id)) {
          totalCost += p.cost;
          totalAdjBen += p.ben * (1 - p.risk);
        }
      });

supply_chain_design: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design network: ${2+r%2} suppliers (cost: ${Array.from({length:2+r%2},()=>10+Math.floor(Math.random()*20)).join(',')}),

supply_chain_design: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design network: ${2+r%2} suppliers (cost: ${Array.from({length:2+r%2},()=>10+Math.floor(Math.random()*20)).join(',')}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a poker strategy for a ${d+2}-player game on round ${r}, focusing on bluff frequency and reading opponents.`,
    (d, r) => `Plan optimal betting patterns for a ${d+1}-hand poker tournament, considering chip stacks and blind schedules.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["bluff", "pot odds", "fold", "raise"])) sc += 30;
    if (has(s, ["tournament", "short stack", "bubble", "ICM"])) sc += 40;
    sc += reasonScore(s, d * 3) + creativeScore(s, d);
    return clamp(sc);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a poker strategy for a ${d+2}-player game on round ${r}, focusing on bluff frequency and reading opponents.`,
    (d, r) => `Plan optimal betting patterns for a ${d+1}-hand poker tournament, considering chip stacks and blind schedules.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["bluff", "pot odds", "fold", "raise"])) sc += 30;
    if (has(s, ["tournament", "short stack", "bubble", "ICM"])) sc += 40;
    sc += reasonScore(s, d * 3) + creativeScore(s, d);
    return clamp(sc);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `For a ${d}-day coding sprint, design project phases and resource allocation with ${r} blockers expected.`,
    (d, r) => `Plan a CI/CD pipeline with ${d} automated tests and ${r} deployment stages per release.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["sprint", "resource", "backlog", "velocity"])) sc += 25;
    if (codeScore(s, d * 2)) sc += 40;
    sc += wc(s, 100, 0) * 0.1 + reasonScore(s, d * 2);
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `For a ${d}-day coding sprint, design project phases and resource allocation with ${r} blockers expected.`,
    (d, r) => `Plan a CI/CD pipeline with ${d} automated tests and ${r} deployment stages per release.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["sprint", "resource", "backlog", "velocity"])) sc += 25;
    if (codeScore(s, d * 2)) sc += 40;
    sc += wc(s, 100, 0) * 0.1 + reasonScore(s, d * 2);
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Redesign a ${d}-department supply chain for ${r} new suppliers, balancing cost and resilience.`,
    (d, r) => `Optimize last-mile delivery routes for ${d} fulfillment centers serving ${r} customer zones.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["supplier", "inventory", "lead time", "warehousing"])) sc += 35;
    if (has(s, ["route", "density", "zone", "vehicle"])) sc += 35;
    sc += mathScore(s, d * 10, d * 20) + precisionScore(s, "cost reduction");
    return clamp(sc);
  },
  deadline: 200,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Redesign a ${d}-department supply chain for ${r} new suppliers, balancing cost and resilience.`,
    (d, r) => `Optimize last-mile delivery routes for ${d} fulfillment centers serving ${r} customer zones.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["supplier", "inventory", "lead time", "warehousing"])) sc += 35;
    if (has(s, ["route", "density", "zone", "vehicle"])) sc += 35;
    sc += mathScore(s, d * 10, d * 20) + precisionScore(s, "cost reduction");
    return clamp(sc);
  },
  deadline: 200,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Plan a ${d}-month marketing campaign with ${r} channels, maximizing reach within budget.`,
    (d, r) => `Design a ${d}-tier subscription model for ${r} user segments with retention focus.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["acquisition", "retention", "conversion", "ROI"])) sc += 40;
    if (has(s, ["tier", "segment", "Cohort", "LTV"])) sc += 40;
    sc += reasonScore(s, d * 2) + creativeScore(s, d * 1.5);
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Plan a ${d}-month marketing campaign with ${r} channels, maximizing reach within budget.`,
    (d, r) => `Design a ${d}-tier subscription model for ${r} user segments with retention focus.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["acquisition", "retention", "conversion", "ROI"])) sc += 40;
    if (has(s, ["tier", "segment", "Cohort", "LTV"])) sc += 40;
    sc += reasonScore(s, d * 2) + creativeScore(s, d * 1.5);
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Allocate ${d} disaster resources across ${r} affected regions during a humanitarian crisis.`,
    (d, r) => `Create a ${d}-day recovery plan after ${r} infrastructure failures, prioritizing critical services.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["triage", "logistics", "shelter", "water"])) sc += 30;
    if (has(s, ["recovery", "redundancy", "contingency", "resilience"])) sc += 30;
    sc += mathScore(s, d * 5, d * 15) + precisionScore(s, "time critical");
    return clamp(sc);
  },
  deadline: 240,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Allocate ${d} disaster resources across ${r} affected regions during a humanitarian crisis.`,
    (d, r) => `Create a ${d}-day recovery plan after ${r} infrastructure failures, prioritizing critical services.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["triage", "logistics", "shelter", "water"])) sc += 30;
    if (has(s, ["recovery", "redundancy", "contingency", "resilience"])) sc += 30;
    sc += mathScore(s, d * 5, d * 15) + precisionScore(s, "time critical");
    return clamp(sc);
  },
  deadline: 240,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `For ${d} competing teams, design a merger integration plan with ${r} stakeholder groups.`,
    (d, r) => `Plan a hostile takeover strategy against ${d} competitors in ${r} regulated markets.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["synergy", "due diligence", "acquisition", "integration"])) sc += 45;
    if (has(s, ["regulatory", "antitrust", "proxy", "hostile"])) sc += 35;
    sc += reasonScore(s, d * 3) + creativeScore(s, d * 1.2);
    return clamp(sc);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `For ${d} competing teams, design a merger integration plan with ${r} stakeholder groups.`,
    (d, r) => `Plan a hostile takeover strategy against ${d} competitors in ${r} regulated markets.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["synergy", "due diligence", "acquisition", "integration"])) sc += 45;
    if (has(s, ["regulatory", "antitrust", "proxy", "hostile"])) sc += 35;
    sc += reasonScore(s, d * 3) + creativeScore(s, d * 1.2);
    return clamp(sc);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Optimize a ${d}-leg flight network with ${r} airports, maximizing on-time performance.`,
    (d, r) => `Design a ${d}-city public transit system handling ${r} passenger segments daily.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["hub", "spoke", "frequency", "connectivity"])) sc += 30;
    if (has(s, ["congestion", "demand", "efficiency", "modal"])) sc += 30;
    sc += mathScore(s, 85, 100) + precisionScore(s, "minimize delay");
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Optimize a ${d}-leg flight network with ${r} airports, maximizing on-time performance.`,
    (d, r) => `Design a ${d}-city public transit system handling ${r} passenger segments daily.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["hub", "spoke", "frequency", "connectivity"])) sc += 30;
    if (has(s, ["congestion", "demand", "efficiency", "modal"])) sc += 30;
    sc += mathScore(s, 85, 100) + precisionScore(s, "minimize delay");
    return clamp(sc);
  },
  deadline: 150,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Plan a ${d}-stage drug trial protocol with ${r} variables, ensuring statistical power.`,
    (d, r) => `Design a ${d}-month product launch roadmap with ${r} market feedback loops.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["cohort", "placebo", "significance", "blinding"])) sc += 35;
    if (has(s, ["milestone", "feedback", "MVP", "iteration"])) sc += 35;
    sc += reasonScore(s, d * 2.5) + creativeScore(s, d);
    return clamp(sc);
  },
  deadline: 210,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Plan a ${d}-stage drug trial protocol with ${r} variables, ensuring statistical power.`,
    (d, r) => `Design a ${d}-month product launch roadmap with ${r} market feedback loops.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["cohort", "placebo", "significance", "blinding"])) sc += 35;
    if (has(s, ["milestone", "feedback", "MVP", "iteration"])) sc += 35;
    sc += reasonScore(s, d * 2.5) + creativeScore(s, d);
    return clamp(sc);
  },
  deadline: 210,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `For ${d} competing factions, negotiate a ceasefire agreement with ${r} disputed terms.`,
    (d, r) => `Plan a ${d}-step peacekeeping operation in ${r} conflict zones with cultural constraints.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["mediation", "ceasefire", "sanctions", "diplomacy"])) sc += 40;
    if (has(s, ["ROE", "protection", "NGO", "disarmament"])) sc += 40;
    sc += reasonScore(s, d * 3) + precisionScore(s, "humanitarian");
    return clamp(sc);
  },
  deadline: 300,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `For ${d} competing factions, negotiate a ceasefire agreement with ${r} disputed terms.`,
    (d, r) => `Plan a ${d}-step peacekeeping operation in ${r} conflict zones with cultural constraints.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["mediation", "ceasefire", "sanctions", "diplomacy"])) sc += 40;
    if (has(s, ["ROE", "protection", "NGO", "disarmament"])) sc += 40;
    sc += reasonScore(s, d * 3) + precisionScore(s, "humanitarian");
    return clamp(sc);
  },
  deadline: 300,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a ${d}-layer cybersecurity defense system mitigating ${r} attack vectors.`,
    (d, r) => `Plan a ${d}-month zero-trust architecture rollout across ${r} hybrid environments.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["firewall", "encryption", "segmentation", "identity"])) sc += 35;
    if (has(s, ["threat model", "least privilege", "microsegmentation", "audit"])) sc += 35;
    sc += codeScore(s, d * 2) + precisionScore(s, "attack surface reduction");
    return clamp(sc);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Design a ${d}-layer cybersecurity defense system mitigating ${r} attack vectors.`,
    (d, r) => `Plan a ${d}-month zero-trust architecture rollout across ${r} hybrid environments.`,
  ],
  score: (s, d) => {
    let sc = 0;
    if (has(s, ["firewall", "encryption", "segmentation", "identity"])) sc += 35;
    if (has(s, ["threat model", "least privilege", "microsegmentation", "audit"])) sc += 35;
    sc += codeScore(s, d * 2) + precisionScore(s, "attack surface reduction");
    return clamp(sc);
  },
  deadline: 180,
})

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You are a diplomat negotiating a peace treaty between two warring nations. Given the current political climate with difficulty ${d}, outline a comprehensive peace strategy in 200 words or less. Focus on long-term stability and mutual benefits.`,
    (d, r) => `As a military advisor, counter-propose an alternative peace framework that addresses security concerns while maintaining diplomatic relations. Use specific examples relevant to the current conflict scenario with difficulty ${d}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['mutual benefit', 'security', 'long-term stability']) ? 3 : 0;
    sc += has(answer, ['diplomatic', 'negotiation', 'treaty']) ? 2 : 0;
    sc += wc(answer) >= 150 ? 2 : 0;
    return clamp(sc);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You are a diplomat negotiating a peace treaty between two warring nations. Given the current political climate with difficulty ${d}, outline a comprehensive peace strategy in 200 words or less. Focus on long-term stability and mutual benefits.`,
    (d, r) => `As a military advisor, counter-propose an alternative peace framework that addresses security concerns while maintaining diplomatic relations. Use specific examples relevant to the current conflict scenario with difficulty ${d}.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['mutual benefit', 'security', 'long-term stability']) ? 3 : 0;
    sc += has(answer, ['diplomatic', 'negotiation', 'treaty']) ? 2 : 0;
    sc += wc(answer) >= 150 ? 2 : 0;
    return clamp(sc);
  },
  deadline: 180,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Your team must develop a 5-year expansion strategy for a tech startup entering a competitive market. With difficulty ${d}, create a detailed roadmap including market entry, competitive positioning, and resource allocation.`,
    (d, r) => `As the opposing team, critique and improve upon the proposed strategy by identifying potential weaknesses and suggesting alternative approaches that could yield better results in the same market conditions.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['market entry', 'competitive positioning', 'resource allocation']) ? 3 : 0;
    sc += has(answer, ['5-year', 'roadmap', 'timeline']) ? 2 : 0;
    sc += wc(answer) >= 200 ? 2 : 0;
    return clamp(sc);
  },
  deadline: 240,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Your team must develop a 5-year expansion strategy for a tech startup entering a competitive market. With difficulty ${d}, create a detailed roadmap including market entry, competitive positioning, and resource allocation.`,
    (d, r) => `As the opposing team, critique and improve upon the proposed strategy by identifying potential weaknesses and suggesting alternative approaches that could yield better results in the same market conditions.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['market entry', 'competitive positioning', 'resource allocation']) ? 3 : 0;
    sc += has(answer, ['5-year', 'roadmap', 'timeline']) ? 2 : 0;
    sc += wc(answer) >= 200 ? 2 : 0;
    return clamp(sc);
  },
  deadline: 240,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `A global pandemic is spreading with severity level ${d}. As a public health strategist, create an immediate response plan covering containment, resource distribution, and communication strategy. Keep it under 300 words.`,
    (d, r) => `With the pandemic evolving, develop a long-term economic recovery plan that balances public health with economic stability. Address key sectors and provide specific metrics for success.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['containment', 'resource distribution', 'communication']) ? 3 : 0;
    sc += has(answer, ['economic recovery', 'public health', 'metrics']) ? 2 : 0;
    sc += wc(answer) >= 250 ? 2 : 0;
    return clamp(sc);
  },
  deadline: 300,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `A global pandemic is spreading with severity level ${d}. As a public health strategist, create an immediate response plan covering containment, resource distribution, and communication strategy. Keep it under 300 words.`,
    (d, r) => `With the pandemic evolving, develop a long-term economic recovery plan that balances public health with economic stability. Address key sectors and provide specific metrics for success.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['containment', 'resource distribution', 'communication']) ? 3 : 0;
    sc += has(answer, ['economic recovery', 'public health', 'metrics']) ? 2 : 0;
    sc += wc(answer) >= 250 ? 2 : 0;
    return clamp(sc);
  },
  deadline: 300,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `You are planning a complex urban development project with budget constraints of ${d * 10} million dollars. Create a comprehensive proposal covering infrastructure, housing, and community services. Include phased implementation and ROI projections.`,
    (d, r) => `As a city council member, evaluate the proposed development plan and provide detailed feedback on sustainability, community impact, and potential improvements. Focus on long-term city planning principles.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['infrastructure', 'housing', 'community services']) ? 3 : 0;
    sc += has(answer, ['phased implementation', 'ROI projections', 'sustainability']) ? 2 : 0;
    sc += wc(answer) >= 180 ? 2 : 0;
    return clamp(sc);
  },
  deadline: 200,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `You are planning a complex urban development project with budget constraints of ${d * 10} million dollars. Create a comprehensive proposal covering infrastructure, housing, and community services. Include phased implementation and ROI projections.`,
    (d, r) => `As a city council member, evaluate the proposed development plan and provide detailed feedback on sustainability, community impact, and potential improvements. Focus on long-term city planning principles.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['infrastructure', 'housing', 'community services']) ? 3 : 0;
    sc += has(answer, ['phased implementation', 'ROI projections', 'sustainability']) ? 2 : 0;
    sc += wc(answer) >= 180 ? 2 : 0;
    return clamp(sc);
  },
  deadline: 200,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `As a corporate strategist, develop a market disruption plan for a traditional industry facing digital transformation. With difficulty ${d}, outline innovation strategy, competitive advantages, and implementation timeline.`,
    (d, r) => `As a competitor analyst, identify potential vulnerabilities in the disruption plan and propose counter-strategies that could protect existing market positions while adapting to digital changes.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['market disruption', 'digital transformation', 'competitive advantages']) ? 3 : 0;
    sc += has(answer, ['innovation strategy', 'implementation timeline', 'vulnerabilities']) ? 2 : 0;
    sc += wc(answer) >= 200 ? 2 : 0;
    return clamp(sc);
  },
  deadline: 220,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `As a corporate strategist, develop a market disruption plan for a traditional industry facing digital transformation. With difficulty ${d}, outline innovation strategy, competitive advantages, and implementation timeline.`,
    (d, r) => `As a competitor analyst, identify potential vulnerabilities in the disruption plan and propose counter-strategies that could protect existing market positions while adapting to digital changes.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['market disruption', 'digital transformation', 'competitive advantages']) ? 3 : 0;
    sc += has(answer, ['innovation strategy', 'implementation timeline', 'vulnerabilities']) ? 2 : 0;
    sc += wc(answer) >= 200 ? 2 : 0;
    return clamp(sc);
  },
  deadline: 220,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Your team must create a disaster response strategy for a region prone to natural disasters with frequency level ${d}. Develop coordination protocols, resource allocation, and evacuation procedures.`,
    (d, r) => `As the opposing team, enhance the disaster response strategy by incorporating advanced technologies, community engagement, and cross-agency collaboration. Focus on scalability and adaptability.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['disaster response', 'coordination protocols', 'resource allocation']) ? 3 : 0;
    sc += has(answer, ['evacuation procedures', 'community engagement', 'cross-agency']) ? 2 : 0;
    sc += wc(answer) >= 220 ? 2 : 0;
    return clamp(sc);
  },
  deadline: 280,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Your team must create a disaster response strategy for a region prone to natural disasters with frequency level ${d}. Develop coordination protocols, resource allocation, and evacuation procedures.`,
    (d, r) => `As the opposing team, enhance the disaster response strategy by incorporating advanced technologies, community engagement, and cross-agency collaboration. Focus on scalability and adaptability.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['disaster response', 'coordination protocols', 'resource allocation']) ? 3 : 0;
    sc += has(answer, ['evacuation procedures', 'community engagement', 'cross-agency']) ? 2 : 0;
    sc += wc(answer) >= 220 ? 2 : 0;
    return clamp(sc);
  },
  deadline: 280,
})
};

export const P5_META = { name: 'Strategy & Planning', icon: '🔄', color: 'text-gray-400', games: Object.keys(P5_EXT) };
