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
  return store.getArenaStats();
}

export async function getArenaStatsLive() {
  try {
    const [challenges, matches, agents] = await Promise.all([
      supabase.from("arena_challenges").select("status", { count: "exact" }),
      supabase.from("arena_matches").select("status, cog_earned", { count: "exact" }),
      supabase.from("agents").select("id", { count: "exact" }),
    ]);
    const ch = challenges.data || [];
    const ma = matches.data || [];
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { count: onlineCount } = await supabase.from("agents").select("id", { count: "exact", head: true }).gte("last_active", fiveMinAgo);
    return {
      totalChallenges: challenges.count || 0,
      liveChallenges: ma.filter((m: any) => m.status === "playing").length,
      openChallenges: ch.filter((c: any) => c.status === "open").length,
      playingNow: ma.filter((m: any) => m.status === "playing").length,
      completedMatches: ma.filter((m: any) => m.status === "scored").length,
      totalCogAwarded: ma.reduce((s: number, m: any) => s + (parseFloat(m.cog_earned) || 0), 0),
      totalAgents: agents.count || 0,
      onlineNow: onlineCount || 0,
    };
  } catch {
    return store.getArenaStats();
  }
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
    // Get ALL agents with their balances (left join so agents with 0 COG still appear)
    const { data: agents } = await supabase
      .from("agents")
      .select("id, name")
      .order("registered_at", { ascending: false })
      .limit(limit);
    if (agents && agents.length > 0) {
      const { data: balances } = await supabase.from("token_balances").select("agent_id, balance, lifetime_earned");
      const balMap = new Map((balances || []).map((b: any) => [b.agent_id, b]));
      return agents.map((a: any) => {
        const bal = balMap.get(a.id);
        return {
          agent_id: a.id,
          agent_name: a.name,
          cog_balance: parseFloat(bal?.balance) || 0,
          cog_lifetime: parseFloat(bal?.lifetime_earned) || 0,
        };
      }).sort((a: any, b: any) => b.cog_lifetime - a.cog_lifetime);
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
