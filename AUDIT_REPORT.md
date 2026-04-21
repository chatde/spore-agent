# Spore Agent — Project Audit Report

**Date:** 2026-03-22

---

## 1. Security Audit

### CRITICAL

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| S1 | **API keys in URL query params** | `embeddings.ts:39,66,111` | Gemini API key logged by proxies, CDNs, browser history |
| S2 | **Wildcard CORS** | `api.ts:23` — `app.use("/*", cors())` | Any website can make requests to the API; enables CSRF and data theft |
| S3 | **No authentication on any endpoint** | `api.ts:273-353` | Anyone can accept bids, deliver work, rate agents on any task |

### HIGH

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| S4 | **Agent ID spoofing** | `api.ts:250,301`, `marketplace.ts:22-73` | `agent_id` comes from request body — anyone can impersonate any agent |
| S5 | **Prompt injection** | `runner.ts:140-161,213-227` | Task title/description injected directly into LLM prompts with no sanitization |
| S6 | **Unsafe JSON parsing of LLM output** | `runner.ts:183` | `JSON.parse()` + `as BidDecision` with no schema validation |
| S7 | **No input bounds** | `api.ts:45,68,160` | `parseInt(query)` with no upper bound; `?limit=999999999` causes resource waste |

### MEDIUM

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| S8 | No size limit on delivery results | `api.ts:309` | Memory exhaustion via massive payloads |
| S9 | No input validation on task creation | `api.ts:209-211` | No length limits, no budget validation (negative values accepted) |
| S10 | No rate limiting | `api.ts` (all endpoints) | Brute force, spam, DoS |
| S11 | No CSP headers | `layout.tsx` | XSS risk on web dashboard |

### Recommendations
1. Move Gemini key to `Authorization` header
2. Lock CORS to specific origins: `cors({ origin: ["https://sporeagent.com"] })`
3. Add JWT or session-based auth; derive `agent_id` from token, not request body
4. Validate all inputs with Zod schemas (max lengths, bounded numbers, no negative budgets)
5. Sanitize task content before injecting into LLM prompts
6. Validate LLM JSON output against a Zod schema before using it
7. Add rate limiting middleware

---

## 2. Code Quality & Reliability

### CRITICAL — Data Isolation

The web dashboard and MCP server maintain **completely separate in-memory stores**:
- MCP server: `src/mcp-server/store.ts`
- Web app: `src/web/src/lib/store.ts`

Tasks posted via web are invisible to MCP agents and vice versa. This breaks the core marketplace functionality.

### CRITICAL — Missing Web API Endpoints

The Next.js API proxy (`src/web/src/app/api/[...path]/route.ts`) is missing POST handlers for:
- `accept-bid`
- `deliver`
- `rate`
- `verify`

The client (`src/web/src/lib/api.ts`) calls these, so they'll all 404.

### HIGH — Race Conditions

All store mutations are unsynchronized:
```
store.tasks.set(...)
store.bids.set(...)
agent.ratings.push(...)  // direct mutation
```
Two concurrent `accept-bid` requests on the same task will both succeed. No locking or atomic operations.

### HIGH — Interval Leak in Agent Runner

`runner.ts:397` — calling `start()` twice creates two intervals without clearing the first. Add a guard:
```typescript
if (this.timer) clearInterval(this.timer);
```

### MEDIUM — Division by Zero Risk

Rating average calculated without guarding `ratings.length > 0` in:
- `api.ts:343` (rate endpoint)
- `api.ts:556` (leaderboard endpoint)
- `index.ts:108` (MCP leaderboard resource)

`store.getLeaderboard()` filters for `ratings.length > 0`, but downstream code recalculates without the guard.

### MEDIUM — Swallowed Errors

4 locations silently catch and discard errors:
- `api.ts:228-230` — embedding failure during task creation
- `api.ts:535-537` — embedding failure during agent registration
- `embeddings.ts:19-21` — `.env` file read failure
- `runner.ts:399-401` — heartbeat errors lose stack traces

### MEDIUM — Non-Null Assertions Without Safety

- `api.ts:330` — `store.agents.get(task.assigned_agent_id!)` — will crash if `assigned_agent_id` is undefined
- `runner.ts:196,246` — `this.state.agentId!` — will crash if registration failed

### LOW — Code Duplication

Rating average calculation is duplicated in 5+ locations across `api.ts`, `route.ts`, and `server-api.ts`. Extract to a shared utility:
```typescript
function avgRating(ratings: Rating[]): number {
  if (ratings.length === 0) return 0;
  return ratings.reduce((s, r) => s + r.rating, 0) / ratings.length;
}
```

### LOW — Growing Collections Without Cleanup

All in-memory Maps grow indefinitely. No task archival, bid cleanup after completion, or delivery pruning. Long-running instances will exhaust memory.

---

## 3. Dependencies & Configuration

### HIGH — Missing `.env.example`

No documentation of required environment variables. Create:
```
# .env.example
GEMINI_API_KEY=your_key_here
PORT=3456
```
```
# src/web/.env.local.example
NEXT_PUBLIC_API_URL=http://localhost:3456
```

### MEDIUM — Version Misalignment

| Package | Root | Web | Issue |
|---------|------|-----|-------|
| `@types/node` | ^25.5.0 | ^20 | 5 major versions apart |
| TypeScript | ^5.9.3 | ^5 | Minor gap |
| ES target | ES2022 | ES2017 | Web targeting older JS |

### MEDIUM — No Node.js Version Constraint

No `engines` field in either `package.json`. Add:
```json
"engines": { "node": ">=20.0.0" }
```

### LOW — No Root ESLint

ESLint is configured for the web app but not for the MCP server or agent runner code.

### LOW — Empty Next.js Config

`src/web/next.config.ts` is empty — no security headers, compression, or caching configured for production.

---

## 4. Summary of Priorities

### Must Fix Before Production
1. **Add authentication** — no endpoint is protected today
2. **Fix CORS** — wildcard allows any origin
3. **Unify data stores** — web and MCP see different data
4. **Implement missing POST endpoints** in web API proxy
5. **Move API key out of URL params** — use headers instead
6. **Add input validation** with Zod on all endpoints

### Should Fix Soon
7. Add concurrency guards (mutex or queue) for state mutations
8. Fix interval leak in agent runner
9. Guard against division by zero in rating calculations
10. Validate LLM JSON output with schemas
11. Sanitize task content before prompt injection
12. Add `.env.example` files
13. Align dependency versions

### Nice to Have
14. Add rate limiting
15. Add CSP headers
16. Extract duplicated rating logic to shared utility
17. Add root ESLint config
18. Configure Next.js for production (headers, caching)
19. Add collection cleanup / TTL for in-memory store
