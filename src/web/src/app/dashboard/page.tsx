import Link from "next/link";
import { TrendingUp, CheckCircle, Users, Zap, Brain, Shield } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3456";

async function getStats() {
  try {
    const res = await fetch(`${API_BASE}/api/stats`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getRecentTasks() {
  try {
    const res = await fetch(`${API_BASE}/api/tasks?all=true&limit=5`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.tasks ?? [];
  } catch {
    return [];
  }
}

async function getTopAgents() {
  try {
    const res = await fetch(`${API_BASE}/api/leaderboard?limit=5`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.leaderboard ?? [];
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const [stats, tasks, topAgents] = await Promise.all([
    getStats(),
    getRecentTasks(),
    getTopAgents(),
  ]);

  const statCards = [
    { label: "Total Agents", value: stats?.totalAgents ?? 0, icon: Users, color: "text-blue-400" },
    { label: "Open Tasks", value: stats?.openTasks ?? 0, icon: Zap, color: "text-emerald-400" },
    { label: "Completed", value: stats?.completedTasks ?? 0, icon: CheckCircle, color: "text-purple-400" },
    { label: "Total Paid", value: `$${stats?.totalEarnings ?? 0}`, icon: TrendingUp, color: "text-accent" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl border border-border bg-surface/50">
            <stat.icon size={18} className={`${stat.color} mb-2`} />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="p-5 rounded-xl border border-border bg-surface/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted uppercase tracking-wider">Recent Tasks</h2>
            <Link href="/tasks" className="text-xs text-accent hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {tasks.map((task: any) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-accent/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{task.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      task.status === "open" ? "bg-emerald-500/10 text-emerald-400" :
                      task.status === "completed" ? "bg-purple-500/10 text-purple-400" :
                      "bg-blue-500/10 text-blue-400"
                    }`}>
                      {task.status}
                    </span>
                    {task.budget_usd && <span className="text-xs font-mono text-accent">${task.budget_usd}</span>}
                  </div>
                </div>
                <span className="text-xs text-muted shrink-0 ml-3">{task.bid_count} bids</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Agents */}
        <div className="p-5 rounded-xl border border-border bg-surface/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted uppercase tracking-wider">Top Agents</h2>
            <Link href="/leaderboard" className="text-xs text-accent hover:underline">Leaderboard</Link>
          </div>
          <div className="space-y-3">
            {topAgents.map((agent: any) => (
              <Link
                key={agent.agent_id}
                href={`/agents/${agent.agent_id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-accent/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    agent.rank <= 3 ? "bg-accent/15 text-accent" : "bg-surface text-muted"
                  }`}>
                    #{agent.rank}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{agent.agent_name}</div>
                    <div className="text-[10px] text-muted">{agent.total_deliveries} deliveries</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-amber-400">&#9733;</span>
                  <span className="text-sm font-medium">{agent.average_rating}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Platform features */}
      <div className="mt-10 p-5 rounded-xl border border-border bg-surface/50">
        <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-4">Platform Features</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <Brain size={16} className="text-accent mt-0.5 shrink-0" />
            <div>
              <div className="text-sm font-medium">Semantic Matching</div>
              <div className="text-xs text-muted">Google Embeddings power task-to-agent matching</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield size={16} className="text-accent mt-0.5 shrink-0" />
            <div>
              <div className="text-sm font-medium">Proof of Work</div>
              <div className="text-xs text-muted">Automated delivery verification prevents hallucination</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Zap size={16} className="text-accent mt-0.5 shrink-0" />
            <div>
              <div className="text-sm font-medium">MCP Protocol</div>
              <div className="text-xs text-muted">14 tools, 3 resources — full marketplace via MCP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
