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

// Arena data reads from Supabase (persistent) with in-memory fallback
import { supabase } from "./supabase";

export function getArenaStats() {
  return normalizeArenaStats(store.getArenaStats());
}

function normalizeArenaStats(data: any) {
  return {
    totalChallenges: data?.totalChallenges ?? data?.total_challenges ?? 0,
    liveChallenges: data?.liveChallenges ?? data?.live_challenges ?? data?.active_matches ?? 0,
    openChallenges: data?.openChallenges ?? data?.open_challenges ?? 0,
    playingNow: data?.playingNow ?? data?.playing_now ?? data?.active_matches ?? 0,
    completedMatches: data?.completedMatches ?? data?.completed_matches ?? 0,
    totalCogAwarded: data?.totalCogAwarded ?? data?.total_cog_awarded ?? 0,
    totalAgents: data?.totalAgents ?? data?.total_agents ?? 0,
    onlineNow: data?.onlineNow ?? data?.online_agents ?? 0,
  };
}

export async function getArenaStatsLive() {
  try {
    const res = await fetch("http://localhost:3456/api/arena/stats", { next: { revalidate: 5 } });
    if (res.ok) {
      return normalizeArenaStats(await res.json());
    }
  } catch {}
  return normalizeArenaStats(store.getArenaStats());
}

export async function getArenaLiveMatchesAsync(limit = 50) {
  try {
    const { data } = await supabase
      .from("arena_matches")
      .select("*, agents!inner(name)")
      .in("status", ["playing", "scored"])
      .order("started_at", { ascending: false })
      .limit(limit);
    if (data && data.length > 0) {
      return data.map((m: any) => ({
        ...m,
        agent_name: m.agents?.name || "Unknown",
        game_type: m.game_type || "unknown",
        game_name: (m.game_type || "").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
        game_icon: "game",
      }));
    }
  } catch {}
  return store.getArenaLiveMatches(limit);
}

export async function getArenaLeaderboardAsync(limit = 25) {
  try {
    const res = await fetch("http://localhost:3456/api/arena/leaderboard?limit=" + limit, { next: { revalidate: 5 } });
    if (res.ok) {
      const d = await res.json();
      const lb = d.leaderboard || d || [];
      if (lb.length > 0) return lb;
    }
  } catch {}
  return store.getArenaLeaderboard(limit);
}

export async function getTrainingDataStats() {
  try {
    const [matchesRes, challengesRes, agentsRes] = await Promise.all([
      supabase.from("arena_matches").select("score, agent_id", { count: "exact" }).eq("status", "scored"),
      supabase.from("arena_challenges").select("game_type").eq("status", "completed"),
      supabase.from("arena_matches").select("agent_id").eq("status", "scored"),
    ]);
    const matches = matchesRes.data || [];
    const challenges = challengesRes.data || [];
    const agents = agentsRes.data || [];
    const avgScore = matches.length > 0
      ? Math.round(matches.reduce((s, m: any) => s + (parseFloat(m.score) || 0), 0) / matches.length)
      : 0;

    // Count matches per game type for pillar coverage
    const { data: gameMatches } = await supabase
      .from("arena_matches")
      .select("challenge_id")
      .eq("status", "scored");
    const pillarCounts: Record<string, number> = {};
    for (const c of challenges) {
      const gt = (c as any).game_type || "unknown";
      pillarCounts[gt] = (pillarCounts[gt] || 0) + 1;
    }

    return {
      totalMatches: matchesRes.count || matches.length,
      withText: 0, // Will increase as Watson logs Q&A pairs
      gameTypeCount: new Set(challenges.map((c: any) => c.game_type)).size,
      modelCount: new Set(agents.map((a: any) => a.agent_id)).size,
      avgScore,
      pillarCounts,
    };
  } catch {
    return { totalMatches: 0, withText: 0, gameTypeCount: 0, modelCount: 0, avgScore: 0, pillarCounts: {} };
  }
}

export async function getArenaChallengesAsync(gameType?: string) {
  try {
    let query = supabase.from("arena_challenges").select("*").order("created_at", { ascending: false });
    if (gameType) query = query.eq("game_type", gameType);
    const { data } = await query;
    if (data) return data;
  } catch {}
  return store.getArenaChallenges(gameType);
}
