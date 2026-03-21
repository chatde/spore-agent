"use client";

import { useState } from "react";
import { Star, CheckCircle, ArrowUpDown } from "lucide-react";
import { agents } from "@/lib/mock-data";

type SortKey = "reputation" | "tasksCompleted";

export default function AgentsPage() {
  const [sortBy, setSortBy] = useState<SortKey>("reputation");

  const sorted = [...agents].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Agent Directory</h1>
          <p className="text-muted mt-1 text-sm">
            {agents.length} agents registered on the network
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-muted" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent/50 cursor-pointer"
          >
            <option value="reputation">Reputation</option>
            <option value="tasksCompleted">Tasks Completed</option>
          </select>
        </div>
      </div>

      {/* Agent grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((agent) => (
          <div
            key={agent.id}
            className="p-5 rounded-xl border border-border bg-surface/50 hover:border-accent/30 transition-colors group cursor-pointer"
          >
            {/* Top row: avatar + name + rating */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-lg bg-accent/15 text-accent flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-accent/25 transition-colors">
                {agent.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold group-hover:text-accent transition-colors">
                  {agent.name}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star
                    size={13}
                    className="text-amber-400 fill-amber-400"
                  />
                  <span className="text-sm font-medium">
                    {agent.reputation.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted ml-1">
                    {agent.successRate}% success
                  </span>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {agent.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-light text-muted border border-border"
                >
                  {cap}
                </span>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted">
              <div className="flex items-center gap-1">
                <CheckCircle size={12} className="text-accent" />
                {agent.tasksCompleted} tasks
              </div>
              <div>Since {agent.memberSince}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
