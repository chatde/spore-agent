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
import { v4 as uuidv4 } from "uuid";
import { store } from "./store.js";
import { seedStore } from "./seed.js";
import { embedText, embedQuery, cosineSimilarity } from "./embeddings.js";
import type { Task, Bid, Delivery, Rating, Agent } from "./types.js";
import { verifyDelivery } from "./verification.js";

const app = new Hono();

// CORS for web dashboard
app.use("/*", cors());

// --- Health ---
app.get("/api/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

// --- Stats ---
app.get("/api/stats", (c) => {
  const stats = store.getStats();
  return c.json(stats);
});

// --- Tasks ---
app.get("/api/tasks", (c) => {
  const status = c.req.query("status");
  let tasks = status
    ? Array.from(store.tasks.values()).filter((t) => t.status === status)
    : store.getOpenTasks();

  if (c.req.query("all") === "true") {
    tasks = store.getAllTasks();
  }

  const limit = parseInt(c.req.query("limit") ?? "50");
  tasks = tasks.slice(0, limit);

  const result = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    requirements: t.requirements,
    budget_usd: t.budget_usd ?? null,
    status: t.status,
    posted_at: t.posted_at,
    assigned_agent_id: t.assigned_agent_id ?? null,
    bid_count: store.getTaskBids(t.id).length,
    has_embedding: !!t.embedding,
  }));

  return c.json({ total: result.length, tasks: result });
});

app.get("/api/tasks/search", async (c) => {
  const q = c.req.query("q");
  if (!q) return c.json({ error: "Query parameter 'q' is required" }, 400);

  const limit = parseInt(c.req.query("limit") ?? "10");

  try {
    const queryEmbedding = await embedQuery(q);
    const results = store.searchTasksByEmbedding(queryEmbedding, limit);

    return c.json({
      query: q,
      total: results.length,
      tasks: results.map((r) => ({
        id: r.task.id,
        title: r.task.title,
        description: r.task.description,
        requirements: r.task.requirements,
        budget_usd: r.task.budget_usd ?? null,
        status: r.task.status,
        posted_at: r.task.posted_at,
        bid_count: store.getTaskBids(r.task.id).length,
        similarity_score: Math.round(r.score * 1000) / 1000,
      })),
    });
  } catch (err) {
    // Fallback to keyword search
    const lower = q.toLowerCase();
    const tasks = store.getAllTasks().filter(
      (t) =>
        t.title.toLowerCase().includes(lower) ||
        t.description.toLowerCase().includes(lower) ||
        t.requirements.some((r) => r.toLowerCase().includes(lower))
    );

    return c.json({
      query: q,
      total: tasks.length,
      fallback: "keyword",
      tasks: tasks.slice(0, limit).map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        requirements: t.requirements,
        budget_usd: t.budget_usd ?? null,
        status: t.status,
        posted_at: t.posted_at,
        bid_count: store.getTaskBids(t.id).length,
      })),
    });
  }
});

app.get("/api/tasks/:id", (c) => {
  const task = store.tasks.get(c.req.param("id"));
  if (!task) return c.json({ error: "Task not found" }, 404);

  const bids = store.getTaskBids(task.id).map((b) => {
    const agent = store.agents.get(b.agent_id);
    return {
      id: b.id,
      agent_id: b.agent_id,
      agent_name: agent?.name ?? "Unknown",
      approach: b.approach,
      estimated_minutes: b.estimated_minutes,
      submitted_at: b.submitted_at,
    };
  });

  const deliveries = Array.from(store.deliveries.values())
    .filter((d) => d.task_id === task.id)
    .map((d) => ({
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
  const task = store.tasks.get(c.req.param("id"));
  if (!task) return c.json({ error: "Task not found" }, 404);

  const limit = parseInt(c.req.query("limit") ?? "5");

  if (task.embedding) {
    const matches = store.matchAgentsByEmbedding(task.embedding, limit);
    return c.json({
      task_id: task.id,
      total: matches.length,
      agents: matches.map((m) => ({
        id: m.agent.id,
        name: m.agent.name,
        capabilities: m.agent.capabilities,
        description: m.agent.description,
        match_score: Math.round(m.score * 1000) / 1000,
        average_rating: m.agent.ratings.length > 0
          ? Math.round(
              (m.agent.ratings.reduce((s, r) => s + r.rating, 0) /
                m.agent.ratings.length) *
                100
            ) / 100
          : null,
        total_ratings: m.agent.ratings.length,
      })),
    });
  }

  // Fallback: keyword matching
  const agents = store.getAllAgents().filter((a) =>
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
  const body = await c.req.json();
  const { title, description, requirements, budget_usd } = body;

  if (!title || !description || !requirements?.length) {
    return c.json({ error: "title, description, and requirements are required" }, 400);
  }

  const task: Task = {
    id: uuidv4(),
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

  store.tasks.set(task.id, task);

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
  const task = store.tasks.get(c.req.param("id"));
  if (!task) return c.json({ error: "Task not found" }, 404);
  if (task.status !== "open") return c.json({ error: "Task is not open for bids" }, 400);

  const body = await c.req.json();
  const { agent_id, approach, estimated_minutes } = body;

  const agent = store.agents.get(agent_id);
  if (!agent) return c.json({ error: "Agent not found" }, 404);

  const bid: Bid = {
    id: uuidv4(),
    task_id: task.id,
    agent_id,
    approach,
    estimated_minutes,
    submitted_at: new Date().toISOString(),
  };
  store.bids.set(bid.id, bid);

  return c.json({
    bid_id: bid.id,
    task_id: task.id,
    agent_name: agent.name,
    status: "submitted",
  }, 201);
});

app.post("/api/tasks/:id/accept-bid", async (c) => {
  const task = store.tasks.get(c.req.param("id"));
  if (!task) return c.json({ error: "Task not found" }, 404);
  if (task.status !== "open") return c.json({ error: "Task is not open" }, 400);

  const body = await c.req.json();
  const bid = store.bids.get(body.bid_id);
  if (!bid || bid.task_id !== task.id) return c.json({ error: "Bid not found" }, 404);

  task.status = "assigned";
  task.assigned_agent_id = bid.agent_id;
  task.accepted_bid_id = bid.id;

  const agent = store.agents.get(bid.agent_id);
  return c.json({
    task_id: task.id,
    bid_id: bid.id,
    assigned_agent: agent?.name ?? bid.agent_id,
    status: "assigned",
  });
});

app.post("/api/tasks/:id/deliver", async (c) => {
  const task = store.tasks.get(c.req.param("id"));
  if (!task) return c.json({ error: "Task not found" }, 404);
  if (task.status !== "assigned") return c.json({ error: "Task not in assigned state" }, 400);

  const body = await c.req.json();
  if (task.assigned_agent_id !== body.agent_id) {
    return c.json({ error: "Agent not assigned to this task" }, 403);
  }

  const delivery: Delivery = {
    id: uuidv4(),
    task_id: task.id,
    agent_id: body.agent_id,
    result: body.result,
    delivered_at: new Date().toISOString(),
  };
  store.deliveries.set(delivery.id, delivery);
  task.status = "delivered";

  return c.json({ delivery_id: delivery.id, status: "delivered" });
});

app.post("/api/tasks/:id/rate", async (c) => {
  const task = store.tasks.get(c.req.param("id"));
  if (!task) return c.json({ error: "Task not found" }, 404);
  if (task.status !== "delivered") return c.json({ error: "Task must be delivered to rate" }, 400);

  const body = await c.req.json();
  const { rating, feedback } = body;

  if (!rating || rating < 1 || rating > 5) {
    return c.json({ error: "Rating must be 1-5" }, 400);
  }

  const agent = store.agents.get(task.assigned_agent_id!);
  if (!agent) return c.json({ error: "Agent not found" }, 404);

  const ratingEntry: Rating = {
    task_id: task.id,
    rating,
    feedback: feedback ?? "",
    rated_at: new Date().toISOString(),
  };
  agent.ratings.push(ratingEntry);
  task.status = "completed";

  const avgRating =
    agent.ratings.reduce((s, r) => s + r.rating, 0) / agent.ratings.length;

  return c.json({
    task_id: task.id,
    agent_id: agent.id,
    agent_name: agent.name,
    rating,
    new_average: Math.round(avgRating * 100) / 100,
    status: "completed",
  });
});

// --- Verification (Proof of Work) ---
app.post("/api/tasks/:id/verify/:deliveryId", async (c) => {
  const task = store.tasks.get(c.req.param("id"));
  if (!task) return c.json({ error: "Task not found" }, 404);

  const deliveryId = c.req.param("deliveryId");
  const delivery = store.deliveries.get(deliveryId);
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
  const task = store.tasks.get(c.req.param("id"));
  if (!task) return c.json({ error: "Task not found" }, 404);

  const deliveryId = c.req.param("deliveryId");
  const delivery = store.deliveries.get(deliveryId);
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
app.get("/api/agents", (c) => {
  const agents = store.getAllAgents().map((a) => {
    const avgRating =
      a.ratings.length > 0
        ? Math.round(
            (a.ratings.reduce((s, r) => s + r.rating, 0) / a.ratings.length) *
              100
          ) / 100
        : null;
    const deliveries = store.getAgentDeliveries(a.id);
    return {
      id: a.id,
      name: a.name,
      capabilities: a.capabilities,
      description: a.description,
      average_rating: avgRating,
      total_ratings: a.ratings.length,
      total_deliveries: deliveries.length,
      success_rate: a.ratings.length > 0
        ? Math.round(
            (a.ratings.filter((r) => r.rating >= 4).length / a.ratings.length) *
              100
          )
        : null,
      registered_at: a.registered_at,
      has_embedding: !!a.embedding,
    };
  });

  return c.json({ total: agents.length, agents });
});

app.get("/api/agents/:id", (c) => {
  const agent = store.agents.get(c.req.param("id"));
  if (!agent) return c.json({ error: "Agent not found" }, 404);

  const deliveries = store.getAgentDeliveries(agent.id);
  const avgRating =
    agent.ratings.length > 0
      ? Math.round(
          (agent.ratings.reduce((s, r) => s + r.rating, 0) /
            agent.ratings.length) *
            100
        ) / 100
      : null;

  return c.json({
    id: agent.id,
    name: agent.name,
    capabilities: agent.capabilities,
    description: agent.description,
    registered_at: agent.registered_at,
    average_rating: avgRating,
    total_ratings: agent.ratings.length,
    total_deliveries: deliveries.length,
    success_rate: agent.ratings.length > 0
      ? Math.round(
          (agent.ratings.filter((r) => r.rating >= 4).length /
            agent.ratings.length) *
            100
        )
      : null,
    ratings: agent.ratings.map((r) => ({
      task_id: r.task_id,
      rating: r.rating,
      feedback: r.feedback,
      rated_at: r.rated_at,
    })),
  });
});

app.get("/api/agents/:id/recommended-tasks", async (c) => {
  const agent = store.agents.get(c.req.param("id"));
  if (!agent) return c.json({ error: "Agent not found" }, 404);

  const limit = parseInt(c.req.query("limit") ?? "5");

  if (agent.embedding) {
    const results = store.searchTasksByEmbedding(agent.embedding, limit);
    const openResults = results.filter((r) => r.task.status === "open");
    return c.json({
      agent_id: agent.id,
      total: openResults.length,
      tasks: openResults.map((r) => ({
        id: r.task.id,
        title: r.task.title,
        description: r.task.description,
        requirements: r.task.requirements,
        budget_usd: r.task.budget_usd ?? null,
        match_score: Math.round(r.score * 1000) / 1000,
        bid_count: store.getTaskBids(r.task.id).length,
      })),
    });
  }

  // Fallback
  const tasks = store.getOpenTasks().filter((t) =>
    t.requirements.some((req) =>
      agent.capabilities.some((cap) => cap.toLowerCase() === req.toLowerCase())
    )
  );

  return c.json({
    agent_id: agent.id,
    total: tasks.length,
    fallback: "keyword",
    tasks: tasks.slice(0, limit).map((t) => ({
      id: t.id,
      title: t.title,
      requirements: t.requirements,
      budget_usd: t.budget_usd ?? null,
      bid_count: store.getTaskBids(t.id).length,
    })),
  });
});

app.post("/api/agents/register", async (c) => {
  const body = await c.req.json();
  const { name, capabilities, description } = body;

  if (!name || !capabilities?.length || !description) {
    return c.json({ error: "name, capabilities, and description are required" }, 400);
  }

  const agent: Agent = {
    id: uuidv4(),
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

  store.agents.set(agent.id, agent);

  return c.json({
    agent_id: agent.id,
    name: agent.name,
    capabilities: agent.capabilities,
    status: "registered",
    has_embedding: !!agent.embedding,
  }, 201);
});

// --- Leaderboard ---
app.get("/api/leaderboard", (c) => {
  const limit = parseInt(c.req.query("limit") ?? "10");
  const topAgents = store.getLeaderboard(limit);

  const leaderboard = topAgents.map((agent, index) => {
    const avgRating =
      agent.ratings.reduce((s, r) => s + r.rating, 0) / agent.ratings.length;
    const deliveries = store.getAgentDeliveries(agent.id);

    return {
      rank: index + 1,
      agent_id: agent.id,
      agent_name: agent.name,
      capabilities: agent.capabilities,
      average_rating: Math.round(avgRating * 100) / 100,
      total_deliveries: deliveries.length,
      total_ratings: agent.ratings.length,
      success_rate: Math.round(
        (agent.ratings.filter((r) => r.rating >= 4).length /
          agent.ratings.length) *
          100
      ),
    };
  });

  return c.json({ total: leaderboard.length, leaderboard });
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
  });
}

main().catch((err: unknown) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
