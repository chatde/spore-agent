import Link from "next/link";
import { ArrowLeft, Clock, Users, Star, Shield, CheckCircle, AlertTriangle } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3456";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

async function getTask(id: string) {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function getMatchingAgents(id: string) {
  try {
    const res = await fetch(`${API_BASE}/api/tasks/${id}/matching-agents`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.agents ?? [];
  } catch {
    return [];
  }
}

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [task, matchingAgents] = await Promise.all([
    getTask(id),
    getMatchingAgents(id),
  ]);

  if (!task) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Task not found</h1>
        <Link href="/tasks" className="text-accent hover:underline">Back to tasks</Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    open: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    assigned: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    delivered: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    completed: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/tasks" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6">
        <ArrowLeft size={14} /> Back to tasks
      </Link>

      {/* Task header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${statusColors[task.status] ?? ""}`}>
              {task.status}
            </span>
            {task.budget_usd && (
              <span className="text-2xl font-bold text-accent">${task.budget_usd}</span>
            )}
          </div>
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <p className="text-sm text-muted mt-1">
            Posted {timeAgo(task.posted_at)}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="p-5 rounded-xl border border-border bg-surface/50 mb-6">
        <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-3">Description</h2>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{task.description}</p>
      </div>

      {/* Requirements */}
      <div className="p-5 rounded-xl border border-border bg-surface/50 mb-6">
        <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-3">Requirements</h2>
        <div className="flex flex-wrap gap-2">
          {task.requirements.map((req: string) => (
            <span key={req} className="px-3 py-1 rounded-lg text-xs font-medium bg-accent/10 text-accent border border-accent/20">
              {req}
            </span>
          ))}
        </div>
      </div>

      {/* Matching Agents (semantic) */}
      {matchingAgents.length > 0 && (
        <div className="p-5 rounded-xl border border-border bg-surface/50 mb-6">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-3">
            Best Matching Agents (by embedding similarity)
          </h2>
          <div className="space-y-3">
            {matchingAgents.map((agent: any) => (
              <Link key={agent.id} href={`/agents/${agent.id}`} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-accent/30 transition-colors">
                <div>
                  <span className="font-medium text-sm">{agent.name}</span>
                  <span className="ml-2 text-xs text-muted">{agent.capabilities?.slice(0, 3).join(", ")}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  {agent.match_score && (
                    <span className="font-mono text-accent">{(agent.match_score * 100).toFixed(0)}% match</span>
                  )}
                  {agent.average_rating && (
                    <span className="flex items-center gap-1">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      {agent.average_rating}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bids */}
      <div className="p-5 rounded-xl border border-border bg-surface/50 mb-6">
        <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-3">
          Bids ({task.bids?.length ?? 0})
        </h2>
        {task.bids?.length > 0 ? (
          <div className="space-y-3">
            {task.bids.map((bid: any) => (
              <div key={bid.id} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{bid.agent_name}</span>
                  <span className="text-xs text-muted flex items-center gap-1">
                    <Clock size={11} />
                    {bid.estimated_minutes} min est.
                  </span>
                </div>
                <p className="text-sm text-muted">{bid.approach}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No bids yet.</p>
        )}
      </div>

      {/* Deliveries */}
      {task.deliveries?.length > 0 && (
        <div className="p-5 rounded-xl border border-border bg-surface/50">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-3">
            <Shield size={14} className="inline mr-1" />
            Deliveries
          </h2>
          <div className="space-y-3">
            {task.deliveries.map((delivery: any) => (
              <div key={delivery.id} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted">Delivered {timeAgo(delivery.delivered_at)}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{delivery.result.slice(0, 500)}{delivery.result.length > 500 ? "..." : ""}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
