import { supabase } from "./supabase.js";
import { cosineSimilarity } from "./embeddings.js";
import type { IStore } from "./store.js";
import type { Agent, Task, Bid, Delivery, Rating } from "./types.js";

// Supabase-backed store — implements the same IStore interface
export class SupabaseStore implements IStore {
  // --- Agents ---
  async getAgent(id: string): Promise<Agent | null> {
    const { data } = await supabase!.from("agents").select("*").eq("id", id).single();
    if (!data) return null;
    const ratings = await this.getAgentRatings(id);
    return { ...data, ratings };
  }

  async getAllAgents(): Promise<Agent[]> {
    const { data } = await supabase!.from("agents").select("*").order("registered_at", { ascending: false });
    if (!data) return [];
    const agents: Agent[] = [];
    for (const a of data) {
      const ratings = await this.getAgentRatings(a.id);
      agents.push({ ...a, ratings });
    }
    return agents;
  }

  async createAgent(agent: Agent): Promise<void> {
    const { id, name, capabilities, description, registered_at } = agent;
    const { error } = await supabase!.from("agents").insert({ id, name, capabilities, description, registered_at });
    if (error) console.error(`[SUPABASE] createAgent error: ${error.message}`);
  }

  // --- Tasks ---
  async getTask(id: string): Promise<Task | null> {
    const { data } = await supabase!.from("tasks").select("*").eq("id", id).single();
    return data ?? null;
  }

  async getOpenTasks(): Promise<Task[]> {
    const { data } = await supabase!.from("tasks").select("*").eq("status", "open").order("posted_at", { ascending: false });
    return data ?? [];
  }

  async getAllTasks(): Promise<Task[]> {
    const { data } = await supabase!.from("tasks").select("*").order("posted_at", { ascending: false });
    return data ?? [];
  }

  async createTask(task: Task): Promise<void> {
    const { id, title, description, requirements, budget_usd, status, posted_at, poster_id } = task;
    const { error } = await supabase!.from("tasks").insert({ id, title, description, requirements, budget_usd, status, posted_at, poster_id });
    if (error) console.error(`[SUPABASE] createTask error: ${error.message}`);
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    const { embedding, ...rest } = updates as any;
    await supabase!.from("tasks").update(rest).eq("id", id);
  }

  // --- Bids ---
  async getBid(id: string): Promise<Bid | null> {
    const { data } = await supabase!.from("bids").select("*").eq("id", id).single();
    return data ?? null;
  }

  async getTaskBids(taskId: string): Promise<Bid[]> {
    const { data } = await supabase!.from("bids").select("*").eq("task_id", taskId).order("submitted_at", { ascending: true });
    return data ?? [];
  }

  async createBid(bid: Bid): Promise<void> {
    await supabase!.from("bids").insert(bid);
  }

  // --- Deliveries ---
  async getDelivery(id: string): Promise<Delivery | null> {
    const { data } = await supabase!.from("deliveries").select("*").eq("id", id).single();
    return data ?? null;
  }

  async getAgentDeliveries(agentId: string): Promise<Delivery[]> {
    const { data } = await supabase!.from("deliveries").select("*").eq("agent_id", agentId);
    return data ?? [];
  }

  async getTaskDeliveries(taskId: string): Promise<Delivery[]> {
    const { data } = await supabase!.from("deliveries").select("*").eq("task_id", taskId);
    return data ?? [];
  }

  async createDelivery(delivery: Delivery): Promise<void> {
    await supabase!.from("deliveries").insert(delivery);
  }

  // --- Ratings ---
  async getAgentRatings(agentId: string): Promise<Rating[]> {
    const { data } = await supabase!.from("ratings").select("*").eq("agent_id", agentId).order("rated_at", { ascending: false });
    return data ?? [];
  }

  async createRating(agentId: string, rating: Rating): Promise<void> {
    await supabase!.from("ratings").insert({ ...rating, agent_id: agentId });
  }

  // --- Leaderboard ---
  async getLeaderboard(limit: number): Promise<Agent[]> {
    const { data } = await supabase!.from("agent_leaderboard").select("*").limit(limit);
    if (!data) return [];
    const agents: Agent[] = [];
    for (const row of data) {
      const agent = await this.getAgent(row.agent_id);
      if (agent) agents.push(agent);
    }
    return agents;
  }

  // --- Stats ---
  async getStats(): Promise<{
    totalAgents: number;
    totalTasks: number;
    completedTasks: number;
    openTasks: number;
    totalEarnings: number;
  }> {
    const [
      { count: totalAgents },
      { count: totalTasks },
      { count: completedTasks },
      { count: openTasks },
    ] = await Promise.all([
      supabase!.from("agents").select("*", { count: "exact", head: true }),
      supabase!.from("tasks").select("*", { count: "exact", head: true }),
      supabase!.from("tasks").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabase!.from("tasks").select("*", { count: "exact", head: true }).eq("status", "open"),
    ]);

    const { data: completedData } = await supabase!.from("tasks").select("budget_usd").eq("status", "completed");
    const totalEarnings = (completedData ?? []).reduce((sum, t) => sum + (t.budget_usd ?? 0), 0);

    return {
      totalAgents: totalAgents ?? 0,
      totalTasks: totalTasks ?? 0,
      completedTasks: completedTasks ?? 0,
      openTasks: openTasks ?? 0,
      totalEarnings,
    };
  }

  // --- Semantic search (client-side for now, Supabase pgvector later) ---
  async searchTasksByEmbedding(
    queryEmbedding: number[],
    limit: number = 10,
    minScore: number = 0.3
  ): Promise<Array<{ task: Task; score: number }>> {
    const tasks = await this.getAllTasks();
    const results: Array<{ task: Task; score: number }> = [];

    for (const task of tasks) {
      if (!task.embedding) continue;
      const score = cosineSimilarity(queryEmbedding, task.embedding);
      if (score >= minScore) {
        results.push({ task, score });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  async matchAgentsByEmbedding(
    taskEmbedding: number[],
    limit: number = 10,
    minScore: number = 0.3
  ): Promise<Array<{ agent: Agent; score: number }>> {
    const agents = await this.getAllAgents();
    const results: Array<{ agent: Agent; score: number }> = [];

    for (const agent of agents) {
      if (!agent.embedding) continue;
      const score = cosineSimilarity(taskEmbedding, agent.embedding);
      if (score >= minScore) {
        results.push({ agent, score });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  // --- Arena stubs (TODO: implement with Supabase queries) ---
  async getTokenBalance(agentId: string) { return null; }
  async creditTokens(agentId: string, amount: number, reason: string, referenceId?: string) {}
  async debitTokens(agentId: string, amount: number, reason: string, referenceId?: string) {}
  async getTokenTransactions(agentId: string, limit?: number) { return []; }
  async getChallenge(id: string) { return null; }
  async getOpenChallenges(gameType?: string) { return []; }
  async createChallenge(challenge: any) {}
  async updateChallenge(id: string, updates: any) {}
  async getMatch(id: string) { return null; }
  async getChallengeMatches(challengeId: string) { return []; }
  async getAgentMatches(agentId: string, limit?: number) { return []; }
  async createMatch(match: any) {}
  async updateMatch(id: string, updates: any) {}
  async getArenaLeaderboard(limit: number) { return []; }
  async getLiveMatches(limit?: number) { return []; }
}
