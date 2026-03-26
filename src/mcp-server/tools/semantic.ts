import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { store } from "../store.js";
import { embedQuery } from "../embeddings.js";
import { averageRating } from "../utils.js";

export function registerSemanticTools(server: McpServer): void {
  server.registerTool("spore_search_tasks", {
    title: "Search Tasks",
    description:
      "Semantically search for tasks using natural language. Uses Google Embeddings for intelligent matching instead of keyword filtering.",
    inputSchema: {
      query: z.string().describe("Natural language description of what you're looking for"),
      limit: z.number().default(10).describe("Maximum results to return"),
    },
  }, async ({ query, limit }) => {
    try {
      const queryEmbedding = await embedQuery(query);
      const results = await store.searchTasksByEmbedding(queryEmbedding, limit);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            query,
            total: results.length,
            tasks: await Promise.all(
              results.map(async (r) => {
                const bids = await store.getTaskBids(r.task.id);
                return {
                  task_id: r.task.id,
                  title: r.task.title,
                  description: r.task.description,
                  requirements: r.task.requirements,
                  budget_usd: r.task.budget_usd ?? null,
                  status: r.task.status,
                  similarity: Math.round(r.score * 1000) / 1000,
                  bid_count: bids.length,
                };
              })
            ),
          }, null, 2),
        }],
      };
    } catch (err) {
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({ error: `Semantic search failed: ${err}` }),
        }],
        isError: true,
      };
    }
  });

  server.registerTool("spore_match_agents", {
    title: "Match Agents to Task",
    description:
      "Find the best-matching agents for a task description using embedding similarity.",
    inputSchema: {
      task_description: z.string().describe("Description of the task to find agents for"),
      limit: z.number().default(5).describe("Maximum agents to return"),
    },
  }, async ({ task_description, limit }) => {
    try {
      const taskEmbedding = await embedQuery(task_description);
      const matches = await store.matchAgentsByEmbedding(taskEmbedding, limit);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            total: matches.length,
            agents: matches.map((m) => {
              return {
                agent_id: m.agent.id,
                name: m.agent.name,
                capabilities: m.agent.capabilities,
                description: m.agent.description,
                match_score: Math.round(m.score * 1000) / 1000,
                average_rating: averageRating(m.agent.ratings),
                total_ratings: m.agent.ratings.length,
              };
            }),
          }, null, 2),
        }],
      };
    } catch (err) {
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({ error: `Agent matching failed: ${err}` }),
        }],
        isError: true,
      };
    }
  });

  server.registerTool("spore_similar_tasks", {
    title: "Find Similar Tasks",
    description:
      "Find tasks similar to a given task using embedding similarity.",
    inputSchema: {
      task_id: z.string().describe("ID of the task to find similar tasks for"),
      limit: z.number().default(5).describe("Maximum results"),
    },
  }, async ({ task_id, limit }) => {
    const task = await store.getTask(task_id);
    if (!task) {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ error: "Task not found" }) }],
        isError: true,
      };
    }

    if (!task.embedding) {
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({ error: "Task has no embedding. Cannot find similar tasks." }),
        }],
        isError: true,
      };
    }

    const results = (await store.searchTasksByEmbedding(task.embedding, limit + 1))
      .filter((r) => r.task.id !== task_id)
      .slice(0, limit);

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          source_task: { id: task.id, title: task.title },
          total: results.length,
          similar_tasks: results.map((r) => ({
            task_id: r.task.id,
            title: r.task.title,
            description: r.task.description,
            requirements: r.task.requirements,
            similarity: Math.round(r.score * 1000) / 1000,
            status: r.task.status,
          })),
        }, null, 2),
      }],
    };
  });
}
