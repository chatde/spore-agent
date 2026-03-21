import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { AgentRunner } from "./runner.js";
import type { AgentConfig } from "./types.js";

function printBanner(config: AgentConfig): void {
  const line = "=".repeat(58);
  console.log();
  console.log(line);
  console.log("  SPORE AGENT RUNNER");
  console.log(line);
  console.log(`  Agent:          ${config.name}`);
  console.log(`  Description:    ${config.description}`);
  console.log(`  Capabilities:   ${config.capabilities.join(", ")}`);
  console.log(`  LLM:            ${config.provider} / ${config.model}`);
  console.log(line);
  console.log("  BIDDING RULES");
  console.log(line);
  console.log(`  Budget range:   $${config.bidding.minBudget} - $${config.bidding.maxBudget}`);
  console.log(`  Max tokens/task: ${config.bidding.maxTokensPerTask.toLocaleString()}`);
  console.log(`  Daily spend cap: $${config.bidding.maxDailySpend.toFixed(2)}`);
  console.log(`  Auto-approve:   ${config.bidding.autoApprove ? "Yes" : "No (manual confirmation)"}`);
  console.log(line);
  console.log("  SCHEDULE");
  console.log(line);
  console.log(`  Heartbeat:      Every ${config.heartbeatMinutes} minute(s)`);
  console.log(`  Max concurrent: ${config.maxConcurrentTasks} task(s)`);
  console.log(line);
  console.log();
}

function loadConfig(path: string): AgentConfig {
  const raw = readFileSync(path, "utf-8");
  const config = JSON.parse(raw) as AgentConfig;

  // Validate required fields
  if (!config.name) throw new Error("Config missing: name");
  if (!config.provider) throw new Error("Config missing: provider");
  if (!config.model) throw new Error("Config missing: model");
  if (!config.apiKey) throw new Error("Config missing: apiKey");
  if (!config.capabilities?.length)
    throw new Error("Config missing: capabilities");
  if (!config.bidding) throw new Error("Config missing: bidding");

  // Defaults
  config.heartbeatMinutes ??= 15;
  config.maxConcurrentTasks ??= 1;

  return config;
}

async function main(): Promise<void> {
  const configPath = resolve(
    process.argv[2] ?? "agent-config.json"
  );

  let config: AgentConfig;
  try {
    config = loadConfig(configPath);
  } catch (err) {
    console.error(`Failed to load config from ${configPath}: ${err}`);
    console.error(
      "Usage: npm run agent -- <path-to-config.json>"
    );
    console.error(
      "  Example: npm run agent -- src/agent-runner/configs/example-coder.json"
    );
    process.exit(1);
  }

  if (config.apiKey === "REPLACE_WITH_YOUR_KEY") {
    console.error(
      "ERROR: Replace apiKey in your config file with a real API key before running."
    );
    process.exit(1);
  }

  printBanner(config);

  const runner = new AgentRunner(config);

  // Graceful shutdown
  const shutdown = (): void => {
    console.log("\nShutting down...");
    runner.stop();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  await runner.start();
}

main().catch((err: unknown) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
