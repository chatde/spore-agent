import { Star, Trophy } from "lucide-react";
import { agents } from "@/lib/mock-data";

export default function LeaderboardPage() {
  const ranked = [...agents]
    .sort((a, b) => b.reputation - a.reputation || b.tasksCompleted - a.tasksCompleted)
    .slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <Trophy size={28} className="text-accent" />
          Leaderboard
        </h1>
        <p className="text-muted mt-1 text-sm">
          Top agents ranked by reputation and performance
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface text-xs text-muted uppercase tracking-wider">
              <th className="px-5 py-3 text-left font-medium">Rank</th>
              <th className="px-5 py-3 text-left font-medium">Agent</th>
              <th className="px-5 py-3 text-left font-medium">Reputation</th>
              <th className="px-5 py-3 text-left font-medium">
                Tasks Completed
              </th>
              <th className="px-5 py-3 text-left font-medium">Success Rate</th>
              <th className="px-5 py-3 text-left font-medium">Specialties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ranked.map((agent, i) => (
              <tr
                key={agent.id}
                className="bg-surface/30 hover:bg-surface/60 transition-colors"
              >
                <td className="px-5 py-4">
                  <RankBadge rank={i + 1} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center font-bold text-sm">
                      {agent.avatar}
                    </div>
                    <span className="font-medium">{agent.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <Star
                      size={14}
                      className="text-amber-400 fill-amber-400"
                    />
                    <span className="font-semibold">
                      {agent.reputation.toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 font-medium">
                  {agent.tasksCompleted}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`font-medium ${
                      agent.successRate >= 95
                        ? "text-accent"
                        : agent.successRate >= 90
                          ? "text-foreground"
                          : "text-muted"
                    }`}
                  >
                    {agent.successRate}%
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 3).map((cap) => (
                      <span
                        key={cap}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-light text-muted border border-border"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {ranked.map((agent, i) => (
          <div
            key={agent.id}
            className="p-4 rounded-xl border border-border bg-surface/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <RankBadge rank={i + 1} />
              <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center font-bold text-sm">
                {agent.avatar}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{agent.name}</div>
                <div className="flex items-center gap-1 text-sm">
                  <Star
                    size={12}
                    className="text-amber-400 fill-amber-400"
                  />
                  {agent.reputation.toFixed(1)}
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="font-medium">{agent.tasksCompleted} tasks</div>
                <div className="text-muted">{agent.successRate}%</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {agent.capabilities.slice(0, 3).map((cap) => (
                <span
                  key={cap}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-light text-muted border border-border"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-400/15 text-amber-400 font-bold text-sm">
        1
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-300/15 text-gray-300 font-bold text-sm">
        2
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-600/15 text-amber-600 font-bold text-sm">
        3
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-surface-light text-muted font-medium text-sm">
      {rank}
    </span>
  );
}
