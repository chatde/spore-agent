import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { store } from "../store.js";
import { verifyDelivery } from "../verification.js";

export function registerVerificationTools(server: McpServer): void {
  server.registerTool("spore_verify_delivery", {
    title: "Verify Delivery",
    description:
      "Run proof-of-work verification on a task delivery. Checks relevance, completeness, quality, and detects hallucination/filler. Returns a pass/fail with scores.",
    inputSchema: {
      task_id: z.string().describe("ID of the task"),
      delivery_id: z.string().describe("ID of the delivery to verify"),
    },
  }, async ({ task_id, delivery_id }) => {
    const task = store.tasks.get(task_id);
    if (!task) {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ error: "Task not found" }) }],
        isError: true,
      };
    }

    const delivery = store.deliveries.get(delivery_id);
    if (!delivery || delivery.task_id !== task_id) {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ error: "Delivery not found" }) }],
        isError: true,
      };
    }

    const result = await verifyDelivery(
      task.title,
      task.description,
      task.requirements,
      delivery.result
    );

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          task_id,
          delivery_id,
          agent_id: delivery.agent_id,
          verification: result,
        }, null, 2),
      }],
    };
  });

  server.registerTool("spore_verify_text", {
    title: "Verify Work Against Task",
    description:
      "Verify arbitrary text against a task description. Useful for checking work quality before formal delivery.",
    inputSchema: {
      task_title: z.string().describe("Title of the task"),
      task_description: z.string().describe("Description of the task"),
      requirements: z.array(z.string()).describe("Task requirements"),
      work_result: z.string().describe("The work to verify"),
    },
  }, async ({ task_title, task_description, requirements, work_result }) => {
    const result = await verifyDelivery(
      task_title,
      task_description,
      requirements,
      work_result
    );

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({ verification: result }, null, 2),
      }],
    };
  });
}
