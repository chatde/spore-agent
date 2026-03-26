import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { store } from "../store.js";
import type { Rating, ReputationData, LeaderboardEntry } from "../types.js";
import { averageRating } from "../utils.js";

export function registerReputationTools(server: McpServer): void {
  server.registerTool("spore_rate", {
    title: "Rate Interaction",
    description:
      "Rate a completed task delivery. Only delivered tasks can be rated.",
    inputSchema: {
      task_id: z.string().describe("ID of the task to rate"),
      rating: z
        .number()
        .min(1)
        .max(5)
        .describe("Rating from 1 (poor) to 5 (excellent)"),
      feedback: z.string().describe("Written feedback about the delivery"),
    },
  }, async ({ task_id, rating, feedback }) => {
    const task = await store.getTask(task_id);
    if (!task) {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ error: "Task not found" }) }],
        isError: true,
      };
    }
    if (task.status !== "delivered") {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              error: "Task must be in delivered state to rate",
            }),
          },
        ],
        isError: true,
      };
    }

    const agentId = task.assigned_agent_id;
    if (!agentId) {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ error: "No agent assigned to this task" }) }],
        isError: true,
      };
    }

    const agent = await store.getAgent(agentId);
    if (!agent) {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ error: "Agent not found" }) }],
        isError: true,
      };
    }

    const ratingEntry: Rating = {
      task_id,
      rating,
      feedback,
      rated_at: new Date().toISOString(),
    };
    await store.createRating(agentId, ratingEntry);
    await store.updateTask(task_id, { status: "completed" });

    // Re-fetch updated agent
    const updatedAgent = await store.getAgent(agentId);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              task_id,
              agent_id: agentId,
              agent_name: agent.name,
              rating,
              new_average: averageRating(updatedAgent?.ratings ?? []),
              total_ratings: (updatedAgent?.ratings ?? []).length,
              status: "rated",
              message: `Rated ${agent.name} ${rating}/5 for "${task.title}".`,
            },
            null,
            2
          ),
        },
      ],
    };
  });

  server.registerTool("spore_reputation", {
    title: "Agent Reputation",
    description:
      "Get the full reputation profile for an agent, including all ratings.",
    inputSchema: {
      agent_id: z.string().describe("ID of the agent to look up"),
    },
  }, async ({ agent_id }) => {
    const agent = await store.getAgent(agent_id);
    if (!agent) {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ error: "Agent not found" }) }],
        isError: true,
      };
    }

    const deliveries = await store.getAgentDeliveries(agent_id);

    const reputation: ReputationData = {
      agent_id: agent.id,
      agent_name: agent.name,
      total_ratings: agent.ratings.length,
      average_rating: averageRating(agent.ratings) ?? 0,
      total_deliveries: deliveries.length,
      capabilities: agent.capabilities,
      ratings: agent.ratings,
    };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(reputation, null, 2),
        },
      ],
    };
  });

  server.registerTool("spore_leaderboard", {
    title: "Leaderboard",
    description:
      "View the top agents ranked by reputation score.",
    inputSchema: {
      limit: z
        .number()
        .default(10)
        .describe("Number of top agents to return (default 10)"),
    },
  }, async ({ limit }) => {
    const topAgents = await store.getLeaderboard(limit);

    const leaderboard: LeaderboardEntry[] = await Promise.all(
      topAgents.map(async (agent, index) => {
        const deliveries = await store.getAgentDeliveries(agent.id);
        return {
          rank: index + 1,
          agent_id: agent.id,
          agent_name: agent.name,
          average_rating: averageRating(agent.ratings) ?? 0,
          total_deliveries: deliveries.length,
          total_ratings: agent.ratings.length,
        };
      })
    );

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            { total: leaderboard.length, leaderboard },
            null,
            2
          ),
        },
      ],
    };
  });
}
