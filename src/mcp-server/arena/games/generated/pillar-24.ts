// Auto-generated — Pillar 24: Auction House (64 games)
// Generated 2026-03-28T19:12:51.702Z
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

export const P24_EXT: Record<string, GameEngine> = {
game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Silent auction for rare art. Your valuation is $${2000 + d*300}. Current high bid: $${1200 + d*150}. Decide your bid.`,
    (d, r) => `Round ${r}: Another bid just appeared at $${1200 + d*150 + d*50}. Re-evaluate and bid.`
  ],
  score: (answer, d) => {
    let sc = mathScore(answer, Math.abs(2000 + d*300 - (1200 + d*150)), 100, 500) * 0.6;
    sc += reasonScore(answer, ["valuation", "bid", "strategy"], 0.4);
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Silent auction for rare art. Your valuation is $${2000 + d*300}. Current high bid: $${1200 + d*150}. Decide your bid.`,
    (d, r) => `Round ${r}: Another bid just appeared at $${1200 + d*150 + d*50}. Re-evaluate and bid.`
  ],
  score: (answer, d) => {
    let sc = mathScore(answer, Math.abs(2000 + d*300 - (1200 + d*150)), 100, 500) * 0.6;
    sc += reasonScore(answer, ["valuation", "bid", "strategy"], 0.4);
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Market maker for volatile crypto. Current price: $${100 + d*20}. Set bid/ask spread.`,
    (d, r) => `Volatility surge! Price spiked $${d*10} in 5 minutes. Widen spread.`
  ],
  score: (answer, d) => {
    let sc = precisionScore(answer, `${d*2}%`, 0.5);
    sc += has(answer, ["bid", "ask", "spread"]) * 50;
    return clamp(sc);
  },
  deadline: 60,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Market maker for volatile crypto. Current price: $${100 + d*20}. Set bid/ask spread.`,
    (d, r) => `Volatility surge! Price spiked $${d*10} in 5 minutes. Widen spread.`
  ],
  score: (answer, d) => {
    let sc = precisionScore(answer, `${d*2}%`, 0.5);
    sc += has(answer, ["bid", "ask", "spread"]) * 50;
    return clamp(sc);
  },
  deadline: 60,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Allocate $${50,000} between bonds, stocks, and crypto. Expected returns: B: ${3+d}%, S: ${7+d}%, C: ${15-d}%. Risks: B: ${d-1}%, S: ${d+2}%, C: ${2*d}%`,
    (d, r) => `Market crash: crypto risk increased ${d*5}%. Reallocate.`
  ],
  score: (answer, d) => {
    let sc = mathScore(answer, 0, 1, 0.05) * 0.5;
    sc += codeScore(answer, "portfolio", 0.5);
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Allocate $${50,000} between bonds, stocks, and crypto. Expected returns: B: ${3+d}%, S: ${7+d}%, C: ${15-d}%. Risks: B: ${d-1}%, S: ${d+2}%, C: ${2*d}%`,
    (d, r) => `Market crash: crypto risk increased ${d*5}%. Reallocate.`
  ],
  score: (answer, d) => {
    let sc = mathScore(answer, 0, 1, 0.05) * 0.5;
    sc += codeScore(answer, "portfolio", 0.5);
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `10-item blind auction. Budget: $${5000}. Items worth: $${300+d*100}, $${400+d*150}, $${500+d*200}, etc. Select 3 items to bid on.`,
    (d, r) => `Round ${r}: 3 bidders dropped out. Item 5 revealed to be worth $${800+d*300}. Adjust bids.`
  ],
  score: (answer, d) => {
    let sc = wc(answer, 3) * 33.33; // Expect 3 items
    sc += has(answer, ["bid", "item", "budget"]) * 33.33;
    sc += creativeScore(answer, "blind auction strategy") * 33.34;
    return clamp(sc);
  },
  deadline: 45,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `10-item blind auction. Budget: $${5000}. Items worth: $${300+d*100}, $${400+d*150}, $${500+d*200}, etc. Select 3 items to bid on.`,
    (d, r) => `Round ${r}: 3 bidders dropped out. Item 5 revealed to be worth $${800+d*300}. Adjust bids.`
  ],
  score: (answer, d) => {
    let sc = wc(answer, 3) * 33.33; // Expect 3 items
    sc += has(answer, ["bid", "item", "budget"]) * 33.33;
    sc += creativeScore(answer, "blind auction strategy") * 33.34;
    return clamp(sc);
  },
  deadline: 45,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Predict resale value of limited-edition sneakers. Cost: $${250}. Market sentiment: ${(d>5?"bullish":"bearish")}. Your valuation:`,
    (d, r) => `Sneaker influencers announce collaboration. Update valuation.`
  ],
  score: (answer, d) => {
    let ideal = 250 * (1 + (d>5?0.3:-0.2));
    let sc = precisionScore(answer, ideal.toString(), 0.6);
    sc += reasonScore(answer, ["sentiment", "trend", "profit margin"], 0.4);
    return clamp(sc);
  },
  deadline: 60,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Predict resale value of limited-edition sneakers. Cost: $${250}. Market sentiment: ${(d>5?"bullish":"bearish")}. Your valuation:`,
    (d, r) => `Sneaker influencers announce collaboration. Update valuation.`
  ],
  score: (answer, d) => {
    let ideal = 250 * (1 + (d>5?0.3:-0.2));
    let sc = precisionScore(answer, ideal.toString(), 0.6);
    sc += reasonScore(answer, ["sentiment", "trend", "profit margin"], 0.4);
    return clamp(sc);
  },
  deadline: 60,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `English auction for antique vase. Your max bid: $${1500}. Opponent's strategy: ${r%2?"aggressive":"cautious"}. Your next bid:`,
    (d, r) => `Opponent bid $${1200 + d*100}. Your turn.`
  ],
  score: (answer, d) => {
    let sc = reasonScore(answer, ["opponent behavior", "increment", "psychology"], 0.7);
    sc += mathScore(answer, 0, 1, 100) * 0.3;
    return clamp(sc);
  },
  deadline: 30,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `English auction for antique vase. Your max bid: $${1500}. Opponent's strategy: ${r%2?"aggressive":"cautious"}. Your next bid:`,
    (d, r) => `Opponent bid $${1200 + d*100}. Your turn.`
  ],
  score: (answer, d) => {
    let sc = reasonScore(answer, ["opponent behavior", "increment", "psychology"], 0.7);
    sc += mathScore(answer, 0, 1, 100) * 0.3;
    return clamp(sc);
  },
  deadline: 30,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Auction NFT collection. Floor price: $${10*d}. Your budget: $${1000*d}. Max value per item: $${30*d}. Select items to bid on.`,
    (d, r) => `Whale bidder offers $${50*d} for rare item. Counterbid?`
  ],
  score: (answer, d) => {
    let sc = wc(answer.split(',').filter(x => x.trim())) * 25; // 4 items expected
    sc += has(answer, ["bid", "NFT", "floor"]) * 25;
    sc += precisionScore(answer, (30*d).toString(), 0.5) * 50;
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `Auction NFT collection. Floor price: $${10*d}. Your budget: $${1000*d}. Max value per item: $${30*d}. Select items to bid on.`,
    (d, r) => `Whale bidder offers $${50*d} for rare item. Counterbid?`
  ],
  score: (answer, d) => {
    let sc = wc(answer.split(',').filter(x => x.trim())) * 25; // 4 items expected
    sc += has(answer, ["bid", "NFT", "floor"]) * 25;
    sc += precisionScore(answer, (30*d).toString(), 0.5) * 50;
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Portfolio optimization: $100k split between ETFs. Expected returns: A: ${4+d}%, B: ${3+d}%, C: ${6-d}%. Correlation: ${(d-5)/10}`,
    (d, r) => `Inflation rises ${d}%. Shift to inflation-protected assets.`
  ],
  score: (answer, d) => {
    let sc = mathScore(answer, 0, 1, 0.05) * 0.6;
    sc += codeScore(answer, "correlation", 0.4);
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Portfolio optimization: $100k split between ETFs. Expected returns: A: ${4+d}%, B: ${3+d}%, C: ${6-d}%. Correlation: ${(d-5)/10}`,
    (d, r) => `Inflation rises ${d}%. Shift to inflation-protected assets.`
  ],
  score: (answer, d) => {
    let sc = mathScore(answer, 0, 1, 0.05) * 0.6;
    sc += codeScore(answer, "correlation", 0.4);
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Risk assessment: Casino chip buyback program. Default probability: ${(d/10)}%. Max payout: $${d*1000}. Price to pay:`,
    (d, r) => `New data: credit rating downgraded. Adjust risk premium.`
  ],
  score: (answer, d) => {
    let ideal = (d/10) * d*1000;
    let sc = precisionScore(answer, ideal.toString(), 0.7);
    sc += reasonScore(answer, ["default probability", "credit risk"], 0.3);
    return clamp(sc);
  },
  deadline: 45,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Risk assessment: Casino chip buyback program. Default probability: ${(d/10)}%. Max payout: $${d*1000}. Price to pay:`,
    (d, r) => `New data: credit rating downgraded. Adjust risk premium.`
  ],
  score: (answer, d) => {
    let ideal = (d/10) * d*1000;
    let sc = precisionScore(answer, ideal.toString(), 0.7);
    sc += reasonScore(answer, ["default probability", "credit risk"], 0.3);
    return clamp(sc);
  },
  deadline: 45,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Market making for meme stock. Price: $${0.5 + d*0.1}. Set spread to maximize profit while avoiding arbitrage.`,
    (d, r) => `Short squeeze! Price jumped ${d*5}%. Aggressively widen spread.`
  ],
  score: (answer, d) => {
    let sc = precisionScore(answer, `${d/2}%`, 0.5);
    sc += has(answer, ["ask", "bid", "volatility"]) * 50;
    return clamp(sc);
  },
  deadline: 30,
}),
};


