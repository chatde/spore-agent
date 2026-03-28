#!/usr/bin/env node
/**
 * Game Factory — Generate 896 arena games using OpenRouter model roulette.
 *
 * Usage:
 *   OPENROUTER_API_KEY=sk-or-... node scripts/game-factory.mjs
 *   OPENROUTER_API_KEY=sk-or-... node scripts/game-factory.mjs --resume
 *   OPENROUTER_API_KEY=sk-or-... node scripts/game-factory.mjs --pillar 12
 *
 * Roulette: cycles through free/cheap models to avoid rate limits.
 * Output: writes pillar files to src/mcp-server/arena/games/generated/
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'src/mcp-server/arena/games/generated');
const STATE_FILE = join(ROOT, 'scripts/.game-factory-state.json');

// ─── Model Roulette ────────────────────────────────────────
const MODELS = [
  // Reliable cheap models (round-robin)
  'deepseek/deepseek-v3.2',                     // $0.0004/1k — best value
  'qwen/qwen3.5-9b',                            // $0.0001/1k — ultra cheap
  'mistralai/mistral-small-2603',                // $0.0006/1k
  'meta-llama/llama-4-scout',                   // $0.00015/1k
  'qwen/qwen3-coder-next',                      // $0.0008/1k — code-optimized
  'qwen/qwen3.5-35b-a3b',                       // $0.0013/1k
  // Free models (may rate limit faster)
  'nvidia/nemotron-3-super-120b-a12b:free',
  'stepfun/step-3.5-flash:free',
  'minimax/minimax-m2.5:free',
  'z-ai/glm-4.5-air:free',
  'arcee-ai/trinity-large-preview:free',
  'nvidia/nemotron-nano-9b-v2:free',
];

let modelIndex = 0;
const modelFailCounts = new Map();
const MAX_FAILS = 3;

function nextModel() {
  let attempts = 0;
  while (attempts < MODELS.length) {
    const model = MODELS[modelIndex % MODELS.length];
    modelIndex++;
    if ((modelFailCounts.get(model) || 0) < MAX_FAILS) return model;
    attempts++;
  }
  console.log('⚠️  All models hit limits. Resetting + waiting 60s...');
  modelFailCounts.clear();
  return MODELS[0];
}

// ─── OpenRouter API ────────────────────────────────────────
const API_KEY = process.env.OPENROUTER_API_KEY;
if (!API_KEY) { console.error('❌ Set OPENROUTER_API_KEY'); process.exit(1); }

let totalTokensIn = 0, totalTokensOut = 0, totalGamesGenerated = 0;
const startTime = Date.now();
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function callOpenRouter(prompt, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const model = nextModel();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': 'https://sporeagent.com',
          'X-Title': 'SporeAgent Arena Game Factory',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4096,
          temperature: 0.9,
        }),
      });
      clearTimeout(timeout);

      if (!res.ok) {
        if (res.status === 429) {
          console.log(`  ⏳ Rate limited on ${model.split('/')[1]}, rotating...`);
          modelFailCounts.set(model, (modelFailCounts.get(model) || 0) + 1);
          await sleep(2000);
          continue;
        }
        const err = await res.text();
        throw new Error(`${res.status}: ${err}`);
      }

      const data = await res.json();
      const usage = data.usage || {};
      totalTokensIn += usage.prompt_tokens || 0;
      totalTokensOut += usage.completion_tokens || 0;

      console.log(`  🎰 ${(data.model || model).split('/').pop()} → ${(usage.completion_tokens || 0).toLocaleString()} tok`);
      return data.choices?.[0]?.message?.content || '';
    } catch (e) {
      console.log(`  ❌ ${model.split('/')[1]}: ${e.message}`);
      modelFailCounts.set(model, (modelFailCounts.get(model) || 0) + 1);
      await sleep(1000);
    }
  }
  throw new Error('All retries exhausted');
}

// ─── Pillars ───────────────────────────────────────────────
const NEW_PILLARS = [
  { id: 11, name: 'Diplomacy & Negotiation', icon: '🤝', color: 'amber', desc: 'Multi-agent negotiation, alliance building, trade deals, conflict resolution' },
  { id: 12, name: 'Survival Arena', icon: '🏕️', color: 'emerald', desc: 'Resource management under pressure, triage, disaster response, survival strategy' },
  { id: 13, name: 'Data Science Dojo', icon: '📊', color: 'violet', desc: 'Statistical analysis, data cleaning, visualization, hypothesis testing, anomaly detection' },
  { id: 14, name: 'Ethics Engine', icon: '⚖️', color: 'slate', desc: 'Moral dilemmas, trolley problems, policy analysis, stakeholder impact, fairness' },
  { id: 15, name: 'Speed Blitz', icon: '⚡', color: 'yellow', desc: 'Time-pressured tasks, rapid-fire Q&A, speed coding, quick math, instant categorization' },
  { id: 16, name: 'World Simulation', icon: '🌍', color: 'sky', desc: 'Economy simulation, population dynamics, climate modeling, city planning, ecosystem balance' },
  { id: 17, name: 'Cipher & Crypto', icon: '🔐', color: 'rose', desc: 'Encryption puzzles, code breaking, steganography, hash challenges, protocol analysis' },
  { id: 18, name: 'Teaching Arena', icon: '📚', color: 'lime', desc: 'Explain concepts to audiences, create tutorials, simplify complexity, analogies' },
  { id: 19, name: 'Multimodal Mind', icon: '🎭', color: 'fuchsia', desc: 'Cross-domain reasoning, synesthesia, format translation, schema mapping' },
  { id: 20, name: 'Battle Royale', icon: '👑', color: 'orange', desc: 'Multi-agent elimination, last-standing, escalating difficulty, king-of-the-hill' },
  { id: 21, name: 'Team Tactics', icon: '🎯', color: 'cyan', desc: 'Cooperative puzzles, role assignment, team strategy, relay challenges, synchronized solving' },
  { id: 22, name: 'Debug Detective', icon: '🔎', color: 'red', desc: 'Find the bug, trace the error, fix the logic, spot the regression, root cause analysis' },
  { id: 23, name: 'Knowledge Graph', icon: '🕸️', color: 'purple', desc: 'Entity extraction, relationship mapping, ontology building, fact verification' },
  { id: 24, name: 'Auction House', icon: '💰', color: 'gold', desc: 'Bidding strategy, valuation, market making, portfolio optimization, risk assessment' },
  { id: 25, name: 'Chaos Engineering', icon: '💥', color: 'zinc', desc: 'Fault injection response, graceful degradation, recovery planning, incident management' },
];

const EXISTING_PILLARS = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: ['Pattern & Perception','Code Combat','Language Arena','Reasoning Gauntlet','Strategy & Planning',
         'Adversarial Ops','Memory Vault','Math Colosseum','Creativity Forge','Meta-Mind'][i],
  existing: 10, target: 40,
}));

// ─── Game Generation ───────────────────────────────────────
function buildPrompt(pillarName, pillarDesc, batchNum, batchSize, existing = []) {
  const existingList = existing.length > 0 ? `\nEXISTING GAMES (do NOT duplicate): ${existing.join(', ')}\n` : '';

  return `You generate arena games for SporeAgent Arena — AI agents compete in these games.

PILLAR: "${pillarName}" — ${pillarDesc}
${existingList}
Generate EXACTLY ${batchSize} NEW unique games. Each uses the textGame() factory pattern.

RULES:
- Game IDs: snake_case, unique, descriptive (e.g. "neural_poker", "syntax_sprint")
- 2-4 prompt functions using difficulty d (1-10) and round r
- Scoring must be deterministic — use: wc(s), has(s, keywords[]), codeScore(s), reasonScore(s), creativeScore(s), precisionScore(s, ideal), mathScore(s), clamp(n)
- Include format comment: // format: solo | duel_1v1 | team_2v2 | battle_royale
- Make each game test a DIFFERENT skill

CRITICAL: Output ONLY raw TypeScript code. NO markdown fences (no \`\`\`). NO explanations. NO comments except format tags. Start directly with the first game_id:

game_id: textGame({
  // format: solo
  prompts: [
    (d, r) => \`Prompt using difficulty \${d} round \${r}\`,
    (d, r) => \`Second variant\`,
  ],
  score: (answer, d) => {
    let sc = 0;
    // scoring logic
    return clamp(sc);
  },
  deadline: 120,
}),

Generate ${batchSize} games now. Be creative and varied.`;
}

function extractGames(output) {
  const cleaned = output.replace(/```\w*\n?/g, '').replace(/```/g, '');
  const pattern = /(\w+):\s*textGame\(\{[\s\S]*?\}\s*\),/g;
  const games = [];
  let match;
  while ((match = pattern.exec(cleaned)) !== null) {
    games.push({ id: match[1], code: match[0] });
  }
  return games;
}

function printDashboard() {
  const elapsed = (Date.now() - startTime) / 1000;
  const pace = totalGamesGenerated / (elapsed / 60);
  const remaining = 896 - totalGamesGenerated;
  const eta = pace > 0 ? (remaining / pace).toFixed(0) : '??';

  console.log(`\n┌───────────────────────────────────────┐`);
  console.log(`│  🏭 GAME FACTORY — ${totalGamesGenerated}/896 (${(totalGamesGenerated/896*100).toFixed(1)}%)`);
  console.log(`│  ⚡ ${pace.toFixed(1)} games/min | ETA: ${eta} min`);
  console.log(`│  📊 ${(totalTokensIn/1000).toFixed(1)}k in / ${(totalTokensOut/1000).toFixed(1)}k out`);
  console.log(`│  🎰 ${modelFailCounts.size}/${MODELS.length} models rate-limited`);
  console.log(`└───────────────────────────────────────┘\n`);
}

// ─── State ─────────────────────────────────────────────────
function loadState() {
  if (existsSync(STATE_FILE)) return JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  return { completedPillars: [], gamesGenerated: 0 };
}
function saveState(state) { writeFileSync(STATE_FILE, JSON.stringify(state, null, 2)); }

// ─── Write Pillar File ─────────────────────────────────────
function writePillarFile(pillarId, pillarName, icon, color, games) {
  mkdirSync(OUT_DIR, { recursive: true });
  const varName = `P${pillarId}_EXT`;
  const content = `// Auto-generated — Pillar ${pillarId}: ${pillarName} (${games.length} games)
// Generated ${new Date().toISOString()}
import type { GameEngine, RoundPrompt, ScoreResult } from '../engine.js';
import type { ArenaMatch, ArenaChallenge } from '../../types.js';

function wc(s: string): number { return s.trim().split(/\\s+/).filter(Boolean).length; }
function has(s: string, kw: string[]): number { const l = s.toLowerCase(); return kw.filter(k => l.includes(k)).length; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function clamp(n: number): number { return Math.max(0, Math.min(100, Math.round(n))); }
function codeScore(s: string): number { let sc = 0; if (s.includes('function') || s.includes('=>')) sc += 20; if (s.includes('return')) sc += 15; if (s.includes('{')) sc += 10; if (s.length > 20) sc += 15; if (s.length > 100) sc += 10; return clamp(sc + rand(5, 20)); }
function reasonScore(s: string): number { const m = ['therefore','because','since','thus','hence','if','then','given','conclude','follows','implies']; let sc = has(s, m) * 7; if (wc(s) > 30) sc += 15; if (wc(s) > 80) sc += 10; return clamp(sc + rand(5, 20)); }
function creativeScore(s: string): number { const u = new Set(s.toLowerCase().split(/\\s+/)); let sc = Math.min(40, u.size); if (wc(s) > 20) sc += 15; return clamp(sc + rand(5, 20)); }
function precisionScore(s: string, ideal: number): number { const len = wc(s); if (len === 0) return 0; return clamp(100 - Math.abs(len - ideal) * 3); }
function mathScore(s: string): number { let sc = 0; if (/\\d/.test(s)) sc += 20; if (s.includes('=') || s.includes('+')) sc += 15; if (has(s, ['therefore','thus','equals','answer','result','solution']) > 0) sc += 15; if (wc(s) > 10) sc += 15; return clamp(sc + rand(10, 25)); }

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
      return { score, feedback: \`Score: \${score}/100\`, round_complete: true, game_complete: rn >= 3, updated_round_data: [...(match.round_data || []), { score, answer: (answer || '').slice(0, 200) }] };
    },
  };
}

export const ${varName}: Record<string, GameEngine> = {
${games.map(g => g.code).join('\n\n')}
};

export const P${pillarId}_META = { name: '${pillarName}', icon: '${icon}', color: 'text-${color}-400', games: Object.keys(${varName}) };
`;
  const filename = `pillar-${String(pillarId).padStart(2, '0')}.ts`;
  writeFileSync(join(OUT_DIR, filename), content);
  console.log(`  📁 Wrote ${filename} (${games.length} games)`);
}

// ─── Main ──────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const resumeMode = args.includes('--resume');
  const pillarIdx = args.indexOf('--pillar');
  const specificPillar = pillarIdx >= 0 ? parseInt(args[pillarIdx + 1]) : null;

  const state = resumeMode ? loadState() : { completedPillars: [], gamesGenerated: 0 };
  totalGamesGenerated = state.gamesGenerated;

  console.log('🏭 SporeAgent Game Factory');
  console.log(`📊 Target: 1,000 games (${896 - totalGamesGenerated} remaining)`);
  console.log(`🎰 Models: ${MODELS.length} in roulette\n`);

  mkdirSync(OUT_DIR, { recursive: true });

  // Phase 1: Expand existing pillars P1-P10 (30 new each = 300)
  for (const p of EXISTING_PILLARS) {
    if (specificPillar && p.id !== specificPillar) continue;
    if (state.completedPillars.includes(p.id)) { console.log(`⏭️  P${p.id} done`); continue; }

    const batchSize = 10;
    const needed = p.target - p.existing;
    const allGames = [];

    console.log(`\n🎮 P${p.id}: ${p.name} — generating ${needed} new games`);

    for (let b = 0; b < Math.ceil(needed / batchSize); b++) {
      const size = Math.min(batchSize, needed - allGames.length);
      console.log(`  📦 Batch ${b + 1} (${size} games)...`);
      try {
        const output = await callOpenRouter(buildPrompt(p.name, `Extended ${p.name} games`, b + 1, size, allGames.map(g => g.id)));
        const games = extractGames(output);
        if (games.length > 0) { allGames.push(...games); totalGamesGenerated += games.length; console.log(`  ✅ ${games.length} games`); }
        else { console.log(`  ⚠️  No games extracted, retrying...`); b--; await sleep(3000); }
      } catch (e) { console.error(`  ❌ ${e.message}`); await sleep(5000); }
      await sleep(1500);
      if ((b + 1) % 3 === 0) printDashboard();
    }

    if (allGames.length > 0) {
      writePillarFile(p.id, p.name, '🔄', 'gray', allGames);
      state.completedPillars.push(p.id);
      state.gamesGenerated = totalGamesGenerated;
      saveState(state);
    }
  }

  // Phase 2: New pillars P11-P25 (40 each = 600)
  for (const p of NEW_PILLARS) {
    if (specificPillar && p.id !== specificPillar) continue;
    if (state.completedPillars.includes(p.id)) { console.log(`⏭️  P${p.id} done`); continue; }

    const batchSize = 10;
    const allGames = [];

    console.log(`\n🎮 P${p.id}: ${p.name} — generating 40 games`);

    for (let b = 0; b < 4; b++) {
      console.log(`  📦 Batch ${b + 1}/4 (10 games)...`);
      try {
        const output = await callOpenRouter(buildPrompt(p.name, p.desc, b + 1, 10, allGames.map(g => g.id)));
        const games = extractGames(output);
        if (games.length > 0) { allGames.push(...games); totalGamesGenerated += games.length; console.log(`  ✅ ${games.length} games`); }
        else { console.log(`  ⚠️  Retry...`); b--; await sleep(3000); }
      } catch (e) { console.error(`  ❌ ${e.message}`); await sleep(5000); }
      await sleep(1500);
      if ((b + 1) % 2 === 0) printDashboard();
    }

    if (allGames.length > 0) {
      writePillarFile(p.id, p.name, p.icon, p.color, allGames);
      state.completedPillars.push(p.id);
      state.gamesGenerated = totalGamesGenerated;
      saveState(state);
    }
  }

  printDashboard();
  console.log('✅ Game Factory complete!');

  // Write integration index
  const allPillars = [...EXISTING_PILLARS, ...NEW_PILLARS];
  const indexContent = allPillars.map(p =>
    `export { P${p.id}_EXT, P${p.id}_META } from './pillar-${String(p.id).padStart(2, '0')}.js';`
  ).join('\n');
  writeFileSync(join(OUT_DIR, 'index.ts'), `// Auto-generated index\n${indexContent}\n`);
  console.log('📁 Wrote generated/index.ts');
}

main().catch(e => { console.error('💀', e); process.exit(1); });
