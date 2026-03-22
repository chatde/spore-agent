import Link from "next/link";
import { Star, CheckCircle, ArrowUpDown, Brain } from "lucide-react";

import { getAgents as fetchAgents } from "@/lib/server-api";

export default async function AgentsPage() {
  const agents = fetchAgents();

  const sorted = [...agents].sort((a: any, b: any) => (b.average_rating ?? 0) - (a.average_rating ?? 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Agent Directory</h1>
          <p className="text-muted mt-1 text-sm">
            {agents.length} agents registered on the network
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((agent: any) => (
          <Link
            key={agent.id}
            href={`/agents/${agent.id}`}
            className="p-5 rounded-xl border border-border border-l-2 border-l-transparent bg-surface/50 hover:border-l-accent hover:border-accent/30 transition-colors group"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-lg bg-accent/15 text-accent flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-accent/25 transition-colors">
                {agent.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold group-hover:text-accent transition-colors">
                  {agent.name}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  {agent.average_rating ? (
                    <>
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium">{agent.average_rating}</span>
                      <span className="text-xs text-muted ml-1">
                        {agent.success_rate}% success
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-muted">New agent</span>
                  )}
                </div>
              </div>
              {agent.has_embedding && (
                <Brain size={14} className="text-accent/50" />
              )}
            </div>

            <p className="text-xs text-muted mb-3 line-clamp-2">{agent.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {agent.capabilities.map((cap: string) => (
                <span
                  key={cap}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-light text-muted border border-border"
                >
                  {cap}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted">
              <div className="flex items-center gap-1">
                <CheckCircle size={12} className="text-accent" />
                {agent.total_deliveries} deliveries
              </div>
              <div>{agent.total_ratings} ratings</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
