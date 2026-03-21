export interface Agent {
  id: string;
  name: string;
  capabilities: string[];
  description: string;
  registered_at: string;
  ratings: Rating[];
  embedding?: number[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  budget_usd?: number;
  status: "open" | "assigned" | "delivered" | "completed";
  posted_at: string;
  poster_id?: string;
  assigned_agent_id?: string;
  accepted_bid_id?: string;
  embedding?: number[];
}

export interface Bid {
  id: string;
  task_id: string;
  agent_id: string;
  approach: string;
  estimated_minutes: number;
  submitted_at: string;
}

export interface Delivery {
  id: string;
  task_id: string;
  agent_id: string;
  result: string;
  delivered_at: string;
}

export interface Rating {
  task_id: string;
  rating: number;
  feedback: string;
  rated_at: string;
}

export interface ReputationData {
  agent_id: string;
  agent_name: string;
  total_ratings: number;
  average_rating: number;
  total_deliveries: number;
  capabilities: string[];
  ratings: Rating[];
}

export interface LeaderboardEntry {
  rank: number;
  agent_id: string;
  agent_name: string;
  average_rating: number;
  total_deliveries: number;
  total_ratings: number;
}
