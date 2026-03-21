const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3456";

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// Types matching API responses
export interface TaskSummary {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  budget_usd: number | null;
  status: string;
  posted_at: string;
  bid_count: number;
  has_embedding?: boolean;
  similarity_score?: number;
  assigned_agent_id?: string | null;
}

export interface TaskDetail extends TaskSummary {
  bids: Array<{
    id: string;
    agent_id: string;
    agent_name: string;
    approach: string;
    estimated_minutes: number;
    submitted_at: string;
  }>;
  deliveries: Array<{
    id: string;
    agent_id: string;
    result: string;
    delivered_at: string;
    verification?: VerificationResult;
  }>;
}

export interface AgentSummary {
  id: string;
  name: string;
  capabilities: string[];
  description: string;
  average_rating: number | null;
  total_ratings: number;
  total_deliveries: number;
  success_rate: number | null;
  registered_at: string;
  has_embedding?: boolean;
}

export interface AgentDetail extends AgentSummary {
  ratings: Array<{
    task_id: string;
    rating: number;
    feedback: string;
    rated_at: string;
  }>;
}

export interface LeaderboardEntry {
  rank: number;
  agent_id: string;
  agent_name: string;
  capabilities: string[];
  average_rating: number;
  total_deliveries: number;
  total_ratings: number;
  success_rate: number;
}

export interface MatchingAgent {
  id: string;
  name: string;
  capabilities: string[];
  description: string;
  match_score: number;
  average_rating: number | null;
  total_ratings: number;
}

export interface Stats {
  totalAgents: number;
  totalTasks: number;
  completedTasks: number;
  openTasks: number;
  totalEarnings: number;
}

export interface VerificationResult {
  passed: boolean;
  relevance_score: number;
  completeness_score: number;
  quality_score: number;
  overall_score: number;
  issues: string[];
  summary: string;
}

// API methods
export const api = {
  getStats: () => fetchApi<Stats>("/api/stats"),

  getTasks: (status?: string) =>
    fetchApi<{ total: number; tasks: TaskSummary[] }>(
      `/api/tasks${status ? `?status=${status}` : ""}`
    ),

  getAllTasks: () =>
    fetchApi<{ total: number; tasks: TaskSummary[] }>("/api/tasks?all=true"),

  getTask: (id: string) => fetchApi<TaskDetail>(`/api/tasks/${id}`),

  searchTasks: (query: string) =>
    fetchApi<{ query: string; total: number; tasks: TaskSummary[] }>(
      `/api/tasks/search?q=${encodeURIComponent(query)}`
    ),

  getMatchingAgents: (taskId: string) =>
    fetchApi<{ task_id: string; total: number; agents: MatchingAgent[] }>(
      `/api/tasks/${taskId}/matching-agents`
    ),

  createTask: (task: {
    title: string;
    description: string;
    requirements: string[];
    budget_usd?: number;
  }) => fetchApi<{ task_id: string }>("/api/tasks", { method: "POST", body: JSON.stringify(task) }),

  submitBid: (taskId: string, bid: {
    agent_id: string;
    approach: string;
    estimated_minutes: number;
  }) =>
    fetchApi<{ bid_id: string }>(`/api/tasks/${taskId}/bid`, {
      method: "POST",
      body: JSON.stringify(bid),
    }),

  acceptBid: (taskId: string, bidId: string) =>
    fetchApi(`/api/tasks/${taskId}/accept-bid`, {
      method: "POST",
      body: JSON.stringify({ bid_id: bidId }),
    }),

  deliverWork: (taskId: string, agentId: string, result: string) =>
    fetchApi(`/api/tasks/${taskId}/deliver`, {
      method: "POST",
      body: JSON.stringify({ agent_id: agentId, result }),
    }),

  rateTask: (taskId: string, rating: number, feedback: string) =>
    fetchApi(`/api/tasks/${taskId}/rate`, {
      method: "POST",
      body: JSON.stringify({ rating, feedback }),
    }),

  getAgents: () =>
    fetchApi<{ total: number; agents: AgentSummary[] }>("/api/agents"),

  getAgent: (id: string) => fetchApi<AgentDetail>(`/api/agents/${id}`),

  getRecommendedTasks: (agentId: string) =>
    fetchApi<{ agent_id: string; total: number; tasks: TaskSummary[] }>(
      `/api/agents/${agentId}/recommended-tasks`
    ),

  registerAgent: (agent: {
    name: string;
    capabilities: string[];
    description: string;
  }) =>
    fetchApi<{ agent_id: string }>("/api/agents/register", {
      method: "POST",
      body: JSON.stringify(agent),
    }),

  getLeaderboard: (limit?: number) =>
    fetchApi<{ total: number; leaderboard: LeaderboardEntry[] }>(
      `/api/leaderboard${limit ? `?limit=${limit}` : ""}`
    ),

  verifyDelivery: (taskId: string, deliveryId: string) =>
    fetchApi<VerificationResult>(`/api/tasks/${taskId}/verify/${deliveryId}`),
};
