import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { store } from "../store.js";
import type { Bid, Delivery } from "../types.js";

export function registerMarketplaceTools(server: McpServer): void {
  server.registerTool("spore_bid", {
    title: "Bid on Task",
    description:
      "Submit a bid on an open task. Describe your approach and estimated time.",
    inputSchema: {
      task_id: z.string().describe("ID of the task to bid on"),
      agent_id: z.string().describe("Your agent ID"),
      approach: z
        .string()
        .describe("Describe how you would complete this task"),
      estimated_minutes: z
        .number()
        .describe("Estimated time to complete in minutes"),
    },
  }, async ({ task_id, agent_id, approach, estimated_minutes }) => {
    const task = store.tasks.get(task_id);
    if (!task) {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ error: "Task not found" }) }],
        isError: true,
      };
    }
    if (task.status !== "open") {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ error: "Task is not open for bids" }) }],
        isError: true,
      };
    }

    const agent = store.agents.get(agent_id);
    if (!agent) {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ error: "Agent not found. Register first." }) }],
        isError: true,
      };
    }

    const bid: Bid = {
      id: uuidv4(),
      task_id,
      agent_id,
      approach,
      estimated_minutes,
      submitted_at: new Date().toISOString(),
    };
    store.bids.set(bid.id, bid);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              bid_id: bid.id,
              task_id,
              agent_name: agent.name,
              status: "submitted",
              message: `Bid submitted on "${task.title}".`,
            },
            null,
            2
          ),
        },
      ],
    };
  });

  server.registerTool("spore_accept_bid", {
    title: "Accept Bid",
    description: "Accept a bid on a task, assigning it to the bidding agent.",
    inputSchema: {
      task_id: z.string().describe("ID of the task"),
      bid_id: z.string().describe("ID of the bid to accept"),
    },
  }, async ({ task_id, bid_id }) => {
    const task = store.tasks.get(task_id);
    if (!task) {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ error: "Task not found" }) }],
        isError: true,
      };
    }
    if (task.status !== "open") {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ error: "Task is not open" }) }],
        isError: true,
      };
    }

    const bid = store.bids.get(bid_id);
    if (!bid || bid.task_id !== task_id) {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ error: "Bid not found for this task" }) }],
        isError: true,
      };
    }

    task.status = "assigned";
    task.assigned_agent_id = bid.agent_id;
    task.accepted_bid_id = bid_id;

    const agent = store.agents.get(bid.agent_id);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              task_id,
              bid_id,
              assigned_agent: agent?.name ?? bid.agent_id,
              status: "assigned",
              message: `Bid accepted. Task "${task.title}" assigned to ${agent?.name ?? "agent"}.`,
            },
            null,
            2
          ),
        },
      ],
    };
  });

  server.registerTool("spore_deliver", {
    title: "Deliver Work",
    description:
      "Deliver completed work for an assigned task. Submit your result.",
    inputSchema: {
      task_id: z.string().describe("ID of the task"),
      agent_id: z.string().describe("Your agent ID"),
      result: z.string().describe("The completed work / deliverable"),
    },
  }, async ({ task_id, agent_id, result }) => {
    const task = store.tasks.get(task_id);
    if (!task) {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ error: "Task not found" }) }],
        isError: true,
      };
    }
    if (task.status !== "assigned") {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ error: "Task is not in assigned state" }) }],
        isError: true,
      };
    }
    if (task.assigned_agent_id !== agent_id) {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ error: "You are not assigned to this task" }) }],
        isError: true,
      };
    }

    const delivery: Delivery = {
      id: uuidv4(),
      task_id,
      agent_id,
      result,
      delivered_at: new Date().toISOString(),
    };
    store.deliveries.set(delivery.id, delivery);
    task.status = "delivered";

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              delivery_id: delivery.id,
              task_id,
              status: "delivered",
              message: `Work delivered for "${task.title}". Awaiting rating.`,
            },
            null,
            2
          ),
        },
      ],
    };
  });
}
