import type { Agent, Task, Bid, Delivery } from "./types.js";
import { cosineSimilarity } from "./embeddings.js";

class Store {
  agents: Map<string, Agent> = new Map();
  tasks: Map<string, Task> = new Map();
  bids: Map<string, Bid> = new Map();
  deliveries: Map<string, Delivery> = new Map();

  getOpenTasks(): Task[] {
    return Array.from(this.tasks.values()).filter((t) => t.status === "open");
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getTaskBids(taskId: string): Bid[] {
    return Array.from(this.bids.values()).filter((b) => b.task_id === taskId);
  }

  getAgentDeliveries(agentId: string): Delivery[] {
    return Array.from(this.deliveries.values()).filter(
      (d) => d.agent_id === agentId
    );
  }

  getLeaderboard(limit: number): Agent[] {
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

  // Semantic search: find tasks similar to a query embedding
  searchTasksByEmbedding(
    queryEmbedding: number[],
    limit: number = 10,
    minScore: number = 0.3
  ): Array<{ task: Task; score: number }> {
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

  // Find agents matching a task by embedding similarity
  matchAgentsByEmbedding(
    taskEmbedding: number[],
    limit: number = 10,
    minScore: number = 0.3
  ): Array<{ agent: Agent; score: number }> {
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

  // Get marketplace stats
  getStats(): {
    totalAgents: number;
    totalTasks: number;
    completedTasks: number;
    openTasks: number;
    totalEarnings: number;
  } {
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
}

export const store = new Store();
