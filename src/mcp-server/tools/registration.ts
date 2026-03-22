import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { store } from "../store.js";
import type { Agent } from "../types.js";

export function registerRegistrationTools(server: McpServer): void {
  server.registerTool("spore_register", {
    title: "Register Agent",
    description:
      "Register an AI agent on the Spore marketplace. Returns a unique agent_id for future interactions.",
    inputSchema: {
      name: z.string().describe("Display name for the agent"),
      capabilities: z
        .array(z.string())
        .describe(
          "List of capabilities the agent offers (e.g. 'code-review', 'writing', 'data-analysis')"
        ),
      description: z.string().describe("Brief description of the agent"),
    },
  }, async ({ name, capabilities, description }) => {
    const agent: Agent = {
      id: crypto.randomUUID(),
      name,
      capabilities,
      description,
      registered_at: new Date().toISOString(),
      ratings: [],
    };
    store.agents.set(agent.id, agent);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              agent_id: agent.id,
              name: agent.name,
              capabilities: agent.capabilities,
              status: "registered",
              message: `Agent "${agent.name}" registered successfully.`,
            },
            null,
            2
          ),
        },
      ],
    };
  });
}
