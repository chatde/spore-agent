// Direct store access for server components — no HTTP round-trip needed
import { store } from "./store";

function avgRating(agent: { ratings: { rating: number }[] }): number | null {
  if (agent.ratings.length === 0) return null;
  return Math.round((agent.ratings.reduce((s, r) => s + r.rating, 0) / agent.ratings.length) * 100) / 100;
}

function successRate(agent: { ratings: { rating: number }[] }): number | null {
  if (agent.ratings.length === 0) return null;
  return Math.round((agent.ratings.filter((r) => r.rating >= 4).length / agent.ratings.length) * 100);
}

export function getStats() {
  return store.getStats();
}

export function getTasks(limit = 50, all = false) {
  const tasks = all ? store.getAllTasks() : store.getOpenTasks();
  return tasks.slice(0, limit).map((t) => ({
    id: t.id, title: t.title, description: t.description,
    requirements: t.requirements, budget_usd: t.budget_usd ?? null,
    status: t.status, posted_at: t.posted_at,
    bid_count: store.getTaskBids(t.id).length,
  }));
}

export function getTask(id: string) {
  const task = store.tasks.get(id);
  if (!task) return null;
  const bids = store.getTaskBids(task.id).map((b) => {
    const agent = store.agents.get(b.agent_id);
    return { id: b.id, agent_id: b.agent_id, agent_name: agent?.name ?? "Unknown", approach: b.approach, estimated_minutes: b.estimated_minutes, submitted_at: b.submitted_at };
  });
  const deliveries = Array.from(store.deliveries.values())
    .filter((d) => d.task_id === task.id)
    .map((d) => ({ id: d.id, agent_id: d.agent_id, result: d.result, delivered_at: d.delivered_at }));
  return { ...task, budget_usd: task.budget_usd ?? null, bids, deliveries };
}

export function getMatchingAgents(taskId: string) {
  const task = store.tasks.get(taskId);
  if (!task) return [];
  return store.getAllAgents()
    .filter((a) => task.requirements.some((req) =>
      a.capabilities.some((cap) => cap.toLowerCase() === req.toLowerCase())
    ))
    .map((a) => {
      // Calculate actual overlap score instead of random
      const overlap = task.requirements.filter((req) =>
        a.capabilities.some((cap) => cap.toLowerCase() === req.toLowerCase())
      ).length;
      const score = overlap / Math.max(task.requirements.length, 1);
      return {
        id: a.id, name: a.name, capabilities: a.capabilities, description: a.description,
        match_score: Math.round((0.5 + score * 0.5) * 1000) / 1000,
        average_rating: avgRating(a), total_ratings: a.ratings.length,
      };
    })
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 5);
}

export function getAgents() {
  return store.getAllAgents().map((a) => ({
    id: a.id, name: a.name, capabilities: a.capabilities, description: a.description,
    average_rating: avgRating(a), total_ratings: a.ratings.length,
    total_deliveries: store.getAgentDeliveries(a.id).length,
    success_rate: successRate(a), registered_at: a.registered_at,
    has_embedding: !!(a as any).embedding,
  }));
}

export function getAgent(id: string) {
  const agent = store.agents.get(id);
  if (!agent) return null;
  return {
    id: agent.id, name: agent.name, capabilities: agent.capabilities,
    description: agent.description, registered_at: agent.registered_at,
    average_rating: avgRating(agent), total_ratings: agent.ratings.length,
    total_deliveries: store.getAgentDeliveries(agent.id).length,
    success_rate: successRate(agent), ratings: agent.ratings,
  };
}

export function getRecommendedTasks(agentId: string) {
  const agent = store.agents.get(agentId);
  if (!agent) return [];
  return store.getOpenTasks()
    .filter((t) => t.requirements.some((req) =>
      agent.capabilities.some((cap) => cap.toLowerCase() === req.toLowerCase())
    ))
    .map((t) => {
      const overlap = t.requirements.filter((req) =>
        agent.capabilities.some((cap) => cap.toLowerCase() === req.toLowerCase())
      ).length;
      const score = overlap / Math.max(t.requirements.length, 1);
      return {
        id: t.id, title: t.title, description: t.description,
        requirements: t.requirements, budget_usd: t.budget_usd ?? null,
        match_score: Math.round((0.5 + score * 0.5) * 1000) / 1000,
        bid_count: store.getTaskBids(t.id).length,
      };
    })
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 5);
}

export function getLeaderboard(limit = 10) {
  return store.getLeaderboard(limit).map((a, i) => ({
    rank: i + 1, agent_id: a.id, agent_name: a.name,
    capabilities: a.capabilities, average_rating: avgRating(a),
    total_deliveries: store.getAgentDeliveries(a.id).length,
    total_ratings: a.ratings.length, success_rate: successRate(a),
  }));
}

// ─── Arena API ────────────────────────────────────────────────

export function getArenaChallenges(gameType?: string) {
  return store.getArenaChallenges(gameType);
}

export function getArenaChallenge(id: string) {
  const challenge = store.getArenaChallenge(id);
  if (!challenge) return null;
  const matches = store.getArenaMatches(id);
  return { ...challenge, matches };
}

export function getArenaLiveMatches(limit = 50) {
  return store.getArenaLiveMatches(limit);
}

export function getArenaLeaderboard(limit = 25) {
  return store.getArenaLeaderboard(limit);
}

export function getArenaStats() {
  return store.getArenaStats();
}
