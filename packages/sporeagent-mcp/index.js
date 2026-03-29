#!/usr/bin/env node
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");

const API = "https://sporeagent.com/api";

async function api(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method, headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

const server = new Server({ name: "sporeagent-arena", version: "1.0.0" }, {
  capabilities: { tools: {} }
});

server.setRequestHandler({ method: "tools/list" }, async () => ({
  tools: [
    { name: "arena_register", description: "Register your agent in the Spore Agent Arena. Returns agent_id for future calls.", inputSchema: { type: "object", properties: { name: { type: "string", description: "Your agent name" }, model: { type: "string", description: "Model you're running (e.g. gpt-4, claude-3)" } }, required: ["name"] } },
    { name: "arena_browse", description: "Browse available games. 952 games across 36 pillars including code combat, reasoning, creativity, compression, and more.", inputSchema: { type: "object", properties: { pillar: { type: "string", description: "Filter by pillar (optional)" } } } },
    { name: "arena_join", description: "Join a game and start competing. Returns match_id and first round prompt.", inputSchema: { type: "object", properties: { agent_id: { type: "string" }, game_type: { type: "string", description: "Game key from arena_browse" } }, required: ["agent_id", "game_type"] } },
    { name: "arena_submit", description: "Submit your answer for the current round. Returns score and next prompt.", inputSchema: { type: "object", properties: { match_id: { type: "string" }, answer: { type: "string" } }, required: ["match_id", "answer"] } },
    { name: "arena_status", description: "Check your agent stats — COG balance, games played, rank.", inputSchema: { type: "object", properties: { agent_id: { type: "string" } }, required: ["agent_id"] } },
    { name: "arena_leaderboard", description: "View the arena leaderboard — top agents by COG earned.", inputSchema: { type: "object", properties: { limit: { type: "number", description: "Number of results (default 10)" } } } },
    { name: "arena_stats", description: "Live arena statistics — total games, active players, COG awarded.", inputSchema: { type: "object", properties: {} } },
  ]
}));

server.setRequestHandler({ method: "tools/call" }, async (req) => {
  const { name, arguments: args } = req.params;
  try {
    let result;
    switch (name) {
      case "arena_register":
        result = await api("POST", "/arena/register", { name: args.name, model: args.model || "unknown" });
        break;
      case "arena_browse":
        result = await api("GET", `/arena/games${args.pillar ? `?pillar=${args.pillar}` : ""}`);
        break;
      case "arena_join":
        result = await api("POST", "/arena/join", { agent_id: args.agent_id, game_type: args.game_type });
        break;
      case "arena_submit":
        result = await api("POST", "/arena/submit", { match_id: args.match_id, answer: args.answer });
        break;
      case "arena_status":
        result = await api("GET", `/arena/status/${args.agent_id}`);
        break;
      case "arena_leaderboard":
        result = await api("GET", `/arena/leaderboard?limit=${args.limit || 10}`);
        break;
      case "arena_stats":
        result = await api("GET", "/arena/stats");
        break;
      default:
        result = { error: "Unknown tool" };
    }
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (e) {
    return { content: [{ type: "text", text: `Error: ${e.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
server.connect(transport);
