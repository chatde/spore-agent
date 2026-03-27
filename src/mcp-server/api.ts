import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Try local .env first, then parent (pantheon-ai/.env)
config({ path: resolve(__dirname, "../../.env") });
config({ path: resolve(__dirname, "../../../.env") });

import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { store } from "./store.js";
import { seedStore } from "./seed.js";
import { embedText, embedQuery, cosineSimilarity } from "./embeddings.js";
import type { Task, Bid, Delivery, Rating, Agent } from "./types.js";
import { verifyDelivery } from "./verification.js";
import { averageRating, successRate } from "./utils.js";
import { z } from "zod";

// --- Zod Schemas ---
const CreateTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  requirements: z.array(z.string()).min(1),
  budget_usd: z.number().optional(),
});

const RegisterAgentSchema = z.object({
  name: z.string(),
  capabilities: z.array(z.string()).min(1),
  description: z.string(),
});

const BidSchema = z.object({
  agent_id: z.string().uuid(),
  approach: z.string(),
  estimated_minutes: z.number(),
});

const AcceptBidSchema = z.object({
  bid_id: z.string(),
});

const DeliverSchema = z.object({
  agent_id: z.string(),
  result: z.string(),
});

const RateSchema = z.object({
  rating: z.number().int().min(1).max(5),
  feedback: z.string().optional(),
});

const app = new Hono();

// CORS for web dashboard
app.use("/*", cors());

// Cache headers for GET requests
app.use("/api/*", async (c, next) => {
  await next();
  if (c.req.method === "GET") {
    c.header("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
  }
});

// --- Health ---
app.get("/api/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

// --- Stats ---
app.get("/api/stats", async (c) => {
  const stats = await store.getStats();
  return c.json(stats);
});

// --- Tasks ---
app.get("/api/tasks", async (c) => {
  const status = c.req.query("status");
  let tasks: Task[];

  if (c.req.query("all") === "true") {
    tasks = await store.getAllTasks();
  } else if (status) {
    tasks = (await store.getAllTasks()).filter((t) => t.status === status);
  } else {
    tasks = await store.getOpenTasks();
  }

  const limit = parseInt(c.req.query("limit") ?? "50");
  tasks = tasks.slice(0, limit);

  const result = await Promise.all(
    tasks.map(async (t) => {
      const bids = await store.getTaskBids(t.id);
      return {
        id: t.id,
        title: t.title,
        description: t.description,
        requirements: t.requirements,
        budget_usd: t.budget_usd ?? null,
        status: t.status,
        posted_at: t.posted_at,
        assigned_agent_id: t.assigned_agent_id ?? null,
        bid_count: bids.length,
        has_embedding: !!t.embedding,
      };
    })
  );

  return c.json({ total: result.length, tasks: result });
});

app.get("/api/tasks/search", async (c) => {
  const q = c.req.query("q");
  if (!q) return c.json({ error: "Query parameter 'q' is required" }, 400);

  const limit = parseInt(c.req.query("limit") ?? "10");

  try {
    const queryEmbedding = await embedQuery(q);
    const results = await store.searchTasksByEmbedding(queryEmbedding, limit);

    return c.json({
      query: q,
      total: results.length,
      tasks: await Promise.all(
        results.map(async (r) => {
          const bids = await store.getTaskBids(r.task.id);
          return {
            id: r.task.id,
            title: r.task.title,
            description: r.task.description,
            requirements: r.task.requirements,
            budget_usd: r.task.budget_usd ?? null,
            status: r.task.status,
            posted_at: r.task.posted_at,
            bid_count: bids.length,
            similarity_score: Math.round(r.score * 1000) / 1000,
          };
        })
      ),
    });
  } catch (err) {
    // Fallback to keyword search
    const lower = q.toLowerCase();
    const allTasks = await store.getAllTasks();
    const tasks = allTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(lower) ||
        t.description.toLowerCase().includes(lower) ||
        t.requirements.some((r) => r.toLowerCase().includes(lower))
    );

    return c.json({
      query: q,
      total: tasks.length,
      fallback: "keyword",
      tasks: await Promise.all(
        tasks.slice(0, limit).map(async (t) => {
          const bids = await store.getTaskBids(t.id);
          return {
            id: t.id,
            title: t.title,
            description: t.description,
            requirements: t.requirements,
            budget_usd: t.budget_usd ?? null,
            status: t.status,
            posted_at: t.posted_at,
            bid_count: bids.length,
          };
        })
      ),
    });
  }
});

app.get("/api/tasks/:id", async (c) => {
  const task = await store.getTask(c.req.param("id"));
  if (!task) return c.json({ error: "Task not found" }, 404);

  const rawBids = await store.getTaskBids(task.id);
  const bids = await Promise.all(
    rawBids.map(async (b) => {
      const agent = await store.getAgent(b.agent_id);
      return {
        id: b.id,
        agent_id: b.agent_id,
        agent_name: agent?.name ?? "Unknown",
        approach: b.approach,
        estimated_minutes: b.estimated_minutes,
        submitted_at: b.submitted_at,
      };
    })
  );

  const rawDeliveries = await store.getTaskDeliveries(task.id);
  const deliveries = rawDeliveries.map((d) => ({
    id: d.id,
    agent_id: d.agent_id,
    result: d.result,
    delivered_at: d.delivered_at,
  }));

  return c.json({
    id: task.id,
    title: task.title,
    description: task.description,
    requirements: task.requirements,
    budget_usd: task.budget_usd ?? null,
    status: task.status,
    posted_at: task.posted_at,
    assigned_agent_id: task.assigned_agent_id ?? null,
    bids,
    deliveries,
  });
});

app.get("/api/tasks/:id/matching-agents", async (c) => {
  const task = await store.getTask(c.req.param("id"));
  if (!task) return c.json({ error: "Task not found" }, 404);

  const limit = parseInt(c.req.query("limit") ?? "5");

  if (task.embedding) {
    const matches = await store.matchAgentsByEmbedding(task.embedding, limit);
    return c.json({
      task_id: task.id,
      total: matches.length,
      agents: matches.map((m) => ({
        id: m.agent.id,
        name: m.agent.name,
        capabilities: m.agent.capabilities,
        description: m.agent.description,
        match_score: Math.round(m.score * 1000) / 1000,
        average_rating: averageRating(m.agent.ratings),
        total_ratings: m.agent.ratings.length,
      })),
    });
  }

  // Fallback: keyword matching
  const allAgents = await store.getAllAgents();
  const agents = allAgents.filter((a) =>
    task.requirements.some((req) =>
      a.capabilities.some((cap) => cap.toLowerCase() === req.toLowerCase())
    )
  );

  return c.json({
    task_id: task.id,
    total: agents.length,
    fallback: "keyword",
    agents: agents.slice(0, limit).map((a) => ({
      id: a.id,
      name: a.name,
      capabilities: a.capabilities,
      description: a.description,
    })),
  });
});

app.post("/api/tasks", async (c) => {
  let body;
  try { body = await c.req.json(); } catch { return c.json({ error: "Invalid JSON body" }, 400); }

  const parseResult = CreateTaskSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ error: "Invalid input", details: parseResult.error.flatten().fieldErrors }, 400);
  }
  const { title, description, requirements, budget_usd } = parseResult.data;

  const task: Task = {
    id: crypto.randomUUID(),
    title,
    description,
    requirements,
    budget_usd: budget_usd ?? undefined,
    status: "open",
    posted_at: new Date().toISOString(),
  };

  // Generate embedding
  try {
    task.embedding = await embedText(
      `${title}. ${description}. Requirements: ${requirements.join(", ")}`
    );
  } catch {
    // Proceed without embedding
  }

  await store.createTask(task);

  return c.json({
    task_id: task.id,
    title: task.title,
    status: "open",
    has_embedding: !!task.embedding,
    message: `Task "${task.title}" posted successfully.`,
  }, 201);
});

// --- Bids ---
app.post("/api/tasks/:id/bid", async (c) => {
  const task = await store.getTask(c.req.param("id"));
  if (!task) return c.json({ error: "Task not found" }, 404);
  if (task.status !== "open") return c.json({ error: "Task is not open for bids" }, 400);

  let body;
  try { body = await c.req.json(); } catch { return c.json({ error: "Invalid JSON body" }, 400); }

  const parseResult = BidSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ error: "Invalid input", details: parseResult.error.flatten().fieldErrors }, 400);
  }
  const { agent_id, approach, estimated_minutes } = parseResult.data;

  const agent = await store.getAgent(agent_id);
  if (!agent) return c.json({ error: "Agent not found" }, 404);

  const bid: Bid = {
    id: crypto.randomUUID(),
    task_id: task.id,
    agent_id,
    approach,
    estimated_minutes,
    submitted_at: new Date().toISOString(),
  };
  await store.createBid(bid);

  return c.json({
    bid_id: bid.id,
    task_id: task.id,
    agent_name: agent.name,
    status: "submitted",
  }, 201);
});

app.post("/api/tasks/:id/accept-bid", async (c) => {
  const task = await store.getTask(c.req.param("id"));
  if (!task) return c.json({ error: "Task not found" }, 404);
  if (task.status !== "open") return c.json({ error: "Task is not open" }, 400);

  let body;
  try { body = await c.req.json(); } catch { return c.json({ error: "Invalid JSON body" }, 400); }

  const parseResult = AcceptBidSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ error: "Invalid input", details: parseResult.error.flatten().fieldErrors }, 400);
  }
  const bid = await store.getBid(parseResult.data.bid_id);
  if (!bid || bid.task_id !== task.id) return c.json({ error: "Bid not found" }, 404);

  await store.updateTask(task.id, {
    status: "assigned",
    assigned_agent_id: bid.agent_id,
    accepted_bid_id: bid.id,
  });

  const agent = await store.getAgent(bid.agent_id);
  return c.json({
    task_id: task.id,
    bid_id: bid.id,
    assigned_agent: agent?.name ?? bid.agent_id,
    status: "assigned",
  });
});

app.post("/api/tasks/:id/deliver", async (c) => {
  const task = await store.getTask(c.req.param("id"));
  if (!task) return c.json({ error: "Task not found" }, 404);
  if (task.status !== "assigned") return c.json({ error: "Task not in assigned state" }, 400);

  let body;
  try { body = await c.req.json(); } catch { return c.json({ error: "Invalid JSON body" }, 400); }

  const parseResult = DeliverSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ error: "Invalid input", details: parseResult.error.flatten().fieldErrors }, 400);
  }
  if (task.assigned_agent_id !== parseResult.data.agent_id) {
    return c.json({ error: "Agent not assigned to this task" }, 403);
  }
  const { agent_id, result } = parseResult.data;

  const delivery: Delivery = {
    id: crypto.randomUUID(),
    task_id: task.id,
    agent_id,
    result,
    delivered_at: new Date().toISOString(),
  };
  await store.createDelivery(delivery);
  await store.updateTask(task.id, { status: "delivered" });

  return c.json({ delivery_id: delivery.id, status: "delivered" });
});

app.post("/api/tasks/:id/rate", async (c) => {
  const task = await store.getTask(c.req.param("id"));
  if (!task) return c.json({ error: "Task not found" }, 404);
  if (task.status !== "delivered") return c.json({ error: "Task must be delivered to rate" }, 400);

  let body;
  try { body = await c.req.json(); } catch { return c.json({ error: "Invalid JSON body" }, 400); }

  const parseResult = RateSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ error: "Invalid input", details: parseResult.error.flatten().fieldErrors }, 400);
  }
  const { rating, feedback } = parseResult.data;

  const agent = await store.getAgent(task.assigned_agent_id!);
  if (!agent) return c.json({ error: "Agent not found" }, 404);

  const ratingEntry: Rating = {
    task_id: task.id,
    rating,
    feedback: feedback ?? "",
    rated_at: new Date().toISOString(),
  };
  await store.createRating(agent.id, ratingEntry);
  await store.updateTask(task.id, { status: "completed" });

  // Re-fetch to get updated ratings
  const updatedAgent = await store.getAgent(agent.id);

  return c.json({
    task_id: task.id,
    agent_id: agent.id,
    agent_name: agent.name,
    rating,
    new_average: averageRating(updatedAgent?.ratings ?? []),
    status: "completed",
  });
});

// --- Verification (Proof of Work) ---
app.post("/api/tasks/:id/verify/:deliveryId", async (c) => {
  const task = await store.getTask(c.req.param("id"));
  if (!task) return c.json({ error: "Task not found" }, 404);

  const deliveryId = c.req.param("deliveryId");
  const delivery = await store.getDelivery(deliveryId);
  if (!delivery || delivery.task_id !== task.id) {
    return c.json({ error: "Delivery not found" }, 404);
  }

  const result = await verifyDelivery(
    task.title,
    task.description,
    task.requirements,
    delivery.result
  );

  return c.json(result);
});

// Also support GET for convenience
app.get("/api/tasks/:id/verify/:deliveryId", async (c) => {
  const task = await store.getTask(c.req.param("id"));
  if (!task) return c.json({ error: "Task not found" }, 404);

  const deliveryId = c.req.param("deliveryId");
  const delivery = await store.getDelivery(deliveryId);
  if (!delivery || delivery.task_id !== task.id) {
    return c.json({ error: "Delivery not found" }, 404);
  }

  const result = await verifyDelivery(
    task.title,
    task.description,
    task.requirements,
    delivery.result
  );

  return c.json(result);
});

// --- Agents ---
app.get("/api/agents", async (c) => {
  const allAgents = await store.getAllAgents();
  const agents = await Promise.all(
    allAgents.map(async (a) => {
      const deliveries = await store.getAgentDeliveries(a.id);
      return {
        id: a.id,
        name: a.name,
        capabilities: a.capabilities,
        description: a.description,
        average_rating: averageRating(a.ratings),
        total_ratings: a.ratings.length,
        total_deliveries: deliveries.length,
        success_rate: successRate(a.ratings),
        registered_at: a.registered_at,
        has_embedding: !!a.embedding,
      };
    })
  );

  return c.json({ total: agents.length, agents });
});

app.get("/api/agents/:id", async (c) => {
  const agent = await store.getAgent(c.req.param("id"));
  if (!agent) return c.json({ error: "Agent not found" }, 404);

  const deliveries = await store.getAgentDeliveries(agent.id);
  return c.json({
    id: agent.id,
    name: agent.name,
    capabilities: agent.capabilities,
    description: agent.description,
    registered_at: agent.registered_at,
    average_rating: averageRating(agent.ratings),
    total_ratings: agent.ratings.length,
    total_deliveries: deliveries.length,
    success_rate: successRate(agent.ratings),
    ratings: agent.ratings.map((r) => ({
      task_id: r.task_id,
      rating: r.rating,
      feedback: r.feedback,
      rated_at: r.rated_at,
    })),
  });
});

app.get("/api/agents/:id/recommended-tasks", async (c) => {
  const agent = await store.getAgent(c.req.param("id"));
  if (!agent) return c.json({ error: "Agent not found" }, 404);

  const limit = parseInt(c.req.query("limit") ?? "5");

  if (agent.embedding) {
    const results = await store.searchTasksByEmbedding(agent.embedding, limit);
    const openResults = results.filter((r) => r.task.status === "open");
    return c.json({
      agent_id: agent.id,
      total: openResults.length,
      tasks: await Promise.all(
        openResults.map(async (r) => {
          const bids = await store.getTaskBids(r.task.id);
          return {
            id: r.task.id,
            title: r.task.title,
            description: r.task.description,
            requirements: r.task.requirements,
            budget_usd: r.task.budget_usd ?? null,
            match_score: Math.round(r.score * 1000) / 1000,
            bid_count: bids.length,
          };
        })
      ),
    });
  }

  // Fallback
  const openTasks = await store.getOpenTasks();
  const tasks = openTasks.filter((t) =>
    t.requirements.some((req) =>
      agent.capabilities.some((cap) => cap.toLowerCase() === req.toLowerCase())
    )
  );

  return c.json({
    agent_id: agent.id,
    total: tasks.length,
    fallback: "keyword",
    tasks: await Promise.all(
      tasks.slice(0, limit).map(async (t) => {
        const bids = await store.getTaskBids(t.id);
        return {
          id: t.id,
          title: t.title,
          requirements: t.requirements,
          budget_usd: t.budget_usd ?? null,
          bid_count: bids.length,
        };
      })
    ),
  });
});

app.post("/api/agents/register", async (c) => {
  let body;
  try { body = await c.req.json(); } catch { return c.json({ error: "Invalid JSON body" }, 400); }

  const parseResult = RegisterAgentSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ error: "Invalid input", details: parseResult.error.flatten().fieldErrors }, 400);
  }
  const { name, capabilities, description } = parseResult.data;

  const agent: Agent = {
    id: crypto.randomUUID(),
    name,
    capabilities,
    description,
    registered_at: new Date().toISOString(),
    ratings: [],
  };

  try {
    agent.embedding = await embedText(
      `${name}: ${capabilities.join(", ")}. ${description}`
    );
  } catch {
    // Proceed without embedding
  }

  await store.createAgent(agent);

  return c.json({
    agent_id: agent.id,
    name: agent.name,
    capabilities: agent.capabilities,
    status: "registered",
    has_embedding: !!agent.embedding,
  }, 201);
});

// --- Leaderboard ---
app.get("/api/leaderboard", async (c) => {
  const limit = parseInt(c.req.query("limit") ?? "10");
  const topAgents = await store.getLeaderboard(limit);

  const leaderboard = await Promise.all(
    topAgents.map(async (agent, index) => {
      const deliveries = await store.getAgentDeliveries(agent.id);
      return {
        rank: index + 1,
        agent_id: agent.id,
        agent_name: agent.name,
        capabilities: agent.capabilities,
        average_rating: averageRating(agent.ratings),
        total_deliveries: deliveries.length,
        total_ratings: agent.ratings.length,
        success_rate: successRate(agent.ratings),
      };
    })
  );

  return c.json({ total: leaderboard.length, leaderboard });
});

// --- Arena ---
app.get("/api/arena/challenges", async (c) => {
  const gameType = c.req.query("game_type");
  const limit = parseInt(c.req.query("limit") ?? "50");
  const challenges = await store.getOpenChallenges(
    gameType as import("./arena/types.js").GameType | undefined
  );

  return c.json({
    total: challenges.length,
    challenges: challenges.slice(0, limit).map((ch) => ({
      id: ch.id,
      game_type: ch.game_type,
      difficulty: ch.difficulty,
      entry_fee_cog: ch.entry_fee_cog,
      reward_pool_cog: ch.reward_pool_cog,
      max_participants: ch.max_participants,
      status: ch.status,
      created_at: ch.created_at,
    })),
  });
});

app.get("/api/arena/challenges/:id", async (c) => {
  const challenge = await store.getChallenge(c.req.param("id"));
  if (!challenge) return c.json({ error: "Challenge not found" }, 404);

  const matches = await store.getChallengeMatches(challenge.id);
  return c.json({
    ...challenge,
    participants: matches.length,
    matches: matches.map((m) => ({
      match_id: m.id,
      agent_id: m.agent_id,
      status: m.status,
      score: m.score,
      cog_earned: m.cog_earned,
    })),
  });
});

app.get("/api/arena/matches/:id", async (c) => {
  const match = await store.getMatch(c.req.param("id"));
  if (!match) return c.json({ error: "Match not found" }, 404);

  const challenge = await store.getChallenge(match.challenge_id);
  const agent = await store.getAgent(match.agent_id);

  return c.json({
    match_id: match.id,
    challenge_id: match.challenge_id,
    game_type: challenge?.game_type ?? "unknown",
    agent_id: match.agent_id,
    agent_name: agent?.name ?? "Unknown",
    status: match.status,
    score: match.score,
    cog_earned: match.cog_earned,
    rounds_completed: match.round_data?.length ?? 0,
    started_at: match.started_at ?? null,
    submitted_at: match.submitted_at ?? null,
    scored_at: match.scored_at ?? null,
  });
});

app.get("/api/arena/leaderboard", async (c) => {
  const limit = parseInt(c.req.query("limit") ?? "25");
  const leaderboard = await store.getArenaLeaderboard(limit);

  return c.json({
    total: leaderboard.length,
    leaderboard: leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry,
    })),
  });
});

app.get("/api/arena/agents/:id/stats", async (c) => {
  const agentId = c.req.param("id");
  const agent = await store.getAgent(agentId);
  if (!agent) return c.json({ error: "Agent not found" }, 404);

  const balance = await store.getTokenBalance(agentId);
  const matches = await store.getAgentMatches(agentId);
  const scoredMatches = matches.filter((m) => m.status === "scored");
  const avgScore =
    scoredMatches.length > 0
      ? scoredMatches.reduce((sum, m) => sum + m.score, 0) / scoredMatches.length
      : 0;

  return c.json({
    agent_id: agentId,
    agent_name: agent.name,
    cog_balance: balance?.balance ?? 0,
    cog_lifetime: balance?.lifetime_earned ?? 0,
    matches_played: matches.length,
    matches_scored: scoredMatches.length,
    avg_score: Math.round(avgScore * 100) / 100,
    total_cog_earned: scoredMatches.reduce((sum, m) => sum + m.cog_earned, 0),
  });
});

app.get("/api/arena/live", async (c) => {
  const matches = await store.getLiveMatches(50);
  return c.json({ matches });
});

// --- Start ---
const PORT = parseInt(process.env.PORT ?? "3456");

async function main(): Promise<void> {
  await seedStore();

  serve({ fetch: app.fetch, port: PORT }, (info) => {
    console.log(`\nSpore Agent API running at http://localhost:${info.port}`);
    console.log(`  Tasks:       http://localhost:${info.port}/api/tasks`);
    console.log(`  Search:      http://localhost:${info.port}/api/tasks/search?q=security`);
    console.log(`  Agents:      http://localhost:${info.port}/api/agents`);
    console.log(`  Leaderboard: http://localhost:${info.port}/api/leaderboard`);
    console.log(`  Stats:       http://localhost:${info.port}/api/stats`);
    console.log(`  Arena:       http://localhost:${info.port}/api/arena/challenges`);
    console.log(`  Arena Live:  http://localhost:${info.port}/api/arena/live`);
  });
}

main().catch((err: unknown) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
