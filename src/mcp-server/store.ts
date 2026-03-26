import type { Agent, Task, Bid, Delivery, Rating } from "./types.js";
import { cosineSimilarity } from "./embeddings.js";
import { SupabaseStore } from "./store-supabase.js";
import { isSupabaseEnabled } from "./supabase.js";

// Unified async store interface — both in-memory and Supabase implement this
export interface IStore {
  // Agents
  getAgent(id: string): Promise<Agent | null>;
  getAllAgents(): Promise<Agent[]>;
  createAgent(agent: Agent): Promise<void>;

  // Tasks
  getTask(id: string): Promise<Task | null>;
  getOpenTasks(): Promise<Task[]>;
  getAllTasks(): Promise<Task[]>;
  createTask(task: Task): Promise<void>;
  updateTask(id: string, updates: Partial<Task>): Promise<void>;

  // Bids
  getBid(id: string): Promise<Bid | null>;
  getTaskBids(taskId: string): Promise<Bid[]>;
  createBid(bid: Bid): Promise<void>;

  // Deliveries
  getDelivery(id: string): Promise<Delivery | null>;
  getAgentDeliveries(agentId: string): Promise<Delivery[]>;
  getTaskDeliveries(taskId: string): Promise<Delivery[]>;
  createDelivery(delivery: Delivery): Promise<void>;

  // Ratings
  getAgentRatings(agentId: string): Promise<Rating[]>;
  createRating(agentId: string, rating: Rating): Promise<void>;

  // Aggregates
  getLeaderboard(limit: number): Promise<Agent[]>;
  getStats(): Promise<{
    totalAgents: number;
    totalTasks: number;
    completedTasks: number;
    openTasks: number;
    totalEarnings: number;
  }>;

  // Semantic search
  searchTasksByEmbedding(
    queryEmbedding: number[],
    limit?: number,
    minScore?: number
  ): Promise<Array<{ task: Task; score: number }>>;
  matchAgentsByEmbedding(
    taskEmbedding: number[],
    limit?: number,
    minScore?: number
  ): Promise<Array<{ agent: Agent; score: number }>>;
}

// In-memory implementation — wraps Maps with async interface
class MemoryStore implements IStore {
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, Task> = new Map();
  private bids: Map<string, Bid> = new Map();
  private deliveries: Map<string, Delivery> = new Map();

  async getAgent(id: string): Promise<Agent | null> {
    return this.agents.get(id) ?? null;
  }

  async getAllAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async createAgent(agent: Agent): Promise<void> {
    this.agents.set(agent.id, agent);
  }

  async getTask(id: string): Promise<Task | null> {
    return this.tasks.get(id) ?? null;
  }

  async getOpenTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter((t) => t.status === "open");
  }

  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async createTask(task: Task): Promise<void> {
    this.tasks.set(task.id, task);
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    const task = this.tasks.get(id);
    if (task) Object.assign(task, updates);
  }

  async getBid(id: string): Promise<Bid | null> {
    return this.bids.get(id) ?? null;
  }

  async getTaskBids(taskId: string): Promise<Bid[]> {
    return Array.from(this.bids.values()).filter((b) => b.task_id === taskId);
  }

  async createBid(bid: Bid): Promise<void> {
    this.bids.set(bid.id, bid);
  }

  async getDelivery(id: string): Promise<Delivery | null> {
    return this.deliveries.get(id) ?? null;
  }

  async getAgentDeliveries(agentId: string): Promise<Delivery[]> {
    return Array.from(this.deliveries.values()).filter(
      (d) => d.agent_id === agentId
    );
  }

  async getTaskDeliveries(taskId: string): Promise<Delivery[]> {
    return Array.from(this.deliveries.values()).filter(
      (d) => d.task_id === taskId
    );
  }

  async createDelivery(delivery: Delivery): Promise<void> {
    this.deliveries.set(delivery.id, delivery);
  }

  async getAgentRatings(agentId: string): Promise<Rating[]> {
    const agent = this.agents.get(agentId);
    return agent?.ratings ?? [];
  }

  async createRating(agentId: string, rating: Rating): Promise<void> {
    const agent = this.agents.get(agentId);
    if (agent) agent.ratings.push(rating);
  }

  async getLeaderboard(limit: number): Promise<Agent[]> {
    const agents = Array.from(this.agents.values());
    return agents
      .filter((a) => a.ratings.length > 0)
      .sort((a, b) => {
        const avgA =
          a.ratings.reduce((sum, r) => sum + r.rating, 0) / a.ratings.length;
        const avgB =
          b.ratings.reduce((sum, r) => sum + r.rating, 0) / b.ratings.length;
        if (avgB !== avgA) return avgB - avgA;
        return b.ratings.length - a.ratings.length;
      })
      .slice(0, limit);
  }

  async getStats() {
    const tasks = Array.from(this.tasks.values());
    const completed = tasks.filter((t) => t.status === "completed");
    const open = tasks.filter((t) => t.status === "open");
    const totalEarnings = completed.reduce(
      (sum, t) => sum + (t.budget_usd ?? 0),
      0
    );

    return {
      totalAgents: this.agents.size,
      totalTasks: this.tasks.size,
      completedTasks: completed.length,
      openTasks: open.length,
      totalEarnings,
    };
  }

  async searchTasksByEmbedding(
    queryEmbedding: number[],
    limit: number = 10,
    minScore: number = 0.3
  ): Promise<Array<{ task: Task; score: number }>> {
    const results: Array<{ task: Task; score: number }> = [];

    for (const task of this.tasks.values()) {
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
    const results: Array<{ agent: Agent; score: number }> = [];

    for (const agent of this.agents.values()) {
      if (!agent.embedding) continue;
      const score = cosineSimilarity(taskEmbedding, agent.embedding);
      if (score >= minScore) {
        results.push({ agent, score });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}

// Pick implementation based on env
const useSupabase = isSupabaseEnabled();

if (useSupabase) {
  console.log("[STORE] Using Supabase-backed store");
} else {
  console.log("[STORE] Using in-memory store (set SUPABASE_URL + SUPABASE_SERVICE_KEY to use Supabase)");
}

export const store: IStore = useSupabase ? new SupabaseStore() : new MemoryStore();
