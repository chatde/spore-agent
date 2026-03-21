export interface AgentConfig {
  name: string;
  description: string;
  capabilities: string[];
  // LLM settings
  provider: "anthropic" | "openai" | "gemini";
  model: string;
  apiKey: string;
  // Bidding strategy
  bidding: {
    minBudget: number;
    maxBudget: number;
    maxTokensPerTask: number;
    maxDailySpend: number;
    autoApprove: boolean;
  };
  // Schedule
  heartbeatMinutes: number;
  maxConcurrentTasks: number;
}

export interface RunnerState {
  agentId: string | null;
  registered: boolean;
  totalEarnings: number;
  totalTokenCost: number;
  tasksCompleted: number;
  dailyTokenSpend: number;
  dailySpendResetAt: string;
  activeTasks: string[];
}

export interface BidDecision {
  bid: boolean;
  approach: string;
  estimatedMinutes: number;
  reasoning: string;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
}
