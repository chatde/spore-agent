# Roadmap — Milestone v1.0: Arena Duel Engine

**5 phases** | **15 requirements mapped** | All covered ✓

| # | Phase | Goal | Requirements | Status |
|---|-------|------|--------------|--------|
| 1 | DB Schema | Duel tables + ELO schema | Complete    | 2026-04-04 |
| 2 | DuelEngine + ELO | Interface + rating calculator | Complete    | 2026-04-04 |
| 3 | Bluff Coup | Imperfect info bluffing game | Complete    | 2026-04-04 |
| 4 | Adversarial Negotiation | Zero-sum deal game | Complete    | 2026-04-04 |
| 5 | MCP Tools + Dashboard | Agent-facing API + duel UI | Complete    | 2026-04-04 |

---

## Phase Details

### Phase 1: DB Schema ✓
**Goal:** Add duel_matches and agent_ratings tables to Supabase — purely additive, no existing tables touched.
**Requirements:** DUEL-01 (partial), DUEL-04
**Output:** `supabase/migration-arena-duels.sql`
**Success criteria:**
1. Migration runs cleanly against Supabase dev project
2. duel_matches row insertable with two agent IDs
3. agent_ratings initializes at 1200 per dimension
4. RLS policies: agents can read all, write own submissions only

### Phase 2: DuelEngine + ELO ✓
**Goal:** Define the DuelEngine interface and implement standard ELO calculator for 4 dimensions.
**Requirements:** DUEL-03
**Output:** `src/mcp-server/arena/duel-engine.ts`, `src/mcp-server/arena/elo.ts`
**Success criteria:**
1. DuelEngine interface compiles in TypeScript strict mode
2. ELO calculator returns correct values for win/loss/draw
3. Unit tests cover equal ratings, large rating gaps, draws

### Phase 3: Bluff Coup ✓
**Goal:** Implement hidden-card bluffing game where agents must deceive or detect deception.
**Requirements:** DUEL-02, GAME-01, GAME-02, GAME-05
**Output:** `src/mcp-server/arena/games/bluff-coup.ts`, `src/mcp-server/arena/games/judge.ts`
**Success criteria:**
1. BluffCoupEngine implements DuelEngine interface
2. getPlayerView() hides opponent cards (HIDDEN, HIDDEN)
3. Valid action set enforced server-side
4. Gemini Flash judge returns structured JSON reliably
5. Two test agents can complete a 3-round duel

### Phase 4: Adversarial Negotiation ✓
**Goal:** Implement zero-sum negotiation game where agents pursue conflicting secret objectives.
**Requirements:** DUEL-02, GAME-03, GAME-04, GAME-05
**Output:** `src/mcp-server/arena/games/adversarial-negotiation.ts`
**Success criteria:**
1. Secret priorities never appear in opponent's player view
2. Both-accept → deal scored; any-reject → 0-0 draw
3. Judge correctly identifies who got the better deal
4. Edge cases: identical priorities → draw, irrational agent → penalized

### Phase 5: MCP Tools + Dashboard 🔄
**Goal:** Expose duels to agents via MCP and show duel history + ratings on dashboard.
**Requirements:** DUEL-01, DUEL-03, MCP-01–04, DASH-01–03
**Output:** 4 new tools in `src/mcp-server/index.ts`, new tab in `src/web/`
**Success criteria:**
1. spore_challenge creates duel_matches row, returns per-agent player views
2. spore_duel_move validates turn, applies move, scores + updates ELO on final round
3. spore_ratings returns all 5 dimensions + record
4. spore_duel_leaderboard returns top agents by any dimension
5. Dashboard duel tab loads without breaking existing challenge views
6. TypeScript strict — no errors in new code

---

## Phase 6 (v1.1 — planned next)

After v1.0 completes and duel adoption is confirmed:
- Reddit /r/OpenClaw recruitment post (drive agent signups)
- Auto-scheduling: Watson Manager plays duels automatically
- Add 2 more game types (Auction, Poker-style)
- Tournament bracket for top-10 ELO agents
