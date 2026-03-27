import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { store } from "./store.js";
import { registerRegistrationTools } from "./tools/registration.js";
import { registerTaskTools } from "./tools/tasks.js";
import { registerMarketplaceTools } from "./tools/marketplace.js";
import { registerReputationTools } from "./tools/reputation.js";
import { registerSemanticTools } from "./tools/semantic.js";
import { registerVerificationTools } from "./tools/verification.js";
import { registerPaymentTools } from "./tools/payments.js";
import { registerArenaTools } from "./tools/arena.js";
import { averageRating } from "./utils.js";
import { logToDiscord } from "../logging/discord-webhook.js";

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
registerPaymentTools(server);
registerArenaTools(server);

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
    const openTasks = await store.getOpenTasks();
    const tasks = await Promise.all(
      openTasks.map(async (t) => {
        const bids = await store.getTaskBids(t.id);
        return {
          task_id: t.id,
          title: t.title,
          description: t.description,
          requirements: t.requirements,
          budget_usd: t.budget_usd ?? null,
          posted_at: t.posted_at,
          bid_count: bids.length,
        };
      })
    );

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
    const allAgents = await store.getAllAgents();
    const agents = allAgents.map((a) => ({
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
    const topAgents = await store.getLeaderboard(25);
    const leaderboard = await Promise.all(
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

// Arena resources
server.registerResource(
  "arena-challenges",
  "spore://arena/challenges",
  {
    title: "Arena Challenges",
    description: "List of open arena challenges agents can join",
    mimeType: "application/json",
  },
  async (uri) => {
    const challenges = await store.getOpenChallenges();
    const result = challenges.map((c) => ({
      challenge_id: c.id,
      game_type: c.game_type,
      difficulty: c.difficulty,
      entry_fee_cog: c.entry_fee_cog,
      reward_pool_cog: c.reward_pool_cog,
      max_participants: c.max_participants,
      status: c.status,
      created_at: c.created_at,
    }));

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(
            { total: result.length, challenges: result },
            null,
            2
          ),
        },
      ],
    };
  }
);

server.registerResource(
  "arena-leaderboard",
  "spore://arena/leaderboard",
  {
    title: "Arena Leaderboard",
    description: "Top agents ranked by COG earnings in the arena",
    mimeType: "application/json",
  },
  async (uri) => {
    const leaderboard = await store.getArenaLeaderboard(25);

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(
            {
              total: leaderboard.length,
              leaderboard: leaderboard.map((entry, index) => ({
                rank: index + 1,
                ...entry,
              })),
            },
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
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Spore Agent MCP server running on stdio");
    logToDiscord("info", "Spore Agent MCP server started");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Failed to start MCP server:", message);
    logToDiscord("error", "Spore Agent MCP server failed to start", { error: message });
    throw error;
  }
}

main().catch((error: unknown) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
