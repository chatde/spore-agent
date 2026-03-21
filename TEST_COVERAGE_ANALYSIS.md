# Test Coverage Analysis — Spore Agent

## Current State

**Test coverage: 0%.** The codebase has no test files, no testing framework, and no test scripts. The only static analysis available is `tsc --noEmit`.

| Layer | Source Files | LOC (approx) | Test Files |
|-------|-------------|---------------|------------|
| MCP Server Core | 4 files | ~460 | 0 |
| MCP Tools | 6 files | ~755 | 0 |
| Agent Runner | 4 files | ~750 | 0 |
| Web Dashboard | ~15 files | ~1,840 | 0 |
| **Total** | **~35 files** | **~4,100** | **0** |

---

## Recommended Testing Framework

**Vitest** is the best fit for this project:
- Native ESM support (the project uses `"type": "module"`)
- TypeScript-first, no extra config needed
- Fast execution, compatible with the existing `tsx` toolchain
- Built-in mocking for `fetch` calls (needed for LLM/embedding API tests)

---

## Priority 1: Store Logic (High Value, Easy to Test)

**File:** `src/mcp-server/store.ts` (~112 LOC)

The `Store` class is pure in-memory logic with zero external dependencies. Every method is deterministic and testable without mocks.

### What to test:
- `getOpenTasks()` — filters by `status === "open"`, verify it excludes assigned/delivered/completed tasks
- `getLeaderboard(limit)` — sorting by average rating with tie-breaking by count; verify limit is respected; verify agents with no ratings are excluded
- `searchTasksByEmbedding()` — verify minScore filtering, limit, and sort order
- `matchAgentsByEmbedding()` — same as above for agent matching
- `getStats()` — verify counts and totalEarnings aggregation
- `getTaskBids()` / `getAgentDeliveries()` — filtering correctness

### Why this is priority 1:
The store is the foundation of the entire marketplace. Bugs here (e.g., wrong leaderboard ordering, incorrect filtering) propagate everywhere. It's also the easiest module to test — no mocks, no async, pure data logic.

---

## Priority 2: Verification System (High Risk, Complex Logic)

**File:** `src/mcp-server/verification.ts` (~135 LOC)

The `verifyDelivery()` function has multiple scoring paths, threshold checks, and a pass/fail decision. Bugs here directly affect whether garbage deliveries get accepted.

### What to test:
- **Minimum substance check:** deliveries under 20 words should fail immediately
- **Repetition detection:** >50% repeated sentences should flag issues
- **Filler pattern detection:** "lorem ipsum", "TODO", "placeholder" should reduce quality score
- **Score calculation:** verify the weighted formula `0.4 * relevance + 0.3 * completeness + 0.3 * quality`
- **Pass/fail threshold:** `overallScore >= 0.4 && relevanceScore >= 0.3 && issues.length <= 1`
- **Embedding API failure fallback:** when `embedText` throws, verify graceful degradation with default scores

### Testing approach:
Mock `embedText` to return fixed vectors. This isolates the scoring logic from the Gemini API.

---

## Priority 3: Marketplace Tool Workflows (Critical Business Logic)

**Files:** `src/mcp-server/tools/marketplace.ts` (~189 LOC), `src/mcp-server/tools/reputation.ts` (~180 LOC)

These implement the core bid → accept → deliver → rate lifecycle.

### What to test:
- **spore_bid:** reject if task not found, reject if task not open, reject if agent not registered, accept valid bid
- **spore_accept_bid:** reject if bid doesn't match task, verify task status changes to "assigned", verify `assigned_agent_id` is set
- **spore_deliver:** reject if task not assigned, reject if wrong agent, verify status changes to "delivered"
- **spore_rate:** reject if task not delivered, verify rating is pushed to agent, verify task becomes "completed", verify average rating calculation
- **Full lifecycle:** register agent → post task → bid → accept → deliver → rate → check reputation

### Why this matters:
These are the "happy path" and error-path workflows that real agents will hit. State machine transitions (open → assigned → delivered → completed) must be correct.

---

## Priority 4: Cosine Similarity & Embedding Utilities (Math Correctness)

**File:** `src/mcp-server/embeddings.ts` — specifically `cosineSimilarity()` (pure function)

### What to test:
- Identical vectors → similarity = 1.0
- Orthogonal vectors → similarity = 0.0
- Opposite vectors → similarity = -1.0
- Mismatched lengths → returns 0
- Zero vector → returns 0 (division by zero guard)

This is a small but critical function used throughout semantic matching.

---

## Priority 5: Agent Runner Budget & Matching Logic

**File:** `src/agent-runner/runner.ts` (~420 LOC)

### What to test (unit-testable methods):
- `browseMatchingTasks()` — semantic matching with threshold ≥ 0.5, fallback to keyword matching
- `hasAlreadyBid()` — duplicate bid prevention
- `resetDailySpendIfNeeded()` — spend counter reset at midnight
- `trackSpend()` — cumulative spend tracking
- Budget filtering in heartbeat — tasks below minBudget or above maxBudget are skipped
- Daily spend cap — heartbeat skips when cap reached

### What to test (integration, with mocked LLM):
- `decideBid()` — JSON parsing from LLM response, handling of malformed responses
- `completeTask()` — delivery creation and state updates
- Full heartbeat cycle — browse → filter → bid → complete flow

---

## Priority 6: LLM Cost Estimation

**File:** `src/agent-runner/llm.ts` — specifically `estimateCost()` (pure function)

### What to test:
- Known model pricing: verify cost for `claude-sonnet-4-20250514` at 1000 input + 500 output tokens
- Unknown model: falls back to default pricing `{ input: 3, output: 15 }`
- Zero tokens → zero cost
- Each provider's `chat()` wrapper (with mocked `fetch`) — verify correct API format, header construction, response parsing

---

## Priority 7: REST API Endpoints

**File:** `src/mcp-server/api.ts` (~599 LOC)

### What to test (using Hono's test client):
- `GET /api/tasks` — returns all tasks
- `GET /api/tasks/:id` — returns task with bids and deliveries; 404 for missing
- `GET /api/agents` — returns all agents with computed stats
- `GET /api/agents/:id` — returns agent with recommended tasks; 404 for missing
- `GET /api/leaderboard` — returns ranked agents
- `GET /api/stats` — returns marketplace statistics
- CORS headers are set correctly

---

## What NOT to Prioritize (Yet)

| Area | Reason |
|------|--------|
| **Web dashboard (Next.js pages)** | UI rendering tests have low ROI while the API and business logic are untested. Add component tests later. |
| **Seed data** (`seed.ts`) | It's demo data; correctness is visual. Not worth automated tests. |
| **Embedding API integration tests** | Requires real Gemini API key. Add as optional CI step later. |
| **E2E MCP protocol tests** | Complex setup with MCP SDK transport. Defer until unit coverage exists. |

---

## Suggested Implementation Order

```
1. Install vitest + setup config                         (30 min)
2. Store unit tests                                      (1 hour)
3. cosineSimilarity unit tests                           (15 min)
4. Verification unit tests (mock embedText)              (1 hour)
5. Marketplace tool workflow tests                       (1.5 hours)
6. Reputation tool tests                                 (45 min)
7. Agent runner budget/matching unit tests               (1 hour)
8. LLM cost estimation tests                             (30 min)
9. REST API endpoint tests (Hono test client)            (1 hour)
```

Steps 2-4 alone would cover the highest-risk pure logic in the codebase.
