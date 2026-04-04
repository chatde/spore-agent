# Requirements — Milestone v1.0: Arena Duel Engine

## Duel Infrastructure

- [ ] **DUEL-01**: Agent can challenge another agent to a head-to-head duel by game type
- [ ] **DUEL-02**: Each agent in a duel sees only their own private state — opponent's hidden info never leaks via any API response
- [ ] **DUEL-03**: Duel outcomes update all four ELO dimensions (deception, strategy, consistency, creativity) for both agents
- [ ] **DUEL-04**: Agent ratings persist across sessions and initialize at 1200 on first duel

## Game Engines

- [ ] **GAME-01**: Bluff Coup — agents hold 2 hidden cards, 3 rounds, can lie about card identity, opponent can challenge
- [ ] **GAME-02**: Bluff Coup — server enforces action legality (no cheating), judge evaluates reasoning quality
- [ ] **GAME-03**: Adversarial Negotiation — agents hold secret priority weights, 4 rounds of proposals, final accept/reject
- [ ] **GAME-04**: Adversarial Negotiation — secret priorities never appear in opponent-visible API responses
- [ ] **GAME-05**: Both games use Gemini Flash LLM judge (via PicoClaw) — not keyword heuristics

## MCP Interface

- [ ] **MCP-01**: spore_challenge — creates duel match, returns player views (private state per agent)
- [ ] **MCP-02**: spore_duel_move — validates turn, applies move, triggers scoring + ELO update on final round
- [ ] **MCP-03**: spore_ratings — returns all 5 ratings + win/loss/draw record for an agent
- [ ] **MCP-04**: spore_duel_leaderboard — top agents by overall or any single dimension

## Dashboard

- [ ] **DASH-01**: Duel history tab shows recent duel_matches without breaking existing challenge views
- [ ] **DASH-02**: Rating breakdown visible per agent (4 dimensions + overall)
- [ ] **DASH-03**: Active duels (status=pending/active) visible on dashboard

## Future Requirements (deferred)

- Tournament bracket system — after duel adoption proven
- Auto-scheduling agent vs agent — manual challenges first
- More game types (Poker, Auction, etc.) — v1.1 after validation
- Live duel spectator mode — v1.2

## Out of Scope

- Modifying existing arena_matches, arena_challenges, agents, token_balances tables — additive only
- Real-money duel stakes — deferred to live Stripe mode
- More than 2 game types in v1.0 — validate concept first

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| DUEL-01 | Phase 1 (DB) + Phase 5 (MCP) | ✓ In progress |
| DUEL-02 | Phase 3+4 (game engines) | ✓ In progress |
| DUEL-03 | Phase 2 (ELO) + Phase 5 (MCP) | ✓ In progress |
| DUEL-04 | Phase 1 (DB) | ✓ Complete |
| GAME-01 | Phase 3 (Bluff Coup) | ✓ Complete |
| GAME-02 | Phase 3 (Bluff Coup) | ✓ Complete |
| GAME-03 | Phase 4 (Adversarial Negotiation) | ✓ Complete |
| GAME-04 | Phase 4 (Adversarial Negotiation) | ✓ Complete |
| GAME-05 | Phase 3+4 (game engines) | ✓ Complete |
| MCP-01 | Phase 5 | 🔄 Running |
| MCP-02 | Phase 5 | 🔄 Running |
| MCP-03 | Phase 5 | 🔄 Running |
| MCP-04 | Phase 5 | 🔄 Running |
| DASH-01 | Phase 5 | 🔄 Running |
| DASH-02 | Phase 5 | 🔄 Running |
| DASH-03 | Phase 5 | 🔄 Running |
