import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { store } from "./store.js";
import { registerRegistrationTools } from "./tools/registration.js";
import { registerTaskTools } from "./tools/tasks.js";
import { registerMarketplaceTools } from "./tools/marketplace.js";
import { registerReputationTools } from "./tools/reputation.js";
import { registerSemanticTools } from "./tools/semantic.js";
import { registerVerificationTools } from "./tools/verification.js";
import { averageRating } from "./utils.js";

const server = new McpServer({
  name: "spore-agent",
  version: "1.0.0",
});

// Register all tools
registerRegistrationTools(server);
registerTaskTools(server);
registerMarketplaceTools(server);
registerReputationTools(server);
registerSemanticTools(server);
registerVerificationTools(server);

// Register resources
server.registerResource(
  "open-tasks",
  "spore://tasks/open",
  {
    title: "Open Tasks",
    description: "List of all open tasks on the Spore marketplace",
    mimeType: "application/json",
  },
  async (uri) => {
    const tasks = store.getOpenTasks().map((t) => ({
      task_id: t.id,
      title: t.title,
      description: t.description,
      requirements: t.requirements,
      budget_usd: t.budget_usd ?? null,
      posted_at: t.posted_at,
      bid_count: store.getTaskBids(t.id).length,
    }));

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify({ total: tasks.length, tasks }, null, 2),
        },
      ],
    };
  }
);

server.registerResource(
  "agent-directory",
  "spore://agents/directory",
  {
    title: "Agent Directory",
    description: "Directory of all registered agents with their capabilities",
    mimeType: "application/json",
  },
  async (uri) => {
    const agents = Array.from(store.agents.values()).map((a) => ({
        agent_id: a.id,
        name: a.name,
        capabilities: a.capabilities,
        description: a.description,
        average_rating: averageRating(a.ratings),
        total_ratings: a.ratings.length,
        registered_at: a.registered_at,
    }));

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify({ total: agents.length, agents }, null, 2),
        },
      ],
    };
  }
);

server.registerResource(
  "leaderboard",
  "spore://leaderboard",
  {
    title: "Leaderboard",
    description: "Top agents ranked by reputation score",
    mimeType: "application/json",
  },
  async (uri) => {
    const topAgents = store.getLeaderboard(25);
    const leaderboard = topAgents.map((agent, index) => ({
      rank: index + 1,
      agent_id: agent.id,
      agent_name: agent.name,
      average_rating: averageRating(agent.ratings) ?? 0,
      total_deliveries: store.getAgentDeliveries(agent.id).length,
      total_ratings: agent.ratings.length,
    }));

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(
            { total: leaderboard.length, leaderboard },
            null,
            2
          ),
        },
      ],
    };
  }
);

// Start the server
async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Spore Agent MCP server running on stdio");
}

main().catch((error: unknown) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
