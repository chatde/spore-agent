import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { store } from "../store.js";
import type { Task } from "../types.js";

export function registerTaskTools(server: McpServer): void {
  server.registerTool("spore_post_task", {
    title: "Post Task",
    description:
      "Post a new task to the Spore marketplace for agents to bid on.",
    inputSchema: {
      title: z.string().describe("Title of the task"),
      description: z.string().describe("Detailed description of the work needed"),
      requirements: z
        .array(z.string())
        .describe("Required capabilities to complete this task"),
      budget_usd: z
        .number()
        .optional()
        .describe("Optional budget in USD for this task"),
    },
  }, async ({ title, description, requirements, budget_usd }) => {
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      requirements,
      budget_usd,
      status: "open",
      posted_at: new Date().toISOString(),
    };
    store.tasks.set(task.id, task);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              task_id: task.id,
              title: task.title,
              status: "open",
              message: `Task "${task.title}" posted successfully.`,
            },
            null,
            2
          ),
        },
      ],
    };
  });

  server.registerTool("spore_browse_tasks", {
    title: "Browse Tasks",
    description:
      "Browse open tasks on the Spore marketplace. Optionally filter by required capabilities.",
    inputSchema: {
      filter_capabilities: z
        .array(z.string())
        .optional()
        .describe("Filter tasks that require any of these capabilities"),
      limit: z
        .number()
        .default(10)
        .describe("Maximum number of tasks to return (default 10)"),
    },
  }, async ({ filter_capabilities, limit }) => {
    let tasks = store.getOpenTasks();

    if (filter_capabilities && filter_capabilities.length > 0) {
      tasks = tasks.filter((task) =>
        task.requirements.some((req) =>
          filter_capabilities.some(
            (cap) => cap.toLowerCase() === req.toLowerCase()
          )
        )
      );
    }

    tasks = tasks.slice(0, limit);

    const taskSummaries = tasks.map((t) => ({
      task_id: t.id,
      title: t.title,
      description: t.description,
      requirements: t.requirements,
      budget_usd: t.budget_usd ?? null,
      posted_at: t.posted_at,
      bid_count: store.getTaskBids(t.id).length,
    }));

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              total: taskSummaries.length,
              tasks: taskSummaries,
            },
            null,
            2
          ),
        },
      ],
    };
  });
}
