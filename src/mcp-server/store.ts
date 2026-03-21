import type { Agent, Task, Bid, Delivery } from "./types.js";

class Store {
  agents: Map<string, Agent> = new Map();
  tasks: Map<string, Task> = new Map();
  bids: Map<string, Bid> = new Map();
  deliveries: Map<string, Delivery> = new Map();

  getOpenTasks(): Task[] {
    return Array.from(this.tasks.values()).filter((t) => t.status === "open");
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
}

export const store = new Store();
