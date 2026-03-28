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
})

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `You're bidding in a simulated auction for a rare digital asset. The asset's true value is between ${d * 100} and ${d * 200}. Your bid must be in this range. Write a 2-sentence justification for your bid amount.`,
    (d, r) => `The auctioneer announces a "Dutch auction" starting at ${d * 300}. Bids decrease every second. Write a brief strategy for when to place your bid, in 1 sentence.`,
    (d, r) => `You've won the asset for ${d * 180}. Now, write a 1-sentence plan to resell it within 3 rounds for maximum profit.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const justif = answer.split('\n')[0];
    if (justif.includes('value') || justif.includes('worth')) sc += 3;
    if (justif.includes('market') || justif.includes('demand')) sc += 2;
    const strategy = answer.split('\n')[1] || '';
    if (strategy.includes('wait') || strategy.includes('patience')) sc += 2;
    const plan = answer.split('\n')[2] || '';
    if (plan.includes('resell') || plan.includes('profit')) sc += 3;
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `You're bidding in a simulated auction for a rare digital asset. The asset's true value is between ${d * 100} and ${d * 200}. Your bid must be in this range. Write a 2-sentence justification for your bid amount.`,
    (d, r) => `The auctioneer announces a "Dutch auction" starting at ${d * 300}. Bids decrease every second. Write a brief strategy for when to place your bid, in 1 sentence.`,
    (d, r) => `You've won the asset for ${d * 180}. Now, write a 1-sentence plan to resell it within 3 rounds for maximum profit.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const justif = answer.split('\n')[0];
    if (justif.includes('value') || justif.includes('worth')) sc += 3;
    if (justif.includes('market') || justif.includes('demand')) sc += 2;
    const strategy = answer.split('\n')[1] || '';
    if (strategy.includes('wait') || strategy.includes('patience')) sc += 2;
    const plan = answer.split('\n')[2] || '';
    if (plan.includes('resell') || plan.includes('profit')) sc += 3;
    return clamp(sc);
  },
  deadline: 90,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You are a market maker for a volatile token. The token price is ${d * 5}. Write a 2-sentence bid-ask spread strategy that maximizes your edge.`,
    (d, r) => `A large order arrives: 100 units. Write a 1-sentence response to hedge your exposure.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const spread = answer.split('\n')[0];
    if (spread.includes('spread') || spread.includes('bid')) sc += 4;
    if (spread.includes('edge') || spread.includes('profit')) sc += 2;
    const hedge = answer.split('\n')[1] || '';
    if (hedge.includes('hedge') || hedge.includes('offset')) sc += 3;
    if (hedge.includes('exposure')) sc += 2;
    return clamp(sc);
  },
  deadline: 75,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You are a market maker for a volatile token. The token price is ${d * 5}. Write a 2-sentence bid-ask spread strategy that maximizes your edge.`,
    (d, r) => `A large order arrives: 100 units. Write a 1-sentence response to hedge your exposure.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const spread = answer.split('\n')[0];
    if (spread.includes('spread') || spread.includes('bid')) sc += 4;
    if (spread.includes('edge') || spread.includes('profit')) sc += 2;
    const hedge = answer.split('\n')[1] || '';
    if (hedge.includes('hedge') || hedge.includes('offset')) sc += 3;
    if (hedge.includes('exposure')) sc += 2;
    return clamp(sc);
  },
  deadline: 75,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Your team holds 5 NFTs worth ${d * 10} each. Write a 2-sentence portfolio diversification plan to reduce risk.`,
    (d, r) => `One asset drops 30%. Write a 1-sentence recovery strategy.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const div = answer.split('\n')[0];
    if (div.includes('diversify') || div.includes('spread')) sc += 4;
    if (div.includes('risk') || div.includes('balance')) sc += 2;
    const recover = answer.split('\n')[1] || '';
    if (recover.includes('buy') || recover.includes('hold')) sc += 3;
    if (recover.includes('rebalance')) sc += 2;
    return clamp(sc);
  },
  deadline: 60,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Your team holds 5 NFTs worth ${d * 10} each. Write a 2-sentence portfolio diversification plan to reduce risk.`,
    (d, r) => `One asset drops 30%. Write a 1-sentence recovery strategy.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const div = answer.split('\n')[0];
    if (div.includes('diversify') || div.includes('spread')) sc += 4;
    if (div.includes('risk') || div.includes('balance')) sc += 2;
    const recover = answer.split('\n')[1] || '';
    if (recover.includes('buy') || recover.includes('hold')) sc += 3;
    if (recover.includes('rebalance')) sc += 2;
    return clamp(sc);
  },
  deadline: 60,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Calculate the expected value of a 10-unit lot with 30% chance of ${d * 50} gain, 50% chance of break-even, and 20% chance of ${d * -20} loss. Write the exact number.`,
    (d, r) => `You have ${d * 1000} to invest. Write a 1-sentence risk allocation plan.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const ev = d * 10 * (0.3 * 50 + 0.5 * 0 + 0.2 * (-20));
    const ans = Number(answer.split('\n')[0].replace(/[^0-9.-]+/g, ''));
    if (Math.abs(ans - ev) < 1) sc += 5;
    const plan = answer.split('\n')[1] || '';
    if (plan.includes('risk') || plan.includes('allocation')) sc += 3;
    return clamp(sc);
  },
  deadline: 80,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `Calculate the expected value of a 10-unit lot with 30% chance of ${d * 50} gain, 50% chance of break-even, and 20% chance of ${d * -20} loss. Write the exact number.`,
    (d, r) => `You have ${d * 1000} to invest. Write a 1-sentence risk allocation plan.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const ev = d * 10 * (0.3 * 50 + 0.5 * 0 + 0.2 * (-20));
    const ans = Number(answer.split('\n')[0].replace(/[^0-9.-]+/g, ''));
    if (Math.abs(ans - ev) < 1) sc += 5;
    const plan = answer.split('\n')[1] || '';
    if (plan.includes('risk') || plan.includes('allocation')) sc += 3;
    return clamp(sc);
  },
  deadline: 80,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `You're bidding on a bundle of 3 items worth ${d * 30} total. Write a 2-sentence valuation reasoning for your max bid.`,
    (d, r) => `The auction ends in 30 seconds. Write a 1-sentence last-second bidding tactic.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const val = answer.split('\n')[0];
    if (val.includes('bundle') || val.includes('total')) sc += 3;
    if (val.includes('worth') || val.includes('value')) sc += 2;
    const tactic = answer.split('\n')[1] || '';
    if (tactic.includes('last') || tactic.includes('second')) sc += 3;
    if (tactic.includes('snipe') || tactic.includes('bid')) sc += 2;
    return clamp(sc);
  },
  deadline: 70,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `You're bidding on a bundle of 3 items worth ${d * 30} total. Write a 2-sentence valuation reasoning for your max bid.`,
    (d, r) => `The auction ends in 30 seconds. Write a 1-sentence last-second bidding tactic.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const val = answer.split('\n')[0];
    if (val.includes('bundle') || val.includes('total')) sc += 3;
    if (val.includes('worth') || val.includes('value')) sc += 2;
    const tactic = answer.split('\n')[1] || '';
    if (tactic.includes('last') || tactic.includes('second')) sc += 3;
    if (tactic.includes('snipe') || tactic.includes('bid')) sc += 2;
    return clamp(sc);
  },
  deadline: 70,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You're arbitraging between two markets: Market A price ${d * 8}, Market B price ${d * 12}. Write a 2-sentence execution plan.`,
    (d, r) => `Transaction fees are ${d * 0.5} per trade. Write a 1-sentence profitability check.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const exec = answer.split('\n')[0];
    if (exec.includes('buy') && exec.includes('sell')) sc += 4;
    if (exec.includes('arbitrage')) sc += 2;
    const check = answer.split('\n')[1] || '';
    if (check.includes('profit') && check.includes('fees')) sc += 3;
    if (check.includes('net')) sc += 2;
    return clamp(sc);
  },
  deadline: 85,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You're arbitraging between two markets: Market A price ${d * 8}, Market B price ${d * 12}. Write a 2-sentence execution plan.`,
    (d, r) => `Transaction fees are ${d * 0.5} per trade. Write a 1-sentence profitability check.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const exec = answer.split('\n')[0];
    if (exec.includes('buy') && exec.includes('sell')) sc += 4;
    if (exec.includes('arbitrage')) sc += 2;
    const check = answer.split('\n')[1] || '';
    if (check.includes('profit') && check.includes('fees')) sc += 3;
    if (check.includes('net')) sc += 2;
    return clamp(sc);
  },
  deadline: 85,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Your team must liquidate 100 units over 5 rounds. Write a 2-sentence distribution strategy to minimize price impact.`,
    (d, r) => `A whale buys 50 units suddenly. Write a 1-sentence adjustment to your plan.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const dist = answer.split('\n')[0];
    if (dist.includes('distribute') || dist.includes('even')) sc += 4;
    if (dist.includes('impact')) sc += 2;
    const adj = answer.split('\n')[1] || '';
    if (adj.includes('adjust') || adj.includes('react')) sc += 3;
    if (adj.includes('demand')) sc += 2;
    return clamp(sc);
  },
  deadline: 95,
}),

game_id: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Your team must liquidate 100 units over 5 rounds. Write a 2-sentence distribution strategy to minimize price impact.`,
    (d, r) => `A whale buys 50 units suddenly. Write a 1-sentence adjustment to your plan.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const dist = answer.split('\n')[0];
    if (dist.includes('distribute') || dist.includes('even')) sc += 4;
    if (dist.includes('impact')) sc += 2;
    const adj = answer.split('\n')[1] || '';
    if (adj.includes('adjust') || adj.includes('react')) sc += 3;
    if (adj.includes('demand')) sc += 2;
    return clamp(sc);
  },
  deadline: 95,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `You observe a 15% price drop after news. Write a 2-sentence sentiment analysis and next move.`,
    (d, r) => `The market rebounds 10%. Write a 1-sentence confirmation signal to re-enter.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const sentiment = answer.split('\n')[0];
    if (sentiment.includes('panic') || sentiment.includes('fear')) sc += 3;
    if (sentiment.includes('buy' || sentiment.includes('hold'))) sc += 2;
    const signal = answer.split('\n')[1] || '';
    if (signal.includes('rebound') || signal.includes('confirm')) sc += 3;
    if (signal.includes('enter')) sc += 2;
    return clamp(sc);
  },
  deadline: 65,
}),

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => `You observe a 15% price drop after news. Write a 2-sentence sentiment analysis and next move.`,
    (d, r) => `The market rebounds 10%. Write a 1-sentence confirmation signal to re-enter.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const sentiment = answer.split('\n')[0];
    if (sentiment.includes('panic') || sentiment.includes('fear')) sc += 3;
    if (sentiment.includes('buy' || sentiment.includes('hold'))) sc += 2;
    const signal = answer.split('\n')[1] || '';
    if (signal.includes('rebound') || signal.includes('confirm')) sc += 3;
    if (signal.includes('enter')) sc += 2;
    return clamp(sc);
  },
  deadline: 65,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `You're in a sealed-bid auction with 4 others. Write a 2-sentence optimal bidding formula based on your valuation ${d * 25}.`,
    (d, r) => `You learn someone bid 10% higher. Write a 1-sentence counter-strategy.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const formula = answer.split('\n')[0];
    if (formula.includes('bid' && formula.includes('valuation'))) sc += 4;
    if (formula.includes('optimal')) sc += 2;
    const counter = answer.split('\n')[1] || '';
    if (counter.includes('counter' || counter.includes('adjust'))) sc += 3;
    if (counter.includes('higher')) sc += 2;
    return clamp(sc);
  },
  deadline: 100,
}),

game_id: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `You're in a sealed-bid auction with 4 others. Write a 2-sentence optimal bidding formula based on your valuation ${d * 25}.`,
    (d, r) => `You learn someone bid 10% higher. Write a 1-sentence counter-strategy.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const formula = answer.split('\n')[0];
    if (formula.includes('bid' && formula.includes('valuation'))) sc += 4;
    if (formula.includes('optimal')) sc += 2;
    const counter = answer.split('\n')[1] || '';
    if (counter.includes('counter' || counter.includes('adjust'))) sc += 3;
    if (counter.includes('higher')) sc += 2;
    return clamp(sc);
  },
  deadline: 100,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You must hedge a 1000-unit long position. Write a 2-sentence options strategy to neutralize delta.`,
    (d, r) => `Volatility spikes 20%. Write a 1-sentence adjustment to your hedge.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const hedge = answer.split('\n')[0];
    if (hedge.includes('hedge' && hedge.includes('delta'))) sc += 4;
    if (hedge.includes('options')) sc += 2;
    const adj = answer.split('\n')[1] || '';
    if (adj.includes('adjust' || adj.includes('volatility'))) sc += 3;
    if (adj.includes('increase')) sc += 2;
    return clamp(sc);
  },
  deadline: 110,
}),

game_id: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You must hedge a 1000-unit long position. Write a 2-sentence options strategy to neutralize delta.`,
    (d, r) => `Volatility spikes 20%. Write a 1-sentence adjustment to your hedge.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const hedge = answer.split('\n')[0];
    if (hedge.includes('hedge' && hedge.includes('delta'))) sc += 4;
    if (hedge.includes('options')) sc += 2;
    const adj = answer.split('\n')[1] || '';
    if (adj.includes('adjust' || adj.includes('volatility'))) sc += 3;
    if (adj.includes('increase')) sc += 2;
    return clamp(sc);
  },
  deadline: 110,
})

bid_bluff: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Round ${r}: You and an opponent bid for a contract worth ${100 + d*20} points. Your private cost is ${30 + d*5 + r*3} points. Submit your bid (integer points). Lowest bid wins but must be above cost.`,
    (d, r) => `Round ${r}: A prize of ${150 + d*15} points. Your secret valuation is ${80 + d*8 + r*4} points. Submit your bid (integer). Highest bid wins but pays their bid.`,
  ],
  score: (answer, d, round) => {
    let sc = 0;
    const bid = parseInt(answer);
    if (isNaN(bid)) return 0;
    if (round === 0) {
      const cost = 30 + d*5 + round*3;
      const prize = 100 + d*20;
      if (bid >= cost) {
        sc = prize - bid;
      } else {
        sc = -10;
      }
    } else {
      const val = 80 + d*8 + round*4;
      const prize = 150 + d*15;
      if (bid <= val && bid <= prize) {
        sc = val - bid;
      } else {
        sc = Math.max(-20, val - bid);
      }
    }
    return clamp(sc, -50, 200);
  },
  deadline: 90,
}),

bid_bluff: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Round ${r}: You and an opponent bid for a contract worth ${100 + d*20} points. Your private cost is ${30 + d*5 + r*3} points. Submit your bid (integer points). Lowest bid wins but must be above cost.`,
    (d, r) => `Round ${r}: A prize of ${150 + d*15} points. Your secret valuation is ${80 + d*8 + r*4} points. Submit your bid (integer). Highest bid wins but pays their bid.`,
  ],
  score: (answer, d, round) => {
    let sc = 0;
    const bid = parseInt(answer);
    if (isNaN(bid)) return 0;
    if (round === 0) {
      const cost = 30 + d*5 + round*3;
      const prize = 100 + d*20;
      if (bid >= cost) {
        sc = prize - bid;
      } else {
        sc = -10;
      }
    } else {
      const val = 80 + d*8 + round*4;
      const prize = 150 + d*15;
      if (bid <= val && bid <= prize) {
        sc = val - bid;
      } else {
        sc = Math.max(-20, val - bid);
      }
    }
    return clamp(sc, -50, 200);
  },
  deadline: 90,
}),

portfolio_volatility: textGame({
  // format: solo
  prompts: [
    (d, r) => `Allocate 100% across ${3 + Math.floor(d/3)} assets. Mean returns: ${[2,5,8,12,15].slice(0,3+Math.floor(d/3)).join(', ')}%. Std dev: ${[4,7,10,14,18].slice(0,3+Math.floor(d/3)).join(', ')}%. Corr matrix is identity. Maximize Sharpe ratio (risk-free rate ${1 + d*0.2}%). Provide percentages comma-separated.`,
    (d, r) => `Asset count: ${4}. Expected returns: [${[3,6,9,11].map(x => x + r).join(', ')}]%. Covariance diagonal: [${[5,8,12,16].map(x => x + r).join(', ')}]. No shorting. Minimize variance for 7% target return. Give weights as comma-separated percentages summing to 100.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const nums = answer.split(',').map(s => parseFloat(s.trim()));
    if (nums.length < 3) return 0;
    const sum = nums.reduce((a,b) => a+b, 0);
    if (Math.abs(sum - 100) > 1) return 0;
    sc += 100 - Math.abs(sum - 100);
    sc += precisionScore(answer, "25,35,40");
    sc += reasonScore(answer);
    return clamp(sc, 0, 100);
  },
  deadline: 150,
}),

portfolio_volatility: textGame({
  // format: solo
  prompts: [
    (d, r) => `Allocate 100% across ${3 + Math.floor(d/3)} assets. Mean returns: ${[2,5,8,12,15].slice(0,3+Math.floor(d/3)).join(', ')}%. Std dev: ${[4,7,10,14,18].slice(0,3+Math.floor(d/3)).join(', ')}%. Corr matrix is identity. Maximize Sharpe ratio (risk-free rate ${1 + d*0.2}%). Provide percentages comma-separated.`,
    (d, r) => `Asset count: ${4}. Expected returns: [${[3,6,9,11].map(x => x + r).join(', ')}]%. Covariance diagonal: [${[5,8,12,16].map(x => x + r).join(', ')}]. No shorting. Minimize variance for 7% target return. Give weights as comma-separated percentages summing to 100.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const nums = answer.split(',').map(s => parseFloat(s.trim()));
    if (nums.length < 3) return 0;
    const sum = nums.reduce((a,b) => a+b, 0);
    if (Math.abs(sum - 100) > 1) return 0;
    sc += 100 - Math.abs(sum - 100);
    sc += precisionScore(answer, "25,35,40");
    sc += reasonScore(answer);
    return clamp(sc, 0, 100);
  },
  deadline: 150,
}),

multi_lot_auction: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `${4 + Math.floor(d/5)} identical items for sale. ${6 + d} bidders each want up to 2 items. Your value per item is ${50 + d*6} points. Submit your bid per item (integer). Uniform price clears market.`,
    (d, r) => `Round ${r}: Two heterogeneous lots: Lot A value ${120 + d*10}, Lot B value ${90 + d*8}. You can bid on both but can win only one. Submit two comma-separated bids (A, B).`,
  ],
  score: (answer, d, round) => {
    let sc = 0;
    if (round === 0) {
      const bid = parseInt(answer);
      const value = 50 + d*6;
      const marketPrice = Math.floor(value * 0.7 + d*2);
      if (bid >= marketPrice) {
        sc = (value - marketPrice) * 2;
      } else if (bid >= marketPrice - 5) {
        sc = value - marketPrice;
      }
    } else {
      const parts = answer.split(',').map(s => parseInt(s.trim()));
      if (parts.length === 2) {
        const valA = 120 + d*10;
        const valB = 90 + d*8;
        const priceA = Math.floor(valA * 0.8);
        const priceB = Math.floor(valB * 0.8);
        if (parts[0] >= priceA && parts[0] >= parts[1]) {
          sc = valA - parts[0];
        } else if (parts[1] >= priceB) {
          sc = valB - parts[1];
        }
      }
    }
    return clamp(sc, 0, 200);
  },
  deadline: 120,
}),

multi_lot_auction: textGame({
  // format: battle_royale
  prompts: [
    (d, r) => `${4 + Math.floor(d/5)} identical items for sale. ${6 + d} bidders each want up to 2 items. Your value per item is ${50 + d*6} points. Submit your bid per item (integer). Uniform price clears market.`,
    (d, r) => `Round ${r}: Two heterogeneous lots: Lot A value ${120 + d*10}, Lot B value ${90 + d*8}. You can bid on both but can win only one. Submit two comma-separated bids (A, B).`,
  ],
  score: (answer, d, round) => {
    let sc = 0;
    if (round === 0) {
      const bid = parseInt(answer);
      const value = 50 + d*6;
      const marketPrice = Math.floor(value * 0.7 + d*2);
      if (bid >= marketPrice) {
        sc = (value - marketPrice) * 2;
      } else if (bid >= marketPrice - 5) {
        sc = value - marketPrice;
      }
    } else {
      const parts = answer.split(',').map(s => parseInt(s.trim()));
      if (parts.length === 2) {
        const valA = 120 + d*10;
        const valB = 90 + d*8;
        const priceA = Math.floor(valA * 0.8);
        const priceB = Math.floor(valB * 0.8);
        if (parts[0] >= priceA && parts[0] >= parts[1]) {
          sc = valA - parts[0];
        } else if (parts[1] >= priceB) {
          sc = valB - parts[1];
        }
      }
    }
    return clamp(sc, 0, 200);
  },
  deadline: 120,
}),

adverse_selection: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You are a buyer. Seller's item quality is High (value ${150 + d*20}) ,

adverse_selection: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `You are a buyer. Seller's item quality is High (value ${150 + d*20}) 

combinatorial_bids: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Three items X,Y,Z. Your team values: X=${80 + d*5}, Y=${70 + d*5}, Z=${60 + d*5}, X+Y=${120 + d*10}, Y+Z=${110 + d*10}, X+Z=${115 + d*10}, X+Y+Z=${150 + d*15}. Opponent values are similar but shifted. Submit bids for each of the 7 bundles (comma-separated).`,
    (d, r) => `Two spectrum licenses A & B. Values: A=${100 + d*8}, B=${90 + d*6}, A+B=${210 + d*12} (synergy). Your budget ${180 + d*10}. Submit package bids for A, B, and AB (three integers).`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const bids = answer.split(',').map(s => parseInt(s.trim()));
    if (bids.length >= 3) {
      sc += has(answer, [bids[0].toString(), bids[1].toString(), bids[2].toString()]) ? 30 : 0;
      sc += mathScore(answer);
      sc += reasonScore(answer);
    }
    return clamp(sc, 0, 100);
  },
  deadline: 180,
}),

combinatorial_bids: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Three items X,Y,Z. Your team values: X=${80 + d*5}, Y=${70 + d*5}, Z=${60 + d*5}, X+Y=${120 + d*10}, Y+Z=${110 + d*10}, X+Z=${115 + d*10}, X+Y+Z=${150 + d*15}. Opponent values are similar but shifted. Submit bids for each of the 7 bundles (comma-separated).`,
    (d, r) => `Two spectrum licenses A & B. Values: A=${100 + d*8}, B=${90 + d*6}, A+B=${210 + d*12} (synergy). Your budget ${180 + d*10}. Submit package bids for A, B, and AB (three integers).`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const bids = answer.split(',').map(s => parseInt(s.trim()));
    if (bids.length >= 3) {
      sc += has(answer, [bids[0].toString(), bids[1].toString(), bids[2].toString()]) ? 30 : 0;
      sc += mathScore(answer);
      sc += reasonScore(answer);
    }
    return clamp(sc, 0, 100);
  },
  deadline: 180,
}),

market_making_spread: textGame({
  // format: solo
  prompts: [
    (d, r) => `You are a market maker. Asset true value ∼ N(${100 + d*5}, ${10 + d}),

market_making_spread: textGame({
  // format: solo
  prompts: [
    (d, r) => `You are a market maker. Asset true value ∼ N(${100 + d*5}, ${10 + d})

sequential_bargaining: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Split a pie of size ${200 + d*30} over 3 rounds. Discount factor 0.9 per round. You make the first offer (percentage you keep). Opponent can accept or counter.`,
    (d, r) => `Bargain over an asset. Your valuation ${80 + d*10}, opponent's valuation ${120 + d*15}. Alternating offers, discount 0.85. You start. Propose a price.`,
  ],
  score: (answer, d, round) => {
    let sc = 0;
    const num = parseFloat(answer);
    if (isNaN(num)) return 0;
    if (round === 0) {
      const pie = 200 + d*30;
      const fair = pie * 0.55;
      sc += Math.max(0, 100 - Math.abs(num - fair));
    } else {
      const yourVal = 80 + d*10;
      const oppVal = 120 + d*15;
      const efficientPrice = (yourVal + oppVal) / 2;
      sc += Math.max(0, 100 - Math.abs(num - efficientPrice));
    }
    sc += reasonScore(answer);
    return clamp(sc, 0, 100);
  },
  deadline: 100,
}),

sequential_bargaining: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Split a pie of size ${200 + d*30} over 3 rounds. Discount factor 0.9 per round. You make the first offer (percentage you keep). Opponent can accept or counter.`,
    (d, r) => `Bargain over an asset. Your valuation ${80 + d*10}, opponent's valuation ${120 + d*15}. Alternating offers, discount 0.85. You start. Propose a price.`,
  ],
  score: (answer, d, round) => {
    let sc = 0;
    const num = parseFloat(answer);
    if (isNaN(num)) return 0;
    if (round === 0) {
      const pie = 200 + d*30;
      const fair = pie * 0.55;
      sc += Math.max(0, 100 - Math.abs(num - fair));
    } else {
      const yourVal = 80 + d*10;
      const oppVal = 120 + d*15;
      const efficientPrice = (yourVal + oppVal) / 2;
      sc += Math.max(0, 100 - Math.abs(num - efficientPrice));
    }
    sc += reasonScore(answer);
    return clamp(sc, 0, 100);
  },
  deadline: 100,
}),

risk_parity_allocation: textGame({
  // format: solo
  prompts: [
    (d, r) => `Three asset classes: Equities σ=${15 + d}%, Bonds σ=${5 + d/2}%, Commodities σ=${20 + d}%. Correlations: E-B 0.2, E-C 0.4, B-C 0.1. Allocate to equalize risk contribution (risk parity). Provide percentages.`,
    (d, r) => `Four uncorrelated assets with vols ${[8,12,6,18].map(x => x + d/2).join(', ')}%. Achieve portfolio vol of exactly 10%. Give weights comma-separated summing to 100.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['%', ',']) ? 20 : 0;
    const nums = answer.split(',').map(s => parseFloat(s.trim()));
    const sum = nums.reduce((a,b) => a+b, 0);
    if (Math.abs(sum - 100) < 5) sc += 30;
    sc += mathScore(answer);
    sc += creativeScore(answer);
    return clamp(sc, 0, 100);
  },
  deadline: 140,
}),

risk_parity_allocation: textGame({
  // format: solo
  prompts: [
    (d, r) => `Three asset classes: Equities σ=${15 + d}%, Bonds σ=${5 + d/2}%, Commodities σ=${20 + d}%. Correlations: E-B 0.2, E-C 0.4, B-C 0.1. Allocate to equalize risk contribution (risk parity). Provide percentages.`,
    (d, r) => `Four uncorrelated assets with vols ${[8,12,6,18].map(x => x + d/2).join(', ')}%. Achieve portfolio vol of exactly 10%. Give weights comma-separated summing to 100.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ['%', ',']) ? 20 : 0;
    const nums = answer.split(',').map(s => parseFloat(s.trim()));
    const sum = nums.reduce((a,b) => a+b, 0);
    if (Math.abs(sum - 100) < 5) sc += 30;
    sc += mathScore(answer);
    sc += creativeScore(answer);
    return clamp(sc, 0, 100);
  },
  deadline: 140,
}),
};

export const P24_META = { name: 'Auction House', icon: '💰', color: 'text-gold-400', games: Object.keys(P24_EXT) };
