import { v4 as uuidv4 } from "uuid";
import { store } from "../mcp-server/store.js";
import { chat } from "./llm.js";
import type { AgentConfig, RunnerState, BidDecision } from "./types.js";
import type { Agent, Task, Bid } from "../mcp-server/types.js";

function ts(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function log(prefix: string, msg: string): void {
  console.log(`[${ts()}] [${prefix}] ${msg}`);
}

export class AgentRunner {
  private config: AgentConfig;
  private state: RunnerState;
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;

  constructor(config: AgentConfig) {
    this.config = config;
    this.state = {
      agentId: null,
      registered: false,
      totalEarnings: 0,
      totalTokenCost: 0,
      tasksCompleted: 0,
      dailyTokenSpend: 0,
      dailySpendResetAt: this.nextMidnight(),
      activeTasks: [],
    };
  }

  private nextMidnight(): string {
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    return d.toISOString();
  }

  private resetDailySpendIfNeeded(): void {
    if (new Date().toISOString() >= this.state.dailySpendResetAt) {
      this.state.dailyTokenSpend = 0;
      this.state.dailySpendResetAt = this.nextMidnight();
      log("BUDGET", "Daily spend counter reset");
    }
  }

  private trackSpend(cost: number): void {
    this.state.dailyTokenSpend += cost;
    this.state.totalTokenCost += cost;
  }

  // --- Registration ---

  private register(): void {
    const agent: Agent = {
      id: uuidv4(),
      name: this.config.name,
      capabilities: this.config.capabilities,
      description: this.config.description,
      registered_at: new Date().toISOString(),
      ratings: [],
    };
    store.agents.set(agent.id, agent);

    this.state.agentId = agent.id;
    this.state.registered = true;
    log("REGISTER", `Registered as "${agent.name}" (${agent.id})`);
  }

  // --- Browse matching tasks ---

  private browseMatchingTasks(): Task[] {
    const openTasks = store.getOpenTasks();
    return openTasks.filter((task) =>
      task.requirements.some((req) =>
        this.config.capabilities.some(
          (cap) => cap.toLowerCase() === req.toLowerCase()
        )
      )
    );
  }

  // --- Check for tasks assigned to this agent ---

  private getAssignedTasks(): Task[] {
    return Array.from(store.tasks.values()).filter(
      (t) =>
        t.status === "assigned" && t.assigned_agent_id === this.state.agentId
    );
  }

  // --- Check if already bid on a task ---

  private hasAlreadyBid(taskId: string): boolean {
    return Array.from(store.bids.values()).some(
      (b) => b.task_id === taskId && b.agent_id === this.state.agentId
    );
  }

  // --- Ask LLM whether to bid ---

  private async decideBid(task: Task): Promise<BidDecision | null> {
    const existingBids = store.getTaskBids(task.id);

    const systemPrompt = `You are ${this.config.name}, an autonomous AI agent on the Spore Agent marketplace. You evaluate tasks and decide whether to bid on them.

Your capabilities: ${this.config.capabilities.join(", ")}
Budget rules: min $${this.config.bidding.minBudget}, max $${this.config.bidding.maxBudget}

Respond ONLY with valid JSON matching this schema:
{"bid": boolean, "approach": string, "estimatedMinutes": number, "reasoning": string}`;

    const userMessage = `Should I bid on this task?

Title: ${task.title}
Description: ${task.description}
Requirements: ${task.requirements.join(", ")}
Budget: ${task.budget_usd != null ? `$${task.budget_usd}` : "Not specified"}
Current bids: ${existingBids.length}

Consider:
1. Do my capabilities match the requirements?
2. Is the budget within my range (${this.config.bidding.minBudget}-${this.config.bidding.maxBudget})?
3. Can I realistically deliver quality work?

Respond with JSON only.`;

    try {
      const { text, usage } = await chat(
        this.config.provider,
        this.config.model,
        this.config.apiKey,
        systemPrompt,
        userMessage
      );
      this.trackSpend(usage.estimatedCost);
      log(
        "LLM",
        `Bid decision cost: $${usage.estimatedCost.toFixed(4)} (${usage.inputTokens}+${usage.outputTokens} tokens)`
      );

      // Extract JSON from response (handles markdown code blocks)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        log("LLM", `Could not parse bid decision from response: ${text.slice(0, 200)}`);
        return null;
      }
      return JSON.parse(jsonMatch[0]) as BidDecision;
    } catch (err) {
      log("ERROR", `LLM bid decision failed: ${err}`);
      return null;
    }
  }

  // --- Place a bid ---

  private placeBid(task: Task, decision: BidDecision): void {
    const bid: Bid = {
      id: uuidv4(),
      task_id: task.id,
      agent_id: this.state.agentId!,
      approach: decision.approach,
      estimated_minutes: decision.estimatedMinutes,
      submitted_at: new Date().toISOString(),
    };
    store.bids.set(bid.id, bid);
    log(
      "BID",
      `Bid placed on "${task.title}" -- ${decision.approach.slice(0, 100)}...`
    );
  }

  // --- Complete a task ---

  private async completeTask(task: Task): Promise<void> {
    log("WORK", `Starting work on "${task.title}"...`);

    const systemPrompt = `You are ${this.config.name}, an autonomous AI agent completing a task on the Spore Agent marketplace.

Your capabilities: ${this.config.capabilities.join(", ")}

Provide a thorough, high-quality deliverable. Be specific and actionable.`;

    const userMessage = `Complete the following task:

Title: ${task.title}
Description: ${task.description}
Requirements: ${task.requirements.join(", ")}
Budget: ${task.budget_usd != null ? `$${task.budget_usd}` : "Not specified"}

Provide your complete deliverable below.`;

    try {
      const { text, usage } = await chat(
        this.config.provider,
        this.config.model,
        this.config.apiKey,
        systemPrompt,
        userMessage
      );
      this.trackSpend(usage.estimatedCost);
      log(
        "LLM",
        `Task completion cost: $${usage.estimatedCost.toFixed(4)} (${usage.inputTokens}+${usage.outputTokens} tokens)`
      );

      // Deliver the result
      const delivery = {
        id: uuidv4(),
        task_id: task.id,
        agent_id: this.state.agentId!,
        result: text,
        delivered_at: new Date().toISOString(),
      };
      store.deliveries.set(delivery.id, delivery);
      task.status = "delivered";

      this.state.tasksCompleted++;
      this.state.activeTasks = this.state.activeTasks.filter(
        (id) => id !== task.id
      );

      if (task.budget_usd) {
        this.state.totalEarnings += task.budget_usd;
      }

      log(
        "DELIVER",
        `Delivered "${task.title}" (${text.length} chars). Total completed: ${this.state.tasksCompleted}`
      );
    } catch (err) {
      log("ERROR", `Task completion failed for "${task.title}": ${err}`);
    }
  }

  // --- Main heartbeat cycle ---

  private async heartbeat(): Promise<void> {
    if (!this.running) return;

    log("HEARTBEAT", "=".repeat(60));
    this.resetDailySpendIfNeeded();

    // Check daily spend cap
    if (this.state.dailyTokenSpend >= this.config.bidding.maxDailySpend) {
      log(
        "BUDGET",
        `Daily spend cap reached ($${this.state.dailyTokenSpend.toFixed(4)} / $${this.config.bidding.maxDailySpend}). Skipping cycle.`
      );
      return;
    }

    // Phase 1: Work on assigned tasks
    const assignedTasks = this.getAssignedTasks();
    if (assignedTasks.length > 0) {
      log("WORK", `${assignedTasks.length} task(s) assigned and awaiting completion`);
      for (const task of assignedTasks) {
        if (!this.state.activeTasks.includes(task.id)) {
          this.state.activeTasks.push(task.id);
        }
        await this.completeTask(task);

        // Re-check spend cap between tasks
        if (this.state.dailyTokenSpend >= this.config.bidding.maxDailySpend) {
          log("BUDGET", "Daily spend cap reached mid-cycle. Stopping work.");
          return;
        }
      }
    }

    // Phase 2: Browse and bid on matching tasks
    const currentTaskCount = this.state.activeTasks.length;
    if (currentTaskCount >= this.config.maxConcurrentTasks) {
      log(
        "BROWSE",
        `Already at max concurrent tasks (${currentTaskCount}/${this.config.maxConcurrentTasks}). Skipping browse.`
      );
      return;
    }

    const matchingTasks = this.browseMatchingTasks();
    log(
      "BROWSE",
      `Found ${matchingTasks.length} open task(s) matching capabilities`
    );

    let bidCount = 0;
    for (const task of matchingTasks) {
      if (currentTaskCount + bidCount >= this.config.maxConcurrentTasks) break;
      if (this.hasAlreadyBid(task.id)) {
        log("BROWSE", `Already bid on "${task.title}", skipping`);
        continue;
      }

      // Check budget range
      if (task.budget_usd != null) {
        if (task.budget_usd < this.config.bidding.minBudget) {
          log(
            "BROWSE",
            `"${task.title}" budget $${task.budget_usd} below minimum $${this.config.bidding.minBudget}, skipping`
          );
          continue;
        }
        if (task.budget_usd > this.config.bidding.maxBudget) {
          log(
            "BROWSE",
            `"${task.title}" budget $${task.budget_usd} above maximum $${this.config.bidding.maxBudget}, skipping`
          );
          continue;
        }
      }

      // Ask LLM for bid decision
      const decision = await this.decideBid(task);
      if (decision && decision.bid) {
        this.placeBid(task, decision);
        bidCount++;
      } else if (decision) {
        log(
          "BROWSE",
          `Declined "${task.title}": ${decision.reasoning.slice(0, 120)}`
        );
      }

      // Re-check spend cap
      if (this.state.dailyTokenSpend >= this.config.bidding.maxDailySpend) {
        log("BUDGET", "Daily spend cap reached mid-bidding. Stopping.");
        return;
      }
    }

    // Summary
    log(
      "STATUS",
      [
        `Bids placed: ${bidCount}`,
        `Active tasks: ${this.state.activeTasks.length}`,
        `Completed: ${this.state.tasksCompleted}`,
        `Daily spend: $${this.state.dailyTokenSpend.toFixed(4)} / $${this.config.bidding.maxDailySpend}`,
        `Total spend: $${this.state.totalTokenCost.toFixed(4)}`,
        `Total earnings: $${this.state.totalEarnings.toFixed(2)}`,
      ].join(" | ")
    );
  }

  // --- Lifecycle ---

  async start(): Promise<void> {
    this.running = true;

    // Register on first run
    if (!this.state.registered) {
      this.register();
    }

    log("START", `Heartbeat interval: every ${this.config.heartbeatMinutes} minute(s)`);

    // Run first heartbeat immediately
    await this.heartbeat();

    // Schedule recurring heartbeats
    this.timer = setInterval(
      () => {
        this.heartbeat().catch((err) =>
          log("ERROR", `Heartbeat failed: ${err}`)
        );
      },
      this.config.heartbeatMinutes * 60 * 1000
    );
  }

  stop(): void {
    this.running = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    log("STOP", "Agent runner stopped");
    log(
      "FINAL",
      [
        `Tasks completed: ${this.state.tasksCompleted}`,
        `Total earnings: $${this.state.totalEarnings.toFixed(2)}`,
        `Total LLM spend: $${this.state.totalTokenCost.toFixed(4)}`,
      ].join(" | ")
    );
  }
}
