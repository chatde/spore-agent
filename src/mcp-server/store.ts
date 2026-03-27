import type { Agent, Task, Bid, Delivery, Rating } from "./types.js";
import type {
  TokenBalance,
  TokenTransaction,
  ArenaChallenge,
  ArenaMatch,
  ArenaLeaderboardEntry,
  GameType,
} from "./arena/types.js";
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

  // Arena — Token balances
  getTokenBalance(agentId: string): Promise<TokenBalance | null>;
  creditTokens(agentId: string, amount: number, reason: string, referenceId?: string): Promise<void>;
  debitTokens(agentId: string, amount: number, reason: string, referenceId?: string): Promise<void>;
  getTokenTransactions(agentId: string, limit?: number): Promise<TokenTransaction[]>;

  // Arena — Challenges
  getChallenge(id: string): Promise<ArenaChallenge | null>;
  getOpenChallenges(gameType?: GameType): Promise<ArenaChallenge[]>;
  createChallenge(challenge: ArenaChallenge): Promise<void>;
  updateChallenge(id: string, updates: Partial<ArenaChallenge>): Promise<void>;

  // Arena — Matches
  getMatch(id: string): Promise<ArenaMatch | null>;
  getChallengeMatches(challengeId: string): Promise<ArenaMatch[]>;
  getAgentMatches(agentId: string, limit?: number): Promise<ArenaMatch[]>;
  createMatch(match: ArenaMatch): Promise<void>;
  updateMatch(id: string, updates: Partial<ArenaMatch>): Promise<void>;

  // Arena — Leaderboard & live
  getArenaLeaderboard(limit: number): Promise<ArenaLeaderboardEntry[]>;
  getLiveMatches(limit?: number): Promise<ArenaMatch[]>;
}

// In-memory implementation — wraps Maps with async interface
class MemoryStore implements IStore {
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, Task> = new Map();
  private bids: Map<string, Bid> = new Map();
  private deliveries: Map<string, Delivery> = new Map();
  private tokenBalances: Map<string, TokenBalance> = new Map();
  private tokenTransactions: Map<string, TokenTransaction> = new Map();
  private challenges: Map<string, ArenaChallenge> = new Map();
  private matches: Map<string, ArenaMatch> = new Map();

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

  // --- Arena: Token balances ---

  async getTokenBalance(agentId: string): Promise<TokenBalance | null> {
    return this.tokenBalances.get(agentId) ?? null;
  }

  async creditTokens(
    agentId: string,
    amount: number,
    reason: string,
    referenceId?: string
  ): Promise<void> {
    let bal = this.tokenBalances.get(agentId);
    if (!bal) {
      bal = { agent_id: agentId, balance: 0, lifetime_earned: 0, updated_at: new Date().toISOString() };
      this.tokenBalances.set(agentId, bal);
    }
    bal.balance += amount;
    bal.lifetime_earned += amount;
    bal.updated_at = new Date().toISOString();

    const txn: TokenTransaction = {
      id: crypto.randomUUID(),
      agent_id: agentId,
      amount,
      reason: reason as TokenTransaction["reason"],
      reference_id: referenceId,
      created_at: new Date().toISOString(),
    };
    this.tokenTransactions.set(txn.id, txn);
  }

  async debitTokens(
    agentId: string,
    amount: number,
    reason: string,
    referenceId?: string
  ): Promise<void> {
    const bal = this.tokenBalances.get(agentId);
    if (!bal || bal.balance < amount) {
      throw new Error(`Insufficient balance for agent ${agentId}`);
    }
    bal.balance -= amount;
    bal.updated_at = new Date().toISOString();

    const txn: TokenTransaction = {
      id: crypto.randomUUID(),
      agent_id: agentId,
      amount: -amount,
      reason: reason as TokenTransaction["reason"],
      reference_id: referenceId,
      created_at: new Date().toISOString(),
    };
    this.tokenTransactions.set(txn.id, txn);
  }

  async getTokenTransactions(agentId: string, limit?: number): Promise<TokenTransaction[]> {
    const txns = Array.from(this.tokenTransactions.values())
      .filter((t) => t.agent_id === agentId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return limit ? txns.slice(0, limit) : txns;
  }

  // --- Arena: Challenges ---

  async getChallenge(id: string): Promise<ArenaChallenge | null> {
    return this.challenges.get(id) ?? null;
  }

  async getOpenChallenges(gameType?: GameType): Promise<ArenaChallenge[]> {
    return Array.from(this.challenges.values())
      .filter((c) => c.status === "open" && (!gameType || c.game_type === gameType))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async createChallenge(challenge: ArenaChallenge): Promise<void> {
    this.challenges.set(challenge.id, challenge);
  }

  async updateChallenge(id: string, updates: Partial<ArenaChallenge>): Promise<void> {
    const challenge = this.challenges.get(id);
    if (challenge) Object.assign(challenge, updates);
  }

  // --- Arena: Matches ---

  async getMatch(id: string): Promise<ArenaMatch | null> {
    return this.matches.get(id) ?? null;
  }

  async getChallengeMatches(challengeId: string): Promise<ArenaMatch[]> {
    return Array.from(this.matches.values()).filter((m) => m.challenge_id === challengeId);
  }

  async getAgentMatches(agentId: string, limit?: number): Promise<ArenaMatch[]> {
    const results = Array.from(this.matches.values())
      .filter((m) => m.agent_id === agentId)
      .sort((a, b) => {
        const aTime = a.started_at ? new Date(a.started_at).getTime() : 0;
        const bTime = b.started_at ? new Date(b.started_at).getTime() : 0;
        return bTime - aTime;
      });
    return limit ? results.slice(0, limit) : results;
  }

  async createMatch(match: ArenaMatch): Promise<void> {
    // Enforce unique constraint: one match per agent per challenge
    const existing = Array.from(this.matches.values()).find(
      (m) => m.challenge_id === match.challenge_id && m.agent_id === match.agent_id
    );
    if (existing) {
      throw new Error(`Agent ${match.agent_id} already has a match in challenge ${match.challenge_id}`);
    }
    this.matches.set(match.id, match);
  }

  async updateMatch(id: string, updates: Partial<ArenaMatch>): Promise<void> {
    const match = this.matches.get(id);
    if (match) Object.assign(match, updates);
  }

  // --- Arena: Leaderboard & live ---

  async getArenaLeaderboard(limit: number): Promise<ArenaLeaderboardEntry[]> {
    const agentMap = new Map<string, { agent: Agent; bal: TokenBalance | undefined; matches: ArenaMatch[] }>();

    for (const match of this.matches.values()) {
      if (!agentMap.has(match.agent_id)) {
        const agent = this.agents.get(match.agent_id);
        if (!agent) continue;
        agentMap.set(match.agent_id, {
          agent,
          bal: this.tokenBalances.get(match.agent_id),
          matches: [],
        });
      }
      agentMap.get(match.agent_id)!.matches.push(match);
    }

    const entries: ArenaLeaderboardEntry[] = [];
    for (const [agentId, data] of agentMap) {
      const scored = data.matches.filter((m) => m.status === "scored");
      const avgScore = scored.length > 0
        ? scored.reduce((sum, m) => sum + m.score, 0) / scored.length
        : 0;

      // Count wins: highest score in their challenge among scored matches
      let wins = 0;
      for (const m of scored) {
        const challengeMatches = Array.from(this.matches.values()).filter(
          (cm) => cm.challenge_id === m.challenge_id && cm.status === "scored"
        );
        const maxScore = Math.max(...challengeMatches.map((cm) => cm.score));
        if (m.score === maxScore) wins++;
      }

      entries.push({
        agent_id: agentId,
        agent_name: data.agent.name,
        cog_balance: data.bal?.balance ?? 0,
        cog_lifetime: data.bal?.lifetime_earned ?? 0,
        matches_played: data.matches.length,
        matches_won: wins,
        avg_score: avgScore,
      });
    }

    return entries
      .sort((a, b) => {
        if (b.cog_lifetime !== a.cog_lifetime) return b.cog_lifetime - a.cog_lifetime;
        return b.avg_score - a.avg_score;
      })
      .slice(0, limit);
  }

  async getLiveMatches(limit?: number): Promise<ArenaMatch[]> {
    const live = Array.from(this.matches.values())
      .filter((m) => m.status === "joined" || m.status === "playing")
      .sort((a, b) => {
        const aTime = a.started_at ? new Date(a.started_at).getTime() : 0;
        const bTime = b.started_at ? new Date(b.started_at).getTime() : 0;
        return bTime - aTime;
      });
    return limit ? live.slice(0, limit) : live;
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
