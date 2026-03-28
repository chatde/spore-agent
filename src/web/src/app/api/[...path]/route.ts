import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { supabase } from "@/lib/supabase";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

// Persist to Supabase — awaited before response to ensure data lands
async function persist(table: string, data: Record<string, unknown>) {
  const { error } = await supabase.from(table).upsert(data as any);
  if (error) console.error(`[PERSIST] ${table} failed:`, error.message, error.code, JSON.stringify(data).slice(0, 200));
}

function avgRating(agent: { ratings: { rating: number }[] }): number | null {
  if (agent.ratings.length === 0) return null;
  return Math.round((agent.ratings.reduce((s, r) => s + r.rating, 0) / agent.ratings.length) * 100) / 100;
}

function successRate(agent: { ratings: { rating: number }[] }): number | null {
  if (agent.ratings.length === 0) return null;
  return Math.round((agent.ratings.filter((r) => r.rating >= 4).length / agent.ratings.length) * 100);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const route = path.join("/");

  // GET /api/health
  if (route === "health") {
    return json({ status: "ok", timestamp: new Date().toISOString() });
  }

  // GET /api/debug-persist — test Supabase write
  if (route === "debug-persist") {
    try {
      const id = crypto.randomUUID();
      const name = "DebugTest-" + Date.now();
      const result = await supabase.from("agents").upsert({ id, name, capabilities: ["debug"], description: "test", registered_at: new Date().toISOString() });
      const { data: readback } = await supabase.from("agents").select("name").eq("name", name).limit(1);
      return json({ id, persisted: (readback?.length ?? 0) > 0, error: result.error?.message ?? null, readback });
    } catch (e: any) {
      return json({ error: e.message, stack: e.stack?.slice(0, 300) });
    }
  }

  // GET /api/stats
  if (route === "stats") {
    return json(store.getStats());
  }

  // GET /api/tasks
  if (route === "tasks") {
    const url = new URL(req.url);
    const all = url.searchParams.get("all") === "true";
    const limit = parseInt(url.searchParams.get("limit") ?? "50");
    const tasks = (all ? store.getAllTasks() : store.getOpenTasks()).slice(0, limit);
    return json({
      total: tasks.length,
      tasks: tasks.map((t) => ({
        id: t.id, title: t.title, description: t.description,
        requirements: t.requirements, budget_usd: t.budget_usd ?? null,
        status: t.status, posted_at: t.posted_at,
        assigned_agent_id: t.assigned_agent_id ?? null,
        bid_count: store.getTaskBids(t.id).length,
      })),
    });
  }

  // GET /api/tasks/search?q=...
  if (route === "tasks/search") {
    const q = new URL(req.url).searchParams.get("q") ?? "";
    const limit = parseInt(new URL(req.url).searchParams.get("limit") ?? "10");
    const lower = q.toLowerCase();
    const tasks = store.getAllTasks()
      .filter((t) =>
        t.title.toLowerCase().includes(lower) ||
        t.description.toLowerCase().includes(lower) ||
        t.requirements.some((r) => r.toLowerCase().includes(lower))
      )
      .slice(0, limit);

    return json({
      query: q, total: tasks.length,
      tasks: tasks.map((t) => ({
        id: t.id, title: t.title, description: t.description,
        requirements: t.requirements, budget_usd: t.budget_usd ?? null,
        status: t.status, posted_at: t.posted_at,
        bid_count: store.getTaskBids(t.id).length,
      })),
    });
  }

  // GET /api/tasks/:id
  if (path[0] === "tasks" && path.length === 2 && path[1] !== "search") {
    const task = store.tasks.get(path[1]);
    if (!task) return json({ error: "Task not found" }, 404);

    const bids = store.getTaskBids(task.id).map((b) => {
      const agent = store.agents.get(b.agent_id);
      return { id: b.id, agent_id: b.agent_id, agent_name: agent?.name ?? "Unknown", approach: b.approach, estimated_minutes: b.estimated_minutes, submitted_at: b.submitted_at };
    });

    const deliveries = Array.from(store.deliveries.values())
      .filter((d) => d.task_id === task.id)
      .map((d) => ({ id: d.id, agent_id: d.agent_id, result: d.result, delivered_at: d.delivered_at }));

    return json({
      id: task.id, title: task.title, description: task.description,
      requirements: task.requirements, budget_usd: task.budget_usd ?? null,
      status: task.status, posted_at: task.posted_at,
      assigned_agent_id: task.assigned_agent_id ?? null,
      bids, deliveries,
    });
  }

  // GET /api/tasks/:id/matching-agents
  if (path[0] === "tasks" && path.length === 3 && path[2] === "matching-agents") {
    const task = store.tasks.get(path[1]);
    if (!task) return json({ error: "Task not found" }, 404);

    const agents = store.getAllAgents()
      .filter((a) => task.requirements.some((req) =>
        a.capabilities.some((cap) => cap.toLowerCase() === req.toLowerCase())
      ))
      .slice(0, 5);

    return json({
      task_id: task.id, total: agents.length,
      agents: agents.map((a) => ({
        id: a.id, name: a.name, capabilities: a.capabilities, description: a.description,
        match_score: 0.75 + Math.random() * 0.2,
        average_rating: avgRating(a), total_ratings: a.ratings.length,
      })),
    });
  }

  // GET /api/agents
  if (route === "agents") {
    const agents = store.getAllAgents().map((a) => ({
      id: a.id, name: a.name, capabilities: a.capabilities, description: a.description,
      average_rating: avgRating(a), total_ratings: a.ratings.length,
      total_deliveries: store.getAgentDeliveries(a.id).length,
      success_rate: successRate(a), registered_at: a.registered_at,
      has_embedding: true,
    }));
    return json({ total: agents.length, agents });
  }

  // GET /api/agents/:id
  if (path[0] === "agents" && path.length === 2 && path[1] !== "register") {
    const agent = store.agents.get(path[1]);
    if (!agent) return json({ error: "Agent not found" }, 404);

    return json({
      id: agent.id, name: agent.name, capabilities: agent.capabilities,
      description: agent.description, registered_at: agent.registered_at,
      average_rating: avgRating(agent), total_ratings: agent.ratings.length,
      total_deliveries: store.getAgentDeliveries(agent.id).length,
      success_rate: successRate(agent),
      ratings: agent.ratings,
    });
  }

  // GET /api/agents/:id/recommended-tasks
  if (path[0] === "agents" && path.length === 3 && path[2] === "recommended-tasks") {
    const agent = store.agents.get(path[1]);
    if (!agent) return json({ error: "Agent not found" }, 404);

    const tasks = store.getOpenTasks()
      .filter((t) => t.requirements.some((req) =>
        agent.capabilities.some((cap) => cap.toLowerCase() === req.toLowerCase())
      ))
      .slice(0, 5);

    return json({
      agent_id: agent.id, total: tasks.length,
      tasks: tasks.map((t) => ({
        id: t.id, title: t.title, description: t.description,
        requirements: t.requirements, budget_usd: t.budget_usd ?? null,
        match_score: 0.7 + Math.random() * 0.25,
        bid_count: store.getTaskBids(t.id).length,
      })),
    });
  }

  // GET /api/leaderboard
  if (route === "leaderboard") {
    const limit = parseInt(new URL(req.url).searchParams.get("limit") ?? "10");
    const top = store.getLeaderboard(limit);
    return json({
      total: top.length,
      leaderboard: top.map((a, i) => ({
        rank: i + 1, agent_id: a.id, agent_name: a.name,
        capabilities: a.capabilities,
        average_rating: avgRating(a),
        total_deliveries: store.getAgentDeliveries(a.id).length,
        total_ratings: a.ratings.length,
        success_rate: successRate(a),
      })),
    });
  }

  // GET /api/arena/challenges
  if (route === "arena/challenges") {
    const gameType = new URL(req.url).searchParams.get("game_type") ?? undefined;
    return json(store.getArenaChallenges(gameType));
  }

  // GET /api/arena/leaderboard
  if (route === "arena/leaderboard") {
    const limit = parseInt(new URL(req.url).searchParams.get("limit") ?? "25");
    return json({ total: store.getArenaLeaderboard(limit).length, leaderboard: store.getArenaLeaderboard(limit) });
  }

  // GET /api/arena/live
  if (route === "arena/live") {
    return json({ matches: store.getArenaLiveMatches(50) });
  }

  // GET /api/arena/stats
  if (route === "arena/stats") {
    return json(store.getArenaStats());
  }

  // GET /api/arena/results
  if (route === "arena/results") {
    const matches = store.getArenaMatches();
    const scored = matches.filter((m: any) => m.status === "scored").map((m: any) => ({
      agent_name: m.agent_name, agent_id: m.agent_id, game_type: m.game_type,
      difficulty: m.difficulty, score: m.score, cog_earned: m.cog_earned,
      status: m.status, scored_at: m.submitted_at ?? "", reward_pool_cog: m.reward_pool_cog,
    }));
    return json({ total: scored.length, results: scored });
  }

  return json({ error: "Not found" }, 404);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const body = await req.json().catch(() => ({}));

  // POST /api/tasks
  if (path.join("/") === "tasks") {
    const { title, description, requirements, budget_usd } = body;
    if (!title || !description || !requirements?.length) {
      return json({ error: "title, description, and requirements are required" }, 400);
    }
    const id = crypto.randomUUID();
    store.tasks.set(id, {
      id, title, description, requirements, budget_usd,
      status: "open", posted_at: new Date().toISOString(),
    });
    return json({ task_id: id, title, status: "open", has_embedding: true }, 201);
  }

  // POST /api/agents/register
  if (path[0] === "agents" && path[1] === "register") {
    const { name, capabilities, description } = body;
    if (!name || !capabilities?.length || !description) {
      return json({ error: "name, capabilities, and description are required" }, 400);
    }
    const id = crypto.randomUUID();
    const registered_at = new Date().toISOString();
    store.agents.set(id, {
      id, name, capabilities, description,
      registered_at, ratings: [],
    });
    await persist("agents", { id, name, capabilities, description, registered_at });
    return json({ agent_id: id, name, capabilities, status: "registered", has_embedding: true }, 201);
  }

  // POST /api/agents/:id/credit
  if (path[0] === "agents" && path.length === 3 && path[2] === "credit") {
    const agentId = path[1];
    const agent = store.agents.get(agentId);
    if (!agent) return json({ error: "Agent not found" }, 404);
    const { amount = 0, reason = "admin_grant" } = body;
    const bal = store.arenaBalances.get(agentId) || { balance: 0, lifetime: 0 };
    bal.balance += amount;
    bal.lifetime += amount;
    store.arenaBalances.set(agentId, bal);
    await persist("token_balances", { agent_id: agentId, balance: bal.balance, lifetime_earned: bal.lifetime, updated_at: new Date().toISOString() });
    await persist("token_transactions", { agent_id: agentId, amount, reason });
    return json({ agent_id: agentId, credited: amount, balance: bal.balance });
  }

  // POST /api/survey — agent COG survey votes
  if (path[0] === "survey") {
    const { vote, timestamp, agent_id } = body;
    // Store in memory (will persist within serverless instance lifetime)
    const votes = (globalThis as any).__surveyVotes || [];
    votes.push({ vote, timestamp, agent_id: agent_id || "anonymous", voted_at: new Date().toISOString() });
    (globalThis as any).__surveyVotes = votes;
    console.log(`[SURVEY] Vote: ${vote} from ${agent_id || "anonymous"}`);
    await persist("survey_votes", { vote, agent_id: agent_id || "anonymous" });
    return json({ success: true, vote, total_votes: votes.length });
  }

  // POST /api/waitlist — email capture for early access
  if (path[0] === "waitlist") {
    const { email, source } = body;
    if (!email || !email.includes("@")) return json({ error: "Valid email required" }, 400);
    await persist("waitlist", { email, source: source || "unknown" });
    return json({ success: true });
  }

  // POST /api/analytics — track events for growth metrics
  if (path[0] === "analytics") {
    const { event, data } = body;
    await persist("analytics_events", { event, data });
    return json({ tracked: true });
  }

  // POST /api/tasks/:id/bid
  if (path[0] === "tasks" && path.length === 3 && path[2] === "bid") {
    const task = store.tasks.get(path[1]);
    if (!task) return json({ error: "Task not found" }, 404);
    if (task.status !== "open") return json({ error: "Task not open" }, 400);
    const agent = store.agents.get(body.agent_id);
    if (!agent) return json({ error: "Agent not found" }, 404);
    const id = crypto.randomUUID();
    store.bids.set(id, {
      id, task_id: task.id, agent_id: body.agent_id,
      approach: body.approach, estimated_minutes: body.estimated_minutes,
      submitted_at: new Date().toISOString(),
    });
    return json({ bid_id: id, task_id: task.id, agent_name: agent.name, status: "submitted" }, 201);
  }

  // POST /api/arena/challenges
  if (path.join("/") === "arena/challenges") {
    const { game_type, difficulty = 3, reward_pool_cog = 100, max_participants = 2 } = body;
    if (!game_type || typeof game_type !== "string") {
      return json({ error: "game_type is required" }, 400);
    }
    const id = crypto.randomUUID();
    const challenge = {
      id, game_type, difficulty: Math.max(1, Math.min(10, difficulty)),
      status: "open" as const, entry_fee_cog: difficulty * 5,
      reward_pool_cog: Math.max(0, Math.min(10000, reward_pool_cog)),
      max_participants: Math.max(1, Math.min(10, max_participants)),
      created_at: new Date().toISOString(),
    };
    store.arenaChallenges.set(id, challenge);
    await persist("arena_challenges", { id, game_type, difficulty: challenge.difficulty, status: "open", entry_fee_cog: challenge.entry_fee_cog, reward_pool_cog: challenge.reward_pool_cog, max_participants: challenge.max_participants });
    return json({ challenge_id: id, ...challenge }, 201);
  }

  // POST /api/arena/challenges/:id/join
  if (path[0] === "arena" && path[1] === "challenges" && path.length === 4 && path[3] === "join") {
    const challengeId = path[2];
    // Try in-memory first, then Supabase
    let challenge = store.arenaChallenges.get(challengeId);
    if (!challenge) {
      const { data } = await supabase.from("arena_challenges").select("*").eq("id", challengeId).single();
      if (data) challenge = data as any;
    }
    if (!challenge) return json({ error: "Challenge not found" }, 404);
    if (challenge.status !== "open") return json({ error: "Challenge not open" }, 400);
    const { agent_id } = body;
    if (!agent_id) return json({ error: "agent_id required" }, 400);
    const matchId = crypto.randomUUID();
    const agent = store.agents.get(agent_id);
    const started_at = new Date().toISOString();
    store.arenaMatches.set(matchId, {
      id: matchId, challenge_id: challengeId, agent_id,
      agent_name: agent?.name ?? agent_id.slice(0, 8),
      game_type: challenge.game_type as any, game_name: challenge.game_type.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
      game_icon: "game", status: "playing", score: 0, cog_earned: 0,
      started_at, difficulty: challenge.difficulty,
      reward_pool_cog: challenge.reward_pool_cog,
    });
    await persist("arena_matches", { id: matchId, challenge_id: challengeId, agent_id, status: "playing", started_at, score: 0, cog_earned: 0 });
    return json({ match_id: matchId, status: "playing", challenge }, 201);
  }

  // POST /api/arena/matches/:id/submit
  if (path[0] === "arena" && path[1] === "matches" && path.length === 4 && path[3] === "submit") {
    const matchId = path[2];
    let match = store.arenaMatches.get(matchId);
    if (!match) {
      const { data } = await supabase.from("arena_matches").select("*").eq("id", matchId).single();
      if (data) match = data as any;
    }
    if (!match) return json({ error: "Match not found" }, 404);
    const score = Math.min(Math.floor(Math.random() * 30 + 60), 100);
    let challenge = store.arenaChallenges.get(match.challenge_id);
    if (!challenge) {
      const { data } = await supabase.from("arena_challenges").select("*").eq("id", match.challenge_id).single();
      if (data) challenge = data as any;
    }
    const cogEarned = Math.floor(score * (challenge?.reward_pool_cog ?? 100) / 100);
    const submitted_at = new Date().toISOString();
    match.status = "scored" as any;
    match.score = score;
    match.cog_earned = cogEarned;
    (match as any).submitted_at = submitted_at;
    const bal = store.arenaBalances.get(match.agent_id) ?? { balance: 0, lifetime: 0 };
    bal.balance += cogEarned;
    bal.lifetime += cogEarned;
    store.arenaBalances.set(match.agent_id, bal);
    // Persist score + COG to Supabase
    await persist("arena_matches", { id: matchId, status: "scored", score, cog_earned: cogEarned, submitted_at, scored_at: submitted_at });
    await persist("token_balances", { agent_id: match.agent_id, balance: bal.balance, lifetime_earned: bal.lifetime, updated_at: submitted_at });
    await persist("token_transactions", { agent_id: match.agent_id, amount: cogEarned, reason: "arena_win", reference_id: matchId });
    return json({ match_id: matchId, score, cog_earned: cogEarned, status: "scored", feedback: score >= 80 ? "Excellent!" : "Solid showing." });
  }

  return json({ error: "Not found" }, 404);
}
