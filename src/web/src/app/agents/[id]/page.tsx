import Link from "next/link";
import { ArrowLeft, Star, CheckCircle, Brain } from "lucide-react";

import { getAgent as fetchAgent, getRecommendedTasks as fetchRecommended } from "@/lib/server-api";

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = fetchAgent(id);
  const recommendedTasks = fetchRecommended(id);

  if (!agent) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Agent not found</h1>
        <Link href="/agents" className="text-accent hover:underline">Back to agents</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/agents" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6">
        <ArrowLeft size={14} /> Back to agents
      </Link>

      {/* Agent header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-16 h-16 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold text-2xl shrink-0">
          {agent.name[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{agent.name}</h1>
          <p className="text-sm text-muted mt-1">{agent.description}</p>
          <div className="flex items-center gap-4 mt-3">
            {agent.average_rating && (
              <div className="flex items-center gap-1">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="font-medium">{agent.average_rating}</span>
                <span className="text-xs text-muted">({agent.total_ratings} ratings)</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-sm text-muted">
              <CheckCircle size={14} className="text-accent" />
              {agent.total_deliveries} deliveries
            </div>
            {agent.success_rate && (
              <span className="text-sm text-muted">{agent.success_rate}% success</span>
            )}
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="p-5 rounded-xl border border-border bg-surface/50 mb-6">
        <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-3">Capabilities</h2>
        <div className="flex flex-wrap gap-2">
          {agent.capabilities.map((cap: string) => (
            <span key={cap} className="px-3 py-1 rounded-lg text-xs font-medium bg-surface-light text-muted border border-border">
              {cap}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended Tasks */}
      {recommendedTasks.length > 0 && (
        <div className="p-5 rounded-xl border border-border bg-surface/50 mb-6">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-3">
            <Brain size={14} className="inline mr-1" />
            Recommended Tasks
          </h2>
          <div className="space-y-2">
            {recommendedTasks.map((task: any) => (
              <Link key={task.id} href={`/tasks/${task.id}`} className="flex items-center justify-between p-3 rounded-lg border border-border border-l-2 border-l-transparent hover:border-l-accent hover:border-accent/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">{task.title}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-xs">
                  {task.match_score && (
                    <span className="font-mono text-accent">{(task.match_score * 100).toFixed(0)}%</span>
                  )}
                  {task.budget_usd && (
                    <span className="font-mono font-semibold">${task.budget_usd}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Ratings */}
      {agent.ratings?.length > 0 && (
        <div className="p-5 rounded-xl border border-border bg-surface/50">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-3">
            Recent Ratings
          </h2>
          <div className="space-y-3">
            {agent.ratings.slice(0, 10).map((rating: any, i: number) => (
              <div key={i} className="p-3 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={12} className={j < rating.rating ? "text-amber-400 fill-amber-400" : "text-border"} />
                  ))}
                  <span className="text-xs text-muted">{rating.rating}/5</span>
                </div>
                <p className="text-sm text-muted">{rating.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
